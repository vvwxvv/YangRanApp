"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { LanguageContext } from "@/components/contexts/LanguageContext";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import useFont from "@/hooks/useFont";
import useData from "@/hooks/useData";
import { filterByLanguage } from "@/utils/filterByLanguage";

function WritingRail({ isCn, isMobile, open, onOpen, fontFamily, labelEn, labelCn, topOffset }) {
  const [hover, setHover] = useState(false);
  if (open) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={isCn ? `打开${labelCn}列表` : `Open ${labelEn.toLowerCase()}`}
      title={isCn ? labelCn : labelEn}
      style={{
        position: "fixed",
        right: 0,
        // Align the rail's top edge with the first artwork image instead of
        // floating it in the vertical centre of the viewport.
        top: topOffset,
        zIndex: 1200,
        width: isMobile ? 24 : 28,
        minHeight: isCn ? (isMobile ? 108 : 128) : isMobile ? 150 : 180,
        padding: "18px 0",
        margin: 0,
        border: "none",
        borderTop: "1px solid rgba(255,255,255,0.18)",
        borderBottom: "1px solid rgba(255,255,255,0.18)",
        borderRadius: 0,
        background: "#111111",
        color: "#ffffff",
        fontFamily,
        writingMode: "vertical-rl",
        // Upright letters read top-to-bottom without tilting the head.
        textOrientation: "upright",
        fontSize: isMobile ? 13 : 14,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        lineHeight: 1,
        cursor: "pointer",
        opacity: hover ? 0.82 : 1,
        boxShadow: "-2px 0 10px rgba(0,0,0,0.18)",
        transition: "opacity 0.2s ease",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span
        style={{
          display: "inline-block",
          transform: "translateX(-3px)",
          color: "#ffffff",
        }}
      >
        {isCn ? labelCn : labelEn}
      </span>
    </div>
  );
}

/**
 * Right-side drawer listing every language-matched Writing record. Rows with
 * paragraphs expand in place, so no public writing-detail route is required.
 */
function WritingDrawer({
  open,
  onClose,
  writings,
  isLoading,
  isCn,
  isMobile,
  paper,
  rule,
  colors,
  fonts,
  displayFont,
}) {
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!open) setExpanded(null);
  }, [open]);

  // Lock the page, close on Escape, and restore the previous overflow.
  useEffect(() => {
    if (!open || typeof document === "undefined") return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 4000,
            // The global div background rule would otherwise paint this
            // full-screen layer white over the index page.
            background: "transparent",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "absolute",
              inset: 0,
              // Invisible click-catcher: the index page must stay visible
              // behind the drawer (no full grey modal wash).
              background: "transparent",
            }}
          />

          <motion.aside
            className="writing-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={isCn ? "文章列表" : "Writings"}
            style={{
              "--writing-paper": paper,
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(460px, 92vw)",
              display: "flex",
              flexDirection: "column",
              background: paper,
              color: colors.text,
              boxShadow: "-1px 0 0 rgba(0,0,0,0.18)",
              overflow: "hidden",
            }}
          >
            {/* Black header, matching the home archive bar. */}
            <div
              className="writing-drawer-header"
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: isMobile ? "14px 16px" : "16px 20px",
                background: paper,
                color: colors.text,
                borderBottom: `1px solid ${rule}`,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    opacity: 0.65,
                    lineHeight: 1.2,
                  }}
                >
                  {isCn ? "索引" : "Index"}
                </div>
                <div
                  style={{
                    marginTop: 3,
                    fontFamily: displayFont,
                    fontSize: isMobile ? 20 : 22,
                    fontWeight: 700,
                    fontStretch: "condensed",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    lineHeight: 1.05,
                  }}
                >
                  {isCn ? "文章" : "Writings"}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontFamily: fonts.body,
                    fontSize: 10.5,
                    opacity: 0.6,
                  }}
                >
                  {writings.length} {isCn ? "篇" : writings.length === 1 ? "entry" : "entries"}
                </div>
              </div>

              <button
                type="button"
                className="writing-drawer-close"
                onClick={onClose}
                aria-label={isCn ? "关闭" : "Close"}
                autoFocus
                style={{
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 34,
                  height: 34,
                  padding: 0,
                  border: `1px solid ${rule}`,
                  borderRadius: 0,
                  background: "transparent",
                  color: colors.text,
                  cursor: "pointer",
                }}
              >
                <X size={17} strokeWidth={1.6} color={colors.text} />
              </button>
            </div>

            {/* List */}
            <div
              className="writing-drawer-body"
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                background: paper,
                padding: isMobile ? "0 16px 28px" : "0 20px 32px",
              }}
            >
              {isLoading ? (
                <div
                  style={{
                    padding: "28px 0",
                    fontFamily: fonts.body,
                    fontSize: 12,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    opacity: 0.5,
                  }}
                >
                  {isCn ? "加载中…" : "Loading…"}
                </div>
              ) : writings.length === 0 ? (
                <div
                  style={{
                    padding: "28px 0",
                    fontFamily: fonts.body,
                    fontSize: 12.5,
                    opacity: 0.55,
                  }}
                >
                  {isCn ? "暂无文章。" : "No writings yet."}
                </div>
              ) : (
                writings.map((writing, index) => {
                  const id = writing.id || writing._id || `${writing.title}-${index}`;
                  const paragraphs = Array.isArray(writing.paragraphs)
                    ? writing.paragraphs.filter(Boolean)
                    : [];
                  const excerpt =
                    writing.summary || writing.caption || paragraphs[0] || "";
                  const meta = [writing.type, writing.year].filter(Boolean).join(" · ");
                  const canExpand = paragraphs.length > 0 || !!writing.summary || !!writing.caption;
                  const isExpanded = expanded === id;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => canExpand && setExpanded(isExpanded ? null : id)}
                      aria-expanded={canExpand ? isExpanded : undefined}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "16px 0 14px",
                        margin: 0,
                        border: "none",
                        borderTop: `1px solid ${rule}`,
                        borderRadius: 0,
                        background: "transparent",
                        color: "inherit",
                        textAlign: "left",
                        cursor: canExpand ? "pointer" : "default",
                        fontFamily: fonts.body,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 10,
                          fontFamily: fonts.body,
                          fontSize: 10.5,
                          letterSpacing: "0.04em",
                          opacity: 0.62,
                          lineHeight: 1.2,
                        }}
                      >
                        <span style={{ fontFamily: fonts.body, fontVariantNumeric: "tabular-nums" }}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {meta ? <span>{meta}</span> : null}
                      </div>

                      <div
                        style={{
                          marginTop: 7,
                          fontFamily: displayFont,
                          fontSize: isMobile ? 17 : 18,
                          fontWeight: 700,
                          fontStretch: "condensed",
                          lineHeight: 1.12,
                          textTransform: "uppercase",
                          letterSpacing: "0.01em",
                          color: colors.text,
                        }}
                      >
                        {writing.title}
                      </div>

                      {excerpt ? (
                        <div
                          style={{
                            marginTop: 7,
                            fontFamily: fonts.body,
                            fontSize: 12.5,
                            lineHeight: 1.55,
                            opacity: 0.7,
                            ...(isExpanded
                              ? {}
                              : {
                                  display: "-webkit-box",
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }),
                          }}
                        >
                          {excerpt}
                        </div>
                      ) : null}

                      {isExpanded && paragraphs.length > 0 ? (
                        <div style={{ marginTop: 11 }}>
                          {paragraphs.map((paragraph, paragraphIndex) => (
                            <p
                              key={paragraphIndex}
                              style={{
                                margin: "0 0 10px",
                                fontFamily: fonts.body,
                                fontSize: 12.5,
                                lineHeight: 1.75,
                                opacity: 0.82,
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      ) : null}

                      {canExpand ? (
                        <div
                          style={{
                            marginTop: 9,
                            fontFamily: fonts.body,
                            fontSize: 9.5,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            opacity: 0.45,
                          }}
                        >
                          {isExpanded
                            ? isCn
                              ? "收起 −"
                              : "Close −"
                            : isCn
                            ? "展开 +"
                            : "Read +"}
                        </div>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}


/**
 * Global right-edge writing dock. Rendered by LayoutMainContent on every
 * public page, so the same button/drawer is reused everywhere.
 *
 * Props are intentionally content-agnostic:
 *   labelEn / labelCn — the vertical button copy
 *   topOffset         — where the rail starts (default: +150px below the old
 *                       position, as requested)
 */
export default function WritingSidePanel({
  labelEn = "WRITINGS",
  labelCn = "文章",
  topOffset = "calc(clamp(20px, 4.5vh, 40px) + 150px)",
}) {
  const { isCn } = useContext(LanguageContext);
  const { isMobile } = useContext(DeviceContext);
  const { colors, isDark } = useReverseTheme();
  const pathname = usePathname();

  const { fontFamily: bodyFont } = useFont("bodyText");
  const { fontFamily: displayFont } = useFont("archiveDisplay");

  const { data: rawWritings = [], isLoading } = useData("/api/writing?limit=100");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const writings = useMemo(() => {
    const list = Array.isArray(rawWritings)
      ? rawWritings
      : rawWritings?.data && Array.isArray(rawWritings.data)
      ? rawWritings.data
      : [];
    const matched = filterByLanguage(list, isCn);
    const source = matched.length ? matched : list;
    return [...source].sort((a, b) => {
      const ay = Number(a?.year) || 0;
      const by = Number(b?.year) || 0;
      if (ay !== by) return by - ay;
      return String(a?.title || "").localeCompare(String(b?.title || ""), undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  }, [rawWritings, isCn]);

  const paper = isDark ? "#111111" : "#ffffff";
  const rule = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.14)";

  return (
    <>
      <WritingRail
        isCn={isCn}
        isMobile={isMobile}
        open={open}
        onOpen={() => setOpen(true)}
        fontFamily={bodyFont}
        labelEn={labelEn}
        labelCn={labelCn}
        topOffset={topOffset}
      />
      <WritingDrawer
        open={open}
        onClose={() => setOpen(false)}
        writings={writings}
        isLoading={isLoading}
        isCn={isCn}
        isMobile={isMobile}
        paper={paper}
        rule={rule}
        colors={colors}
        fonts={{ body: bodyFont }}
        displayFont={displayFont}
      />
    </>
  );
}
