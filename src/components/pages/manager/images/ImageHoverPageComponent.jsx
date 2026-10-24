"use client";

/**
 * ImageHoverPageComponent — the ARTIST NAME HOVER IMAGE page.
 *
 *   /manager/image/hover
 *
 * It decides which single image represents each artist — the picture a visitor
 * sees when they hover the artist's NAME (the `artist_hover_image` mark flag):
 *
 *   • grouped by artist, A→Z (Ungrouped last) — the SAME grouping the image
 *     order page uses, resolved through the shared image-source index, so an
 *     image tagged with an artwork OR an exhibition / fair / event / biography
 *     still lands under its artist instead of "Ungrouped".
 *   • every image is shown GREY by default — no × overlay
 *   • the chosen image turns back to full colour, moves to the top of its
 *     artist group and is what visitors see when hovering the artist's name
 *   • only ONE per artist — picking another clears the previous one. If an
 *     artist somehow carries more than one flag (older data, batch import),
 *     a red warning appears with a one-click "keep only the first" fix.
 *   • clicking the mouse button saves immediately (no separate save step)
 *
 * ── WHERE IT SHOWS (so nobody has to guess) ─────────────────────────────────
 *   /artists              → the sticky preview column on the RIGHT; the image
 *                           appears while a visitor hovers an artist name.
 *   /artists/<artist>     → the rolling slideshow; hovering it reveals the
 *                           same picture.
 */

import React, { useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Image, ImageOff, AlertTriangle } from "lucide-react";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import useData from "@/hooks/useData";
import useFont from '@/hooks/useFont';
import { buildImageSourceIndex } from "@/components/pages/manager/images/hooks/useImageSourceIndex";
import OrderPageShell from "@/components/pages/manager/order/OrderPageShell";
import OrderGroupBox from "@/components/pages/manager/order/OrderGroupBox";
import OrderInfoNote from "@/components/pages/manager/order/OrderInfoNote";
import OrderCard, {
  OrderCardGrid,
  OrderEmptyState,
  OrderViewControls,
} from "@/components/pages/manager/order/OrderCard";
import { getOrder } from "@/utils/mediaOrder";
import {
  MARK,
  applyMark,
  isMarkApplied,
  markLabel,
  toWireMark,
} from "@/utils/mediaMarks";

const T = {
  title: { en: "Artist Name Hover Image", cn: "艺术家名称悬停图" },
  subtitle: {
    en: "Pick ONE image per artist — the picture shown while a visitor hovers the artist's name. Everything is grey until it is chosen.",
    cn: "每位艺术家只选一张 — 访客悬停艺术家名称时显示的图片。未被选中的图片为灰色。",
  },
  back: { en: "Images", cn: "图库" },
  images: { en: "images", cn: "张图片" },
  chosen: { en: "hover image", cn: "悬停图" },
  empty: { en: "No images found", cn: "暂无图片" },
  loadingErr: { en: "Connection failed", cn: "连接失败" },
  retry: { en: "Retry", cn: "重试" },
  okOn: { en: "Hover image set", cn: "已设为悬停图" },
  okOff: { en: "Hover image cleared", cn: "已取消悬停图" },
  fail: { en: "Failed to save", cn: "保存失败" },
  grid: { en: "Grid", cn: "网格" },
  list: { en: "List", cn: "列表" },
  size: { en: "Size", cn: "大小" },
  pick: { en: "Set as", cn: "设为" },
  // Duplicate guard
  dupAlertTitle: { en: "More than one hover image", cn: "存在多张悬停图" },
  dupAlertArtist: {
    en: "artists carry more than one hover image. Only the first can show — keep it and clear the rest.",
    cn: "位艺术家拥有超过一张悬停图。只有第一张会显示 — 请保留第一张并清除其余。",
  },
  dupFix: { en: "Keep the first, clear the rest", cn: "保留第一张，清除其余" },
  dupFixed: { en: "Extra hover images cleared", cn: "已清除多余的悬停图" },
  dupGroup: { en: "hover images — only 1 allowed", cn: "张悬停图 — 只允许 1 张" },
  keepFirst: { en: "Keep the first", cn: "只保留第一张" },
};

