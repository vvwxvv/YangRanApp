"use client";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { LanguageContext } from "@/components/contexts/LanguageContext";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import useData from "@/hooks/useData";
import useFont from "@/hooks/useFont";
import { filterByLanguage } from "@/utils/filterByLanguage";
import AlertInfo from "@/components/alerts/AlertInfo";
import LoadingAnimation from "@/components/animations/LoadingAnimation";
import BackButton from "@/components/buttons/BackButton";
import { ChevronsRight } from "@/components/icons/ChevronsIcon";

// ============================================================================
// ARTWORK ARCHIVE
// ─────────────────────────────────────────────────────────────────────────────
// A clean, single-column archive index grouped by YEAR (YingXinXun list style):
//
//   ● Archive                       ⌕ Search…   Type ▾   Year ▾   Light  Dark
//   | 2026 ▾
//   |   Critical Moment
//   |   Dasein
//   | 2024 ▾
//   | 2023 ▸
//
//   • No grouping tabs — the list is grouped by year.
//   • Borderless filter dropdowns: Type · Year (custom panel, manager-nav look).
//   • Search is an always-visible input box.
//   • Background (light/dark) switch sits at the end.
//   • One left rule runs down the list; year sits above its works.
//
// Fits HuJiemingApp Prisma `Artwork`: year, title, type, medium, series …
// ============================================================================

const UNDATED = "__undated__";

// YingXinXun list metrics (single source of truth for the list visuals).
const LIST = {
  borderWidth: "1px",
  headerPaddingLeft: 0,
  innerMarginLeft: 0,
  innerPaddingLeft: 14,
  itemPaddingLeft: 0,
  indicatorMarginRight: 8,
  rowPaddingY: 6,
  minHeight: 32,
  groupFontSize: 12,
  itemFontSize: 12,
  yearFontSize: 11,
};

// Manager-nav dropdown panel (same shape as ManagerNav's DesktopDropdown).
const ACCENT_W = 3;
const PANEL_MIN_WIDTH = 150;

const panelVariants = {
  hidden: { opacity: 0, y: -6, scaleY: 0.93, transition: { duration: 0.1, ease: [0.4, 0, 1, 1] } },
  visible: { opacity: 1, y: 0, scaleY: 1, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -4, scaleY: 0.96, transition: { duration: 0.1, ease: [0.4, 0, 1, 1] } },
};

// ── helpers ──────────────────────────────────────────────────────────────────
const makeArtworkSlug = (text = "") =>
  String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_-]/gu, "");

const yearValue = (year) => {
  const n = parseInt(year, 10);
  return Number.isNaN(n) ? null : n;
};
// Loose year from a date-ish field (exhibitions/bibliography may have no `year`).
const dateYear = (x) => {
  const d = new Date(x?.date_start || x?.date || x?.published_at || "");
  return isNaN(d.getTime()) ? null : d.getFullYear();
};


const norm = (v) => String(v ?? "").trim();

