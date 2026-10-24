"use client";

/**
 * OrderInfoNote — the explanatory panel an order page shows under its tabs.
 *
 * It answers the question the tabs can't: "what does this order actually do,
 * and which page does it affect?" The copy lives in `orderInfo.js`; this file
 * only renders it, so a new order tab needs ONE entry there and nothing here.
 *
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │ ⓘ  EXHIBITION PAGE ORDER — IMAGES      [ Exhibition pages ]  │
 *   │ This is the order of the images inside each exhibition …     │
 *   │                                                              │
 *   │ HOW IT WORKS                 WHERE IT SHOWS                  │
 *   │ • one box per exhibition …   • /exhibitions/<show> → …       │
 *   │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
 *   │ Saved on the image as `order.exhibition_page_order` …        │
 *   └──────────────────────────────────────────────────────────────┘
 *
 * White body, hairlines, no black fills — same visual language as the rest of
 * the order chrome. Collapsible (header click), open by default.
 */

import React, { useState } from "react";
import { Info } from "lucide-react";
import { orderInfoFor } from "@/components/pages/manager/order/orderInfo";
import {
  orderInfoBoxStyle,
  orderInfoHeaderStyle,
  orderInfoListStyle,
  orderInfoSectionLabelStyle,
  orderInfoTagStyle,
  orderInfoTitleStyle,
} from "@/components/pages/manager/order/orderPageStyles";

const txt = (entry, isCn) => (entry ? (isCn ? entry.cn : entry.en) : "");

function Bullets({ items, isCn, fontFamily, label }) {
  if (!items?.length) return null;
  return (
    <div style={{ flex: "1 1 300px", minWidth: 260 }}>
      <div style={orderInfoSectionLabelStyle({ fontFamily })}>{label}</div>
      <ul style={orderInfoListStyle({ fontFamily })}>
        {items.map((entry, i) => (
          <li key={i} style={{ marginBottom: 5 }}>
            {txt(entry, isCn)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function OrderInfoNote({
  orderKey,
  entity = "image",
  isCn = false,
  fontFamily,
  labelFontFamily,
  defaultOpen = true,
  style,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const info = orderInfoFor(orderKey, entity);
  if (!info) return null;

  const howLabel = isCn ? "排序逻辑" : "How it works";
  const whereLabel = isCn ? "影响哪些页面" : "Where it shows";
  const notesLabel = isCn ? "注意" : "Good to know";

  return (
    <section style={{ ...orderInfoBoxStyle, ...(style || {}) }} aria-label={txt(info.title, isCn)}>
      <button
        type="button"
        className="ordbtn"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          padding: 0,
          border: "none",
          background: "var(--background-primary, #fff)",
          cursor: "pointer",
          textAlign: "left",
          color: "var(--text-primary, #000)",
          ...orderInfoHeaderStyle({ fontFamily }),
        }}
      >
        <Info size={14} aria-hidden="true" style={{ flexShrink: 0, opacity: 0.75 }} />
        <span style={orderInfoTitleStyle({ fontFamily })}>{txt(info.title, isCn)}</span>
        {info.tag ? (
          <span style={orderInfoTagStyle({ fontFamily: labelFontFamily || fontFamily })}>
            {txt(info.tag, isCn)}
          </span>
        ) : null}
        <span
          aria-hidden="true"
          style={{
            marginLeft: "auto",
            fontSize: 11,
            opacity: 0.5,
            fontFamily: labelFontFamily || fontFamily,
            whiteSpace: "nowrap",
          }}
        >
          {open ? (isCn ? "收起" : "Hide info") : isCn ? "显示说明" : "Show info"}
        </span>
      </button>

      {open ? (
        <>
          <div
            style={{
              fontFamily,
              fontSize: 12.8,
              lineHeight: 1.65,
              color: "var(--text-primary, rgba(0,0,0,.72))",
              marginTop: 9,
            }}
          >
            {txt(info.intro, isCn)}
          </div>

          <div
            style={{
              display: "flex",
              gap: 28,
              flexWrap: "wrap",
              marginTop: 14,
            }}
          >
            <Bullets items={info.how} isCn={isCn} fontFamily={fontFamily} label={howLabel} />
            <Bullets items={info.where} isCn={isCn} fontFamily={fontFamily} label={whereLabel} />
          </div>

          {info.notes?.length ? (
            <div
              style={{
                borderTop: "1px dashed var(--border-light, rgba(0,0,0,.22))",
                marginTop: 14,
                paddingTop: 10,
              }}
            >
              <div
                style={{
                  ...orderInfoSectionLabelStyle({ fontFamily }),
                  marginBottom: 5,
                }}
              >
                {notesLabel}
              </div>
              <ul
                style={{
                  ...orderInfoListStyle({ fontFamily }),
                  opacity: 0.86,
                  fontSize: 12,
                }}
              >
                {info.notes.map((entry, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>
                    {txt(entry, isCn)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
