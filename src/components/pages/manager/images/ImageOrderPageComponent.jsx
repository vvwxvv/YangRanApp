"use client";

/**
 * ImageOrderPageComponent — manager page for ordering images PER PAGE.
 *
 *   /manager/image/order
 *
 * Three tabs, each writing its own `Image.order.<key>` position:
 *
 *   Artist Page Order (Rolling Images)  rolling_img_order
 *     → grouped by ARTIST (one numbered sequence per artist, the artist page's
 *       rolling slideshow). The eye button is the rolling SELECTION: removed
 *       images keep no position and drop under the dashed line.
 *
 *   Exhibition Page Order                exhibition_page_order
 *     → grouped by EXHIBITION, newest show first; one numbered sequence per
 *       show, holding exactly the images that show's page displays.
 *
 * Grouping is not cosmetic: a page shows ONE ordered gallery, so grouping by
 * artist on the exhibition tab would number a sequence the page never shows
 * (see orderGroups.js — it is the single builder all three modes share).
 *
 * Every tab renders an <OrderInfoNote> explaining what the active order does
 * and which page it affects (copy: orderInfo.js).
 *
 * Save posts every group in ONE request: POST /api/image/reorder
 * { groups, orderKey, clearIds }.
 */

import React, { useContext, useMemo, useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Eye, EyeOff, GripVertical } from "lucide-react";

import { LanguageContext } from "@/components/contexts/LanguageContext";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import useFont from '@/hooks/useFont';
import useData from "@/hooks/useData";
import { buildImageSourceIndex } from "@/components/pages/manager/images/hooks/useImageSourceIndex";
import {
  IMAGE_MARK_HIDE_ARTIST_ROLLING_LABEL,
  applyMark,
  hideLabelForOrderKey,
  hideTokenForOrderKey,
  isMarkHidden,
  toWireMark,
} from "@/utils/mediaMarks";
import { IMAGE_PAGE_ORDER_KEYS, ORDER_KEY_LABELS, normalizeImageOrder,
  ARTIST_DETAIL_ROLLING_ORDER_KEY,
  ARTIST_ROLLING_ORDER_KEY,
} from "@/utils/mediaOrder";
import {
  GROUP_MODE,
  NO_ENTITY_KEY,
  buildImageOrderGroups,
  groupModeForOrderKey,
  orderRankOf,
} from "@/components/pages/manager/order/orderGroups";
import { formatDateRange } from "@/components/pages/exhibition/utils/exhibitionDates";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from "@/components/alerts/AlertInfo";
import OrderPageShell from "@/components/pages/manager/order/OrderPageShell";
import OrderGroupBox from "@/components/pages/manager/order/OrderGroupBox";
import OrderInfoNote from "@/components/pages/manager/order/OrderInfoNote";
import OrderRollingStrip from "@/components/pages/manager/order/OrderRollingStrip";
import OrderArtistRollingPreview from "@/components/pages/manager/order/OrderArtistRollingPreview";
import OrderCard, {
  OrderCardGrid,
  OrderHiddenStrip,
  OrderViewControls,
  SortableOrderItem,
} from "@/components/pages/manager/order/OrderCard";

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIG
// ─────────────────────────────────────────────────────────────────────────────
// Which `order` sub-key is edited by default. An image can hold one position
// per page (artist rolling / exhibition page) — the toolbar switches between
// them.
const ORDER_KEY_DEFAULT = ARTIST_ROLLING_ORDER_KEY;

const idOf = (item) => item?.id || item?._id;

