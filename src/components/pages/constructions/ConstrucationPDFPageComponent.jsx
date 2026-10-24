"use client";

// ═══════════════════════════════════════════════════════════════════════════════
//  ▼▼▼  EDIT HERE — all page settings in one place, no props needed  ▼▼▼
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // ── Slide images ─────────────────────────────────────────────────────────────
 // External URLs also need an entry in next.config.js → images.remotePatterns
  //     { protocol: "https", hostname: "huweiyiart.com" }
  slides: [
    "https://huweiyiart.com/imgs/slider_cover_img_1.webp",
    "https://huweiyiart.com/imgs/slider_cover_img_2.webp",
    "https://huweiyiart.com/imgs/slider_cover_img_3.webp",
    "https://huweiyiart.com/imgs/slider_cover_img_4.webp",
  ],

  // ── PDF — only the URL matters ───────────────────────────────────────────────
  pdfUrl: process.env.NEXT_PUBLIC_PDF_PORTFOLIO_URL || "",

  // ── Progress bar — set to null to hide completely ────────────────────────────
  progress: 90,   // 0–100

  // ── Bilingual copy ───────────────────────────────────────────────────────────
  copy: {
    eyebrow:  { cn: "网站建设中",              en: "Under Construction"                     },
    tagline:  { cn: "即将到来",               en: "Coming Soon"                            },
    ctaLabel: { cn: "同时，欢迎探索艺术家作品",  en: "In the meantime, explore the artist's work" },
    viewBtn:  { cn: "查看作品集",              en: "View Portfolio"                         },
    progress: { cn: "进度",                   en: "Progress"                               },
  },
};

const THEME = {
  // ── Colours ──────────────────────────────────────────────────────────────────
  pageBg:        "#080808",                      // canvas before first image loads
  scrimColor:    "#000000",
  scrimOpacity:   0.44,                          // 0–1

  gold:          "#c9a96e",
  cream:         "#f5f0eb",
  creamMid:      "rgba(245,240,235,0.52)",
  creamFaint:    "rgba(245,240,235,0.36)",
  ruleGold:      "rgba(201,169,110,0.65)",
  btnBorder:     "rgba(245,240,235,0.32)",

  progressTrack: "rgba(245,240,235,0.10)",
  progressLabel: "rgba(245,240,235,0.38)",
  progressEdge:  "rgba(245,240,235,0.25)",

  // ── Fonts ─────────────────────────────────────────────────────────────────────
  fontDisplay:   "'Cormorant Garamond', 'Georgia', serif",
  fontUi:        "'Inter', 'Helvetica Neue', sans-serif",

  headingSize:   "clamp(2.6rem, 7vw, 5.2rem)",
  taglineSize:   "clamp(0.8rem, 2vw, 1rem)",

  // ── Slideshow ─────────────────────────────────────────────────────────────────
  slideInterval: 5000,   // ms between slides
  slideFadeDur:  1.6,    // s — crossfade
  kenBurnsDur:   8,      // s — slow zoom
};

// ═══════════════════════════════════════════════════════════════════════════════
//  ▲▲▲  stop editing above this line  ▲▲▲
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import PDFViewerButton from "@/components/buttons/PDFViewerButton";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import useAppTitle from "@/hooks/useAppTitle";

// ─── z-index map — one place, no accidental conflicts ─────────────────────────
const Z = {
  slide:   0,   // behind everything
  scrim:   1,   // dims the slide
  content: 2,   // hero text (transparent bg — image shows through scrim)
  ui:      3,   // CTA, progress bar, dots
};

// ─── helpers ──────────────────────────────────────────────────────────────────
const t = (key, isCn) => CONFIG.copy[key]?.[isCn ? "cn" : "en"] ?? "";

// ─── Slide ────────────────────────────────────────────────────────────────────
const Slide = ({ src, active }) => (
  <AnimatePresence mode="sync">
    {active && (
      <motion.div
        key={src}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: THEME.slideFadeDur, ease: "easeInOut" }}
        style={{ position: "absolute", inset: 0, zIndex: Z.slide }}
      >
        <motion.div
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: THEME.kenBurnsDur, ease: "linear" }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Image
            src={src}
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Slide dots ───────────────────────────────────────────────────────────────
const SlideDots = ({ count, active }) => (
  <div style={{ display: "flex", gap: "6px", alignItems: "center" }} aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        style={{
          width:           i === active ? "18px" : "4px",
          height:          "1.5px",
          backgroundColor: i === active ? THEME.cream : "rgba(245,240,235,0.28)",
          borderRadius:    "1px",
          transition:      "width 0.55s ease, background-color 0.4s ease",
        }}
      />
    ))}
  </div>
);

