"use client";

import React, { useContext } from "react";
import { motion } from "framer-motion";

import { LanguageContext } from "@/components/contexts/LanguageContext";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import useFont from "@/hooks/useFont";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import AlertInfo from "@/components/alerts/AlertInfo";
import LoadingAnimation from "@/components/animations/LoadingAnimation";
import useResumeData from "@/components/pages/resume/hooks/useResumeData";
import {
  pick,
  formatDateRange,
  splitRoleOrg,
} from "@/components/pages/resume/utils/resumeUtils";

// ============================================================================
// RESUME PAGE (public)
// ─────────────────────────────────────────────────────────────────────────────
// A CV-style page: a "RESUME" title with a rule, then one section per Resume
// `type` (EXHIBITIONS, EXPERIENCES, …) — each with a heading + rule, and entries
// of "[start – end]  Role, Organisation" followed by its bullet lines.
//
// Fits HuJiemingApp Prisma `Resume`:
//   type (section) · start_date · end_date · description ("Role, Org")
//   introduction[] (bullets) · artist · year · language
// ============================================================================
const CONFIG = {
  PAGE: {
    MAX_WIDTH: 940,
    PADDING_TOP_DESKTOP: 32,
    PADDING_TOP_MOBILE: 22,
    PADDING_X_DESKTOP: 60,
    PADDING_X_MOBILE: 22,
    PADDING_BOTTOM: 120,
  },

  TITLE: {
    FONT_SIZE_DESKTOP: "26px",
    FONT_SIZE_MOBILE: "22px",
    FONT_WEIGHT: 600,
    LETTER_SPACING: "0.16em",
    RULE_MARGIN_TOP: 12,
    RULE_MARGIN_BOTTOM: 8,
  },

  SECTION: {
    FONT_SIZE_DESKTOP: "13px",
    FONT_SIZE_MOBILE: "12px",
    FONT_WEIGHT: 600,
    LETTER_SPACING: "0.2em",
    MARGIN_TOP_DESKTOP: 54,
    MARGIN_TOP_MOBILE: 40,
    RULE_MARGIN_TOP: 10,
    RULE_MARGIN_BOTTOM: 20,
  },

  ENTRY: {
    FONT_SIZE_DESKTOP: "13px",
    FONT_SIZE_MOBILE: "12.5px",
    LINE_HEIGHT: 1.6,
    LETTER_SPACING: "0.01em",
    BLOCK_GAP: 26,
    ROW_GAP: 6,
    BULLET_INDENT: 22,
    BULLET_OPACITY: 0.82,
    ROLE_WEIGHT: 600,
  },

  RULE_OPACITY: { light: 0.55, dark: 0.6 },

  TEXT: {
    TITLE: { en: "Resume", cn: "履历" },
    EMPTY: { en: "No resume entries", cn: "暂无履历" },
    ERROR_MESSAGE: { en: "Loading Failed", cn: "加载失败" },
    RETRY_BUTTON: { en: "Retry", cn: "重试" },
  },
};

function Rule({ color, height = "1px", marginTop = 0, marginBottom = 0 }) {
  return (
    <div
      style={{
        height,
        width: "100%",
        backgroundColor: color,
        marginTop,
        marginBottom,
      }}
    />
  );
}

// One entry: date range + "Role, Org" line, then the bullet lines.
const ResumeEntry = React.memo(function ResumeEntry({
  item,
  index,
  isMobile,
  fontFamily,
  color,
}) {
  const { role, org } = splitRoleOrg(item.description);
  const dateLabel = formatDateRange(item.start_date, item.end_date);
  const bullets = Array.isArray(item.introduction)
    ? item.introduction.filter(Boolean)
    : [];

  const fontSize = isMobile ? CONFIG.ENTRY.FONT_SIZE_MOBILE : CONFIG.ENTRY.FONT_SIZE_DESKTOP;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isMobile ? 0 : Math.min(index, 8) * 0.03, duration: 0.4, ease: "easeOut" }}
      style={{ marginBottom: CONFIG.ENTRY.BLOCK_GAP }}
    >
      <p
        style={{
          margin: 0,
          fontFamily,
          fontSize,
          lineHeight: CONFIG.ENTRY.LINE_HEIGHT,
          letterSpacing: CONFIG.ENTRY.LETTER_SPACING,
          color,
        }}
      >
        {dateLabel && (
          <span style={{ fontStyle: "italic", marginRight: 8 }}>{dateLabel}</span>
        )}
        {role && (
          <span style={{ fontStyle: "italic", fontWeight: CONFIG.ENTRY.ROLE_WEIGHT }}>{role}</span>
        )}
        {org && <span>{role ? ", " : ""}{org}</span>}
      </p>

      {bullets.map((line, i) => (
        <p
          key={i}
          style={{
            margin: `${CONFIG.ENTRY.ROW_GAP}px 0 0`,
            paddingLeft: CONFIG.ENTRY.BULLET_INDENT,
            fontFamily,
            fontSize,
            lineHeight: CONFIG.ENTRY.LINE_HEIGHT,
            letterSpacing: CONFIG.ENTRY.LETTER_SPACING,
            color,
            opacity: CONFIG.ENTRY.BULLET_OPACITY,
          }}
        >
          – {line}
        </p>
      ))}
    </motion.div>
  );
});

