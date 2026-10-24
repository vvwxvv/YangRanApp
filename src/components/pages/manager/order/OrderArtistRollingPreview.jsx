"use client";

/**
 * OrderArtistRollingPreview.jsx — the per-artist filmstrip shown INSIDE an
 * artist's accordion on the "Artist Detail Page Order (Rolling Images)" tab.
 *
 * It answers the question the cards alone can't: "what will this artist's
 * detail-page slideshow actually show, in which order?" — the artist's selected
 * images, numbered 1…N exactly like the slides they drive.
 *
 *   ┌ Detail page rolling preview · 4 images ────────────────────────┐
 *   │ [1 img] [2 img] [3 img] [4 img]                                 │
 *   └─────────────────────────────────────────────────────────────────┘
 *
 * Nothing here is interactive: it is a read-only mirror of the cards below
 * (use the eye on a card to change the selection).
 */

import React from "react";

export default function OrderArtistRollingPreview({
  items = [],
  isCn = false,
  fontFamily,
  labelFontFamily,
  /** True once this artist's order for the active sequence has been saved. */
  hasSavedOrder = true,
  /** Shown when nothing is selected for this artist. */
  emptyHint,
}) {
  const t = {
    title: isCn ? "详情页轮播预览" : "Detail page rolling preview",
    images: isCn ? "张图片" : "images",
    where: isCn
      ? "显示位置：/artists/<artist>（艺术家详情页）→ 右栏顶部的轮播图"
      : "Shows on: /artists/<artist> (artist detail page) → the rolling slideshow at the top of the right column",
    notSaved: isCn
      ? "· 尚未保存（页面暂用艺术家页序列）"
      : "· not saved yet (page still uses the Artist Page sequence)",
    empty:
      emptyHint ||
      (isCn
        ? "这位艺术家还没有选择详情页轮播图片（此期间详情页仍使用艺术家页轮播序列）。"
        : "No images selected for this artist's detail page yet (it keeps using the artist-page sequence until you pick some)."),
  };

  return (
    <div
      style={{
        border: "1px solid var(--border-light, rgba(0,0,0,.12))",
        borderRadius: 10,
        background: "var(--interactive-background-hover, rgba(0,0,0,.015))",
        padding: "10px 12px 12px",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          marginBottom: items.length ? 9 : 3,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "1.3px",
            textTransform: "uppercase",
            opacity: 0.55,
          }}
        >
          {t.title}
        </span>
        {items.length ? (
          <span
            style={{
              fontFamily: labelFontFamily || fontFamily,
              fontSize: 11.5,
              color: "var(--text-primary, rgba(0,0,0,.5))",
            }}
          >
            {items.length} {t.images}
          </span>
        ) : null}
        {!hasSavedOrder ? (
          <span
            style={{
              fontFamily: labelFontFamily || fontFamily,
              fontSize: 11,
              color: "var(--text-primary, rgba(0,0,0,.45))",
            }}
          >
            {t.notSaved}
          </span>
        ) : null}
      </div>

      <div
        style={{
          fontFamily: labelFontFamily || fontFamily,
          fontSize: 10.5,
          color: "var(--text-primary, rgba(0,0,0,.45))",
          marginBottom: items.length ? 9 : 3,
        }}
      >
        {t.where}
      </div>

      {items.length === 0 ? (
        <div
          style={{
            fontFamily: labelFontFamily || fontFamily,
            fontSize: 11.5,
            lineHeight: 1.5,
            color: "var(--text-primary, rgba(0,0,0,.45))",
          }}
        >
          {t.empty}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            overflowY: "hidden",
            paddingBottom: 2,
          }}
        >
          {items.map((item) => (
            <div
              key={`${item.id}-${item.number}`}
              title={item.title || ""}
              style={{
                flexShrink: 0,
                width: 88,
                border: "1px solid var(--border-light, rgba(0,0,0,.14))",
                borderRadius: 7,
                background: "var(--background-primary, #fff)",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  position: "relative",
                  display: "block",
                  width: "100%",
                  aspectRatio: "4 / 3",
                  background: "var(--interactive-background-hover, #f2f2f2)",
                }}
              >
                {item.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt=""
                    draggable={false}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : null}
                <span
                  style={{
                    position: "absolute",
                    left: 4,
                    bottom: 4,
                    minWidth: 17,
                    height: 17,
                    padding: "0 4px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                    background: "var(--background-primary, rgba(255,255,255,.92))",
                    border: "1px solid var(--border-light, rgba(0,0,0,.18))",
                    fontFamily,
                    fontSize: 10.5,
                    fontWeight: 700,
                    lineHeight: 1,
                    color: "var(--text-primary, #000)",
                  }}
                >
                  {item.number}
                </span>
              </span>
              <span
                style={{
                  display: "block",
                  padding: "4px 6px 5px",
                  fontFamily,
                  fontSize: 10.5,
                  lineHeight: 1.25,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.title || "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
