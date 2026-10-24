/**
 * orderPageStyles.js
 *
 * ONE source of truth for the visual language of every manager "order" page
 * (Artwork order, Image order, Artist-name hover image, and any future one).
 *
 * Why: the order pages all share the same chrome — a Back button, a bold
 * underlined header label (`PAGE ─ ACTIVE ORDER`), a grey subtitle, a dashed
 * rule, then a sticky toolbar (order switcher + actions) — and that chrome was
 * being copy-pasted per page. Change it here once and every order page follows.
 *
 * Usage:
 *   import { ORDER_PAGE_CSS, orderButtonStyle, orderChipStyle } from
 *     "@/components/pages/manager/order/orderPageStyles";
 *
 *   <style>{ORDER_PAGE_CSS}</style>
 *   <button className="ordbtn" style={orderButtonStyle({ fontFamily, primary: true })}>…</button>
 *
 * …or just use <OrderPageShell>, which already applies all of these.
 */

/** The <style> block an order page should render once (with `.ordbtn` usages). */
export const ORDER_PAGE_CSS = `
  /* Buttons are always white — never a black fill. */
  .ordbtn {
    transition: opacity 0.15s ease;
    background: var(--background-primary, #fff) !important;
    color: var(--text-primary, #000) !important;
  }
  /* Hover *and* pressed/selected are signalled with an underline only. */
  .ordbtn:hover:not(:disabled),
  .ordbtn:focus-visible:not(:disabled),
  .ordbtn[aria-pressed="true"],
  .ordbtn[data-active="true"] {
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-thickness: 2px;
  }
  .ordbtn:disabled { opacity: 0.5; cursor: default; }

  /* Card action buttons (hide / show / pick). */
  .ordhide { transition: opacity 0.15s ease, background 0.15s ease; }
  .ordhide:hover:not(:disabled) { opacity: 1 !important; background: var(--interactive-background-hover, rgba(0,0,0,.04)); }
  .ordhover { transition: opacity 0.15s ease, background 0.15s ease, color 0.15s ease; }
  .ordhover:hover:not(:disabled) { opacity: 1 !important; }

  /* Group accordion header — white, never filled; hover tints + underlines. */
  .ordgroup-head { transition: background 0.15s ease; }
  .ordgroup-head:hover { background: var(--interactive-background-hover, rgba(0,0,0,.045)) !important; }
  .ordgroup-head:hover .ordgroup-label {
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-thickness: 2px;
  }
  .ordgroup-head:focus-visible { outline: 2px solid var(--border-light, #000); outline-offset: -3px; }
`;

/** Small outlined button: Back / Save / Reset / custom actions. */
export const orderButtonStyle = ({ fontFamily, primary = false, disabled = false } = {}) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  padding: "8px 14px",
  fontSize: 12.5,
  fontFamily,
  // `primary` only earns extra weight now — never a black fill.
  fontWeight: primary ? 700 : 500,
  color: "var(--text-primary, #000)",
  background: "var(--background-primary, #fff)",
  border: "1px solid var(--border-light, #000)",
  borderRadius: 8,
  cursor: disabled ? "default" : "pointer",
  opacity: disabled ? 0.6 : 1,
  whiteSpace: "nowrap",
});

/**
 * Order-type chip. Everything stays white; the SELECTED one is just bolder and
 * underlined (no black fill / no heavy inset bar).
 */
export const orderChipStyle = ({ fontFamily, active = false } = {}) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "7px 12px",
  fontFamily,
  fontSize: 12.5,
  fontWeight: active ? 800 : 500,
  color: active ? "var(--text-primary, #000)" : "var(--text-primary, rgba(0,0,0,0.55))",
  background: "var(--background-primary, #fff)",
  border: `1px solid ${active ? "var(--border-light, #000)" : "var(--border-light, rgba(0,0,0,0.14))"}`,
  borderRadius: 8,
  cursor: "pointer",
  textDecoration: active ? "underline" : "none",
  textDecorationThickness: 2,
  textUnderlineOffset: 3,
  whiteSpace: "nowrap",
});

/** Bold, underlined, black header label — `PAGE NAME ─ ACTIVE ORDER`. */
export const orderHeaderLabelStyle = ({ fontFamily } = {}) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 9,
  flexWrap: "wrap",
  fontFamily,
  fontSize: 12.5,
  fontWeight: 800,
  letterSpacing: 1.8,
  textTransform: "uppercase",
  color: "var(--text-primary, #000)",
  textDecoration: "underline",
  textDecorationThickness: 2,
  textUnderlineOffset: 5,
});

