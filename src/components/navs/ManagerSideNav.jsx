"use client";

/**
 * Manager menu — one icon in the top bar, drawer slides in from the left.
 *
 * Same interaction as the public home page: the icon IS the menu control, it
 * morphs into an while the drawer is open, and there is no text label next
 * to it. Nothing is pinned to the side; content keeps the full width.
 *
 * The list is the manager menu from the Meta document, grouped by its top-level
 * items (built-in settings pages are injected at read time).
 */

import React, { useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import useSiteMeta from "@/hooks/useSiteMeta";
import useFont from "@/hooks/useFont";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import { getManagerSections } from "@/lib/managerMenu";
import { getBrandName } from "@/utils/artistUtils";
import LanguageSwitcherInMenu from "@/components/switchers/LanguageSwitcherInMenu";

const BAR_HEIGHT = 52;

const isActiveHref = (pathname, href) => {
  if (!href) return false;
  if (pathname === href) return true;
  return pathname.startsWith(`${href.replace(/\/$/, "")}/`);
};

/** Three lines ↔ (same morph as the public nav). */
function MorphMenuIcon({ open, size = 24, stroke = 1.6, color = "currentColor", duration = 0.42 }) {
  const lineStyle = {
    transformBox: "view-box",
    transformOrigin: "12px 12px",
    transition: `transform ${duration}s cubic-bezier(0.76, 0, 0.24, 1), opacity ${duration * 0.65}s ease`,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", overflow: "visible" }}
    >
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        style={{ ...lineStyle, transform: open ? "translateY(0) rotate(45deg)" : "translateY(-6px) rotate(0deg)" }}
      />
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        style={{ ...lineStyle, opacity: open ? 0 : 1, transform: open ? "scaleX(0.2)" : "scaleX(1)" }}
      />
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        style={{ ...lineStyle, transform: open ? "translateY(0) rotate(-45deg)" : "translateY(6px) rotate(0deg)" }}
      />
    </svg>
  );
}

function Chevron({ open }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      aria-hidden="true"
      style={{
        transform: open ? "rotate(0deg)" : "rotate(-90deg)",
        transition: "transform .22s ease",
      }}
    >
      <path d="M1 3 L5 7 L9 3" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function Accordion({ id, label, items, pathname, font, onNavigate }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 22 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          all: "unset",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          minHeight: 42,
          padding: "8px 6px",
          boxSizing: "border-box",
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
          touchAction: "manipulation",
          fontFamily: font,
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#000",
        }}
      >
        <span>{label}</span>
        <Chevron open={open} />
      </button>

      {open && (
        <div
          style={{
            borderLeft: "1px solid #cfcfcf",
            paddingLeft: 14,
            paddingTop: 2,
            paddingBottom: 2,
          }}
        >
          {items.map((item) => {
            const active = isActiveHref(pathname, item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  minHeight: 40,
                  padding: "4px 6px",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                  fontFamily: font,
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "#000",
                  textDecoration: "none",
                  borderBottom: "none",
                  fontWeight: active ? 700 : 400,
                  transition: "font-weight .18s ease",
                }}
                className="msn-link"
              >
                <span className="msn-link-text">{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MenuBody({ sections, pathname, font, onNavigate, isCn }) {
  const SETTINGS_ORDER = ["/manager/form-settings", "/manager/meta"];
  const SPECIAL = new Set([...SETTINGS_ORDER, "/manager/about", "/manager/resume", "/manager/artist-contact"]);

  const all = sections.flatMap((section) => section.items);
  const byHref = new Map(all.map((item) => [item.href, item]));

  const about = byHref.get("/manager/about");
  const resume = byHref.get("/manager/resume");
  const contact = byHref.get("/manager/artist-contact");
  const settings = SETTINGS_ORDER.map((href) => byHref.get(href)).filter(Boolean);

  const groups = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !SPECIAL.has(item.href)),
    }))
    .filter((section) => section.items.length > 0);

  const generalItems = [
    about,
    resume,
    contact && { ...contact, label: isCn ? "联系" : "Contact" },
  ].filter(Boolean);

  return (
    <nav aria-label="Manager" style={{ display: "flex", flexDirection: "column", flex: 1, overflowY: "auto", minHeight: 0 }}>
      {generalItems.length > 0 && (
        <Accordion
          id="about"
          label={isCn ? "关于" : "ABOUT"}
          items={generalItems}
          pathname={pathname}
          font={font}
          onNavigate={onNavigate}
        />
      )}

      {groups.map((section) => (
        <Accordion
          key={section.key}
          id={section.key}
          label={section.label}
          items={section.items}
          pathname={pathname}
          font={font}
          onNavigate={onNavigate}
        />
      ))}

      {settings.length > 0 && (
        <Accordion
          id="settings"
          label={isCn ? "设置" : "SETTINGS"}
          items={settings}
          pathname={pathname}
          font={font}
          onNavigate={onNavigate}
        />
      )}
    </nav>
  );
}

export default function ManagerSideNav() {
  const { isCn } = useContext(LanguageContext);
  const { colors } = useReverseTheme();
  const { contentFontFamily } = useFont();
  const { fontFamily: brandFont } = useFont("artistName");
  const pathname = usePathname() || "";
  const { meta } = useSiteMeta();
  const brandName = getBrandName(isCn);

  const sections = useMemo(() => getManagerSections(isCn, meta?.menu), [isCn, meta?.menu]);

  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <style>{`
        .msn-link {
          position: relative;
          border-bottom: 2px solid transparent;
          border-radius: 0;
          transition: background-color .12s ease, font-weight .18s ease;
        }
        .msn-link:hover { background-color: rgba(0, 0, 0, 0.045); }
        .msn-link:active { background-color: rgba(0, 0, 0, 0.09); }
        /* Hover rule: a black line grows out of the centre, exactly under the
           label (not the full row). */
        .msn-link-text {
          position: relative;
          display: inline-block;
        }
        .msn-link-text::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -6px;
          height: 2px;
          background: #000;
          transform: scaleX(0);
          transform-origin: center center;
          transition: transform .34s cubic-bezier(.22, 1, .36, 1);
          pointer-events: none;
        }
        .msn-link:hover .msn-link-text::after,
        .msn-link:focus-visible .msn-link-text::after { transform: scaleX(1); }
        .msn-link[aria-current="page"] { border-bottom-color: #000; }

        /* …and the label gives a tiny shake while the line draws. */
        @keyframes msn-nudge {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-1.6px); }
          40% { transform: translateX(1.4px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(.8px); }
        }
        .msn-link:hover .msn-link-text,
        .msn-link:focus-visible .msn-link-text {
          animation: msn-nudge .42s cubic-bezier(.36, .07, .19, .97);
        }

 /* Close — black, pinned right, half turn on hover. */
        .msn-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: -10px;
          padding: 6px;
          border: 0;
          background: none;
          cursor: pointer;
          color: #000 !important;
          line-height: 0;
          transform: rotate(0deg);
          transition: transform .45s cubic-bezier(.4, 0, .2, 1);
          -webkit-tap-highlight-color: transparent;
        }
        .msn-close:hover { transform: rotate(180deg); }

        /* Icon-only trigger: pure black at rest, lifts on hover like a nav item. */
        .msn-trigger {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: 0;
          margin: 0;
          padding: 6px;
          cursor: pointer;
          line-height: 0;
          color: #000;
          transform: scale(1);
          transition: transform .22s cubic-bezier(.4, 0, .2, 1);
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .msn-trigger:hover { transform: scale(1.12); }
        .msn-trigger:active { transform: scale(0.96); }
      `}</style>

      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: `${BAR_HEIGHT}px`,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: { xs: 1.5, md: 2.5 },
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.border}`,
          zIndex: 1200,
        }}
      >
        <button
          type="button"
          className="msn-trigger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? (isCn ? "关闭菜单" : "Close menu") : isCn ? "打开菜单" : "Open menu"}
          aria-expanded={open}
        >
          <MorphMenuIcon open={open} size={21} stroke={1.6} color="#000" />
        </button>

        {/* Artist wordmark, centred — same treatment as the public bar. */}
        <Link
          href="/manager/artwork"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            textDecoration: "none",
            color: "#000",
            fontFamily: brandFont,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            lineHeight: 1,
            whiteSpace: "nowrap",
            pointerEvents: "auto",
            // Bigger click target, same optical position.
            padding: "8px 6px",
            marginTop: -8,
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {brandName}
        </Link>

        <span style={{ flex: 1 }} />

        <LanguageSwitcherInMenu sx={{ position: "static", top: "auto", right: "auto" }} />
      </Box>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="left"
        hideBackdrop
        // With no backdrop the page stays visible; a click on the empty area
        // (the modal root itself) still closes the menu.
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
        // Above the top bar: the menu is a full-height panel, not a sheet
        // tucked under the header. The modal root must stay transparent —
        // otherwise it paints a full-screen sheet and hides the page.
        sx={{ zIndex: 1300, backgroundColor: "transparent" }}
        PaperProps={{
          sx: {
            width: "min(86vw, 340px)",
            backgroundColor: colors.background,
            color: colors.text,
            px: 3,
            pt: 2,
            pb: 3,
            height: "100dvh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Drawer header: dashboard mark + “Manager”, close on the right. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 18,
            paddingBottom: 12,
            borderBottom: "2px solid #000",
          }}
        >
          <DashboardOutlinedIcon sx={{ fontSize: 22, color: "#000" }} />
          <span
            style={{
              fontFamily: contentFontFamily,
              fontSize: 23,
              fontWeight: 600,
              letterSpacing: "0.01em",
              color: "#000",
              lineHeight: 1,
            }}
          >
            Manager
          </span>
          <button
            type="button"
            className="msn-close"
            onClick={() => setOpen(false)}
            aria-label={isCn ? "关闭菜单" : "Close menu"}
            style={{ marginLeft: "auto" }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        <MenuBody
          sections={sections}
          pathname={pathname}
          colors={colors}
          font={contentFontFamily}
          onNavigate={() => setOpen(false)}
          isCn={isCn}
        />
      </Drawer>
    </>
  );
}

export { BAR_HEIGHT };