// ─── Progress bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({ value, label }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 2.0 }}
    style={{ width: "260px" }}
  >
    <p style={{
      margin: "0 0 10px",
      fontFamily: THEME.fontUi, fontSize: "9px",
      letterSpacing: "0.22em", textTransform: "uppercase",
      color: THEME.progressLabel,
    }}>
      {label}
    </p>

    <div style={{
      position: "relative", width: "100%", height: "1px",
      background: THEME.progressTrack, overflow: "hidden",
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ delay: 2.5, duration: 1.8, ease: "easeOut" }}
        style={{ position: "absolute", inset: 0, background: THEME.gold, overflow: "hidden" }}
      >
        <motion.div
          animate={{ x: ["-120%", "120%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 4.4 }}
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent, rgba(245,240,235,0.22), transparent)",
          }}
        />
      </motion.div>
    </div>

    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
      <span style={{ fontFamily: THEME.fontUi, fontSize: "10px", color: THEME.progressEdge }}>0%</span>
      <motion.span
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 4.4 }}
        style={{ fontFamily: THEME.fontUi, fontSize: "12px", fontWeight: 300, color: THEME.cream }}
      >
        {value}%
      </motion.span>
      <span style={{ fontFamily: THEME.fontUi, fontSize: "10px", color: THEME.progressEdge }}>100%</span>
    </div>
  </motion.div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const ConstrucationPDFPageComponent = () => {
  const { isCn } = useContext(LanguageContext);
  const { fullNameChinese, fullNameEnglish } = useAppTitle("both");

  const count = CONFIG.slides.length;
  const [current,   setCurrent]   = useState(0);
  const [paused,    setPaused]    = useState(false);
  const [lineReady, setLineReady] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => setLineReady(true), 400);
    return () => clearTimeout(id);
  }, []);

  const advance = useCallback(() => setCurrent(c => (c + 1) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    timerRef.current = setInterval(advance, THEME.slideInterval);
    return () => clearInterval(timerRef.current);
  }, [count, paused, advance]);

  return (
    <div
      style={{
        position: "relative", width: "100%", height: "100vh",
        overflow: "hidden", background: THEME.pageBg,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >

      {/* ── Layer 0: slides ── */}
      {CONFIG.slides.map((src, i) => (
        <Slide key={src} src={src} active={i === current} />
      ))}

      {/* ── Layer 1: scrim (darkens image, reveals through transparent text bg) ── */}
      <motion.div
        animate={{ opacity: THEME.scrimOpacity }}
        transition={{ duration: 0.5 }}
        style={{
          position: "absolute", inset: 0, zIndex: Z.scrim,
          backgroundColor: THEME.scrimColor, pointerEvents: "none",
        }}
      />

      {/* ── Layer 2: hero text — NO background, image shows through ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: Z.content,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 24px", textAlign: "center",
        pointerEvents: "none",
      }}>

        <motion.p
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          style={{
            margin: "0 0 22px",
            fontFamily: THEME.fontUi, fontSize: "9px",
            fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase",
            color: THEME.gold,
          }}
        >
          {t("eyebrow", isCn)}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            margin: 0,
            fontFamily: THEME.fontDisplay, fontSize: THEME.headingSize,
            fontWeight: 300, lineHeight: 1.08,
            color: THEME.cream, letterSpacing: "0.02em",
          }}
        >
          {isCn ? fullNameChinese : fullNameEnglish}
        </motion.h1>

        {/* animated rule */}
        <div aria-hidden="true" style={{
          width:      lineReady ? "clamp(60px,12vw,110px)" : "0px",
          height:     "1px",
          background: `linear-gradient(90deg, transparent, ${THEME.ruleGold}, transparent)`,
          margin:     "24px auto",
          transition: "width 1.4s cubic-bezier(0.22,1,0.36,1) 0.7s",
        }} />

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.0 }}
          style={{
            margin: 0,
            fontFamily: THEME.fontDisplay, fontSize: THEME.taglineSize,
            fontWeight: 400, fontStyle: "italic", letterSpacing: "0.08em",
            color: THEME.creamMid,
          }}
        >
          {t("tagline", isCn)}
        </motion.p>
      </div>

      {/* ── Layer 3: PDF CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.3 }}
        style={{
          position: "absolute", bottom: "30%", left: "50%",
          transform: "translateX(-50%)", zIndex: Z.ui,
          display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
        }}
      >
        <p style={{
          margin: 0,
          fontFamily: THEME.fontUi, fontSize: "9px",
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: THEME.creamFaint, whiteSpace: "nowrap",
        }}>
          {t("ctaLabel", isCn)}
        </p>

        <PDFViewerButton
          pdfUrl={CONFIG.pdfUrl}
          buttonText={CONFIG.copy.viewBtn}
          colors={{ text: THEME.cream, background: "#111111" }}
          style={{
            border: `1px solid ${THEME.btnBorder}`,
            borderRadius: "2px",
            fontSize: "10px",
            letterSpacing: "0.14em",
            padding: "7px 16px",
          }}
        />
      </motion.div>

      {/* ── Layer 3: progress bar ── */}
      {CONFIG.progress != null && (
        <div style={{
          position: "absolute", bottom: "14%", left: "50%",
          transform: "translateX(-50%)", zIndex: Z.ui,
        }}>
          <ProgressBar value={CONFIG.progress} label={t("progress", isCn)} />
        </div>
      )}

      {/* ── Layer 3: slide dots ── */}
      {count > 1 && (
        <div style={{
          position: "absolute", bottom: "28px", left: "50%",
          transform: "translateX(-50%)", zIndex: Z.ui,
        }}>
          <SlideDots count={count} active={current} />
        </div>
      )}
    </div>
  );
};

export default ConstrucationPDFPageComponent;