const T = {
  title: { en: "Order Images", cn: "图片排序" },
  subtitle: {
    en: "Pick the order you are editing, then drag the cards. Images are grouped by artist on the Rolling Images tab and by exhibition on the page-order tabs. Hidden images drop to the bottom, half size, under the dashed line.",
    cn: "选择要编辑的排序，然后拖动卡片。轮播图标签按艺术家分组，页面排序标签按展览分组。隐藏的图片缩小一半，统一放在虚线下方。",
  },
  dragHint: { en: "Drag cards to reorder", cn: "拖动卡片排序" },
  save: { en: "Save Order", cn: "保存排序" },
  saving: { en: "Saving…", cn: "保存中…" },
  reset: { en: "Reset", cn: "重置" },
  back: { en: "Back", cn: "返回" },
  grid: { en: "Grid", cn: "网格" },
  list: { en: "List", cn: "列表" },
  size: { en: "Size", cn: "大小" },
  savedOk: { en: "Order Saved", cn: "排序已保存" },
  saveFail: { en: "Failed to Save Order", cn: "保存排序失败" },
  empty: { en: "No Images", cn: "暂无图片" },
  loadFail: { en: "Loading Failed", cn: "加载失败" },
  ungrouped: { en: "Ungrouped", cn: "未分组" },
  hiddenTitle: { en: "Hidden From Artist Page Rolling", cn: "不在艺术家页轮播中显示" },
  hiddenTitlePage: { en: "Hidden From This Page", cn: "不在此页显示" },
  hiddenHint: {
    en: "Hidden images have no position — they are kept here, half size, under the dashed line.",
    cn: "隐藏的图片没有排序，统一放在虚线下方，尺寸缩小一半。",
  },
  images: { en: "images", cn: "张图片" },
};

const txt = (entry, isCn) => (isCn ? entry.cn : entry.en);

