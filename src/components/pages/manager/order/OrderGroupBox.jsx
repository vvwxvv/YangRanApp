"use client";

/**
 * OrderGroupBox.jsx — the accordion box every order page wraps a group in.
 *
 * Used by all of them (artwork order, image order, artist hover image) so a
 * group — one artist, or one artist's source — reads the same everywhere:
 *
 *   ┌───────────────────────────────────────────────────────────┐
 *   │ Chen Hongzhi   4  ·  1 hidden          drag hint      ⌄   │  ← header (click to fold)
 *   ├───────────────────────────────────────────────────────────┤
 *   │ cards …                                                   │
 *   └───────────────────────────────────────────────────────────┘
 *
 * Nothing is filled black: white body, hairlines, one micro-label per row.
 * Uncontrolled by default (`defaultOpen`); pass `open`/`onOpenChange` to drive it.
 */

import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function OrderGroupBox({
  /** Optional DOM id — used as a scroll anchor from the rolling strip. */
  id: anchorId,
  label,
  /** Right-hand meta: a number, or a string like "4 + 1 hidden". */
  count,
  /** Faint hint after the count (e.g. "drag cards to reorder"). */
  hint,
  /** Node pinned to the far right of the header (before the chevron). */
  right,
  /** Node under the label row… uses the header's right side instead. */
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  /** Keep the header visible but lock it open (no chevron). */
  collapsible = true,
  fontFamily,
  labelFontFamily,
  style,
  bodyStyle,
  headerExtra,
  children,
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = openProp === undefined ? uncontrolled : openProp;
  const id = useId();

  const setOpen = (next) => {
    if (openProp === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  };

  const header = (
    <>
      <span
        style={{
          display: "inline-flex",
          alignItems: "baseline",
          gap: 10,
          minWidth: 0,
          flexWrap: "wrap",
        }}
      >
        <span
          className="ordgroup-label"
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: ".01em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </span>
        {count != null ? (
          <span
            style={{
              fontFamily: labelFontFamily || fontFamily,
              fontSize: 12,
              color: "var(--text-primary, rgba(0,0,0,.55))",
              whiteSpace: "nowrap",
            }}
          >
            {count}
          </span>
        ) : null}
        {hint ? (
          <span
            style={{
              fontFamily: labelFontFamily || fontFamily,
              fontSize: 11.5,
              color: "var(--text-primary, rgba(0,0,0,.35))",
              whiteSpace: "nowrap",
            }}
          >
            {hint}
          </span>
        ) : null}
      </span>

      <span
        style={{
          marginLeft: "auto",
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
        }}
      >
        {headerExtra}
        {right}
        {collapsible ? (
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 22,
              color: "var(--text-primary, rgba(0,0,0,.45))",
              transform: open ? "rotate(0deg)" : "rotate(-90deg)",
              transition: "transform .18s ease",
            }}
          >
            <ChevronDown size={16} />
          </span>
        ) : null}
      </span>
    </>
  );

  return (
    <section
      id={anchorId}
      style={{
        border: "1px solid var(--border-light, rgba(0,0,0,.16))",
        borderRadius: 12,
        marginBottom: 20,
        overflow: "hidden",
        background: "var(--background-primary, #fff)",
        ...style,
      }}
    >
      {collapsible ? (
        <button
          type="button"
          className="ordgroup-head"
          aria-expanded={open}
          aria-controls={`${id}-body`}
          onClick={() => setOpen(!open)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            width: "100%",
            padding: "13px 18px",
            background: "var(--interactive-background-hover, rgba(0,0,0,.02))",
            border: "none",
            borderBottom: open ? "1px solid var(--border-light, rgba(0,0,0,.08))" : "1px solid transparent",
            textAlign: "left",
            cursor: "pointer",
            fontFamily,
            color: "var(--text-primary, #000)",
          }}
        >
          {header}
        </button>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "13px 18px",
            background: "var(--interactive-background-hover, rgba(0,0,0,.02))",
            borderBottom: "1px solid var(--border-light, rgba(0,0,0,.08))",
            fontFamily,
          }}
        >
          {header}
        </div>
      )}

      {open ? (
        <div id={`${id}-body`} style={{ padding: "14px 16px 16px", ...bodyStyle }}>
          {children}
        </div>
      ) : null}
    </section>
  );
}
