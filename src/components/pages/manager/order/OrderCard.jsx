"use client";

/**
 * OrderCard.jsx — the ONE card used by every manager "order" page.
 *
 * Before this file there were three near-identical card implementations
 * (image order, artwork order, artist hover image) drifting apart: different
 * image ratios, different paddings, one filled the eye toggle black, one let
 * tall images stretch the row and leave a big white gap under short cards.
 *
 * Everything now goes through here, so a change lands everywhere:
 *
 *   <OrderCard
 *     image={url}
 *     title="Blue Nude"
 *     subtitle="2024 · Oil on canvas"
 *     meta="Exhibition · Paris"
 *     number={3}
 *     dim={isHidden}
 *     listMode={listMode}
 *     thumbWidth={thumbWidth}
 *     action={{ icon: <Eye size={15} />, onClick, pressed: isHidden, title: "…" }}
 *   />
 *
 * The image box has a FIXED aspect ratio (4/3 by default) with `object-fit:
 * cover`, so every card in a row is exactly the same height — no white space,
 * whatever the source image's shape. `listMode` flips the card to a row.
 *
 * Also exported (shared chrome for the order pages):
 *   • SortableOrderItem — dnd-kit sortable wrapper
 *   • OrderCardGrid     — the grid/list container (min column = thumbWidth)
 *   • OrderHiddenStrip  — dashed separator + half-size cards for hidden items
 *   • OrderViewControls — grid/list toggle + size slider (toolbar right slot)
 *   • OrderEmptyState   — "nothing here" message
 *
 * Group accordion boxes live next door in `OrderGroupBox.jsx`.
 */

import React from "react";
import { GripVertical, LayoutGrid, List } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/** `"4 / 3"` + width 240 → 180 (the height that keeps the ratio). */
export function aspectHeight(aspect, width) {
  const m = String(aspect || "").match(/([\d.]+)\s*\/\s*([\d.]+)/);
  if (!m) return undefined;
  return Math.round((width * Number(m[2])) / Number(m[1]));
}

