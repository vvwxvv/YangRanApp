"use client";

/**
 * Shared base tap/click styles for interactive elements.
 * Prevents default browser touch behaviors, ghost clicks, etc.
 */
export const TAP_STYLE = {
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  touchAction: "manipulation",
  userSelect: "none",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  msUserSelect: "none",
};

/**
 * Build inline style for an interactive item based on interaction state.
 *
 * @param {Object} options
 * @param {boolean} options.pressed - Is the item currently pressed
 * @param {boolean} options.hovered - Is the item currently hovered
 * @param {string}  options.textColor - The theme text color (hex)
 * @param {Object}  options.baseStyle - Additional base styles to merge
 * @param {number}  options.pressedScale - Scale when pressed (for CSS transform)
 * @param {number}  options.hoveredScale - Scale when hovered
 * @param {number}  options.pressedOpacity - Opacity when pressed
 * @param {number}  options.hoveredOpacity - Opacity when hovered
 * @param {string}  options.pressedBgAlpha - Hex alpha suffix for pressed bg (e.g. '15')
 * @param {string}  options.hoveredBgAlpha - Hex alpha suffix for hovered bg
 * @param {string}  options.hoveredTranslateY - translateY when hovered (e.g. '-8px')
 * @param {string}  options.hoveredBoxShadow - boxShadow when hovered
 * @param {string}  options.pressedBoxShadow - boxShadow when pressed
 * @returns {Object} Combined inline style
 */
export function buildInteractiveStyle({
  pressed = false,
  hovered = false,
  textColor = "#000000",
  baseStyle = {},
  pressedScale = 0.96,
  hoveredScale = 1.0,
  pressedOpacity = 0.85,
  hoveredOpacity = 1,
  pressedBgAlpha = "10",
  hoveredBgAlpha = "08",
  hoveredTranslateY = "0px",
  hoveredBoxShadow = "none",
  pressedBoxShadow = "none",
} = {}) {
  const getTransform = () => {
    if (pressed) return `scale(${pressedScale}) translateY(0px)`;
    if (hovered) return `scale(${hoveredScale}) translateY(${hoveredTranslateY})`;
    return "scale(1) translateY(0px)";
  };

  const getBackground = () => {
    if (pressed) return `${textColor}${pressedBgAlpha}`;
    if (hovered) return `${textColor}${hoveredBgAlpha}`;
    return "transparent";
  };

  const getBoxShadow = () => {
    if (pressed) return pressedBoxShadow;
    if (hovered) return hoveredBoxShadow;
    return "none";
  };

  return {
    ...TAP_STYLE,
    ...baseStyle,
    backgroundColor: getBackground(),
    opacity: pressed ? pressedOpacity : hoveredOpacity,
    transform: getTransform(),
    boxShadow: getBoxShadow(),
    transition: [
      "background-color 0.15s cubic-bezier(0.4,0,0.2,1)",
      "opacity 0.15s cubic-bezier(0.4,0,0.2,1)",
      "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
      "box-shadow 0.25s cubic-bezier(0.4,0,0.2,1)",
    ].join(", "),
    willChange: "transform, opacity, background-color, box-shadow",
  };
}

/**
 * Pre-built interactive card style builder.
 * Tailored for dashboard-style card interactions.
 */
export function buildCardStyle({
  pressed = false,
  hovered = false,
  textColor = "#000000",
  baseStyle = {},
} = {}) {
  return buildInteractiveStyle({
    pressed,
    hovered,
    textColor,
    baseStyle,
    pressedScale: 0.97,
    hoveredScale: 1.0,
    pressedOpacity: 0.9,
    hoveredOpacity: 1,
    pressedBgAlpha: "06",
    hoveredBgAlpha: "04",
    hoveredTranslateY: "-8px",
    hoveredBoxShadow: "0 12px 28px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.08)",
    pressedBoxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  });
}