"use client";

import React from "react";
import { Box } from "@mui/material";
import useFont from "@/hooks/useFont";
import { MapPin, Youtube, Instagram, Globe } from "lucide-react";
// Email + phone use Material icons to match the reference art:
//   Email    → filled envelope
//   PhoneIphone → smartphone with a home dot
import EmailIcon from "@mui/icons-material/Email";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

/**
 * ContactInfo — icon-based contact block (no text labels).
 *
 * Design note: bare glyph icons (no circle / border) keep the block clean,
 * younger and more efficient. Same block is shared by the About page and the
 * Contact page.
 *
 * Rows render in this order: phone → email → address → social media,
 * followed by the opening-hours line (bold).
 */

// ─────────────────────────────────────────────────────────────────────────────
//  TOKENS — visual config for the whole block (override via props if needed)
// ─────────────────────────────────────────────────────────────────────────────
export const CONTACT_TOKENS = Object.freeze({
  rowGap: "12px", // vertical gap between rows
  icon: {
    size: 16, // glyph size (px) — icons render bare, no circle
    strokeWidth: 1.6, // glyph stroke width
    gap: "10px", // icon ↔ text gap
    opacity: 0.75, // resting icon opacity (→ 1 on hover)
  },
  text: {
    size: "12px",
    weight: 400,
    opacity: 0.72,
    letterSpacing: "-0.01em",
  },
  hours: {
    weight: 700,
    opacity: 1,
    marginTop: "26px",
    letterSpacing: "-0.01em",
  },
});

// ─────────────────────────────────────────────────────────────────────────────
//  Icons
// ─────────────────────────────────────────────────────────────────────────────

// Platforms we do NOT render. The 小红书 / RED logo is unreadable at this size
// and the block is mostly for overseas visitors — YouTube + Instagram suffice.
export const isHiddenPlatform = (platform) => {
  const k = String(platform || "").toLowerCase();
  return (
    k.includes("xiaohong") ||
    k.includes("小红书") ||
    k.includes("小紅書") ||
    k.trim() === "red"
  );
};

// platform string → icon key (lenient: handles EN/CN and old/new naming)
export const resolveIconKey = (platform) => {
  const k = String(platform || "").toLowerCase();
  if (k.includes("you")) return "youtube";
  if (k.includes("insta")) return "instagram";
  return "globe";
};

// Per-glyph bounding box (in the shared 24-unit icon grid) used to normalise
// each icon's OPTICAL size — otherwise a wide square glyph (Instagram) reads
// bigger than a narrow one (YouTube / the phone) even though the boxes match.
const GLYPH_BBOX = {
  phone: [13, 22],
  email: [20, 16],
  address: [16, 20],
  youtube: [20, 14.1],
  instagram: [20, 20],
  globe: [20, 20],
};
const OPTICAL_TARGET = 18; // target √(w·h) in the 24-unit grid (≈ 12px @ size 16)
const opticalScale = (name) => {
  const b = GLYPH_BBOX[name];
  if (!b) return 1;
  const geo = Math.sqrt(b[0] * b[1]);
  return geo > 0 ? OPTICAL_TARGET / geo : 1;
};

export const ContactIcon = ({ name }) => {
  const { size, strokeWidth, opacity } = CONTACT_TOKENS.icon;
  const lucideProps = { size, strokeWidth, absoluteStrokeWidth: true };

  let inner;
  switch (name) {
    case "phone":
      inner = <PhoneIphoneIcon sx={{ fontSize: size }} />;
      break;
    case "email":
      inner = <EmailIcon sx={{ fontSize: size }} />;
      break;
    case "address":
      inner = <MapPin {...lucideProps} />;
      break;
    case "youtube":
      inner = <Youtube {...lucideProps} />;
      break;
    case "instagram":
      inner = <Instagram {...lucideProps} />;
      break;
    case "globe":
    default:
      inner = <Globe {...lucideProps} />;
      break;
  }

  const scale = opticalScale(name);

  return (
    <Box
      component="span"
      aria-hidden="true"
      className="moodsea-contact-icon"
      sx={{
        flex: "0 0 auto",
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.2s ease",
      }}
    >
      {/* optical-size normaliser — every glyph reads the same size */}
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 0,
          transform: `scale(${scale})`,
        }}
      >
        {inner}
      </Box>
    </Box>
  );
};