// ─────────────────────────────────────────────────────────────────────────────
//  dnd-kit wrapper — the whole card is the drag handle
// ─────────────────────────────────────────────────────────────────────────────
export function SortableOrderItem({ id, disabled = false, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 50 : "auto",
        position: "relative",
        cursor: disabled ? "default" : "grab",
        touchAction: "none",
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Grid / list container
// ─────────────────────────────────────────────────────────────────────────────
export function OrderCardGrid({ listMode, thumbWidth, gap = 12, children, style }) {
  const base = listMode
    ? { display: "flex", flexDirection: "column", gap: 10 }
    : {
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${thumbWidth}px, 1fr))`,
        gap,
      };
  return <div style={{ ...base, ...style }}>{children}</div>;
}

// ─────────────────────────────────────────────────────────────────────────────
//  The card
// ─────────────────────────────────────────────────────────────────────────────
export default function OrderCard({
  image,
  imageAlt = "",
  title,
  subtitle,
  meta,
  /** Position badge (1-based). Omit for no badge; pass `null` for an em dash. */
  number,
  /** Grey the card out (hidden / not-selected). */
  dim = false,
  borderColor = "var(--border-light, #000)",
  listMode = false,
  thumbWidth = 180,
  /** Fixed cover ratio in grid mode / list mode. */
  gridAspect = "4 / 3",
  listAspect = "4 / 3",
  imageBackground = "var(--interactive-background-hover, #f2f2f2)",
  /** Show the little grip badge (the card is draggable either way). */
  dragHandle = false,
  dragHint = "Drag to reorder",
  /** Top-right action button: { icon, title, onClick, pressed, busy, variant } */
  action = null,
  /** Big light-grey X over the whole card. */
  overlayX = false,
  fontFamily,
  titleFontFamily,
  metaFontFamily,
  titleSize = 13,
  style,
  bodyStyle,
  imageStyle,
}) {
  const a = action || null;
  const variant = a?.variant || "plain";

  const actionStyle =
    variant === "outlined"
      ? {
          top: 8,
          right: 8,
          width: 30,
          height: 30,
          borderRadius: 9,
          border: `${a?.pressed ? 1.5 : 1}px solid ${a?.pressed ? "var(--border-light, #000)" : "var(--border-light, rgba(0,0,0,.16))"}`,
          background: "var(--background-primary, #fff)",
          color: a?.pressed ? "var(--text-primary, #000)" : "var(--text-primary, rgba(0,0,0,.4))",
          boxShadow: a?.pressed ? "0 1px 6px rgba(0,0,0,.14)" : "none",
          opacity: a?.busy ? 0.4 : 1,
        }
      : {
          top: 6,
          right: 6,
          width: 26,
          height: 26,
          borderRadius: 7,
          border: "1px solid " + (a?.pressed ? "var(--border-light, #9a9a9a)" : "var(--border-light, rgba(0,0,0,.18))"),
          background: a?.pressed ? "var(--interactive-background-hover, rgba(0,0,0,.06))" : "var(--background-primary, rgba(255,255,255,.9))",
          color: "var(--text-primary, #000)",
          opacity: a?.busy ? 0.4 : a?.pressed ? 1 : 0.55,
        };

  return (
    <div
      style={{
        position: "relative",
        display: listMode ? "flex" : "block",
        alignItems: listMode ? "center" : undefined,
        gap: listMode ? 12 : undefined,
        border: `1px solid ${borderColor}`,
        borderRadius: 10,
        background: "var(--background-primary, #fff)",
        color: "var(--text-primary, #000)",
        overflow: "hidden",
        boxSizing: "border-box",
        height: listMode ? undefined : "100%",
        filter: dim ? "grayscale(1)" : undefined,
        opacity: dim ? 0.55 : 1,
        transition: "filter .15s ease, opacity .15s ease",
        ...style,
      }}
    >
      {/* Cover — fixed ratio so every card lines up */}
      <div
        style={{
          width: listMode ? thumbWidth : "100%",
          aspectRatio: listMode ? undefined : gridAspect,
          height: listMode ? aspectHeight(listAspect, thumbWidth) : undefined,
          background: imageBackground,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flexShrink: 0,
          ...imageStyle,
        }}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={imageAlt}
            draggable={false}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <span style={{ fontSize: 11, opacity: 0.4 }}>No image</span>
        )}
      </div>

      {/* Body — title (+ number), subtitle, meta */}
      <div
        style={{
          padding: listMode ? "10px 12px" : "10px 12px",
          flex: listMode ? 1 : undefined,
          minWidth: 0,
          ...bodyStyle,
        }}
      >
        {title || number !== undefined ? (
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: titleFontFamily || fontFamily,
                fontWeight: 600,
                fontSize: titleSize,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}
              title={title || ""}
            >
              {title || "—"}
            </span>
            {number !== undefined ? (
              <span
                style={{
                  flex: "0 0 auto",
                  fontFamily,
                  fontSize: 20,
                  fontWeight: 700,
                  lineHeight: 1,
                  color: "var(--text-primary, #000)",
                  opacity: number ? 1 : 0.3,
                }}
              >
                {number || "—"}
              </span>
            ) : null}
          </div>
        ) : null}

        {subtitle ? (
          <div
            style={{
              fontFamily,
              fontSize: 12,
              opacity: 0.7,
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={subtitle}
          >
            {subtitle}
          </div>
        ) : null}

        {meta ? (
          <div
            style={{
              fontFamily: metaFontFamily || fontFamily,
              fontSize: 11,
              opacity: 0.5,
              marginTop: 4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={meta}
          >
            {meta}
          </div>
        ) : null}
      </div>

      {/* Grip badge */}
      {dragHandle ? (
        <span
          style={{
            position: "absolute",
            top: 6,
            left: 6,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            borderRadius: 6,
            border: "1px solid var(--border-light, rgba(0,0,0,.14))",
            background: "var(--background-primary, rgba(255,255,255,.9))",
            color: "var(--text-primary, rgba(0,0,0,.45))",
          }}
          title={dragHint}
        >
          <GripVertical size={14} />
        </span>
      ) : null}

      {/* Action button (hide / show / pick) */}
      {a?.icon ? (
        <button
          type="button"
          className="ordhide"
          aria-pressed={a.pressed || false}
          disabled={a.busy}
          title={a.title || ""}
          onClick={(e) => {
            e.stopPropagation();
            a.onClick?.();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            zIndex: 3,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            cursor: a.busy ? "default" : "pointer",
            transition: "border-color .15s ease, color .15s ease, box-shadow .15s ease, opacity .15s ease, background .15s ease",
            ...actionStyle,
          }}
        >
          {a.icon}
        </button>
      ) : null}

      {/* Hidden overlay: one big light grey X across the card */}
      {overlayX ? (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "var(--interactive-background-hover, rgba(255,255,255,0.25))",
            zIndex: 2,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ display: "block" }}
          >
            <path
              d="M3 3 L97 97 M97 3 L3 97"
              stroke="var(--text-primary, #c9c9c9)"
              strokeWidth="1.6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Hidden strip — dashed line + half-size, position-less cards
// ─────────────────────────────────────────────────────────────────────────────
export function OrderHiddenStrip({
  items,
  label,
  hint,
  count,
  listMode = false,
  thumbWidth = 180,
  renderCard,
  fontFamily,
  labelFontFamily,
  style,
}) {
  if (!items?.length) return null;
  const small = Math.max(70, Math.round(thumbWidth / 2));

  return (
    <div style={{ marginTop: 18, ...style }}>
      <div
        style={{
          borderTop: "1px dashed var(--border-light, rgba(0,0,0,.3))",
          paddingTop: 12,
          marginBottom: hint ? 8 : 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          fontFamily,
        }}
      >
        <span
          style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".02em", opacity: 0.75 }}
          title={hint || ""}
        >
          {label}
        </span>
        <span style={{ fontSize: 12, opacity: 0.55 }}>{count ?? items.length}</span>
      </div>

      {hint ? (
        <div
          style={{
            fontFamily: labelFontFamily || fontFamily,
            fontSize: 11,
            color: "var(--text-primary, rgba(0,0,0,.45))",
            marginBottom: 10,
          }}
        >
          {hint}
        </div>
      ) : null}

      <OrderCardGrid listMode={listMode} thumbWidth={small} gap={10}>
        {items.map((item, i) => (
          // The strip owns the key: `renderCard` just returns the card element,
          // so adapters can stay key-free (and React stops warning).
          <React.Fragment key={item?.id || item?._id || `hidden-${i}`}>
            {renderCard(item, small, i)}
          </React.Fragment>
        ))}
      </OrderCardGrid>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  View controls — grid/list toggle + size slider (toolbar right slot)
// ─────────────────────────────────────────────────────────────────────────────
export function OrderViewControls({
  listMode,
  onListModeChange,
  size,
  onSizeChange,
  min = 120,
  max = 360,
  step = 10,
  sizeSliderWidth = 120,
  labels = {},
  fontFamily,
}) {
  return (
    <>
      <span
        style={{
          display: "inline-flex",
          border: "1px solid var(--border-light, #000)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          onClick={() => onListModeChange?.(false)}
          title={labels.grid || "Grid"}
          style={{
            padding: "7px 10px",
            fontSize: 12,
            fontFamily,
            border: "none",
            background: "var(--background-primary, #fff)",
            color: listMode ? "var(--text-primary, rgba(0,0,0,.4))" : "var(--text-primary, #000)",
            cursor: "pointer",
          }}
        >
          <LayoutGrid size={14} />
        </button>
        <button
          type="button"
          onClick={() => onListModeChange?.(true)}
          title={labels.list || "List"}
          style={{
            padding: "7px 10px",
            fontSize: 12,
            fontFamily,
            border: "none",
            borderLeft: "1px solid var(--border-light, #000)",
            background: "var(--background-primary, #fff)",
            color: listMode ? "var(--text-primary, #000)" : "var(--text-primary, rgba(0,0,0,.4))",
            cursor: "pointer",
          }}
        >
          <List size={14} />
        </button>
      </span>

      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily }}>
        <span style={{ fontSize: 12, opacity: 0.6 }}>{labels.size || "Size"}</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={size}
          onChange={(e) => onSizeChange?.(Number(e.target.value))}
          style={{ width: sizeSliderWidth, accentColor: "#000", cursor: "pointer" }}
        />
      </span>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Empty state
// ─────────────────────────────────────────────────────────────────────────────
export function OrderEmptyState({ text, fontFamily }) {
  return (
    <div
      style={{
        padding: "60px 0",
        textAlign: "center",
        fontFamily,
        fontSize: 13,
        color: "var(--text-primary, rgba(0,0,0,.5))",
      }}
    >
      {text}
    </div>
  );
}