const uniqueSorted = (values) =>
  [...new Set(values.map(norm).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );

// Newest-year-first ordering (the same rule the year groups use).
const sortByYearDesc = (a, b) => {
  const ay = yearValue(a.year);
  const by = yearValue(b.year);
  if (ay === null && by === null) return norm(a.title).localeCompare(norm(b.title));
  if (ay === null) return 1;
  if (by === null) return -1;
  if (ay !== by) return by - ay;
  return norm(a.title).localeCompare(norm(b.title));
};

// ─────────────────────────────────────────────────────────────────────────────
function ArchiveLoading({ bg }) {
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

function SearchIcon({ color, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.8" />
      <path d="M20 20l-3.6-3.6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// One option row inside a dropdown panel.
function DropdownOption({ option, selected, onSelect, fontFamily, fg, hoverBg }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={() => onSelect(option.value)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: hovered ? hoverBg : "transparent",
        border: "none",
        padding: "9px 14px",
        cursor: "pointer",
        fontFamily,
        fontSize: 12,
        letterSpacing: "0.02em",
        color: fg,
        fontWeight: selected ? 600 : 400,
        transition: "background-color 0.12s ease",
        whiteSpace: "nowrap",
      }}
    >
      {option.label}
    </button>
  );
}

// Custom dropdown — matches the manager-nav dropdown box (not a native select).
function FilterDropdown({ value, options, onChange, allLabel, fontFamily, colors, muted, width, align = "left" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const text = colors.text;
  // Panel follows the THEME: white box in light mode, black in dark mode
  // (same look as the manager-nav dropdown).
  const panelBg = colors.background;
  const panelFg = colors.text;
  const hoverBg = `${colors.text}0D`;

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items = [{ value: "", label: allLabel }, ...options.map((o) => ({ value: o, label: o }))];

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "none",
          border: "none",
          padding: "2px 0",
          cursor: "pointer",
          fontFamily,
          fontSize: 12,
          letterSpacing: "0.03em",
          color: value ? text : muted,
        }}
      >
        <span style={{ minWidth: width, maxWidth: width, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "left" }}>
          {value || allLabel}
        </span>
        <span
          aria-hidden
          style={{
            fontSize: 9,
            opacity: 0.6,
            display: "inline-block",
            transition: "transform 0.15s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▾
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: "absolute",
              top: "100%",
              ...(align === "right" ? { right: 0, left: "auto" } : { left: 0 }),
              marginTop: 8,
              zIndex: 1000,
              minWidth: PANEL_MIN_WIDTH,
              transformOrigin: align === "right" ? "top right" : "top left",
            }}
          >
            <div
              role="listbox"
              style={{
                padding: "4px 0",
                backgroundColor: panelBg,
                color: panelFg,
                borderLeft: `${ACCENT_W}px solid ${panelFg}`,
                borderTop: `1px solid ${panelFg}26`,
                borderRight: `1px solid ${panelFg}26`,
                borderBottom: `1px solid ${panelFg}26`,
                boxShadow: `3px 3px 0px ${text}14, 0 10px 28px ${text}0D`,
                maxHeight: 320,
                overflowY: "auto",
              }}
            >
              {items.map((option) => (
                <DropdownOption
                  key={option.value || "__all__"}
                  option={option}
                  selected={option.value === value}
                  fontFamily={fontFamily}
                  fg={panelFg}
                  hoverBg={hoverBg}
                  onSelect={(v) => {
                    onChange(v);
                    setOpen(false);
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// One archive row:  title  ┊(dashed rule)┊  year — the hover underline
// spans the WHOLE row, not just the title. Works for any archive dataset.
function ArchiveItem({ item, fontFamily, metaFont, color, muted, line, isMobile }) {
  const [hovered, setHovered] = useState(false);
  const rowStyle = {
    position: "relative",
    display: "flex",
    alignItems: "baseline",
    padding: `${LIST.rowPaddingY}px 0`,
    paddingLeft: LIST.itemPaddingLeft,
    minHeight: isMobile ? 40 : LIST.minHeight,
    textDecoration: "none",
    color: "inherit",
  };
  const inner = (
    <>
      <span
        style={{
          flex: isMobile ? "1 1 auto" : "0 1 auto",
          minWidth: 0,
          fontFamily,
          fontSize: LIST.itemFontSize,
          color,
          opacity: hovered ? 1 : 0.85,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          transition: "opacity 0.15s ease",
        }}
      >
        {item.title || "Untitled"}
      </span>

      {!isMobile && (
        <span
          aria-hidden
          style={{
            flex: "1 1 auto",
            minWidth: 16,
            margin: "0 10px",
            borderBottom: `1px dashed ${line}`,
            opacity: hovered ? 0.75 : 0.4,
            transition: "opacity 0.15s ease",
          }}
        />
      )}

      <span style={{ flex: "0 0 auto", marginLeft: isMobile ? 10 : 0, fontFamily: metaFont, fontSize: isMobile ? 11 : 12, color: muted, whiteSpace: "nowrap" }}>
        {item.year ?? ""}
      </span>

      <motion.span
        aria-hidden
        initial={false}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "1px", background: color, transformOrigin: "left", pointerEvents: "none" }}
      />
    </>
  );
  if (!item.href) return <div style={rowStyle}>{inner}</div>;
  return (
    <Link href={item.href} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={rowStyle}>
      {inner}
    </Link>
  );
}

// Group header (YingXinXun SeriesHeader style):  | Label ▾
function GroupHeader({ group, open, onToggle, groupFont, color, isMobile }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      style={{
        display: "flex",
        alignItems: "center",
        padding: `${LIST.rowPaddingY}px 0`,
        paddingLeft: LIST.headerPaddingLeft,
        minHeight: isMobile ? 40 : LIST.minHeight,
        cursor: "pointer",
        opacity: 1,
      }}
    >
      <span
        style={{
          fontFamily: groupFont,
          fontSize: LIST.groupFontSize,
          fontWeight: 600,
          color,
          marginRight: LIST.indicatorMarginRight,
          flexShrink: 0,
        }}
      >
        |
      </span>
      <span style={{ fontFamily: groupFont, fontSize: LIST.groupFontSize, fontWeight: 500, color }}>
        {group.label}
      </span>
      <span
        aria-hidden
        style={{
          marginLeft: 6,
          fontSize: 10,
          color,
          opacity: 0.5,
          display: "inline-block",
          transition: "transform 0.2s ease",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
        }}
      >
        ▸
      </span>
    </div>
  );
}

// List-view icon (three rows) — the archive's view switch.
function ListIcon({ color, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      {[6, 12, 18].map((y) => (
        <g key={y}>
          <circle cx="4.5" cy={y} r="1.5" fill={color} />
          <path d={`M9.5 ${y}h10.5`} stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

// Image-list row (cover in front): cover · title · year (+ venue on mobile).
function ArchiveListRow({ item, isMobile, fontFamily, color, muted, line }) {
  const [hovered, setHovered] = useState(false);
  const cell = { fontFamily, fontSize: 12, lineHeight: 1.5, color };
  const rowStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "96px minmax(0, 1fr)" : "150px minmax(0, 1fr) 80px",
    columnGap: isMobile ? 12 : 24,
    rowGap: 8,
    alignItems: "center",
    padding: "16px 0",
    borderBottom: `1px solid ${line}`,
    textDecoration: "none",
    color: "inherit",
    opacity: hovered ? 0.8 : 1,
    transition: "opacity 0.15s ease",
  };
  const inner = (
    <>
      <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden", backgroundColor: "rgba(0,0,0,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {item.cover ? (
          <img src={item.cover} alt={item.title || ""} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <span style={{ fontFamily, fontSize: 10, color: muted, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.1em" }}>No Image</span>
        )}
      </div>
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ ...cell, fontWeight: 500 }}>{item.title || "Untitled"}</span>
          <span style={{ ...cell, color: muted }}>{[item.year, item.venue].filter(Boolean).join(" · ")}</span>
        </div>
      ) : (
        <>
          <span style={cell}>{item.title || "Untitled"}</span>
          <span style={{ ...cell, color: muted, textAlign: "right" }}>{item.year || ""}</span>
        </>
      )}
    </>
  );
  if (!item.href) return <div style={rowStyle}>{inner}</div>;
  return (
    <Link href={item.href} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={rowStyle}>
      {inner}
    </Link>
  );
}

// Home-style »» arrow — acts as the "back to home page" button.
function HomeArrow({ onClick, isMobile, text }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Back to home"
      title="Back to home"
      style={{
        background: "none",
        border: "none",
        padding: 2,
        margin: 0,
        cursor: "pointer",
        color: text,
        lineHeight: 0,
        flexShrink: 0,
        opacity: hover ? 0.55 : 1,
        transition: "opacity 0.2s ease",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
      }}
    >
      <ChevronsRight size={isMobile ? 22 : 26} stroke={2.6} />
    </button>
  );
}

// Tab button — bold label, black underline on hover AND when active.
function TabButton({ active, label, onClick, isMobile, text, muted, fontFamily }) {
  const [hover, setHover] = useState(false);
  const show = active || hover;
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-pressed={active}
      style={{
        background: "none",
        border: "none",
        padding: "4px 0",
        margin: 0,
        cursor: "pointer",
        fontFamily,
        fontSize: isMobile ? 14 : 15,
        letterSpacing: "0.03em",
        color: show ? text : muted,
        fontWeight: active ? 700 : 600,
        borderBottom: `1px solid ${show ? text : "transparent"}`,
        transition: "color 0.15s ease, border-color 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}

// ============================================================================
// Main component
// ============================================================================
export default function ArchivePageComponent({ artworks: artworksProp = null }) {
  const { isCn } = useContext(LanguageContext);
  const { isMobile } = useContext(DeviceContext);
  const router = useRouter();

  // ── Typography roles (lib/typography.js) — families via useFont(role). ──
  const { fontFamily: titleFont } = useFont("detailTitle");
  const { fontFamily: groupFont } = useFont("artworkCardArtist");
  const { fontFamily: itemFont } = useFont("artworkCardCaption");
  const { fontFamily: metaFont } = useFont("artworkCardMeta");
  const { fontFamily: descFont } = useFont("detailBody");
  const { fontFamily: labelFont } = useFont("label");
  const { fontFamily: inputFont } = useFont("input");
  const { colors, isDark } = useReverseTheme();

  const text = colors.text;
  const bg = colors.background;
  const line = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)";
  const muted = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";

  // NOTE: left gutter intentionally == MainNav's bar padding so the app title
  // (brand) lines up with every label on this page.
  const GUTTER = isMobile ? 16 : 50;

  // ── Tabs: Artwork · Exhibition · Bibliography ──
  const TABS = [
    { key: "artwork", label: isCn ? "作品" : "Artwork" },
    { key: "exhibition", label: isCn ? "展览" : "Exhibition" },
    { key: "bibliography", label: isCn ? "文献" : "Bibliography" },
  ];
  const [tab, setTab] = useState("artwork");
  const switchTab = (key) => {
    if (key === tab) return;
    setTab(key);
    setTypeFilter("");
    setYearFilter("");
    setQuery("");
    setOpenKeys(null);
  };

  // ── Data ──
  const usingProp = !!artworksProp;
  const { data: aData = [], isLoading: aLoading, error, refetch } = useData(usingProp ? null : "/api/artwork");
  const { data: eData = [], isLoading: eLoading } = useData("/api/exhibition");
  const { data: bData = [], isLoading: bLoading } = useData("/api/bibliography");
  const rawArtworks = artworksProp || aData;

  const toEntries = (arr, kind) =>
    filterByLanguage(Array.isArray(arr) ? arr : [], isCn)
      .filter((x) => x && x.title)
      .map((x) => ({
        id: x.id || x._id,
        title: x.title,
        year: yearValue(x.year) ?? dateYear(x),
        type: norm(x.type),
        cover: x.cover_img_url || x.cover_image_url || "",
        venue: norm(x.venue) || norm(x.location),
        href:
          kind === "artwork"
            ? `/artworks/${makeArtworkSlug(x.title)}`
            : kind === "exhibition"
            ? `/exhibitions/${makeArtworkSlug(x.title)}`
            : null,
      }));

  const entriesByTab = {
    artwork: toEntries(rawArtworks, "artwork"),
    exhibition: toEntries(eData, "exhibition"),
    bibliography: toEntries(bData, "bibliography"),
  };
  const entries = entriesByTab[tab];
  const loading = { artwork: aLoading, exhibition: eLoading, bibliography: bLoading }[tab];

  // ── UI state ──
  const [typeFilter, setTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [query, setQuery] = useState("");
  const [openKeys, setOpenKeys] = useState(null);
  const [view, setView] = useState("year"); // "year" (timeline) | "list" (image rows)

  const typeOptions = useMemo(() => uniqueSorted(entries.map((e) => e.type)), [entries]);
  const yearOptions = useMemo(
    () => [...new Set(entries.map((e) => e.year).filter((y) => y !== null))].sort((a, b) => b - a).map(String),
    [entries]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (typeFilter && e.type !== typeFilter) return false;
      if (yearFilter && String(e.year ?? "") !== yearFilter) return false;
      if (q && !String(e.title).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [entries, typeFilter, yearFilter, query]);

  const listItems = useMemo(() => [...filtered].sort(sortByYearDesc), [filtered]);

  const groups = useMemo(() => {
    const map = new Map();
    for (const e of filtered) {
      const key = e.year === null ? UNDATED : String(e.year);
      const label = e.year === null ? (isCn ? "未注明年份" : "Undated") : String(e.year);
      if (!map.has(key)) map.set(key, { key, label, items: [] });
      map.get(key).items.push(e);
    }
    const list = [...map.values()];
    list.sort((a, b) => {
      const av = a.key === UNDATED ? -Infinity : Number(a.key);
      const bv = b.key === UNDATED ? -Infinity : Number(b.key);
      return bv - av;
    });
    list.forEach((g) => g.items.sort(sortByYearDesc));
    return list;
  }, [filtered, isCn]);

  const filtering = !!(typeFilter || yearFilter || query);
  const openSet = useMemo(() => {
    if (filtering) return new Set(groups.map((g) => g.key));
    if (openKeys) return new Set(openKeys);
    return new Set(groups.slice(0, 2).map((g) => g.key));
  }, [filtering, groups, openKeys]);

  const toggleGroup = (key) =>
    setOpenKeys((prev) => {
      const base = prev ?? (filtering ? groups.map((g) => g.key) : groups.slice(0, 2).map((g) => g.key));
      return base.includes(key) ? base.filter((k) => k !== key) : [...base, key];
    });

  const clearFilters = () => {
    setTypeFilter("");
    setYearFilter("");
    setQuery("");
  };
  const hasFilters = !!(typeFilter || yearFilter || query);

  const heading = isCn ? "档案" : "Archive";

  const themeToggleStyle = (active) => ({
    background: "none",
    border: "none",
    padding: "2px 0",
    cursor: "pointer",
    fontFamily: labelFont,
    fontSize: 12,
    letterSpacing: "0.03em",
    color: active ? text : muted,
    borderBottom: active ? `1px solid ${text}` : "1px solid transparent",
    transition: "color 0.15s ease, border-color 0.15s ease",
  });

  if (!usingProp && error && tab === "artwork") {
    return (
      <div style={{ backgroundColor: bg, color: text, minHeight: "100vh", width: "100%" }}>
        <AlertInfo
          message={isCn ? "加载失败" : "Loading Failed"}
          subMessage={isCn ? "请重试" : "Please retry"}
          buttonText={isCn ? "重试" : "Retry"}
          onBack={refetch || (() => window.location.reload())}
          isCn={isCn}
        />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: bg, color: text, minHeight: "100vh", width: "100%" }}>
      <div style={{ width: "100%", padding: `${isMobile ? 20 : 34}px ${GUTTER}px 100px` }}>

        {/* Switch row — rule above · tabs (left) · » back-to-home (right) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            borderTop: `1px solid ${text}`,
            paddingTop: isMobile ? 14 : 18,
            marginBottom: isMobile ? 22 : 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: isMobile ? 12 : 18 }}>
            {TABS.map((t, i) => (
              <React.Fragment key={t.key}>
                {i > 0 && (
                  <span aria-hidden style={{ color: text, fontSize: isMobile ? 13 : 14 }}>
                    |
                  </span>
                )}
                <TabButton
                  active={tab === t.key}
                  label={t.label}
                  onClick={() => switchTab(t.key)}
                  isMobile={isMobile}
                  text={text}
                  muted={muted}
                  fontFamily={labelFont}
                />
              </React.Fragment>
            ))}
          </div>
          <HomeArrow onClick={() => router.push("/")} isMobile={isMobile} text={text} />
        </div>

        {/* Header: ● Archive (left edge) · search + filters + view (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", paddingBottom: 12, borderBottom: `1px solid ${text}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: text, display: "inline-block" }} />
            <h1 style={{ fontFamily: titleFont, fontSize: isMobile ? 18 : 20, fontWeight: 500, letterSpacing: "0.01em", margin: 0, color: text }}>
              {heading}
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 14 : 22, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, borderBottom: `1px solid ${hasFilters && query ? text : line}`, paddingBottom: 3 }}>
              <SearchIcon color={muted} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isCn ? "搜索…" : "Search…"}
                aria-label={isCn ? "搜索" : "Search"}
                style={{ width: isMobile ? 110 : 150, background: "transparent", border: "none", outline: "none", color: text, fontFamily: inputFont, fontSize: 12, letterSpacing: "0.02em", padding: "2px 0" }}
              />
            </div>

            <FilterDropdown value={typeFilter} onChange={setTypeFilter} options={typeOptions} allLabel={isCn ? "类型：全部" : "Type: All"} fontFamily={labelFont} colors={colors} muted={muted} width={100} />
            <FilterDropdown value={yearFilter} onChange={setYearFilter} options={yearOptions} allLabel={isCn ? "年份：全部" : "Year: All"} fontFamily={labelFont} colors={colors} muted={muted} width={60} align="right" />

            {hasFilters && (
              <button onClick={clearFilters} style={themeToggleStyle(false)}>
                {isCn ? "清除" : "Clear"}
              </button>
            )}

            <button
              onClick={() => setView((v) => (v === "year" ? "list" : "year"))}
              aria-label={view === "list" ? (isCn ? "按年份视图" : "Year view") : isCn ? "列表视图" : "List view"}
              aria-pressed={view === "list"}
              style={{ background: "none", border: "none", padding: 2, cursor: "pointer", display: "inline-flex", alignItems: "center", color: view === "list" ? text : muted }}
            >
              <ListIcon color={view === "list" ? text : muted} />
            </button>
          </div>
        </div>

        {/* ── List (50px below the title row) ── */}
        <div style={{ marginTop: 50 }}>
          {loading ? (
            <div style={{ padding: "48px 0", display: "flex", justifyContent: "center" }}>
              <LoadingAnimation isLoading />
            </div>
          ) : view === "list" ? (
            listItems.length === 0 ? (
              <p style={{ fontFamily: descFont, fontSize: 13, color: muted }}>{isCn ? "暂无内容" : "Nothing here"}</p>
            ) : (
              listItems.map((item, i) => (
                <ArchiveListRow key={item.id || i} item={item} isMobile={isMobile} fontFamily={itemFont} color={text} muted={muted} line={line} />
              ))
            )
          ) : groups.length === 0 ? (
            <p style={{ fontFamily: descFont, fontSize: 13, color: muted }}>{isCn ? "暂无内容" : "Nothing here"}</p>
          ) : (
            groups.map((group) => {
              const open = openSet.has(group.key);
              return (
                <div key={group.key}>
                  <GroupHeader group={group} open={open} onToggle={() => toggleGroup(group.key)} groupFont={groupFont} color={text} isMobile={isMobile} />

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="items"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ borderLeft: `${LIST.borderWidth} solid ${line}`, marginLeft: LIST.innerMarginLeft, paddingLeft: LIST.innerPaddingLeft }}>
                          {group.items.map((item, i) => (
                            <ArchiveItem key={item.id || i} item={item} fontFamily={itemFont} metaFont={metaFont} color={text} muted={muted} line={line} isMobile={isMobile} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
