"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";

const PlayButton = ({ onClick, color = "var(--text-primary, black)", size = 80 }) => {
  const [pressed, setPressed] = useState(false);

  const handlePointerDown = useCallback(() => setPressed(true), []);
  const handlePointerLeave = useCallback(() => setPressed(false), []);
  const handlePointerUp = useCallback(
    (e) => {
      setPressed(false);
      e.stopPropagation();
      onClick?.(e);
    },
    [onClick]
  );
  // Keyboard fallback
  const handleClick = useCallback(
    (e) => {
      if (e.pointerType === "") onClick?.(e);
    },
    [onClick]
  );

  // Triangle dimensions derived from size
  const triangleBase = size * 0.55;   // borderLeft  (depth of triangle)
  const triangleArm  = size * 0.305;  // borderTop/Bottom (half-height)

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label="Play"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      animate={{
        scale:   pressed ? 0.88 : 1,
        opacity: pressed ? 0.6  : 1,
      }}
      transition={{
        scale:   pressed ? { duration: 0.05 } : { duration: 0.18, ease: "easeOut" },
        opacity: pressed ? { duration: 0.05 } : { duration: 0.18 },
      }}
      whileHover={{ scale: pressed ? 0.88 : 1.08, opacity: 0.8 }}
      style={{
        width:  size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 10,
        backgroundColor: "transparent",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        userSelect: "none",
        WebkitUserSelect: "none",
        outline: "none",
      }}
    >
      {/* CSS triangle — ml-1 offset keeps it visually centred */}
      <div
        style={{
          marginLeft: size * 0.05,
          width: 0,
          height: 0,
          borderLeft:   `${triangleBase}px solid ${color}`,
          borderTop:    `${triangleArm}px solid transparent`,
          borderBottom: `${triangleArm}px solid transparent`,
          backgroundColor: "transparent",
          pointerEvents: "none", // let parent receive all pointer events
        }}
      />
    </motion.div>
  );
};

export default PlayButton;