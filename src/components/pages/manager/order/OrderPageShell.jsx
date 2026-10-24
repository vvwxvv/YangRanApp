"use client";

import { ArrowLeft, RotateCcw, Save } from "lucide-react";
import {
  ORDER_PAGE_CSS,
  orderBackSeparatorStyle,
  orderButtonStyle,
  orderByLabelStyle,
  orderChipStyle,
  orderHeaderLabelStyle,
  orderLabelDividerStyle,
  orderNoticeStyle,
  orderPageContainerStyle,
  orderSeparatorStyle,
  orderSubtitleStyle,
  orderToolbarRightStyle,
  orderToolbarStyle,
} from "@/components/pages/manager/order/orderPageStyles";

/**
 * OrderPageShell
 *
 * The shared chrome for every manager "order" page (Artwork order, Image
 * order, Artist-name hover image, and anything added later):
 *
 *   [← Back]
 *   ─────────────── dashed ───────────────
 *   PAGE NAME ─ ACTIVE ORDER        ← bold, black, underlined
 *   subtitle
 *   ─────────────── dashed ───────────────
 *   [ORDER BY] chips … notice … Reset  Save        [right slot]
 *   …page content (`children`)…
 *
 * The shell owns the layout + all shared styling (see orderPageStyles.js), so a
 * new order page only supplies its data + switcher config + content:
 *
 *   <OrderPageShell
 *     isCn={isCn} fontFamily={fontFamily}
 *     title={T.title} subtitle={T.subtitle} backLabel={T.back} onBack={() => router.push("/manager/x")}
 *     orderLabel={orderLabel}
 *     orderKeys={ORDER_KEYS} orderLabels={ORDER_LABELS} orderKey={orderKey} onOrderKeyChange={setOrderKey}
 *     notice={notice} onSave={handleSave} onReset={handleReset} saving={saving}
 *     saveLabel={T.save} savingLabel={T.saving} resetLabel={T.reset}
 *     hint={…} switcherExtra={…} right={…}>
 *     …groups / cards…
 *   </OrderPageShell>
 *
 * Every prop is optional — a page with no order switcher (e.g. the hover-image
 * page) simply omits `orderKeys`/`onSave`.
 */
const txt = (entry, isCn) => (entry ? (isCn ? entry.cn : entry.en) : "");

export default function OrderPageShell({
  // ── header ──
  title,
  subtitle,
  backLabel = { en: "Back", cn: "返回" },
  onBack,
  orderLabel = "",
  // ── order switcher ──
  orderByLabel = { en: "Order by", cn: "排序维度" },
  orderKeys = [],
  orderLabels = {},
  orderKey,
  onOrderKeyChange,
  // ── actions ──
  notice = null,
  onSave,
  onReset,
  saving = false,
  saveLabel = { en: "Save", cn: "保存" },
  savingLabel = { en: "Saving…", cn: "保存中…" },
  resetLabel = { en: "Reset", cn: "重置" },
  // ── slots ──
  hint = null,
  /** Per-tab explanatory panel (usually <OrderInfoNote/>) — sits under the
   *  toolbar, above the groups, and changes with the selected order key. */
  info = null,
  switcherExtra = null,
  right = null,
  children,
  // ── chrome ──
  isCn = false,
  fontFamily,
  containerStyle,
  bodyStyle,
}) {
  return (
    <div
      style={{
        background: "var(--background-primary, #fff)",
        color: "var(--text-primary, #000)",
        minHeight: "100%",
        ...orderPageContainerStyle,
        ...(containerStyle || {}),
      }}
    >
      <style>{ORDER_PAGE_CSS}</style>

      {onBack ? (
        <>
          <button
            type="button"
            className="ordbtn"
            style={orderButtonStyle({ fontFamily })}
            onClick={onBack}
          >
            <ArrowLeft size={14} /> {txt(backLabel, isCn)}
          </button>

          {/* Dashed rule — the Back button keeps its own band up top. */}
          <div style={orderBackSeparatorStyle} />
        </>
      ) : null}

      <div style={{ marginTop: onBack ? 18 : 0 }}>
        <span style={orderHeaderLabelStyle({ fontFamily })}>
          <span>{txt(title, isCn)}</span>
          {orderLabel ? (
            <>
              <span style={orderLabelDividerStyle} />
              <span>{orderLabel}</span>
            </>
          ) : null}
        </span>
        {subtitle ? (
          <div style={orderSubtitleStyle({ fontFamily })}>{txt(subtitle, isCn)}</div>
        ) : null}
      </div>

      <div style={orderSeparatorStyle} />

      <div style={orderToolbarStyle}>
        {orderKeys.length > 0 ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={orderByLabelStyle({ fontFamily })}>{txt(orderByLabel, isCn)}</span>
            {orderKeys.map((key) => {
              const active = key === orderKey;
              return (
                <button
                  key={key}
                  type="button"
                  className="ordbtn"
                  aria-pressed={active}
                  onClick={() => onOrderKeyChange?.(key)}
                  style={orderChipStyle({ fontFamily, active })}
                >
                  {txt(orderLabels[key], isCn) || key}
                </button>
              );
            })}
          </span>
        ) : null}

        {switcherExtra}

        {notice ? (
          <span style={orderNoticeStyle({ fontFamily, type: notice.type })}>{notice.text}</span>
        ) : null}

        {onReset ? (
          <button
            type="button"
            className="ordbtn"
            style={orderButtonStyle({ fontFamily, disabled: saving })}
            onClick={onReset}
            disabled={saving}
          >
            <RotateCcw size={14} /> {txt(resetLabel, isCn)}
          </button>
        ) : null}

        {onSave ? (
          <button
            type="button"
            className="ordbtn"
            style={orderButtonStyle({ fontFamily, primary: true, disabled: saving })}
            onClick={onSave}
            disabled={saving}
          >
            <Save size={14} /> {saving ? txt(savingLabel, isCn) : txt(saveLabel, isCn)}
          </button>
        ) : null}

        {hint}

        {right ? <span style={orderToolbarRightStyle}>{right}</span> : null}
      </div>

      <div style={bodyStyle}>
        {info}
        {children}
      </div>
    </div>
  );
}
