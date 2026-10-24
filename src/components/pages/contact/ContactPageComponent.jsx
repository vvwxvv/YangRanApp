"use client";

import React from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

import useAboutData from "@/components/pages/about/hooks/useAboutData";
import useArtistContactData from "@/components/pages/about/hooks/useArtistContactData";
import AlertInfo from "@/components/alerts/AlertInfo";
import LoadingAnimation from "@/components/animations/LoadingAnimation";
import ContactInfo from "@/components/lists/ContactInfo";
import useFont from '@/hooks/useFont';

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const TYPE = Object.freeze({
  headingSize: "24px",
  headingWeight: 600,
  headingMargin: "0 0 32px 0",
  bodySize: "13px",
  bodyWeight: 400,
  bodyLineHeight: 1.7,
  bodyOpacity: 0.62, // elegant grey body text
  paragraphGap: "1.2em",
});

// ─────────────────────────────────────────────────────────────────────────────
// PAGE POSITION  (⇦ set the whole-page block position here)
//   CONTENT_ALIGN : "left" | "center" | "right"  → horizontal placement in the page
//   MAX_WIDTH     : outer cap for the whole block (bigger = wider spread)
//   PAGE_PX       : side padding (left/right breathing room)
//   PAGE_PY       : top / bottom spacing (lower the top value = content sits higher)
// ─────────────────────────────────────────────────────────────────────────────
const LAYOUT = Object.freeze({
  CONTENT_ALIGN: "center",               // ← "left" | "center" | "right"
  MAX_WIDTH: 1400,                       // outer cap for the whole block
  PAGE_PX: { xs: "24px", md: "48px" },   // side padding
  PAGE_PY: { xs: "48px", md: "72px" },   // top / bottom — lower top = content comes up
  TEXT_MAX_WIDTH: 680,                   // readable text-column cap
});

// Map CONTENT_ALIGN → horizontal margins for the outer block.
const ALIGN_MX = {
  left: { ml: 0, mr: "auto" },
  center: { mx: "auto" },
  right: { ml: "auto", mr: 0 },
};
const CONTENT_MX = ALIGN_MX[LAYOUT.CONTENT_ALIGN] || ALIGN_MX.center;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// ─────────────────────────────────────────────────────────────────────────────
// PLAIN WHITE LOADING STATE
//   No skeleton lines, no animation, no effects — just a blank white screen
//   while the data is being fetched.
// ─────────────────────────────────────────────────────────────────────────────
const PlainWhiteLoading = () => (
  <Box
    sx={{
      backgroundColor: "#fff",
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    }}
  >
    <LoadingAnimation isLoading />
  </Box>
);

// ─────────────────────────────────────────────────────────────────────────────
// STATUS GUARD  (loading / error for both hooks)
// ─────────────────────────────────────────────────────────────────────────────
const AboutStatusGuard = ({ isLoading, error, hasData, isCn, onRetry }) => {
  if (isLoading) return <PlainWhiteLoading />;
  if (error) {
    return (
      <AlertInfo
        message={isCn ? "连接失败" : "Connection Failed"}
        subMessage={isCn ? "系统暂时不可用" : "System temporarily unavailable"}
        buttonText={isCn ? "重试" : "Try Again"}
        onBack={onRetry}
        isCn={isCn}
      />
    );
  }
  if (!hasData) {
    return <AlertInfo message={isCn ? "暂无关于数据" : "No about data available"} isCn={isCn} />;
  }
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
//   Contact page — icon-based contact block (no text labels), per design note.
// ─────────────────────────────────────────────────────────────────────────────
const ContactPageComponent = () => {
  // ── About data (guard parity with the About page) ──
  const {
    isCn,
    colors,
    fontFamily: aboutFontFamily,
    galleryAbout,
    isLoading: aboutLoading,
    error: aboutError,
    handleRetry: aboutRetry,
  } = useAboutData();

  // ── Contact data ──
  const {
    contacts,
    isLoading: contactLoading,
    error: contactError,
    handleRetry: contactRetry,
  } = useArtistContactData();

  // ── Combined loading / error ──
  const isLoading = aboutLoading || contactLoading;
  const error = aboutError || contactError;
  const handleRetry = () => {
    aboutRetry();
    contactRetry();
  };

  // ── Font ──
  const { fontFamily } = useFont();
  const effectiveFont = aboutFontFamily || fontFamily;

  const hasData = Boolean(galleryAbout);

  if (isLoading || error || !hasData) {
    return (
      <AboutStatusGuard
        isLoading={isLoading}
        error={error}
        hasData={hasData}
        isCn={isCn}
        onRetry={handleRetry}
      />
    );
  }

  // ── Contact info ──
  const contact = contacts?.[0] || null;

  // ── Shared styles ──
  const headingStyle = {
    fontFamily: effectiveFont,
    fontSize: TYPE.headingSize,
    fontWeight: TYPE.headingWeight,
    color: colors.text,
    margin: TYPE.headingMargin,
    letterSpacing: "0.02em",
  };

  const bodyStyle = {
    fontFamily: effectiveFont,
    fontSize: TYPE.bodySize,
    fontWeight: TYPE.bodyWeight,
    color: colors.text,
    lineHeight: TYPE.bodyLineHeight,
    opacity: TYPE.bodyOpacity,
    margin: `0 0 ${TYPE.paragraphGap} 0`,
    textAlign: "justify",
  };

  const labels = {
    contactTitle: isCn ? "联系方式" : "Contact",
  };

  return (
    <Box sx={{ backgroundColor: colors.background, color: colors.text, minHeight: "100vh" }}>
      {/* Whole-page content block — position controlled by LAYOUT.CONTENT_ALIGN */}
      <Box
        sx={{
          maxWidth: LAYOUT.MAX_WIDTH,
          ...CONTENT_MX,
          px: LAYOUT.PAGE_PX,
          py: LAYOUT.PAGE_PY,
        }}
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* ── CONTACT SECTION ── */}
          <Box sx={{ maxWidth: LAYOUT.TEXT_MAX_WIDTH, marginTop: "400px" }}>
            <motion.div variants={itemVariants}>
              <h2 style={headingStyle}>{labels.contactTitle}</h2>

              {contact ? (
                <ContactInfo
                  contact={contact}
                  fontFamily={effectiveFont}
                  sx={{ color: colors.text }}
                />
              ) : (
                <p style={bodyStyle}>
                  {isCn ? "暂无联系信息" : "No contact information available"}
                </p>
              )}
            </motion.div>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default ContactPageComponent;
