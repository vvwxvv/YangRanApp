"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { TAP_STYLE } from "@/components/navs/title_text_nav/constants/navigation";

const CloseButton = ({ onClick, color = "currentColor", size = 18 }) => {
  const [rotate,  setRotate]  = useState(0);
  const [pressed, setPressed] = useState(false);

  const triggerRotate = useCallback(() => setRotate((r) => r + 360), []);

  const handlePointerDown  = useCallback(() => setPressed(true),  []);
  const handlePointerLeave = useCallback(() => setPressed(false), []);
  const handlePointerUp    = useCallback((e) => {
    setPressed(false);
    triggerRotate();
    e.stopPropagation();
    onClick?.(e);
  }, [onClick, triggerRotate]);

  // Keyboard fallback
  const handleClick = useCallback((e) => {
    if (e.pointerType === "") {
      triggerRotate();
      onClick?.(e);
    }
  }, [onClick, triggerRotate]);

  return (
    <motion.button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onHoverStart={triggerRotate}
      onClick={handleClick}
      animate={{
        scale:   pressed ? 0.88 : 1,
        opacity: pressed ? 0.6  : 1,
      }}
      transition={
        pressed
          ? { duration: 0.05 }
          : { duration: 0.18, ease: "easeOut" }
      }
      whileHover={{ scale: pressed ? 0.88 : 1.1 }}
      aria-label="Close"
      style={{
        background:      "transparent",
        border:          "none",
        cursor:          "pointer",
        padding:         "10px",
        marginTop:       "10px",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        WebkitTapHighlightColor: "transparent",
        touchAction:     "manipulation",
        userSelect:      "none",
        WebkitUserSelect:"none",
        ...TAP_STYLE,
      }}
    >
      <motion.div
        animate={{ rotate }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          pointerEvents:  "none",
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6"  x2="6"  y2="18" />
          <line x1="6"  y1="6"  x2="18" y2="18" />
        </svg>
      </motion.div>
    </motion.button>
  );
};

export default CloseButton;