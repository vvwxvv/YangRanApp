/**
 * useNav.js
 * ─────────────────────────────────────────────────────────────
 * Reusable hooks for the navigation system.
 * Import individually — no side-effects on mount.
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from "react";

// ── Local breakpoint constants (previously from navTokens) ───
const DEFAULT_BREAKPOINTS = {
  /** Below this → always use drawer */
  mobile: 768,
  /** Below this → collapse desktop row to drawer even if not "mobile" */
  overflowGuard: 900,
};

// ─────────────────────────────────────────────
// useBreakpoint
// ─────────────────────────────────────────────

/**
 * Reports actual window width and derived layout flags.
 *
 * More reliable than a DeviceContext set at SSR time because it
 * re-measures on every resize via ResizeObserver on <html>.
 *
 * @param {Object} [breakpoints] - Optional custom breakpoints.
 * @param {number} [breakpoints.mobile] - px width below which isMobile is true.
 * @param {number} [breakpoints.overflowGuard] - px width below which isNarrow is true.
 * @returns {{ width: number, isMobile: boolean, isNarrow: boolean }}
 *
 * @example
 * const { isMobile, isNarrow } = useBreakpoint();
 * const useDrawer = isMobile || isNarrow || overflows;
 */
export function useBreakpoint(breakpoints = DEFAULT_BREAKPOINTS) {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    const ro = new ResizeObserver(handleResize);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  return {
    width,
    isMobile: width < breakpoints.mobile,
    isNarrow: width < breakpoints.overflowGuard,
  };
}

// ─────────────────────────────────────────────
// useMenuOverflow
// ─────────────────────────────────────────────

/**
 * Measures whether a flex row overflows its container.
 * Attach `rowRef` to the element you want to observe.
 * `overflows` becomes true when scrollWidth > offsetWidth,
 * which means items have spilled outside the visible area.
 *
 * Used to auto-collapse the desktop nav to a drawer when
 * the viewport is too narrow to fit all items — even if
 * the raw pixel width is above the mobile breakpoint.
 *
 * @param {number} menuLength - Number of menu items. Re-runs the
 *                              overflow check whenever this changes.
 * @returns {{ rowRef: React.RefObject, overflows: boolean }}
 *
 * @example
 * const { rowRef, overflows } = useMenuOverflow(menuList.length);
 * // attach rowRef to <nav ref={rowRef}>
 */
export function useMenuOverflow(menuLength) {
  const rowRef = useRef(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const check = () => {
      setOverflows(el.scrollWidth > el.offsetWidth + 2);
    };

    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [menuLength]);

  return { rowRef, overflows };
}

// ─────────────────────────────────────────────
// useDrawerKeyboard
// ─────────────────────────────────────────────

/**
 * Closes a drawer on Escape key press.
 * Only active when `isOpen` is true.
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 *
 * @example
 * useDrawerKeyboard(drawerOpen, () => setDrawerOpen(false));
 */
export function useDrawerKeyboard(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);
}

// ─────────────────────────────────────────────
// useDrawerFocusTrap
// ─────────────────────────────────────────────

/**
 * Moves focus to the first focusable element inside a drawer
 * when it opens. Pair with useDrawerKeyboard for full a11y.
 *
 * @param {React.RefObject} ref - ref attached to the drawer container
 * @param {boolean} isOpen
 *
 * @example
 * const drawerRef = useRef(null);
 * useDrawerFocusTrap(drawerRef, drawerOpen);
 * // <div ref={drawerRef}>...</div>
 */
export function useDrawerFocusTrap(ref, isOpen) {
  useEffect(() => {
    if (!isOpen || !ref.current) return;
    const firstFocusable = ref.current.querySelector(
      "a, button, [tabindex]:not([tabindex='-1'])"
    );
    firstFocusable?.focus();
  }, [isOpen, ref]);
}

// ─────────────────────────────────────────────
// useLogoSize
// ─────────────────────────────────────────────

/**
 * Returns the appropriate logo width/height for the current
 * viewport width, using a size table.
 *
 * @param {number} viewportWidth - current window.innerWidth
 * @param {Array<{maxWidth: number, width: number, height: number}>} sizes
 * @returns {{ width: number, height: number }}
 *
 * @example
 * const { width: logoWidth, height: logoHeight } = useLogoSize(viewportWidth, LOGO.sizes);
 */
export function useLogoSize(viewportWidth, sizes) {
  const match = sizes.find((s) => viewportWidth < s.maxWidth) ?? sizes[sizes.length - 1];
  return { width: match.width, height: match.height };
}