// ─────────────────────────────────────────────────────────────────────────────
//  Card — thin adapter over the shared <OrderCard> (see
//  components/pages/manager/order/OrderCard.jsx). Every order page uses that one card.
// ─────────────────────────────────────────────────────────────────────────────
function ImageCard({
  item,
  orderNumber,
  isCn,
  fontFamily,
  listMode,
  thumbWidth,
  hidden,
  onToggleHide,
  hideLabel,
  busy,
}) {
  const img = item?.img_url || item?.image_url;
  const meta = [item?.type, item?.tag_source].filter(Boolean);
  const hideHint = hideLabel
    ? txt(hideLabel, isCn)
    : isCn
    ? IMAGE_MARK_HIDE_ARTIST_ROLLING_LABEL.cn
    : IMAGE_MARK_HIDE_ARTIST_ROLLING_LABEL.en;

  return (
    <OrderCard
      image={img}
      imageAlt={item?.tag_en || ""}
      title={item?.tag_en || (isCn ? "无标题" : "Untitled")}
      subtitle={item?.tag_cn || "—"}
      meta={meta.join(" · ")}
      number={orderNumber ?? null}
      dim={!!hidden}
      borderColor="#000"
      listMode={listMode}
      thumbWidth={thumbWidth}
      fontFamily={fontFamily}
      overlayX={!!hidden}
      action={{
        icon: hidden ? <EyeOff size={15} /> : <Eye size={15} />,
        pressed: !!hidden,
        busy,
        title: hidden
          ? isCn
            ? "取消隐藏"
            : "Show again"
          : isCn
          ? `隐藏（${hideHint}）`
          : `Hide (${hideHint})`,
        onClick: () => onToggleHide?.(),
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Source sub-group — one box per source (Works / Exhibition: …) inside its
//  group. Dragging is only possible within a sub-group: on the rolling tab the
//  sequence belongs to the artist, so the numbers continue across the artist's
//  boxes.
// ─────────────────────────────────────────────────────────────────────────────
function SourceGroup({
  groupKey,
  label,
  items,
  numbers,
  isCn,
  fontFamily,
  listMode,
  thumbWidth,
  onReorder,
  onToggleItemHidden,
  hideLabel,
  isItemBusy,
  showHeader = true,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const ids = items.map(idOf);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  const cardProps = (item) => ({
    item,
    orderNumber: numbers.get(idOf(item)) ?? null,
    isCn,
    fontFamily,
    listMode,
    thumbWidth,
    hidden: false,
    hideLabel,
    onToggleHide: () => onToggleItemHidden?.(item, groupKey),
    busy: isItemBusy ? isItemBusy(item) : false,
  });

  return (
    <div style={{ marginBottom: 12 }}>
      {showHeader && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            padding: "9px 14px",
            border: "1px solid rgba(0,0,0,.08)",
            borderRadius: 10,
            marginBottom: 12,
            fontFamily,
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 13 }}>{label}</span>
          <span style={{ fontSize: 12, opacity: 0.55 }}>{items.length}</span>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={rectSortingStrategy}>
          <OrderCardGrid listMode={listMode} thumbWidth={thumbWidth} gap={12}>
            {items.map((item) => (
              <SortableOrderItem key={idOf(item)} id={idOf(item)}>
                <ImageCard {...cardProps(item)} />
              </SortableOrderItem>
            ))}
          </OrderCardGrid>
        </SortableContext>
      </DndContext>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Hidden strip — every image hidden from the active page, together at the
//  bottom, half size, above a dashed separator. Not sortable (no position).
// ─────────────────────────────────────────────────────────────────────────────
function HiddenStrip({
  groupKey,
  items,
  title,
  hint,
  isCn,
  fontFamily,
  listMode,
  thumbWidth,
  onToggleItemHidden,
  hideLabel,
  isItemBusy,
}) {
  if (!items.length) return null;

  return (
    <OrderHiddenStrip
      items={items}
      label={title}
      hint={hint}
      count={items.length}
      listMode={listMode}
      thumbWidth={thumbWidth}
      fontFamily={fontFamily}
      style={{ marginTop: 6 }}
      renderCard={(item, smallWidth) => (
        <ImageCard
          item={item}
          orderNumber={null}
          isCn={isCn}
          fontFamily={fontFamily}
          listMode={listMode}
          thumbWidth={smallWidth}
          hidden
          hideLabel={hideLabel}
          onToggleHide={() => onToggleItemHidden?.(item, groupKey)}
          busy={isItemBusy ? isItemBusy(item) : false}
        />
      )}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Group box — the big accordion: header + one sub-box per source
//  (Works / Exhibition: …) + the hidden strip at the bottom. The same
//  component serves all tabs: on the exhibition tab a group is a single box
//  (one show) with its images.
// ─────────────────────────────────────────────────────────────────────────────
function GroupBlock({
  group,
  items,
  anchorId,
  /** The active order sub-key (used by the rolling preview). */
  orderKey,
  isRollingTab = false,
  showRollingPreview = false,
  isCn,
  fontFamily,
  listMode,
  thumbWidth,
  onReorderSource,
  onToggleItemHidden,
  hideLabel,
  isItemBusy,
}) {
  // Number the visible images across the WHOLE group (one sequence per artist
  // on the rolling tab, one per show on the page tabs). Hidden ones carry no
  // number — they sit in the dashed strip below.
  const hiddenItems = items.filter((item) => item.__hidden);
  const visibleItems = items.filter((item) => !item.__hidden);

  const numbered = useMemo(() => {
    const map = new Map();
    let n = 0;
    for (const item of visibleItems) map.set(idOf(item), ++n);
    return map;
  }, [visibleItems]);

  const showSourceHeaders = (group.sources || []).length > 1 || Boolean(group.artist);

  const countLabel = [
    `${visibleItems.length} ${
      isRollingTab ? (isCn ? "轮播" : "rolling") : txt(T.images, isCn)
    }`,
    hiddenItems.length ? `${hiddenItems.length} ${isCn ? "隐藏" : "hidden"}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  // Has this artist's order for the active sequence actually been saved? (The
  // detail page keeps using the Artist Page sequence until it has, so the
  // preview says so instead of pretending the order is live.)
  const hasSavedOrder = visibleItems.some((item) =>
    Number.isFinite(orderRankOf(item, orderKey))
  );

  // What this artist's DETAIL-page slideshow will show, in order — the same
  // visible items, numbered (hidden ones are excluded exactly like the slides).
  const previewItems = visibleItems.map((item, i) => ({
    id: idOf(item),
    number: i + 1,
    title: item?.tag_en || item?.tag_cn || "",
    url: item?.img_url || item?.image_url || "",
  }));

  return (
    <OrderGroupBox
      id={anchorId}
      label={group.label}
      count={countLabel}
      hint={group.meta || undefined}
      defaultOpen={group.key !== NO_ENTITY_KEY}
      fontFamily={fontFamily}
      labelFontFamily={fontFamily}
      bodyStyle={{ padding: "14px 16px 16px" }}
    >
      {showRollingPreview ? (
        <OrderArtistRollingPreview
          items={previewItems}
          hasSavedOrder={hasSavedOrder}
          isCn={isCn}
          fontFamily={fontFamily}
          labelFontFamily={fontFamily}
        />
      ) : null}

      {(group.sources || [])
        // A source whose images are all hidden from this page holds nothing to
        // order — those cards already sit in the dashed strip below (it used to
        // render as an empty "Works 0" box).
        .filter((source) => source.items.some((item) => !item.__hidden))
        .map((source) => (
          <SourceGroup
            key={source.key}
            groupKey={group.key}
            label={source.label}
            items={source.items.filter((item) => !item.__hidden)}
            numbers={numbered}
            isCn={isCn}
            fontFamily={fontFamily}
            listMode={listMode}
            thumbWidth={thumbWidth}
            onReorder={(next) => onReorderSource(group.key, source.key, next)}
            onToggleItemHidden={onToggleItemHidden}
            hideLabel={hideLabel}
            isItemBusy={isItemBusy}
            showHeader={showSourceHeaders}
          />
        ))}

      <HiddenStrip
        groupKey={group.key}
        items={hiddenItems}
        title={isRollingTab ? txt(T.hiddenTitle, isCn) : txt(T.hiddenTitlePage, isCn)}
        hint={txt(T.hiddenHint, isCn)}
        isCn={isCn}
        fontFamily={fontFamily}
        listMode={listMode}
        thumbWidth={thumbWidth}
        onToggleItemHidden={onToggleItemHidden}
        hideLabel={hideLabel}
        isItemBusy={isItemBusy}
      />
    </OrderGroupBox>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────────────────────────────────────
export default function ImageOrderPageComponent() {
  const { isCn } = useContext(LanguageContext);
  const { colors } = useReverseTheme();
  const { fontFamily } = useFont();

  // ── Which order is being edited (switchable in the toolbar) ──
  const [orderKey, setOrderKey] = useState(ORDER_KEY_DEFAULT);
  const mode = groupModeForOrderKey(orderKey);
  const needsArtistIndex = mode === GROUP_MODE.ARTIST;

  // Only fetch what the ACTIVE tab needs — the Mongo endpoints are slow, and
  // the exhibition tab never touches the artist index. `useData(null)` simply
  // fetches nothing (no error), and switching a tab to one that needs the data
  // starts that request then. The `fields=` projection keeps each response to
  // the columns this page actually reads (the transfer is the slow part of
  // every request against this cluster).
  const { data: rawImages = [], isLoading: l1, error: e1, refetch: refetchImages } = useData(
    "/api/image?fields=_id,img_url,tag_en,tag_cn,type,tag_source,mark,order"
  );
  const {
    data: rawExhibitions = [],
    isLoading: l3,
    error: e3,
    refetch: refetchExhibitions,
  } = useData(
    "/api/exhibition?fields=_id,title,date_start,date_end,year,status,language,related_artist,participating_artists,related_artwork,cover_img_url"
  );
  const { data: rawArtworks = [], isLoading: l2, error: e2, refetch: refetchArtworks } = useData(
    needsArtistIndex ? "/api/artwork?fields=_id,title,artist,related_exhibition" : null
  );
  // Other places an artist can hide. An image's tag may name an event, a
  // bibliography or a biography — those records resolve the tag back to an
  // artist, so without them every non-work image falls into "Ungrouped".
  const { data: rawEvents = [], isLoading: l5, error: e5, refetch: refetchEvents } = useData(
    needsArtistIndex ? "/api/event?fields=_id,title,related_artist" : null
  );
  const {
    data: rawBibliographies = [],
    isLoading: l6,
    error: e6,
    refetch: refetchBibliographies,
  } = useData(needsArtistIndex ? "/api/bibliography?fields=_id,title,related_artist" : null);
  const { data: rawSeries = [], refetch: refetchSeries } = useData(
    needsArtistIndex ? "/api/series?fields=_id,title,artist" : null
  );
  const { data: rawAbouts = [], isLoading: l7, error: e7, refetch: refetchAbouts } = useData(
    needsArtistIndex ? "/api/about?fields=_id,artist" : null
  );

  /** One retry button that re-requests everything this tab needs. */
  const refetchAll = useCallback(() => {
    refetchImages?.();
    refetchExhibitions?.();
    refetchArtworks?.();
    refetchEvents?.();
    refetchBibliographies?.();
    refetchSeries?.();
    refetchAbouts?.();
  }, [
    refetchImages,
    refetchExhibitions,
    refetchArtworks,
    refetchEvents,
    refetchBibliographies,
    refetchSeries,
    refetchAbouts,
  ]);

  const isLoading = l1 || l2 || l3 || l5 || l6 || l7;
  const error = e1 || e2 || e3 || e5 || e6 || e7;

  const [draft, setDraft] = useState({}); // group key -> ordered items
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [listMode, setListMode] = useState(false);
  const [thumbWidth, setThumbWidth] = useState(240);

  const hideToken = useMemo(() => hideTokenForOrderKey(orderKey), [orderKey]);
  const hideLabel = hideLabelForOrderKey(orderKey);

  const images = useMemo(() => {
    const arr = Array.isArray(rawImages) ? rawImages : [];
    return arr.map((it) => ({ ...it, id: it.id || it._id, _id: it._id || it.id }));
  }, [rawImages]);

  const artworks = useMemo(() => (Array.isArray(rawArtworks) ? rawArtworks : []), [rawArtworks]);

  // ── Artist index (rolling tab only) ──
  // A tag is resolved against Artwork + Exhibition + Event + Bibliography +
  // About, so an image whose tag names a show is placed under EVERY artist of
  // that show instead of falling out of the grouping.
  const sourceIndex = useMemo(
    () =>
      needsArtistIndex
        ? buildImageSourceIndex({
            artworks,
            images,
            exhibitions: Array.isArray(rawExhibitions) ? rawExhibitions : [],
            events: Array.isArray(rawEvents) ? rawEvents : [],
            bibliographies: Array.isArray(rawBibliographies) ? rawBibliographies : [],
            series: Array.isArray(rawSeries) ? rawSeries : [],
            abouts: Array.isArray(rawAbouts) ? rawAbouts : [],
          })
        : null,
    [
      needsArtistIndex,
      artworks,
      images,
      rawExhibitions,
      rawEvents,
      rawBibliographies,
      rawSeries,
      rawAbouts,
    ]
  );

  // ── Per-card hide/show state (declared before groups is consumed) ──
  // Optimistic overrides: id → mark value, applied instantly on toggle and
  // persisted with a PUT to /api/image.
  const [markOverrides, setMarkOverrides] = useState({});
  const [markBusy, setMarkBusy] = useState({});
  // Groups touched by a hide/show toggle → re-number them on Save.
  const [dirtyKeys, setDirtyKeys] = useState({});

  const markOf = useCallback(
    (item) => {
      const id = item?.id || item?._id;
      if (id && Object.prototype.hasOwnProperty.call(markOverrides, id)) {
        return markOverrides[id];
      }
      return item?.mark;
    },
    [markOverrides]
  );

  const isItemHidden = useCallback(
    (item) => isMarkHidden({ mark: markOf(item) }, hideToken),
    [markOf, hideToken]
  );

  const isItemBusy = useCallback(
    (item) => {
      const id = item?.id || item?._id;
      return Boolean(id && markBusy[id]);
    },
    [markBusy]
  );

  // ── Structure ──
  // One builder for all tabs (orderGroups.js): artist mode for the rolling
  // tab, exhibition mode for the page-order tabs. Hidden images are stamped on
  // the copies here so the block can split them without re-reading the marks
  // per render.
  const groups = useMemo(() => {
    const metaOf = (entity) => formatDateRange(entity, isCn);

    const built = buildImageOrderGroups({
      images,
      orderKey,
      sourceIndex,
      exhibitions: rawExhibitions,
      isCn,
      metaOf,
    });

    return built.map((group) => ({
      ...group,
      items: group.items.map((item) => ({ ...item, __hidden: isItemHidden(item) })),
      sources: (group.sources || []).map((source) => ({
        ...source,
        items: source.items.map((item) => ({ ...item, __hidden: isItemHidden(item) })),
      })),
    }));
  }, [images, orderKey, sourceIndex, rawExhibitions, isCn, isItemHidden, mode]);

  // Reset the draft whenever the groups change.
  useEffect(() => {
    const next = {};
    for (const g of groups) next[g.key] = g.items;
    setDraft(next);
  }, [groups]);

  // Drag inside one source box → splice those cards back into the group's
  // running order, leaving every other source box where it was.
  const onReorder = useCallback(
    (groupKey, sourceKey, nextItems) => {
      setDraft((prev) => {
        const list = prev[groupKey] || [];
        let cursor = 0;
        const next = list.map((item) => {
          if (item.__sourceKey !== sourceKey || item.__hidden) return item;
          return nextItems[cursor++] || item;
        });
        return { ...prev, [groupKey]: next };
      });
      setDirtyKeys((prev) => ({ ...prev, [groupKey]: true }));
    },
    []
  );

  const onToggleItemHidden = useCallback(
    async (item, groupKey) => {
      const id = item?.id || item?._id;
      if (!id) return;

      // Remember that this group needs re-numbering on the next save (both for
      // hide — which clears the position — and show — which adds it back).
      if (groupKey) setDirtyKeys((prev) => ({ ...prev, [groupKey]: true }));

      const nextHidden = !isItemHidden(item);
      // Hide flags live inside the JSON mark, so a form-set `value` survives.
      const nextMark = applyMark(markOf(item), hideToken, nextHidden);

      // Optimistic — the card greys out (or clears) immediately.
      setMarkOverrides((prev) => ({ ...prev, [id]: nextMark }));
      setMarkBusy((prev) => ({ ...prev, [id]: true }));

      try {
        const payload = { mark: toWireMark(nextMark) };
        if (nextHidden) {
          // A hidden image keeps NO position for this page — clear it right
          // away (the other order keys are preserved).
          payload.order = {
            ...normalizeImageOrder(item?.order),
            [orderKey]: "",
          };
        }

        const res = await fetch(`/api/image?id=${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setNotice({
          type: "ok",
          text: nextHidden
            ? isCn
              ? "已隐藏 · 已清除排序"
              : "Hidden · order cleared"
            : isCn
            ? "已恢复显示"
            : "Shown again",
        });
      } catch (err) {
        console.log("[image order] mark update failed:", err);
        setMarkOverrides((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        setNotice({ type: "err", text: isCn ? "标记保存失败" : "Failed to save mark" });
      } finally {
        setMarkBusy((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    },
    [isItemHidden, hideToken, markOf, orderKey, isCn]
  );

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      setNotice(null);

      // Only send groups whose visible order actually changed (single request).
      // Hidden images are excluded from the numbering and have their position
      // cleared, so "hidden" rows never carry a position.
      const groupsToSave = [];
      const hiddenSet = new Set();
      for (const g of groups) {
        const items = draft[g.key] || g.items;
        const visible = [];
        for (const it of items) {
          const id = it.id || it._id;
          if (it.__hidden || isItemHidden(it)) {
            if (id) hiddenSet.add(id);
          } else if (id) {
            visible.push(id);
          }
        }

        // Always write every group with at least one visible item — a group
        // holding a single item still needs its position initialised/persisted.
        if (visible.length) {
          groupsToSave.push(visible);
        }
      }

      const hiddenIds = [...hiddenSet];

      if (!groupsToSave.length && !hiddenIds.length) {
        setNotice({ type: "ok", text: txt(T.savedOk, isCn) });
        return;
      }
      const res = await fetch("/api/image/reorder", {
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
      refetchImages?.();
    } catch (e) {
      console.log(e);
      setNotice({ type: "err", text: txt(T.saveFail, isCn) });
    } finally {
      setSaving(false);
    }
  }, [groups, draft, isItemHidden, refetchImages, isCn, orderKey]);

  const handleReset = useCallback(() => {
    const next = {};
    for (const g of groups) next[g.key] = g.items;
    setDraft(next);
    setNotice(null);
  }, [groups]);

  const hiddenCount = useMemo(() => {
    const ids = new Set();
    for (const group of groups) {
      for (const item of draft[group.key] || group.items) {
        if (item.__hidden) ids.add(idOf(item));
      }
    }
    return ids.size;
  }, [groups, draft]);

  // ── Rolling selection overview (top strip) ──────────────────────────────
  // The Rolling Image Order tab is the one that decides what the artist pages
  // actually show, so it gets an at-a-glance filmstrip of the current
  // selection: artists in page order, each artist's images in rolling order,
  // numbered 1..N across the whole artist (same numbers as the cards).
  const isRollingTab = orderKey === ARTIST_ROLLING_ORDER_KEY;
  // The artist DETAIL page sequence gets a per-artist preview inside each box
  // (the artist-page tab already has the global selection strip at the top).
  const isDetailRollingTab = orderKey === ARTIST_DETAIL_ROLLING_ORDER_KEY;

  const groupAnchorId = useCallback((key) => `ordgroup-${String(key)}`, []);

  const rollingOverview = useMemo(() => {
    if (!isRollingTab) return [];
    return groups.map((g) => {
      const items = draft[g.key] || g.items;
      const rolling = [];
      for (const item of items) {
        if (item.__hidden) continue;
        rolling.push({
          id: idOf(item),
          number: rolling.length + 1,
          title: item?.tag_en || item?.tag_cn || "",
          url: item?.img_url || item?.image_url || "",
          artistLabel: g.label,
        });
      }
      return { key: g.key, label: g.label, items: rolling };
    });
  }, [groups, draft, isRollingTab]);

  if (isLoading) return <LoadingLayer isLoading />;
  if (error) {
    return (
      <AlertInfo
        message={txt(T.loadFail, isCn)}
        subMessage={String(error || "")}
        messageCn={txt(T.loadFail, true)}
        buttonText={isCn ? "重试" : "Retry"}
        onBack={refetchAll}
        isCn={isCn}
      />
    );
  }

  // Human-readable name of the order currently being edited.
  const orderLabel = orderKey
    ? txt(ORDER_KEY_LABELS[orderKey] || { en: orderKey, cn: orderKey }, isCn)
    : "";

  return (
    <div style={{ background: colors.background, color: colors.text, minHeight: "100vh" }}>
      <OrderPageShell
        isCn={isCn}
        fontFamily={fontFamily}
        containerStyle={{ maxWidth: 1400, margin: "0 auto", padding: "24px 20px 80px" }}
        title={T.title}
        subtitle={T.subtitle}
        backLabel={T.back}
        onBack={() => history.back()}
        orderLabel={orderLabel}
        orderByLabel={{ en: "Order by", cn: "排序维度" }}
        orderKeys={IMAGE_PAGE_ORDER_KEYS}
        orderLabels={ORDER_KEY_LABELS}
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
            entity="image"
            isCn={isCn}
            fontFamily={fontFamily}
            labelFontFamily={fontFamily}
          />
        }
        switcherExtra={
          hiddenCount > 0 ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily,
                fontSize: 12,
                opacity: 0.6,
              }}
              title={hideLabel ? txt(hideLabel, isCn) : ""}
            >
              <svg width="12" height="12" viewBox="0 0 72 72" fill="none" aria-hidden="true">
                <path d="M12 12 L60 60 M60 12 L12 60" stroke="#9a9a9a" strokeWidth="8" strokeLinecap="round" />
              </svg>
              {isCn
                ? `${hiddenCount} 张已从此页隐藏`
                : `${hiddenCount} hidden from this page`}
            </span>
          ) : null
        }
        hint={
          <span style={{ fontFamily, fontSize: 12, opacity: 0.55, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <GripVertical size={14} /> {txt(T.dragHint, isCn)}
          </span>
        }
        right={
          <OrderViewControls
            listMode={listMode}
            onListModeChange={setListMode}
            size={thumbWidth}
            onSizeChange={setThumbWidth}
            min={140}
            max={480}
            step={10}
            sizeSliderWidth={140}
            labels={{
              grid: txt(T.grid, isCn),
              list: txt(T.list, isCn),
              size: txt(T.size, isCn),
            }}
            fontFamily={fontFamily}
          />
        }
      >

        {/* Rolling selection — every image that will roll on an artist page,
            in order, numbered. Only relevant on the Rolling Image Order tab. */}
        {isRollingTab ? (
          <OrderRollingStrip
            groups={rollingOverview}
            isCn={isCn}
            fontFamily={fontFamily}
            labelFontFamily={fontFamily}
            anchorIdFor={(key) => groupAnchorId(key)}
          />
        ) : null}

        {/* Groups — one per artist (rolling tab) or per exhibition. */}
        {groups.length === 0 ? (
          <div style={{ fontFamily, fontSize: 14, opacity: 0.6, padding: 40, textAlign: "center" }}>
            {txt(T.empty, isCn)}
          </div>
        ) : (
          groups.map((g) => (
            <GroupBlock
              key={g.key}
              group={g}
              items={draft[g.key] || g.items}
              anchorId={groupAnchorId(g.key)}
              orderKey={orderKey}
              isRollingTab={isRollingTab}
              showRollingPreview={isDetailRollingTab}
              isCn={isCn}
              fontFamily={fontFamily}
              listMode={listMode}
              thumbWidth={thumbWidth}
              onReorderSource={onReorder}
              onToggleItemHidden={onToggleItemHidden}
              hideLabel={hideLabel}
              isItemBusy={isItemBusy}
            />
          ))
        )}
      </OrderPageShell>
    </div>
  );
}