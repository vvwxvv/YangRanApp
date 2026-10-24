"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpDown } from "lucide-react";
import useFont from '@/hooks/useFont';
import { managedOrderKeys, ORDER_KEY_LABELS, getOrder } from "@/utils/mediaOrder";

/**
 * OrderFieldsDisplay — read-only ordering block for forms.
 *
 * Ordering is edited on the dedicated order page (drag & drop), so the form
 * only *shows* the current position and offers the link:
 *
 *   Artist Page Order      3  ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈  [ Edit Order → ]
 *
 * Two shapes are supported:
 *   • `entity="artwork" | "image"` → one row per per-page key in the JSON
 *     `order` object (`order.artist_page_order`, …)
 *   • `fieldName` + `label`        → a single scalar `order` field
 *
 * The number is rendered only when there is one; otherwise just the dashed
 * rule and the link stay, so rows line up neatly.
 *
 * @param {object}  form           react-hook-form instance (watched for values)
 * @param {string}  [entity]       "artwork" | "image" — JSON order keys
 * @param {string}  [fieldName]    scalar order field (default "order")
 * @param {object}  [label]        { en, cn } label for the scalar row
 * @param {string}  [orderPagePath] order page to open (omit → no link)
 * @param {boolean} [isCn]
 * @param {object}  [colors]       { text, secondaryText, border }
 * @param {object}  [labels]       override per-key labels { [key]: {en,cn} }
 * @param {string}  [hint]
 */
export default function OrderFieldsDisplay({
  form,
  entity = null,
  fieldName = "order",
  label = null,
  orderPagePath = null,
  isCn = false,
  colors = {},
  labels = null,
  hint,
}) {
  const router = useRouter();
  const { fontFamily, labelFontFamily } = useFont();

  const textColor = colors?.text || "#000";
  const muted = colors?.secondaryText || "rgba(0,0,0,.45)";

  const rows = React.useMemo(() => {
    // JSON order object → one row per page key this entity can be ordered for.
    const keys = managedOrderKeys(entity);
    if (entity && keys.length) {
      return keys.map((key) => ({
        name: `${fieldName}.${key}`,
        label: (labels?.[key] || ORDER_KEY_LABELS[key] || { en: key, cn: key })[
          isCn ? "cn" : "en"
        ],
      }));
    }
    // Scalar order field.
    const text = label ? label[isCn ? "cn" : "en"] : isCn ? "排序" : "Order";
    return [{ name: fieldName, label: text }];
  }, [entity, fieldName, label, labels, isCn]);

  // Watch every value so the numbers stay live.
  const values = rows.map((row) => ({
    ...row,
    value: form ? form.watch(row.name) : undefined,
  }));

  const readValue = (raw) => {
    if (raw === undefined || raw === null) return "";
    if (typeof raw === "object") return "";
    const v = String(raw).trim();
    return v === "" || v === "null" ? "" : v;
  };

  return (
    <div style={{ fontFamily }}>
      <style>{`
        .ordrow-btn { transition: opacity .15s ease; }
        .ordrow-btn:hover { text-decoration: underline; text-underline-offset: 2px; }
      `}</style>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "7px",
          marginBottom: "12px",
          fontSize: "12px",
          letterSpacing: ".04em",
          textTransform: "uppercase",
          color: muted,
        }}
      >
        <ArrowUpDown size={13} />
        {isCn ? "排序" : "Ordering"}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {values.map((row) => {
          const shown = readValue(row.value);
          return (
            <div
              key={row.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "11px 16px",
                border: `1px solid ${colors?.border || "rgba(0,0,0,.12)"}`,
                borderRadius: "10px",
                background: colors?.background || "#fff",
              }}
            >
              <span
                style={{
                  fontFamily: labelFontFamily,
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "rgba(0,0,0,.72)",
                  minWidth: "168px",
                }}
              >
                {row.label}
              </span>

              {shown ? (
                <span
                  style={{
                    fontFamily,
                    fontSize: "15px",
                    fontWeight: 700,
                    color: textColor,
                    fontVariantNumeric: "tabular-nums",
                    minWidth: "30px",
                  }}
                  title={isCn ? "排序编号" : "Order number"}
                >
                  {shown}
                </span>
              ) : null}

              {/* dashed rule — ⌐- - - - - - - - - ¬ */}
              <span
                style={{
                  flex: "1 1 auto",
                  minWidth: "24px",
                  borderTop: "1px dashed rgba(0,0,0,.25)",
                  height: 0,
                }}
              />

              {orderPagePath ? (
                <button
                  type="button"
                  className="ordrow-btn"
                  onClick={() => router.push(orderPagePath)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    fontSize: "12.5px",
                    fontFamily,
                    fontWeight: 500,
                    color: textColor,
                    background: "#fff",
                    border: "1px solid #000",
                    borderRadius: "8px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isCn ? "编辑排序" : "Edit Order"}
                  <ArrowRight size={13} />
                </button>
              ) : (
                <span
                  style={{
                    fontSize: "12px",
                    color: muted,
                    whiteSpace: "nowrap",
                  }}
                >
                  {isCn ? "无排序页" : "No order page"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {hint && (
        <div
          style={{
            fontSize: "12px",
            color: muted,
            marginTop: "8px",
            fontFamily: labelFontFamily,
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}
