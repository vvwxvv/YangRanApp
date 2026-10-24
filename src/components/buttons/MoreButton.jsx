"use client";

import React, { useState, useCallback, useContext } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LanguageContext } from "@/components/contexts/LanguageContext";

export default function MoreButton({ url }) {
  const { isCn } = useContext(LanguageContext);
  const router = useRouter();
  const [pressed, setPressed] = useState(false);

  const handlePointerDown = useCallback(() => setPressed(true), []);
  const handlePointerLeave = useCallback(() => setPressed(false), []);
  const handlePointerUp = useCallback(
    (e) => {
      setPressed(false);
      e.stopPropagation();
      if (url) router.push(url);
    },
    [url, router]
  );
  // Keyboard fallback only
  const handleClick = useCallback(
    (e) => {
      if (e.pointerType === "" && url) router.push(url);
    },
    [url, router]
  );

  return (
    <motion.button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      aria-label={isCn ? "加载更多" : "Load more"}
      animate={{
        scale:   pressed ? 0.9  : 1,
        opacity: pressed ? 0.65 : 1,
      }}
      transition={{
        scale:   pressed ? { duration: 0.05 } : { duration: 0.18, ease: "easeOut" },
        opacity: pressed ? { duration: 0.05 } : { duration: 0.18 },
      }}
      whileHover={{ opacity: 0.75 }}
      className="focus:outline-none"
      style={{
        background: "none",
        border: "none",
        padding: 0,
        margin: 0,
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <span className="text-blue-500 transition-colors">
        {isCn ? "+更多" : "+More"}
      </span>
    </motion.button>
  );
}