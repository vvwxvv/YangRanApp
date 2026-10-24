"use client";

import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import useFont from "@/hooks/useFont";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import usePageLoad from "@/hooks/usePageLoad";
import { lockScroll, unlockScroll } from "@/utils/scrollLock";

/**
 * Full-screen loading state — used by every page.
 *
 * Nothing from the page underneath should be visible: this covers the nav,
 * content and footer with the theme background. The visual is intentionally
 * quiet: a field of abstract lines drifting in and out, one slowly rotating
 * square, and a small editorial LOADING mark with a moving rule.
 */

const seeded = (seed) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const RADIAL_TICKS = Array.from({ length: 24 }, (_, i) => i * 15);

function LoadingRadiation({ color, rule }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        width: 176,
        height: 176,
        display: "grid",
        placeItems: "center",
      }}
    >
      {/* Static orbit field. */}
      {[74, 96, 118, 140].map((size) => (
        <span
          key={size}
          style={{
            position: "absolute",
            width: size,
            height: size,
            border: `1px solid ${rule}`,
            borderRadius: "50%",
            opacity: 0.55,
          }}
        />
      ))}

      {/* Expanding radiation waves. */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={`wave-${i}`}
          initial={{ scale: 0.35, opacity: 0.32 }}
          animate={{ scale: [0.35, 2.5], opacity: [0.32, 0] }}
          transition={{
            duration: 5.2,
            delay: i * 1.15,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            width: 58,
            height: 58,
            border: `1px solid ${color}`,
            borderRadius: "50%",
            transformOrigin: "center center",
          }}
        />
      ))}

      {/* Fine radial ticks, not cartoon rays. */}
      <motion.svg
        width="176"
        height="176"
        viewBox="0 0 176 176"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", inset: 0 }}
      >
        {RADIAL_TICKS.map((angle) => (
          <line
            key={angle}
            x1="88"
            y1="48"
            x2="88"
            y2="55"
            transform={`rotate(${angle} 88 88)`}
            stroke={color}
            strokeWidth="1"
            opacity="0.38"
          />
        ))}
      </motion.svg>

      {/* Slow asymmetric orbital arc. */}
      <motion.svg
        width="176"
        height="176"
        viewBox="0 0 176 176"
        fill="none"
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", inset: 0 }}
      >
        <circle
          cx="88"
          cy="88"
          r="27"
          stroke={color}
          strokeWidth="1.2"
          strokeDasharray="118 52"
          opacity="0.8"
        />
      </motion.svg>

      {/* Quiet core, not a face. */}
      <motion.span
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: color,
        }}
      />
    </div>
  );
}

const makeLines = () =>
  Array.from({ length: 34 }, (_, index) => {
    const vertical = index % 4 === 0;
    const first = seeded(index + 1);
    const second = seeded(index + 17);
    const third = seeded(index + 43);

    return {
      id: index,
      vertical,
      left: `${10 + first * 80}%`,
      top: `${8 + second * 84}%`,
      width: vertical ? 1 : `${10 + third * 34}%`,
      height: vertical ? `${10 + third * 30}%` : 1,
      opacity: 0.12 + third * 0.2,
      delay: first * 2.4,
      duration: 2.2 + second * 2.8,
    };
  });

export default function LoadingAnimation({ isLoading = true, holdsGate = true }) {
  const { contentFontFamily } = useFont();
  const { colors } = useReverseTheme();
  const lines = useMemo(makeLines, []);

  // While a PAGE renders this, the shell must stay hidden. The global loader
  // rendered by LayoutContent opts out (`holdsGate={false}`) — otherwise it
  // would wait on itself.
  usePageLoad(isLoading && holdsGate);

  // The loading screen is the only thing on the page; stop the document
  // underneath from scrolling (and showing a scrollbar) while it is up.
  // Uses the shared lock so it can never restore a stale "hidden" left by a
  // drawer/modal that was open when this loader mounted.
  useEffect(() => {
    if (!isLoading) return undefined;
    lockScroll();
    return () => unlockScroll();
  }, [isLoading]);

  if (!isLoading) return null;

  const text = colors?.text || "#000000";
  const background = colors?.background || "#ffffff";
  const rule = colors?.border || "rgba(127,127,127,0.25)";

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: background,
        color: text,
        cursor: "wait",
        pointerEvents: "auto",
      }}
    >
      {/* Abstract line field */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {lines.map((line) => (
          <motion.span
            key={line.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, line.opacity, 0],
              scaleX: line.vertical ? 1 : [0.15, 1, 0.25],
              scaleY: line.vertical ? [0.15, 1, 0.25] : 1,
            }}
            transition={{
              duration: line.duration,
              delay: line.delay,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              left: line.left,
              top: line.top,
              width: line.width,
              height: line.height,
              background: text,
              transformOrigin: line.vertical ? "center top" : "left center",
            }}
          />
        ))}
      </div>

      {/* Centre mark */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          padding: 24,
        }}
      >
        <LoadingRadiation color={text} rule={rule} />

        <div
          style={{
            fontFamily: contentFontFamily,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            lineHeight: 1,
            paddingLeft: "0.42em",
          }}
        >
          Loading
        </div>

        <div
          aria-hidden="true"
          style={{
            position: "relative",
            width: 174,
            height: 1,
            background: rule,
            overflow: "hidden",
          }}
        >
          <motion.div
            animate={{ x: ["-110%", "110%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "44%",
              height: "100%",
              background: text,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