const txt = (v, isCn) => (isCn ? v.cn : v.en);
const idOf = (item) => item?.id || item?._id || "";
/** Rolling position of an image ("" when it has none). */
const posOf = (item) => getOrder(item, "rolling_img_order");

const UNGROUPED_KEY = "__ungrouped__";

export default function ImageHoverPageComponent() {
  const router = useRouter();
  const { isCn } = useContext(LanguageContext);
  const { fontFamily, labelFontFamily } = useFont();

  const { data: images = [], isLoading: l1, error: e1, refetch: refetchImages } = useData(
    "/api/image?fields=_id,img_url,tag_en,tag_cn,type,tag_source,mark,order"
  );
  const { data: artworks = [], isLoading: l2, error: e2 } = useData(
    "/api/artwork?fields=_id,title,artist,related_exhibition"
  );
  // The extra collections below are used ONLY to resolve an image tag back to
  // its artist (exhibition / fair / event / bibliography / biography), the same
  // way the image order page groups. Without them those images would fall into
  // "Ungrouped" and an artist's real hover image could not be recognised.
  const { data: exhibitions = [], isLoading: l3, error: e3 } = useData(
    "/api/exhibition?fields=_id,title,related_artist,participating_artists,related_artwork"
  );
  const { data: fairs = [], isLoading: l4, error: e4 } = useData(
    "/api/fair?fields=_id,title,related_artist,participating_artists"
  );
  const { data: events = [], isLoading: l5, error: e5 } = useData(
    "/api/event?fields=_id,title,related_artist"
  );
  const { data: bibliographies = [], isLoading: l6, error: e6 } = useData(
    "/api/bibliography?fields=_id,title,related_artist"
  );
  const { data: series = [] } = useData(
    "/api/series?fields=_id,title,artist"
  );
  const { data: abouts = [], isLoading: l7, error: e7 } = useData(
    "/api/about?fields=_id,artist"
  );

  const [overrides, setOverrides] = useState({}); // id → mark (optimistic)
  const [busy, setBusy] = useState({});           // id → true
  const [notice, setNotice] = useState(null);
  const [fixing, setFixing] = useState(false);
  const [listMode, setListMode] = useState(false);
  const [thumbWidth, setThumbWidth] = useState(180);

  const imagesResolved = useMemo(
    () => (Array.isArray(images) ? images.map((it) => ({ ...it, id: it.id || it._id, _id: it._id || it.id })) : []),
    [images]
  );

  const sourceIndex = useMemo(
    () =>
      buildImageSourceIndex({
        artworks: Array.isArray(artworks) ? artworks : [],
        images: imagesResolved,
        exhibitions: Array.isArray(exhibitions) ? exhibitions : [],
        fairs: Array.isArray(fairs) ? fairs : [],
        events: Array.isArray(events) ? events : [],
        bibliographies: Array.isArray(bibliographies) ? bibliographies : [],
        series: Array.isArray(series) ? series : [],
        abouts: Array.isArray(abouts) ? abouts : [],
      }),
    [artworks, imagesResolved, exhibitions, fairs, events, bibliographies, series, abouts]
  );

  const markOf = useCallback(
    (img) => (idOf(img) in overrides ? overrides[idOf(img)] : img?.mark),
    [overrides]
  );
  const isHoverImage = useCallback(
    (img) => isMarkApplied({ mark: markOf(img) }, MARK.ARTIST_HOVER_IMAGE),
    [markOf]
  );

  // ── Artist-level grouping (one box per artist) ──────────────────────────
  // An image can belong to several artists (a group show's installation views),
  // exactly like the order page — it appears under each of them.
  const groups = useMemo(() => {
    const map = new Map();
    const ungrouped = { key: UNGROUPED_KEY, artist: "", label: isCn ? "未分组" : "Ungrouped", items: [] };

    for (const img of imagesResolved) {
      const resolved = sourceIndex.resolveImageSource(img);
      const artists = resolved?.artists || [];
      if (!artists.length) {
        ungrouped.items.push(img);
        continue;
      }
      for (const artist of artists) {
        const key = String(artist).toLowerCase();
        if (!map.has(key)) {
          map.set(key, {
            key,
            artist,
            label: sourceIndex.labelFor(artist, { lang: isCn ? "cn" : "en" }) || artist,
            items: [],
          });
        }
        map.get(key).items.push(img);
      }
    }

    const arr = [...map.values()].sort((a, b) =>
      String(a.label).localeCompare(String(b.label), undefined, { numeric: true, sensitivity: "base" })
    );
    if (ungrouped.items.length) arr.push(ungrouped);
    return arr;
  }, [imagesResolved, sourceIndex, isCn]);

  // Inside each artist group: the chosen hover images first (the first is what
  // shows), then the rest keep their rolling order (grey).
  const view = useMemo(
    () =>
      groups.map((g) => {
        const on = [];
        const off = [];
        for (const it of g.items) (isHoverImage(it) ? on : off).push(it);
        off.sort((a, b) => {
          const av = Number(posOf(a)) || Infinity;
          const bv = Number(posOf(b)) || Infinity;
          if (av !== bv) return av - bv;
          return String(a?.tag_en || "").localeCompare(String(b?.tag_en || ""));
        });
        return {
          ...g,
          items: [...on, ...off],
          chosenItems: on,
          chosenCount: on.length,
        };
      }),
    [groups, isHoverImage]
  );

  const duplicateGroups = useMemo(() => view.filter((g) => g.chosenCount > 1), [view]);

  const putMark = (iid, mark) =>
    fetch(`/api/image?id=${iid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      // `toWireMark` keeps `hide` AND `marks` present even when empty — a
      // compact mark (missing `marks`) is read by the API as "keep existing",
      // which silently dropped the CLEAR of a hover flag. See utils/mediaMarks.
      body: JSON.stringify({ mark: toWireMark(mark) }),
    });

  // The mouse button saves straight away.
  const toggle = useCallback(
    async (img, groupKey) => {
      const id = idOf(img);
      if (!id || busy[id]) return;

      const currentMark = markOf(img);
      const nextOn = !isMarkApplied({ mark: currentMark }, MARK.ARTIST_HOVER_IMAGE);
      const nextMark = applyMark(currentMark, MARK.ARTIST_HOVER_IMAGE, nextOn);

      // Choosing one clears THIS ARTIST's other hover images (no other artist
      // is touched — the group is one artist, so this can never wipe the site).
      const group = groups.find((g) => g.key === groupKey);
      const others =
        nextOn && group
          ? group.items.filter(
              (it) => idOf(it) !== id && isMarkApplied({ mark: markOf(it) }, MARK.ARTIST_HOVER_IMAGE)
            )
          : [];

      setNotice(null);
      setOverrides((prev) => {
        const next = { ...prev, [id]: nextMark };
        others.forEach((o) => (next[idOf(o)] = applyMark(markOf(o), MARK.ARTIST_HOVER_IMAGE, false)));
        return next;
      });
      setBusy((prev) => {
        const next = { ...prev, [id]: true };
        others.forEach((o) => (next[idOf(o)] = true));
        return next;
      });

      try {
        const res = await putMark(id, nextMark);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await Promise.all(
          others.map((o) => putMark(idOf(o), applyMark(markOf(o), MARK.ARTIST_HOVER_IMAGE, false)))
        );
        setNotice({ type: "ok", text: txt(nextOn ? T.okOn : T.okOff, isCn) });
        refetchImages?.();
      } catch (err) {
        console.log("[hover image] save failed:", err);
        setOverrides((prev) => {
          const next = { ...prev };
          delete next[id];
          others.forEach((o) => delete next[idOf(o)]);
          return next;
        });
        setNotice({ type: "err", text: txt(T.fail, isCn) });
      } finally {
        setBusy((prev) => {
          const next = { ...prev };
          delete next[id];
          others.forEach((o) => delete next[idOf(o)]);
          return next;
        });
      }
    },
    [busy, groups, isCn, markOf, refetchImages]
  );

  // One-click repair: every artist with >1 flag keeps its first (topmost) and
  // clears the rest. Used by the red duplicate banner.
  const clearGroupExtras = useCallback(
    async (group) => {
      const extras = group.chosenItems.slice(1);
      if (!extras.length) return;
      setBusy((prev) => {
        const next = { ...prev };
        extras.forEach((it) => (next[idOf(it)] = true));
        return next;
      });
      try {
        await Promise.all(
          extras.map((o) =>
            putMark(idOf(o), applyMark(markOf(o), MARK.ARTIST_HOVER_IMAGE, false))
          )
        );
        setOverrides((prev) => {
          const next = { ...prev };
          extras.forEach((o) => (next[idOf(o)] = applyMark(markOf(o), MARK.ARTIST_HOVER_IMAGE, false)));
          return next;
        });
        setNotice({ type: "ok", text: txt(T.dupFixed, isCn) });
        refetchImages?.();
      } catch (err) {
        console.log("[hover image] duplicate fix failed:", err);
        setNotice({ type: "err", text: txt(T.fail, isCn) });
      } finally {
        setBusy((prev) => {
          const next = { ...prev };
          extras.forEach((o) => delete next[idOf(o)]);
          return next;
        });
      }
    },
    [isCn, markOf, refetchImages]
  );

  const fixAllDuplicates = useCallback(async () => {
    if (!duplicateGroups.length) return;
    setFixing(true);
    try {
      for (const g of duplicateGroups) await clearGroupExtras(g);
      setNotice({ type: "ok", text: txt(T.dupFixed, isCn) });
    } finally {
      setFixing(false);
    }
  }, [duplicateGroups, clearGroupExtras, isCn]);

  const isLoading = l1 || l2 || l3 || l4 || l5 || l6 || l7;
  const error = e1 || e2 || e3 || e4 || e5 || e6 || e7;

  if (isLoading) return <div style={{ background: "#fff", minHeight: "60vh" }} />;

  if (error) {
    return (
      <div style={{ background: "#fff", minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <div style={{ fontFamily, fontSize: 14 }}>{txt(T.loadingErr, isCn)}</div>
        <button
          type="button"
          onClick={() => refetchImages?.()}
          style={{ padding: "8px 16px", fontSize: 13, fontFamily, border: "1px solid #000", borderRadius: 8, background: "#fff", cursor: "pointer" }}
        >
          {txt(T.retry, isCn)}
        </button>
      </div>
    );
  }

  const total = view.reduce((n, g) => n + g.items.length, 0);
  const dupArtistCount = duplicateGroups.length;

  return (
    <OrderPageShell
      isCn={isCn}
      fontFamily={fontFamily}
      containerStyle={{ maxWidth: "none", margin: 0, padding: "22px 20px 60px", minHeight: "100%" }}
      title={T.title}
      subtitle={T.subtitle}
      backLabel={T.back}
      onBack={() => router.push("/manager/image")}
      notice={notice}
      info={
        <OrderInfoNote
          orderKey="artist_hover_image"
          entity="image"
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
          min={140}
          max={360}
          step={10}
          labels={{ grid: txt(T.grid, isCn), list: txt(T.list, isCn), size: txt(T.size, isCn) }}
          fontFamily={fontFamily}
        />
      }
    >

      {/* ── Duplicate guard ── */}
      {dupArtistCount > 0 ? (
        <div
          role="alert"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            border: "1px solid rgba(200,40,40,.5)",
            background: "rgba(200,40,40,.055)",
            borderRadius: 10,
            padding: "11px 14px",
            marginBottom: 18,
            fontFamily,
          }}
        >
          <AlertTriangle size={16} color="#c82828" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: "#8a1c1c", flex: 1, minWidth: 240 }}>
            <strong>{dupArtistCount}</strong> {txt(T.dupAlertArtist, isCn)}
          </span>
          <button
            type="button"
            className="ordbtn"
            disabled={fixing}
            onClick={fixAllDuplicates}
            style={{
              padding: "6px 12px",
              fontFamily,
              fontSize: 12.5,
              border: "1px solid rgba(200,40,40,.6)",
              borderRadius: 8,
              background: "#fff",
              color: "#8a1c1c",
              cursor: fixing ? "default" : "pointer",
              opacity: fixing ? 0.5 : 1,
            }}
          >
            {txt(T.dupFix, isCn)}
          </button>
        </div>
      ) : null}

      {/* ── Artist groups ── */}
      {total === 0 ? (
        <OrderEmptyState text={txt(T.empty, isCn)} fontFamily={fontFamily} />
      ) : (
        view.map((g) => (
          <OrderGroupBox
            key={g.key}
            label={g.label || g.artist}
            count={`${g.items.length} ${txt(T.images, isCn)}`}
            fontFamily={fontFamily}
            labelFontFamily={labelFontFamily}
            right={
              g.chosenCount === 1 ? (
                <span style={{ fontFamily: labelFontFamily, fontSize: 11, fontWeight: 700 }}>
                  ● {markLabel(MARK.ARTIST_HOVER_IMAGE, isCn)}
                </span>
              ) : g.chosenCount > 1 ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: labelFontFamily,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#c82828",
                  }}
                >
                  <AlertTriangle size={13} /> {g.chosenCount} {txt(T.dupGroup, isCn)}
                </span>
              ) : null
            }
          >
            {/* Duplicate guard for THIS artist — lives in the body because the
                group header is itself a <button> (buttons cannot nest). */}
            {g.chosenCount > 1 ? (
              <div
                role="alert"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                  border: "1px solid rgba(200,40,40,.45)",
                  background: "rgba(200,40,40,.05)",
                  borderRadius: 8,
                  padding: "8px 10px",
                  marginBottom: 12,
                  fontFamily,
                }}
              >
                <AlertTriangle size={14} color="#c82828" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: "#8a1c1c", flex: 1, minWidth: 200 }}>
                  {g.chosenCount} {txt(T.dupGroup, isCn)}
                </span>
                <button
                  type="button"
                  className="ordbtn"
                  disabled={fixing}
                  onClick={() => clearGroupExtras(g)}
                  style={{
                    padding: "4px 10px",
                    fontFamily,
                    fontSize: 11.5,
                    border: "1px solid rgba(200,40,40,.6)",
                    borderRadius: 7,
                    background: "#fff",
                    color: "#8a1c1c",
                    cursor: fixing ? "default" : "pointer",
                  }}
                >
                  {txt(T.keepFirst, isCn)}
                </button>
              </div>
            ) : null}

            <OrderCardGrid listMode={listMode} thumbWidth={thumbWidth} gap={14}>
              {g.items.map((img) => {
                const id = idOf(img);
                const on = isHoverImage(img);
                const isBusy = !!busy[id];
                return (
                  <OrderCard
                    key={id}
                    image={img.img_url}
                    imageAlt={img.tag_en || ""}
                    title={isCn ? img.tag_cn || img.tag_en : img.tag_en || img.tag_cn}
                    meta={[img.type, posOf(img) ? `#${posOf(img)}` : ""]
                      .filter(Boolean)
                      .join(" · ")}
                    dim={!on}
                    borderColor={on ? "#000" : "rgba(0,0,0,.12)"}
                    listMode={listMode}
                    thumbWidth={thumbWidth}
                    fontFamily={fontFamily}
                    metaFontFamily={labelFontFamily}
                    action={{
                      variant: "outlined",
                      icon: on ? (
                        <Image size={15} strokeWidth={2} />
                      ) : (
                        <ImageOff size={15} strokeWidth={1.8} />
                      ),
                      pressed: on,
                      busy: isBusy,
                      title: on
                        ? `${markLabel(MARK.ARTIST_HOVER_IMAGE, isCn)} · ${isCn ? "点击取消" : "click to clear"}`
                        : `${txt(T.pick, isCn)} ${markLabel(MARK.ARTIST_HOVER_IMAGE, isCn)}`,
                      onClick: () => toggle(img, g.key),
                    }}
                  />
                );
              })}
            </OrderCardGrid>
          </OrderGroupBox>
        ))
      )}
    </OrderPageShell>
  );
}
