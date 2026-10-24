"use client";

/**
 * ArtworkOrderPageComponent — manager page for ordering artworks PER PAGE.
 *
 *   /manager/artwork/order
 *
 * One tab per page the artworks appear on (artist page / exhibition page / art
 * fair page). Each tab has its own `order.<key>` position inside the JSON
 * `order` object, so a work can sit at #3 on the artist page and #9 on the
 * exhibition page.
 *
 *   • artworks are grouped by artist (A→Z, "Ungrouped" last)
 *   • drag a card (grid) or a row (list) to re-order inside its group
 *   • the eye icon hides a work from the SELECTED page only — it keeps no
 *     position there, greys out, drops to half size and moves under the dashed
 *     line (the other pages' positions are untouched)
 *   • Save writes every group in one request: POST /api/artwork/reorder
 *     { groups, orderKey, clearIds }
 *
 * Mark handling goes through `utils/mediaMarks` (registry-driven) — never the
 * raw mark object.
 */

import LoadingAnimation from "@/components/animations/LoadingAnimation";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
} from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { LanguageContext } from "@/components/contexts/LanguageContext";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import useFont from '@/hooks/useFont';
import useData from "@/hooks/useData";
import AlertInfo from "@/components/alerts/AlertInfo";
import OrderPageShell from "@/components/pages/manager/order/OrderPageShell";
import OrderGroupBox from "@/components/pages/manager/order/OrderGroupBox";
import OrderInfoNote from "@/components/pages/manager/order/OrderInfoNote";
import OrderCard, {
  OrderCardGrid,
  OrderEmptyState,
  OrderHiddenStrip,
  OrderViewControls,
  SortableOrderItem,
} from "@/components/pages/manager/order/OrderCard";
import { filterByLanguage } from "@/utils/filterByLanguage";
import {
  ARTWORK_ORDER_KEYS,
  getArtworkOrder,
  normalizeArtworkOrder,
} from "@/utils/artworkOrder";
import {
  applyMark,
  hideLabelForOrderKey,
  hideTokenForOrderKey,
  isArtworkHiddenForPage,
  toWireMark,
} from "@/utils/mediaMarks";

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const ORDER_LABELS = {
  artist_page_order: { en: "Artist Page Order", cn: "艺术家页排序" },
  exhibition_page_order: { en: "Exhibition Page Order", cn: "展览页排序" },
  art_fair_page_order: { en: "Art Fair Page Order", cn: "艺博会页排序" },
};

const T = {
  title: { en: "Order Artworks", cn: "作品排序" },
  subtitle: {
    en: "Drag the cards to arrange the order for the selected page. Use the eye to hide a work from that page — hidden works grey out, drop to the bottom, half size, under the dashed line.",
    cn: "拖动卡片调整所选页面的顺序。点击眼睛图标可将作品从该页隐藏——隐藏后卡片变灰并缩到一半，统一放到虚线下方。",
  },
  dragHint: { en: "Drag cards to reorder", cn: "拖动卡片排序" },
  orderBy: { en: "Order by", cn: "排序维度" },
  save: { en: "Save order", cn: "保存排序" },
  saving: { en: "Saving…", cn: "保存中…" },
  reset: { en: "Reset", cn: "重置" },
  back: { en: "Back", cn: "返回" },
  grid: { en: "Grid", cn: "网格" },
  list: { en: "List", cn: "列表" },
  size: { en: "Size", cn: "大小" },
  savedOk: { en: "Order saved", cn: "排序已保存" },
  saveFail: { en: "Failed to save order", cn: "保存排序失败" },
  markHideOk: { en: "Hidden · order cleared", cn: "已隐藏 · 已清除排序" },
  markShowOk: { en: "Shown on this page", cn: "已恢复显示" },
  markFail: { en: "Failed to save mark", cn: "标记保存失败" },
  empty: { en: "No artworks", cn: "暂无作品" },
  loadFail: { en: "Loading failed", cn: "加载失败" },
  ungrouped: { en: "Ungrouped", cn: "未分组" },
  hiddenTitle: { en: "Hidden From This Page", cn: "不在此页显示" },
  hiddenHint: {
    en: "Hidden works have no position — they are kept here, half size, under the dashed line.",
    cn: "隐藏的作品不参与排序，统一放在虚线下方，尺寸缩小一半。",
  },
  hidden: { en: "hidden", cn: "隐藏" },
  noOrder: { en: "Hidden · no order", cn: "已隐藏 · 无排序" },
  retry: { en: "Try again", cn: "重试" },
};

