"use client";

import React, { useContext, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LanguageContext } from "../contexts/LanguageContext";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import useFont from "@/hooks/useFont";
import useSiteMeta from "@/hooks/useSiteMeta";
import { DEFAULT_MENUS } from "@/utils/siteMetaDefaults";
import useArtistContactData from "@/components/pages/about/hooks/useArtistContactData";
import { isHiddenPlatform } from "@/components/lists/ContactInfo";
import ThemeToggleButton from "@/components/buttons/ThemeToggleButton";

// ─────────────────────────────────────────────────────────────────────────────
//  FOOTER CONFIG — single source of truth for the footer's visuals.
//  Content comes from the Meta doc (app title, footer copy, menu) + the
//  ArtistContact record (address / email / phone / social). Nothing visual is
//  hardcoded further down.
// ─────────────────────────────────────────────────────────────────────────────
const FOOTER_CONFIG = Object.freeze({
  MAX_WIDTH: 1200,
  PADDING_DESKTOP: "56px 50px 26px",
  PADDING_MOBILE: "36px 20px 22px",
  COLUMN_GAP: "clamp(24px, 4vw, 64px)",
  BLOCK_GAP: 12, // vertical step inside a column

  TITLE_SIZE_DESKTOP: "26px",
  TITLE_SIZE_MOBILE: "22px",
  TITLE_WEIGHT: 700,
  TITLE_LETTER_SPACING: "0.01em",

  LINK_SIZE: "14px",
  LINK_WEIGHT: 400,
  LINK_LINE_HEIGHT: 1.95,

  META_SIZE: "13px",
  META_LINE_HEIGHT: 1.6,
  META_OPACITY: 0.72,

  COPY_SIZE: "12px",
  COPY_OPACITY: 0.6,

  // Reveal-on-scroll ("auto pop" at the bottom of the page).
  REVEAL_Y: 40,
  REVEAL_DURATION: 0.6,
  REVEAL_EASE: [0.16, 1, 0.3, 1],
  REVEAL_MARGIN: "-60px",
});

export default function Footer() {
  const { isCn } = useContext(LanguageContext);
  const { isMobile } = useContext(DeviceContext);
  const { colors, isDark } = useReverseTheme();
  const { contentFontFamily } = useFont();

  // Meta doc (app title, footer copy, menu) — defaults live in siteMetaDefaults.
  const { meta } = useSiteMeta();

  // Artist contact (address / email / phone / social / web) — same source the
  // Contact page uses.
  const { ArtistContact } = useArtistContactData();

  const languageKey = isCn ? "cn" : "en";
  const menuList = useMemo(() => {
    const src =
      meta?.menu?.mainMenu?.[languageKey] ||
      DEFAULT_MENUS.mainMenu?.[languageKey] ||
      [];
    return src;
  }, [meta, languageKey]);

  // Site title comes from the Meta doc only. Nothing persona-specific is
  // shown before it arrives (no env / default name fallback).
  const appTitle = meta?.seo?.title || "";

  // ── Copyright ──
  const startYear = meta?.app_footer_start_year;
  const companyName = isCn ? meta?.app_footer_cn : meta?.app_footer_en;
  const rightsText = isCn ? meta?.app_footer_rights_cn : meta?.app_footer_rights_en;
  const currentYear = new Date().getFullYear();
  const yearRange =
    !startYear || startYear === currentYear ? `${currentYear}` : `${startYear}–${currentYear}`;
  const copyright = [
    `© ${yearRange}`,
    companyName || appTitle,
    rightsText ? `${rightsText}.` : "",
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  // ── Contact info (all of it lives in the footer) ──
  const addressLines = Array.isArray(ArtistContact?.address)
    ? ArtistContact.address.filter(Boolean)
    : ArtistContact?.address
    ? [ArtistContact.address]
    : [];
  const socials = Array.isArray(ArtistContact?.social_media)
    ? ArtistContact.social_media.filter(
        (s) => s && (s.platform || s.account || s.url) && !isHiddenPlatform(s.platform)
      )
    : [];
  const email = ArtistContact?.email || "";
  const phone = ArtistContact?.phone || "";
  const webUrl = ArtistContact?.web_url || "";

  const border = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.14)";

  const linkStyle = {
    display: "block",
    color: colors.text,
    textDecoration: "none",
    fontFamily: contentFontFamily,
    fontSize: FOOTER_CONFIG.LINK_SIZE,
    fontWeight: FOOTER_CONFIG.LINK_WEIGHT,
    lineHeight: FOOTER_CONFIG.LINK_LINE_HEIGHT,
  };

  const metaStyle = {
    fontFamily: contentFontFamily,
    fontSize: FOOTER_CONFIG.META_SIZE,
    lineHeight: FOOTER_CONFIG.META_LINE_HEIGHT,
    opacity: FOOTER_CONFIG.META_OPACITY,
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: FOOTER_CONFIG.REVEAL_Y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: FOOTER_CONFIG.REVEAL_MARGIN }}
      transition={{ duration: FOOTER_CONFIG.REVEAL_DURATION, ease: FOOTER_CONFIG.REVEAL_EASE }}
      style={{
        width: "100%",
        backgroundColor: colors.background,
        color: colors.text,
        borderTop: `1px solid ${border}`,
      }}
    >
      <div
        style={{
          maxWidth: FOOTER_CONFIG.MAX_WIDTH,
          margin: "0 auto",
          padding: isMobile ? FOOTER_CONFIG.PADDING_MOBILE : FOOTER_CONFIG.PADDING_DESKTOP,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: FOOTER_CONFIG.COLUMN_GAP,
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          {/* Left — address only (app title intentionally not shown) */}
          {addressLines.length > 0 && (
            <div style={{ flex: "1 1 220px", minWidth: 180 }}>
              <div style={metaStyle}>
                {addressLines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          )}

          {/* Column — site menu */}
          <nav style={{ flex: "0 1 auto" }}>
            {menuList.map((item) => (
              <Link key={item.href} href={item.href} style={linkStyle}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Column — contact + social (all contact info lives here) */}
          <div style={{ flex: "0 1 auto" }}>
            <Link href="/contact" style={linkStyle}>
              {isCn ? "联系" : "Contact"}
            </Link>
            {email && (
              <a href={`mailto:${email}`} style={linkStyle}>
                {email}
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} style={linkStyle}>
                {phone}
              </a>
            )}
            {webUrl && (
              <a href={webUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                {webUrl}
              </a>
            )}
            {socials.map((s, i) => {
              const label = s.platform || s.account || s.url;
              const href = s.url || "";
              return href ? (
                <a
                  key={`${label}-${i}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                >
                  {label}
                </a>
              ) : (
                <div key={`${label}-${i}`} style={linkStyle}>
                  {label}
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom — copyright + light/dark switch */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            marginTop: 40,
            paddingTop: 16,
            borderTop: `1px solid ${border}`,
          }}
        >
          <span
            style={{
              fontFamily: contentFontFamily,
              fontSize: FOOTER_CONFIG.COPY_SIZE,
              opacity: FOOTER_CONFIG.COPY_OPACITY,
            }}
          >
            {copyright}
          </span>
          <ThemeToggleButton size={isMobile ? 15 : 16} style={{ flexShrink: 0 }} />
        </div>
      </div>
    </motion.footer>
  );
}
