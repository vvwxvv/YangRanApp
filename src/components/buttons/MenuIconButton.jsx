"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";

const DEFAULT_COLORS = {
  background: "transparent",
  text: "var(--text-primary, #000000)",
  isDark: false,
};

const MenuIconButton = ({ colors, onClick }) => {
  const themeColors = colors || DEFAULT_COLORS;
  const [pointerDown, setPointerDown] = useState(false);

  // Single handler — fires on both mouse and touch.
  // onTouchEnd + onClick together caused double-fires on mobile;
  // pointer events unify both input types and fire exactly once.
  const handlePointerDown = useCallback(() => setPointerDown(true), []);
  const handlePointerUp = useCallback(
    (e) => {
      setPointerDown(false);
      e.stopPropagation();
      onClick?.(e);
    },
    [onClick]
  );
  const handlePointerLeave = useCallback(() => setPointerDown(false), []);

  // Keyboard fallback: pointer events handle mouse/touch; the native click
  // has an empty pointerType, so only fire onClick from a real keyboard.
  const handleClick = useCallback(
    (e) => {
      if (e.pointerType === "") onClick?.(e);
    },
    [onClick]
  );

  return (
    <motion.button
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      animate={{
        scale: pointerDown ? 0.88 : 1,
        opacity: pointerDown ? 0.6 : 1,
      }}
      transition={{
        scale:   pointerDown ? { duration: 0.06 } : { duration: 0.18, ease: "easeOut" },
        opacity: pointerDown ? { duration: 0.06 } : { duration: 0.18 },
      }}
      whileHover={{ opacity: 0.75 }}
      aria-label="Open menu"
      type="button"
      className="p-3 rounded-lg cursor-pointer"
      style={{
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none",
        outline: "none",
        cursor: "pointer",
        position: "relative",
        zIndex: 1401,
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        // Prevent text/icon selection on rapid taps
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <MenuIcon style={{ color: themeColors.text }} />
    </motion.button>
  );
};

export default MenuIconButton;