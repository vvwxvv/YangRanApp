"use client";

import { useCallback, useRef } from "react";

/**
 * Prevents rapid double-tap / accidental multi-fire on all devices.
 *
 * @param {Function} callback - The function to guard
 * @param {number} delay - Minimum ms between taps (default 300)
 * @returns {Function} Guarded callback
 */
export function useTapGuard(callback, delay = 300) {
  const lastTap = useRef(0);

  return useCallback(
    (e) => {
      const now = Date.now();
      if (now - lastTap.current < delay) {
        e?.preventDefault?.();
        return;
      }
      lastTap.current = now;
      callback?.(e);
    },
    [callback, delay]
  );
}

export default useTapGuard;