/** The small dash between the page name and the active order in the label. */
export const orderLabelDividerStyle = {
  display: "inline-block",
  width: 16,
  height: 1,
  background: "rgba(0,0,0,0.45)",
};

/** Grey explanatory line under the header label. */
export const orderSubtitleStyle = ({ fontFamily } = {}) => ({
  fontFamily,
  fontSize: 13,
  lineHeight: 1.65,
  color: "var(--text-primary, rgba(0,0,0,0.62))",
  marginTop: 10,
  maxWidth: 900,
});

/** Dashed rule that separates the header from the content. */
export const orderSeparatorStyle = {
  borderTop: "1px dashed var(--border-light, rgba(0,0,0,0.28))",
  marginTop: 20,
};

/** Dashed rule right under the Back button — it gets its own band at the top. */
export const orderBackSeparatorStyle = {
  borderTop: "1px dashed var(--border-light, rgba(0,0,0,0.28))",
  marginTop: 14,
};

/** Sticky toolbar holding the order switcher + actions. */
export const orderToolbarStyle = {
  position: "sticky",
  top: 70,
  zIndex: 40,
  background: "var(--background-primary, #fff)",
  padding: "14px 0 12px",
  display: "flex",
  alignItems: "center",
  gap: 14,
  flexWrap: "wrap",
  borderBottom: "1px solid var(--border-light, rgba(0,0,0,0.12))",
  marginBottom: 20,
};

/** Dimmed uppercase "ORDER BY" prefix. */
export const orderByLabelStyle = ({ fontFamily } = {}) => ({
  fontFamily,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 1.4,
  textTransform: "uppercase",
  opacity: 0.45,
});

/** Save / Reset feedback line. */
export const orderNoticeStyle = ({ fontFamily, type } = {}) => ({
  fontFamily,
  fontSize: 12,
  color: type === "ok" ? "#0a7d32" : "#c0392b",
});

/** Right-aligned slot inside the toolbar (view mode, size slider, …). */
export const orderToolbarRightStyle = {
  marginLeft: "auto",
  display: "inline-flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

/** Default page container (override via <OrderPageShell containerStyle>). */
export const orderPageContainerStyle = { maxWidth: 1400, margin: "0 auto", padding: "24px 20px 80px" };

// ─────────────────────────────────────────────────────────────────────────────
//  Per-tab info panel (<OrderInfoNote>)
// ─────────────────────────────────────────────────────────────────────────────
/** White box, hairline border — the explanatory panel under the order switcher. */
export const orderInfoBoxStyle = {
  border: "1px solid var(--border-light, rgba(0,0,0,.14))",
  borderRadius: 12,
  background: "var(--background-primary, #fff)",
  padding: "13px 18px 15px",
  marginBottom: 20,
};

/** ⓘ + panel title row. */
export const orderInfoHeaderStyle = ({ fontFamily } = {}) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
  fontFamily,
});

/** Bold uppercase panel title. */
export const orderInfoTitleStyle = ({ fontFamily } = {}) => ({
  fontFamily,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1.6,
  textTransform: "uppercase",
});

/** Small outlined “where this order lives” chip. */
export const orderInfoTagStyle = ({ fontFamily } = {}) => ({
  fontFamily,
  fontSize: 10.5,
  fontWeight: 600,
  letterSpacing: 0.4,
  padding: "3px 8px",
  border: "1px solid var(--border-light, rgba(0,0,0,.2))",
  borderRadius: 999,
  color: "var(--text-primary, rgba(0,0,0,.62))",
  whiteSpace: "nowrap",
});

/** Grey section label inside the panel (HOW IT WORKS / WHERE IT SHOWS). */
export const orderInfoSectionLabelStyle = ({ fontFamily } = {}) => ({
  fontFamily,
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: 1.3,
  textTransform: "uppercase",
  opacity: 0.45,
  marginBottom: 7,
});

/** Bullet list inside the panel. */
export const orderInfoListStyle = ({ fontFamily } = {}) => ({
  fontFamily,
  fontSize: 12.3,
  lineHeight: 1.6,
  color: "var(--text-primary, rgba(0,0,0,.72))",
  margin: 0,
  paddingLeft: 16,
});
