"use client";

/**
 * OrderRollingStrip.jsx — the "at a glance" filmstrip at the top of the
 * Rolling Image Order page.
 *
 * One horizontal row with EVERY image currently selected for the artist-page
 * rolling sequence, in the exact order it will roll: artists in page order,
 * each artist's images in their rolling order, each tile numbered. Hovering a
 * tile shows the full title; clicking jumps to that artist's box.
 *
 * Data shape:
 *   groups = [{ key, label, items: [{ id, number, title, url }] }]
 */

import React from "react";

export default function OrderRollingStrip({
  groups = [],
  isCn = false,
  fontFamily,
  labelFontFamily,
  labels = {},
  /** Where this sequence shows on the public site (a short sentence). */
  where,
  /** Optional: id of the artist box to scroll to. */
  anchorIdFor,
}) {
  const rows = groups.filter((g) => g.items.length > 0);
  const total = rows.reduce((n, g) => n + g.items.length, 0);

  const t = {
    title: labels.title || (isCn ? "轮播选中" : "Rolling Selection"),
    images: labels.images || (isCn ? "张图片" : "images"),
    artists: labels.artists || (isCn ? "位艺术家" : "artists"),
    empty:
      labels.empty ||
      (isCn
        ? "还没有选中任何轮播图片 —— 用下方的眼睛按钮隐藏不需要的图片。"
        : "No rolling images selected yet — use the eye button below to hide the ones you don't want."),
    jump: labels.jump || (isCn ? "跳转到该艺术家" : "Jump to this artist"),
  };

  const whereText =
    where ||
    (isCn
      ? "显示位置：/artists（艺术家列表）右侧预览栏 · /artists/<artist>（详情页）右侧轮播（作为回退）"
      : "Shows on: /artists (artist list) → right preview column · /artists/<artist> (detail page) → right rolling slideshow (fallback)");

  const jump = (key) => {
    if (!anchorIdFor) return;
    document
      .getElementById(anchorIdFor(key))
      ?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      style={{
        border: "1px solid var(--border-light, rgba(0,0,0,.16))",
        borderRadius: 12,
        marginBottom: 20,
        overflow: "hidden",
        background: "var(--background-primary, #fff)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          padding: "11px 18px",
          background: "var(--interactive-background-hover, rgba(0,0,0,.02))",
          borderBottom: "1px solid var(--border-light, rgba(0,0,0,.08))",
          fontFamily,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "1.4px",
            textTransform: "uppercase",
          }}
        >
          {t.title}
        </span>
        <span
          style={{
            fontFamily: labelFontFamily || fontFamily,
            fontSize: 12,
            color: "var(--text-primary, rgba(0,0,0,.55))",
          }}
        >
          {total} {t.images}
          {rows.length > 0 ? ` · ${rows.length} ${t.artists}` : ""}
        </span>
      </div>

      <div
        style={{
          padding: "7px 18px",
          borderBottom: "1px dashed var(--border-light, rgba(0,0,0,.14))",
          fontFamily: labelFontFamily || fontFamily,
          fontSize: 11,
          color: "var(--text-primary, rgba(0,0,0,.5))",
          lineHeight: 1.5,
        }}
      >
        {whereText}
      </div>

      {total === 0 ? (
        <div
          style={{
            padding: "16px 18px",
            fontFamily: labelFontFamily || fontFamily,
            fontSize: 12,
            color: "var(--text-primary, rgba(0,0,0,.45))",
          }}
        >
          {t.empty}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: 12,
            padding: "14px 18px 16px",
            overflowX: "auto",
            overflowY: "hidden",
          }}
        >
          {rows.flatMap((g) =>
            g.items.map((item) => (
              <button
                key={`${g.key}-${item.id}-${item.number}`}
                type="button"
                className="ordstrip"
                onClick={() => jump(g.key)}
                title={`${g.label} · ${item.title || ""} — ${t.jump}`}
                style={{
                  flexShrink: 0,
                  display: "block",
                  width: 104,
                  padding: 0,
                  border: "1px solid var(--border-light, rgba(0,0,0,.14))",
                  borderRadius: 8,
                  background: "var(--background-primary, #fff)",
                  overflow: "hidden",
                  cursor: anchorIdFor ? "pointer" : "default",
                  textAlign: "left",
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
                      minWidth: 18,
                      height: 18,
                      padding: "0 4px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                      background: "var(--background-primary, rgba(255,255,255,.92))",
                      border: "1px solid var(--border-light, rgba(0,0,0,.18))",
                      fontFamily,
                      fontSize: 11,
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
                    padding: "5px 7px 6px",
                    fontFamily,
                    fontSize: 11,
                    lineHeight: 1.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.title || "—"}
                </span>
                <span
                  style={{
                    display: "block",
                    padding: "0 7px 7px",
                    fontFamily: labelFontFamily || fontFamily,
                    fontSize: 10,
                    color: "var(--text-primary, rgba(0,0,0,.45))",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.artistLabel || g.label}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </section>
  );
}