const ResumeSection = React.memo(function ResumeSection({
  group,
  isMobile,
  fontFamily,
  headingFont,
  color,
  ruleColor,
}) {
  return (
    <section
      style={{
        marginTop: isMobile ? CONFIG.SECTION.MARGIN_TOP_MOBILE : CONFIG.SECTION.MARGIN_TOP_DESKTOP,
      }}
    >
      {group.label && (
        <>
          <h2
            style={{
              margin: 0,
              fontFamily: headingFont,
              fontSize: isMobile ? CONFIG.SECTION.FONT_SIZE_MOBILE : CONFIG.SECTION.FONT_SIZE_DESKTOP,
              fontWeight: CONFIG.SECTION.FONT_WEIGHT,
              letterSpacing: CONFIG.SECTION.LETTER_SPACING,
              textTransform: "uppercase",
              color,
            }}
          >
            {group.label}
          </h2>
          <Rule
            color={ruleColor}
            marginTop={CONFIG.SECTION.RULE_MARGIN_TOP}
            marginBottom={CONFIG.SECTION.RULE_MARGIN_BOTTOM}
          />
        </>
      )}

      {group.items.map((item, i) => (
        <ResumeEntry
          key={item.id || item._id || i}
          item={item}
          index={i}
          isMobile={isMobile}
          fontFamily={fontFamily}
          color={color}
        />
      ))}
    </section>
  );
});

function ResumeLoading({ bg }) {
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: bg || "#ffffff",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingAnimation isLoading />
    </div>
  );
}

// ============================================================================
// Main component
// ============================================================================
export default function ResumePageComponent({ title }) {
  const { isCn } = useContext(LanguageContext);
  const { isMobile } = useContext(DeviceContext);
  // ── Typography roles (lib/typography.js) ──
  const { fontFamily: titleFont } = useFont("detailTitle");
  const { fontFamily: headingFont } = useFont("detailSectionHeading");
  const { fontFamily: bodyFont } = useFont("detailBody");
  const { colors, isDark } = useReverseTheme();

  const text = colors.text;
  const bg = colors.background;
  const ruleColor = isDark
    ? `rgba(255,255,255,${CONFIG.RULE_OPACITY.dark})`
    : `rgba(0,0,0,${CONFIG.RULE_OPACITY.light})`;

  // Real data from the API (like the other pages) — filtered + grouped by
  // `type` in useResumeData.
  const { groups, isLoading, error, handleRetry } = useResumeData();

  const heading = title || pick(isCn, CONFIG.TEXT.TITLE);

  if (isLoading) return <ResumeLoading bg={bg} />;
  if (error) {
    return (
      <AlertInfo
        message={pick(isCn, CONFIG.TEXT.ERROR_MESSAGE)}
        buttonText={pick(isCn, CONFIG.TEXT.RETRY_BUTTON)}
        onBack={handleRetry}
        isCn={isCn}
      />
    );
  }

  return (
    <div
      style={{
        backgroundColor: bg,
        color: text,
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: CONFIG.PAGE.MAX_WIDTH,
          margin: "0 auto",
          paddingTop: isMobile ? CONFIG.PAGE.PADDING_TOP_MOBILE : CONFIG.PAGE.PADDING_TOP_DESKTOP,
          paddingLeft: isMobile ? CONFIG.PAGE.PADDING_X_MOBILE : CONFIG.PAGE.PADDING_X_DESKTOP,
          paddingRight: isMobile ? CONFIG.PAGE.PADDING_X_MOBILE : CONFIG.PAGE.PADDING_X_DESKTOP,
          paddingBottom: CONFIG.PAGE.PADDING_BOTTOM,
        }}
      >
        {/* ── Title ── */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            margin: 0,
            fontFamily: titleFont,
            fontSize: isMobile ? CONFIG.TITLE.FONT_SIZE_MOBILE : CONFIG.TITLE.FONT_SIZE_DESKTOP,
            fontWeight: CONFIG.TITLE.FONT_WEIGHT,
            letterSpacing: CONFIG.TITLE.LETTER_SPACING,
            textTransform: "uppercase",
            color: text,
          }}
        >
          {heading}
        </motion.h1>
        <Rule
          color={ruleColor}
          marginTop={CONFIG.TITLE.RULE_MARGIN_TOP}
          marginBottom={CONFIG.TITLE.RULE_MARGIN_BOTTOM}
        />

        {/* ── Sections ── */}
        {groups.length === 0 ? (
          <p
            style={{
              fontFamily: bodyFont,
              fontSize: "13px",
              color: text,
              opacity: 0.3,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginTop: 40,
            }}
          >
            {pick(isCn, CONFIG.TEXT.EMPTY)}
          </p>
        ) : (
          groups.map((group) => (
            <ResumeSection
              key={group.key}
              group={group}
              isMobile={isMobile}
              fontFamily={bodyFont}
              headingFont={headingFont}
              color={text}
              ruleColor={ruleColor}
            />
          ))
        )}
      </div>
    </div>
  );
}