const txt = (v, isCn) => (isCn ? v.cn : v.en);
const idOf = (item) => item?.id || item?._id || "";
const normalizeName = (value) => String(value ?? "").trim();
const keyOf = (name) => normalizeName(name).toLowerCase();

const ORDER_KEY_DEFAULT = ARTWORK_ORDER_KEYS[0]; // artist_page_order

/** Numeric position of a work for the active page (Infinity = none). */
const getOrderValue = (item, orderKey) => {
  const n = Number(getArtworkOrder(item, orderKey));
  return Number.isFinite(n) && n > 0 ? n : Infinity;
};

/** Year, newest first — the tie-breaker for works without a position. */
const getYearValue = (item) => {
  const n = Number(String(item?.year ?? "").replace(/[^\d]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

// ─────────────────────────────────────────────────────────────────────────────
//  Card — thin adapter over the shared <OrderCard>, so every order page shows
//  exactly the same card (fixed 4/3 cover, same padding, same type scale).
// ─────────────────────────────────────────────────────────────────────────────
function ArtworkCard({
  item,
  number,
  orderKey,
  hidden,
  busy,
  listMode,
  thumbWidth,
  onToggleHidden,
  isCn,
  fontFamily,
  labelFontFamily,
}) {
  const id = idOf(item);
  const cover = item?.cover_img_url || item?.image_url || "";
  const hideLabel = hideLabelForOrderKey(orderKey);

  return (
    <OrderCard
      image={cover}
      imageAlt={item?.title || ""}
      title={item?.title || "—"}
      subtitle={[item?.year, item?.medium].filter(Boolean).join(" · ")}
      number={number}
      dim={hidden}
      listMode={listMode}
      thumbWidth={thumbWidth}
      fontFamily={fontFamily}
      metaFontFamily={labelFontFamily}
      dragHandle
      dragHint={isCn ? "拖动排序" : "Drag to reorder"}
      overlayX={hidden}
      action={{
        icon: hidden ? <EyeOff size={15} /> : <Eye size={15} />,
        pressed: hidden,
        busy,
        title: hidden
          ? isCn
            ? `取消隐藏（${hideLabel?.cn || ""}）`
            : `Show on ${hideLabel?.en || ""}`
          : isCn
            ? `从此页隐藏（${hideLabel?.cn || ""}）`
            : `Hide from ${hideLabel?.en || ""}`,
        onClick: () => onToggleHidden?.(item),
      }}
    />
  );
}
// ─────────────────────────────────────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────────────────────────────────────
export default function ArtworkOrderPageComponent() {
  const router = useRouter();
  const { isCn } = useContext(LanguageContext);
  const { colors } = useReverseTheme();
  const { fontFamily, labelFontFamily } = useFont();

  // `fields=` keeps the payload to the columns this page renders — the cluster
  // is transfer bound, so asking for 9 columns instead of 22 is a real saving.
  // Keep `language` (the list is language-filtered) and `order`/`mark` in sync
  // with `getArtworkOrder` / `isArtworkHiddenForPage`.
  const { data: rawWorks = [], isLoading, error, refetch } = useData(
    "/api/artwork?fields=_id,title,artist,year,medium,cover_img_url,language,order,mark"
  );

  const [orderKey, setOrderKey] = useState(ORDER_KEY_DEFAULT);
  const [listMode, setListMode] = useState(false);
  const [thumbWidth, setThumbWidth] = useState(180);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [draft, setDraft] = useState({});        // groupKey → items[]
  const [dirtyKeys, setDirtyKeys] = useState({}); // groupKey → true (needs renumber)
  const [markOverrides, setMarkOverrides] = useState({}); // id → mark (optimistic)
  const [markBusy, setMarkBusy] = useState({});           // id → true

  const hideToken = useMemo(() => hideTokenForOrderKey(orderKey), [orderKey]);

  const markOf = useCallback(
    (item) => (idOf(item) in markOverrides ? markOverrides[idOf(item)] : item?.mark),
    [markOverrides]
  );

  const isItemHidden = useCallback(
    (item) => isArtworkHiddenForPage({ mark: markOf(item) }, orderKey),
    [markOf, orderKey]
  );

  // Language-filtered artworks, then grouped by artist (A→Z, ungrouped last).
  const groups = useMemo(() => {
    const works = filterByLanguage(rawWorks, isCn);

    const buckets = new Map();
    for (const item of works) {
      const artist = normalizeName(item?.artist);
      const key = artist ? keyOf(artist) : "__ungrouped__";
      if (!buckets.has(key)) buckets.set(key, { key, label: artist || txt(T.ungrouped, isCn), items: [] });
      buckets.get(key).items.push(item);
    }

    const list = [...buckets.values()];

    // Inside a group: numbered first (ascending by this page's order), then the
    // rest by year (newest first) so unordered works still read sensibly.
    for (const g of list) {
      g.items = [...g.items].sort((a, b) => {
        const av = getOrderValue(a, orderKey);
        const bv = getOrderValue(b, orderKey);
        if (av !== bv) return av - bv;
        const ay = getYearValue(a);
        const by = getYearValue(b);
        if (ay !== by) return by - ay;
        return String(a?.title || "").localeCompare(String(b?.title || ""));
      });
    }

    list.sort((a, b) => {
      if (a.key === "__ungrouped__") return 1;
      if (b.key === "__ungrouped__") return -1;
      return a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: "base" });
    });

    return list;
  }, [rawWorks, isCn, orderKey]);

  // Reset the draft whenever the groups/order key change.
  useEffect(() => {
    const next = {};
    for (const g of groups) next[g.key] = g.items;
    setDraft(next);
  }, [groups]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = useCallback(
    (groupKey) => (event) => {
      const { active, over } = event || {};
      if (!over || active.id === over.id) return;
      setDraft((prev) => {
        const items = prev[groupKey] || [];
        const visible = items.filter((it) => !isItemHidden(it));
        const from = visible.findIndex((it) => idOf(it) === active.id);
        const to = visible.findIndex((it) => idOf(it) === over.id);
        if (from < 0 || to < 0) return prev;
        const moved = arrayMove(visible, from, to);
        const hidden = items.filter((it) => isItemHidden(it));
        return { ...prev, [groupKey]: [...moved, ...hidden] };
      });
      setDirtyKeys((prev) => ({ ...prev, [groupKey]: true }));
    },
    [isItemHidden]
  );

  // Hide / show a work for the ACTIVE page.
  const onToggleHidden = useCallback(
    async (item) => {
      const id = idOf(item);
      if (!id || !hideToken || markBusy[id]) return;

      const nextHidden = !isItemHidden(item);
      const nextMark = applyMark(markOf(item), hideToken, nextHidden);

      setNotice(null);
      setMarkOverrides((prev) => ({ ...prev, [id]: nextMark }));
      setMarkBusy((prev) => ({ ...prev, [id]: true }));

      try {
        const payload = { mark: toWireMark(nextMark) };
        if (nextHidden) {
          // A hidden work keeps no position on this page — clear it now
          // (the other pages' positions are preserved).
          payload.order = { ...normalizeArtworkOrder(item?.order), [orderKey]: "" };
        }
        const res = await fetch(`/api/artwork?id=${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setNotice({
          type: "ok",
          text: nextHidden ? txt(T.markHideOk, isCn) : txt(T.markShowOk, isCn),
        });
      } catch (err) {
        console.log("[artwork order] mark update failed:", err);
        setMarkOverrides((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        setNotice({ type: "err", text: txt(T.markFail, isCn) });
      } finally {
        setMarkBusy((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    },
    [hideToken, isCn, isItemHidden, markBusy, markOf, orderKey]
  );

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      setNotice(null);

      // Every group with at least one visible work is (re)written — that way a
      // group holding a single work still gets its position persisted.
      const groupsToSave = [];
      const hiddenSet = new Set();

      for (const g of groups) {
        const items = draft[g.key] || g.items;
        const visible = [];
        for (const it of items) {
          const id = idOf(it);
          if (isItemHidden(it)) {
            if (id) hiddenSet.add(id);
          } else if (id) {
            visible.push(id);
          }
        }
        if (visible.length) groupsToSave.push(visible);
      }

      const hiddenIds = [...hiddenSet];

      if (!groupsToSave.length && !hiddenIds.length) {
        setNotice({ type: "ok", text: txt(T.savedOk, isCn) });
        return;
      }

      const res = await fetch("/api/artwork/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groups: groupsToSave,
          orderKey,
          clearIds: hiddenIds,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setDirtyKeys({});
      setNotice({ type: "ok", text: txt(T.savedOk, isCn) });
      refetch?.();
    } catch (err) {
      console.log("[artwork order] save failed:", err);
      setNotice({ type: "err", text: txt(T.saveFail, isCn) });
    } finally {
      setSaving(false);
    }
  }, [draft, groups, isCn, isItemHidden, orderKey, refetch]);

  const handleReset = useCallback(() => {
    const next = {};
    for (const g of groups) next[g.key] = g.items;
    setDraft(next);
    setDirtyKeys({});
    setNotice(null);
  }, [groups]);

  // Human-readable name of the order currently being edited.
  const orderLabel = orderKey
    ? txt(ORDER_LABELS[orderKey] || { en: orderKey, cn: orderKey }, isCn)
    : "";

  if (isLoading) return <LoadingAnimation isLoading />;

  if (error) {
    return (
      <AlertInfo
        message={txt(T.loadFail, isCn)}
        subMessage=""
        buttonText={txt(T.retry, isCn)}
        onBack={() => refetch?.()}
        isCn={isCn}
      />
    );
  }

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <OrderPageShell
      isCn={isCn}
      fontFamily={fontFamily}
      containerStyle={{ width: "100%", maxWidth: 1180, margin: "0 auto", padding: "22px 20px 80px" }}
      title={T.title}
      subtitle={T.subtitle}
      backLabel={T.back}
      onBack={() => router.push("/manager/artwork")}
      orderLabel={orderLabel}
      orderByLabel={T.orderBy}
      orderKeys={ARTWORK_ORDER_KEYS}
      orderLabels={ORDER_LABELS}
      orderKey={orderKey}
      onOrderKeyChange={setOrderKey}
      notice={notice}
      onSave={handleSave}
      onReset={handleReset}
      saving={saving}
      saveLabel={T.save}
      savingLabel={T.saving}
      resetLabel={T.reset}
      info={
        <OrderInfoNote
          orderKey={orderKey}
          entity="artwork"
          isCn={isCn}
          fontFamily={fontFamily}
          labelFontFamily={labelFontFamily}
        />
      }
      right={
        <OrderViewControls
          listMode={listMode}
          onListModeChange={setListMode}
          size={thumbWidth}
          onSizeChange={setThumbWidth}
          min={120}
          max={320}
          step={10}
          labels={{
            grid: txt(T.grid, isCn),
            list: txt(T.list, isCn),
            size: txt(T.size, isCn),
          }}
          fontFamily={fontFamily}
        />
      }
    >

      {total === 0 ? (
        <OrderEmptyState text={txt(T.empty, isCn)} fontFamily={fontFamily} />
      ) : (
        groups.map((g) => {
          const items = draft[g.key] || g.items;
          const visible = items.filter((it) => !isItemHidden(it));
          const hiddenItems = items.filter((it) => isItemHidden(it));

          return (
            <OrderGroupBox
              key={g.key}
              label={g.label}
              count={
                hiddenItems.length
                  ? `${visible.length} + ${hiddenItems.length} ${txt(T.hidden, isCn)}`
                  : visible.length
              }
              hint={txt(T.dragHint, isCn)}
              fontFamily={fontFamily}
              labelFontFamily={labelFontFamily}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd(g.key)}
              >
                <SortableContext
                  items={visible.map((it) => idOf(it))}
                  strategy={rectSortingStrategy}
                >
                  <OrderCardGrid listMode={listMode} thumbWidth={thumbWidth} gap={14}>
                    {visible.map((item, i) => (
                      <SortableOrderItem key={idOf(item)} id={idOf(item)}>
                        <ArtworkCard
                          item={item}
                          number={i + 1}
                          orderKey={orderKey}
                          hidden={false}
                          busy={!!markBusy[idOf(item)]}
                          listMode={listMode}
                          thumbWidth={thumbWidth}
                          onToggleHidden={onToggleHidden}
                          isCn={isCn}
                          fontFamily={fontFamily}
                          labelFontFamily={labelFontFamily}
                        />
                      </SortableOrderItem>
                    ))}
                  </OrderCardGrid>
                </SortableContext>

                <OrderHiddenStrip
                  items={hiddenItems}
                  label={txt(T.hiddenTitle, isCn)}
                  hint={txt(T.hiddenHint, isCn)}
                  listMode={listMode}
                  thumbWidth={thumbWidth}
                  fontFamily={fontFamily}
                  labelFontFamily={labelFontFamily}
                  renderCard={(item, smallWidth) => (
                    <ArtworkCard
                      item={item}
                      number={null}
                      orderKey={orderKey}
                      hidden
                      busy={!!markBusy[idOf(item)]}
                      listMode={listMode}
                      thumbWidth={smallWidth}
                      onToggleHidden={onToggleHidden}
                      isCn={isCn}
                      fontFamily={fontFamily}
                      labelFontFamily={labelFontFamily}
                    />
                  )}
                />
              </DndContext>
            </OrderGroupBox>
          );
        })
      )}

      {notice && (
        <div style={{ marginTop: 8, fontFamily, fontSize: 11, color: "rgba(0,0,0,.4)" }}>
          {txt({ en: "Hidden works keep their position on the other pages.", cn: "隐藏的作品在其他页面仍保留排序。" }, isCn)}
        </div>
      )}
    </OrderPageShell>
  );
}