export const ContactRow = React.memo(function ContactRow({ icon, children, href, fontFamily, style }) {
  const { gap } = CONTACT_TOKENS.icon;
  const content = (
    <>
      <ContactIcon name={icon} />
      <span style={{ minWidth: 0, wordBreak: "break-word" }}>{children}</span>
    </>
  );

  const rowStyle = {
    fontFamily,
    fontSize: CONTACT_TOKENS.text.size,
    fontWeight: CONTACT_TOKENS.text.weight,
    letterSpacing: CONTACT_TOKENS.text.letterSpacing,
    opacity: CONTACT_TOKENS.text.opacity,
    display: "flex",
    alignItems: "center",
    gap,
    lineHeight: 1.5,
    ...style,
  };

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="moodsea-contact-row"
        style={{ ...rowStyle, color: "inherit", textDecoration: "none" }}
      >
        {content}
      </a>
    );
  }

  return (
    <div className="moodsea-contact-row" style={rowStyle}>
      {content}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
//  Data helper
// ─────────────────────────────────────────────────────────────────────────────
export function normalizeContact(raw) {
  if (!raw) return null;
  const rawSocial = raw.social_media ?? raw.socialMedia ?? [];
  const socialMedia = Array.isArray(rawSocial)
    ? rawSocial.filter((s) => s && (s.platform || s.account || s.url))
    : [];
  return {
    phone: raw.phone ?? "",
    email: raw.email ?? "",
    address: Array.isArray(raw.address) ? raw.address.join(", ") : raw.address ?? "",
    openingTime: raw.opening_time ?? raw.openingTime ?? "",
    socialMedia,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  ContactInfo
// ─────────────────────────────────────────────────────────────────────────────
export default function ContactInfo({ contact, fontFamily: fontFamilyProp, rowGap, hoursMarginTop, sx }) {
  // Font family comes from the typography lib (lib/typography.js via useFont) —
  // "exhibitionCaption", the same role the About body uses. A `fontFamily`
  // prop may still override it.
  const { fontFamily: libFontFamily } = useFont("exhibitionCaption");
  const fontFamily = fontFamilyProp || libFontFamily;

  const info = React.useMemo(() => normalizeContact(contact), [contact]);
  if (!info) return null;

  const { phone, email, address, openingTime, socialMedia } = info;
  const gap = rowGap ?? CONTACT_TOKENS.rowGap;
  // 小红书 / RED etc. are filtered out entirely (see isHiddenPlatform).
  const visibleSocial = socialMedia.filter((s) => !isHiddenPlatform(s.platform));
  const hasRows = phone || email || address || visibleSocial.length;
  if (!hasRows && !openingTime) return null;

  const hoursStyle = {
    fontFamily,
    fontSize: CONTACT_TOKENS.text.size,
    fontWeight: CONTACT_TOKENS.hours.weight,
    opacity: CONTACT_TOKENS.hours.opacity,
    margin: `${hoursMarginTop ?? CONTACT_TOKENS.hours.marginTop} 0 0 0`,
    letterSpacing: CONTACT_TOKENS.hours.letterSpacing,
  };

  return (
    <Box
      sx={{
        "& .moodsea-contact-row:hover .moodsea-contact-icon": { opacity: 1 },
        ...sx,
      }}
    >
      {phone && (
        <ContactRow icon="phone" href={`tel:${phone}`} fontFamily={fontFamily} style={{ marginBottom: gap }}>
          {phone}
        </ContactRow>
      )}
      {email && (
        <ContactRow icon="email" href={`mailto:${email}`} fontFamily={fontFamily} style={{ marginBottom: gap }}>
          {email}
        </ContactRow>
      )}
      {address && (
        <ContactRow icon="address" fontFamily={fontFamily} style={{ marginBottom: gap }}>
          {address}
        </ContactRow>
      )}
      {visibleSocial.map((s, i) => (
        <ContactRow
          key={`${s.platform || "social"}-${i}`}
          icon={resolveIconKey(s.platform)}
          href={s.url || undefined}
          fontFamily={fontFamily}
          style={{ marginBottom: gap }}
        >
          {s.account || s.url || s.platform}
        </ContactRow>
      ))}
      {openingTime && <p style={hoursStyle}>{openingTime}</p>}
    </Box>
  );
}
