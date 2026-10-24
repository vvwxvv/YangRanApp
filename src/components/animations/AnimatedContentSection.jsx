"use client";

import React from "react";
import { motion } from "framer-motion";
import { renderArrayContent, renderTextWithFormatting } from "@/utils/textFormatting";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * AnimatedContentSection
 * ─────────────────────────────────────────────────────────────────────────
 * Generic, reusable editorial text block: an animated heading, a stack of
 * animated paragraphs, and an optional element pinned to the bottom-right
 * corner (e.g. a download button / link).
 *
 * Framework/design-system agnostic beyond framer-motion + the two text
 * helpers. Not tied to "About" — use it anywhere a page needs the same
 * "caption + copy + corner action" pattern (About, Exhibition, ArchitectProject…).
 *
 * Usage:
 *   <AnimatedContentSection
 *     heading={item.caption}
 *     paragraphs={item.introduction}
 *     fontFamily={fontFamily}
 *     color={colors.text}
 *     cornerSlot={<SomeButton />}
 *   />
 * ─────────────────────────────────────────────────────────────────────────
 */

// ── Typography defaults — override per-usage via the `typography` prop ────
export const DEFAULT_TYPOGRAPHY = {
  captionSize: "14px",
  headingSize: "14px",
  bodySize: "14px",
  captionWeight: 600,
  headingWeight: 500,
  bodyWeight: 400,
  headingTracking: "0.06em",
  captionTracking: "0.12em",
  bodyTracking: "0.01em",
  headingLineHeight: 1.25,
  bodyLineHeight: 1.72,
  paragraphGap: "1.1em",
  headingGap: "1.6rem",
};

// ── Motion — understated, precise (e-flux-like) ────────────────────────────
const EASE = [0.16, 1, 0.3, 1]; // expo-out: fast settle, no bounce

export const sectionAnimationVariants = {
  container: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.04 } },
  },
  heading: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  },
  paragraph: {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
  },
  // corner element fades in place last — no slide, keeps it editorial
  corner: (delay = 0.45) => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: EASE, delay } },
  }),
};

/**
 * Builds ready-to-spread style objects (base / heading / paragraph / caption)
 * from a font family, text color, and optional typography overrides.
 * Kills monospace-fallback flashes and enables OpenType features.
 */
export function buildTypographyStyles({ fontFamily, color, typography = {} }) {
  const TYPE = { ...DEFAULT_TYPOGRAPHY, ...typography };

  const base = {
    fontFamily,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textRendering: "optimizeLegibility",
    fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
  };

  const heading = {
    ...base,
    color,
    fontSize: TYPE.headingSize,
    fontWeight: TYPE.headingWeight,
    lineHeight: TYPE.headingLineHeight,
    letterSpacing: TYPE.headingTracking,
    margin: `0 0 ${TYPE.headingGap} 0`,
    textTransform: "none",
  };

  // No text-align:justify — that's what stretches word-spacing into gaps.
  const paragraph = {
    ...base,
    color,
    fontSize: TYPE.bodySize,
    fontWeight: TYPE.bodyWeight,
    lineHeight: TYPE.bodyLineHeight,
    letterSpacing: TYPE.bodyTracking,
    margin: `0 0 ${TYPE.paragraphGap} 0`,
    textAlign: "left",
    hyphens: "auto",
    wordBreak: "break-word",
  };

  const caption = {
    ...base,
    color,
    fontSize: TYPE.captionSize,
    fontWeight: TYPE.captionWeight,
    letterSpacing: TYPE.captionTracking,
    textTransform: "uppercase",
  };

  return { base, heading, paragraph, caption };
}

/**
 * Renders one <motion.p> per item so the stagger animation applies
 * per-paragraph rather than to the whole block at once.
 * Accepts either plain strings or rich content nodes handled by
 * renderArrayContent (matches the project's existing text-formatting utils).
 */
export const AnimatedParagraphs = ({
  items,
  style,
  variants = sectionAnimationVariants.paragraph,
}) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <>
      {items.map((item, i) => (
        <motion.p key={i} style={style} variants={variants}>
          {typeof item === "string" ? item : renderArrayContent([item], {})}
        </motion.p>
      ))}
    </>
  );
};

const AnimatedContentSection = ({
  heading,
  paragraphs,
  fontFamily,
  color,
  typography,
  cornerSlot,
  cornerDelay = 0.45,
  cornerOffset = "52px",
  className,
  style: styleOverride,
}) => {
  const styles = buildTypographyStyles({ fontFamily, color, typography });

  return (
    <motion.div
      className={className}
      style={{
        position: "relative",
        paddingBottom: cornerSlot ? cornerOffset : 0,
        ...styleOverride,
      }}
      variants={sectionAnimationVariants.container}
      initial="hidden"
      animate="visible"
    >
      {heading && (
        <motion.h2 style={styles.heading} variants={sectionAnimationVariants.heading}>
          {renderTextWithFormatting(heading)}
        </motion.h2>
      )}

      <AnimatedParagraphs items={paragraphs} style={styles.paragraph} />

      {cornerSlot && (
        <motion.div
          style={{ position: "absolute", bottom: 0, right: 0 }}
          variants={sectionAnimationVariants.corner(cornerDelay)}
        >
          {cornerSlot}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnimatedContentSection;

