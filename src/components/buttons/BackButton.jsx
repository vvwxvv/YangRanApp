"use client";

import React, { useState, useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import useFont from '@/hooks/useFont';
import { useReverseTheme } from "@/hooks/useReverseTheme";

export default function BackButton({ onClick, ...props }) {
  const { buttonFontFamily } = useFont();
  const { colors }           = useReverseTheme();
  const [pressed,  setPressed]  = useState(false);
  const [hovered,  setHovered]  = useState(false);

  const executeAction = useCallback((e) => {
    if (onClick) onClick(e);
    else window.history.back();
  }, [onClick]);

  // Pointer events — fire exactly once for both mouse and touch.
  // Previous pattern (onTouchStart fires executeAction, then onClick also
  // fires it via hasHandledRef guard) was fragile: on slow devices the ref
  // could reset before onClick arrived, causing double navigation.
  const handlePointerDown  = useCallback(() => setPressed(true),  []);
  const handlePointerLeave = useCallback(() => { setPressed(false); setHovered(false); }, []);
  const handlePointerUp    = useCallback((e) => {
    setPressed(false);
    e.stopPropagation();
    executeAction(e);
  }, [executeAction]);

  // Keyboard fallback (Enter / Space → pointerType "")
  const handleClick = useCallback((e) => {
    if (e.pointerType === "") executeAction(e);
  }, [executeAction]);

  // Hover — mouse only (pointer events don't fire onMouseEnter on touch)
  const handleMouseEnter = useCallback(() => setHovered(true),  []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  // Nudge the arrows left on press, same as ThreeArrowBackButton
  const nudgeX = pressed ? -4 : 0;

  return (
    <motion.button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        scale:   pressed ? 0.92 : 1,
        opacity: pressed ? 0.65 : 1,
      }}
      transition={
        pressed
          ? { duration: 0.05 }
          : { duration: 0.18, ease: "easeOut" }
      }
      whileHover={{ scale: pressed ? 0.92 : 1.05 }}
      aria-label="Go back"
      className="flex items-center justify-center touch-manipulation"
      style={{
        backgroundColor:         colors.background || "var(--background-primary, #ffffff)",
        color:                   colors.text,
        borderRadius:            "4px",
        border:                  "none",
        outline:                 "none",
        fontFamily:              buttonFontFamily,
        padding:                 "8px 16px",
        cursor:                  "pointer",
        WebkitTapHighlightColor: "transparent",
        touchAction:             "manipulation",
        position:                "relative",
        userSelect:              "none",
        WebkitUserSelect:        "none",
        // Low z-index: keep it BELOW the mobile drawer (MainNav DRAWER.Z_INDEX
        // = 1500) so an open left drawer covers it instead of overlapping.
        zIndex:                  1,
      }}
      {...props}
    >
      <motion.span
        animate={{ x: nudgeX }}
        transition={pressed ? { duration: 0.05 } : { duration: 0.18, ease: "easeOut" }}
        style={{
          display:      "flex",
          alignItems:   "center",
          position:     "relative",
          pointerEvents:"none", // children must not intercept pointer events
        }}
      >
        <ChevronLeft style={{ width: 16, height: 16, marginRight: -6, color: colors.text }} />
        <ChevronLeft style={{ width: 16, height: 16, marginRight: -6, color: colors.text }} />
        <ChevronLeft style={{ width: 16, height: 16,                  color: colors.text }} />

        {/* Underline animation */}
        <motion.span
          style={{
            position:        "absolute",
            bottom:          -2,
            left:            0,
            height:          2,
            backgroundColor: colors.text,
          }}
          initial={{ width: 0 }}
          animate={{ width: hovered && !pressed ? "100%" : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </motion.span>
    </motion.button>
  );
}