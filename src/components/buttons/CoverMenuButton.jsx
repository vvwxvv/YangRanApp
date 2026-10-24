"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { TAP_STYLE } from "@/components/navs/title_text_nav/constants/navigation";

const CoverMenuButton = ({ onClick }) => {
  const [pressed, setPressed] = useState(false);

  const handlePointerDown  = useCallback(() => setPressed(true),  []);
  const handlePointerLeave = useCallback(() => setPressed(false), []);
  const handlePointerUp    = useCallback((e) => {
    setPressed(false);
    e.stopPropagation();
    onClick?.(e);
  }, [onClick]);

  // Keyboard fallback
  const handleClick = useCallback((e) => {
    if (e.pointerType === "") onClick?.(e);
  }, [onClick]);

  return (
    <motion.button
      type="button"
      key="arrow-down"
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: 1,
        y:       0,
        scale:   pressed ? 0.92 : 1,
      }}
      exit={{ opacity: 0, y: 12 }}
      transition={
        pressed
          ? { duration: 0.05 }
          : { duration: 0.35, delay: 0.2 }
      }
      whileHover={{ scale: pressed ? 0.92 : 1.06, opacity: 0.85 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      aria-label="Open navigation menu"
      style={{
        position:      "absolute",
        bottom:        "52px",
        left:          "50%",
        transform:     "translateX(-50%)",
        zIndex:        20,
        background:    "transparent",
        border:        "none",
        color:         "#fff",
        cursor:        "pointer",
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        gap:           "10px",
        padding:       "12px",
        WebkitTapHighlightColor: "transparent",
        touchAction:   "manipulation",
        userSelect:    "none",
        WebkitUserSelect: "none",
        ...TAP_STYLE,
      }}
    >
      <span
        style={{
          fontSize:      "9px",
          letterSpacing: "4px",
          textTransform: "uppercase",
          color:         pressed ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.55)",
          fontWeight:    "400",
          transition:    "color 0.05s ease-out",
          pointerEvents: "none",
        }}
      >
        Menu
      </span>

      <motion.div
        animate={{ y: pressed ? 4 : [0, 5, 0] }}
        transition={
          pressed
            ? { duration: 0.05 }
            : { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ pointerEvents: "none" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={pressed ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.8)"}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </motion.button>
  );
};

export default CoverMenuButton;