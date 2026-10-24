"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const DEFAULT_BTN_CLASS =
  "inline-flex items-center px-4 py-2 rounded-[10px] bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white text-[13px] leading-none tracking-wide hover:bg-black/[0.04] transition-colors relative";

const SHARED_STYLE = {
  WebkitTapHighlightColor: "transparent",
  touchAction:             "manipulation",
  userSelect:              "none",
  WebkitUserSelect:        "none",
};

// ─── Underline bar (shared between link and button variants) ──────────────────
const UnderlineBar = ({ active }) => (
  <motion.div
    className="absolute left-0 right-0 h-px bg-black dark:bg-white"
    style={{ bottom: 3, pointerEvents: "none", transformOrigin: "left" }}
    initial={false}
    animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
  />
);

// ─── Link item ────────────────────────────────────────────────────────────────
const LinkItem = ({ btn, idx }) => {
  const [pressed,  setPressed]  = useState(false);
  const [hovered,  setHovered]  = useState(false);
  const Icon = btn.icon;

  const handlePointerDown  = useCallback(() => setPressed(true),  []);
  const handlePointerLeave = useCallback(() => { setPressed(false); setHovered(false); }, []);
  const handlePointerUp    = useCallback(() => setPressed(false),  []);
  const handleMouseEnter   = useCallback(() => setHovered(true),   []);
  const handleMouseLeave   = useCallback(() => setHovered(false),  []);

  return (
    <Link
      key={btn.key || idx}
      href={btn.route}
      draggable={false}
      className={`${btn.className || DEFAULT_BTN_CLASS} touch-manipulation`}
      style={{ textDecoration: "none", ...SHARED_STYLE, ...btn.style }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.span
        style={{ display: "flex", alignItems: "center", pointerEvents: "none" }}
        animate={{
          scale:   pressed ? 0.97 : 1,
          opacity: pressed ? 0.7  : 1,
        }}
        transition={pressed ? { duration: 0.05 } : { duration: 0.18, ease: "easeOut" }}
      >
        {Icon && <Icon className="inline mr-1 text-current" size={18} />}
        {btn.label}
      </motion.span>
      <UnderlineBar active={hovered && !pressed} />
    </Link>
  );
};

// ─── Button item ──────────────────────────────────────────────────────────────
const ButtonItem = ({ btn, idx }) => {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const Icon = btn.icon;

  const handlePointerDown  = useCallback(() => setPressed(true),  []);
  const handlePointerLeave = useCallback(() => { setPressed(false); setHovered(false); }, []);
  const handlePointerUp    = useCallback((e) => {
    setPressed(false);
    e.stopPropagation();
    btn.onClick?.(e);
  }, [btn.onClick]);

  // Keyboard fallback
  const handleClick = useCallback((e) => {
    if (e.pointerType === "") {
      e.stopPropagation();
      btn.onClick?.(e);
    }
  }, [btn.onClick]);

  const handleMouseEnter = useCallback(() => setHovered(true),  []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  return (
    <motion.button
      key={btn.key || idx}
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={{
        scale:   pressed ? 0.97 : 1,
        opacity: pressed ? 0.7  : 1,
      }}
      transition={pressed ? { duration: 0.05 } : { duration: 0.18, ease: "easeOut" }}
      whileHover={{ scale: pressed ? 0.97 : 1.02 }}
      className={`${btn.className || DEFAULT_BTN_CLASS} touch-manipulation`}
      style={{ ...SHARED_STYLE, ...btn.style }}
      {...btn.extraProps}
    >
      <span style={{ display: "flex", alignItems: "center", pointerEvents: "none" }}>
        {Icon && <Icon className="text-current inline mr-1" size={18} />}
        {btn.label}
      </span>
      <UnderlineBar active={hovered && !pressed} />
    </motion.button>
  );
};

// ─── ButtonRow ────────────────────────────────────────────────────────────────
/**
 * ButtonRow — flexible row of action buttons for manager pages.
 *
 * @param {Array}          buttons   — configs: { label, onClick, route, icon, component, key, className, style, extraProps }
 * @param {Object}         style     — row wrapper style
 * @param {string}         className — row wrapper className
 * @param {React.ReactNode} children — rendered after buttons
 */
const ButtonRow = ({ buttons = [], style = {}, className = "", children }) => (
  <div
    className={`flex items-center gap-1 mb-2 justify-start ${className}`}
    style={style}
  >
    {buttons.map((btn, idx) => {
      // Custom component override
      if (btn.component) {
        const Comp = btn.component;
        return <Comp key={btn.key || idx} {...btn} />;
      }

      // Next.js Link for route buttons
      if (btn.route) {
        return <LinkItem key={btn.key || idx} btn={btn} idx={idx} />;
      }

      // Default button
      return <ButtonItem key={btn.key || idx} btn={btn} idx={idx} />;
    })}
    {children}
  </div>
);

export default ButtonRow;