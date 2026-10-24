"use client";

import { useState, useCallback, useRef, useMemo } from "react";

/**
 * Production-grade interaction hook.
 * Uses pointer events (unified mouse + touch + pen) with proper cleanup.
 * Prevents sticky :hover on touch devices, handles edge cases.
 *
 * @param {Object} options
 * @param {number} options.touchHoverDelay - ms to keep hover after touch ends (default 150)
 * @returns {{ hovered: boolean, pressed: boolean, handlers: Object, reset: Function }}
 */
export function useInteraction({ touchHoverDelay = 150 } = {}) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timeoutRef = useRef(null);

  const clearHoverTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handlers = useMemo(
    () => ({
      onPointerEnter: (e) => {
        if (e.pointerType !== "touch") setHovered(true);
      },
      onPointerLeave: (e) => {
        if (e.pointerType !== "touch") setHovered(false);
        setPressed(false);
      },
      onPointerDown: (e) => {
        setPressed(true);
        if (e.pointerType === "touch") {
          clearHoverTimeout();
          setHovered(true);
        }
      },
      onPointerUp: (e) => {
        setPressed(false);
        if (e.pointerType === "touch") {
          clearHoverTimeout();
          timeoutRef.current = setTimeout(() => setHovered(false), touchHoverDelay);
        }
      },
      onPointerCancel: () => {
        setPressed(false);
        setHovered(false);
        clearHoverTimeout();
      },
    }),
    [clearHoverTimeout, touchHoverDelay]
  );

  const reset = useCallback(() => {
    setPressed(false);
    setHovered(false);
    clearHoverTimeout();
  }, [clearHoverTimeout]);

  return { hovered, pressed, handlers, reset };
}

export default useInteraction;