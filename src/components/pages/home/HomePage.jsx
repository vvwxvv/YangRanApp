"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { LanguageContext } from "@/components/contexts/LanguageContext";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import useFont from "@/hooks/useFont";
import useData from "@/hooks/useData";
import { useWindowSize } from "@/hooks/useWindowSize";
import { filterByLanguage } from "@/utils/filterByLanguage";
import LoadingAnimation from "@/components/animations/LoadingAnimation";
import {
  isCurrentExhibition,
  parseExhibitionDate,
} from "@/components/pages/exhibition/utils/exhibitionDates";

/* ══════════════════════════════════════════════════════════════════════════
   HOME GRID — change these numbers to control the artwork grid.
   ──────────────────────────────────────────────────────────────────────────
   MAX_COLUMNS     → the most columns the grid may use (desktop cap)
   MIN_CARD_WIDTH  → smallest a card may get before dropping a column
   The actual column count is calculated from the viewport width:
   phone → 1, tablet → 2, desktop → up to MAX_COLUMNS.
   ══════════════════════════════════════════════════════════════════════════ */
const HOME_GRID = Object.freeze({
  MAX_COLUMNS: 4,
  MIN_CARD_WIDTH: 240,
  PAGE_PADDING: 40,
  PAGE_PADDING_MOBILE: 16,
  COLUMN_GAP: 18,
  COLUMN_GAP_MOBILE: 16,
  ROW_GAP: 30,
  ROW_GAP_MOBILE: 30,
});

// Smart responsive columns: fit as many MIN_CARD_WIDTH cards as the viewport
// allows, never exceeding MAX_COLUMNS, and always at least one.
const homeColumns = (viewportWidth, isMobile) => {
  const padding = isMobile
    ? HOME_GRID.PAGE_PADDING_MOBILE
    : HOME_GRID.PAGE_PADDING;
  const available = Math.max(0, viewportWidth - padding * 2);
  const fit = Math.floor(available / HOME_GRID.MIN_CARD_WIDTH);
  return Math.max(1, Math.min(HOME_GRID.MAX_COLUMNS, fit || 1));
};

/* ══════════════════════════════════════════════════════════════════════════
   HOME — Harvard Film Archive-style archive index
   ──────────────────────────────────────────────────────────────────────────
   Layout, top → bottom:
     1. black header (rendered by MainNav on "/") — menu · wordmark · search
     2. full-bleed hero still, with a "NOW PLAYING" paper tab bottom-right
     3. ○ date range + big condensed uppercase title
     4. bordered TODAY / TOMORROW / WEEKDAY strip (current + upcoming)
     5. configurable artwork grid (see HOME_GRID above) — image, type · year, title
     6. UPCOMING EXHIBITIONS list + a wide still
   Data still comes from /api/artwork + /api/exhibition (+ /api/image for
   cover fallbacks); nothing here writes to the database.
   ══════════════════════════════════════════════════════════════════════════ */

const T = {
  nowPlaying: { en: "Now Playing", cn: "正在展出" },
  upcomingTag: { en: "Upcoming", cn: "即将展出" },
  recentWork: { en: "Recent Work", cn: "近期作品" },
  today: { en: "Today", cn: "今天" },
  tomorrow: { en: "Tomorrow", cn: "明天" },
  onView: { en: "On view", cn: "展出中" },
  opening: { en: "Opening", cn: "开幕" },
  upcoming: { en: "Upcoming Exhibitions", cn: "即将展出" },
  onViewSection: { en: "On View", cn: "正在展出" },
  allWorks: { en: "All artworks", cn: "全部作品" },
  empty: { en: "Nothing here yet.", cn: "暂无内容。" },
  noWorks: { en: "No artworks", cn: "暂无作品" },
  undated: { en: "Undated", cn: "年份未详" },
};

const pick = (pair, isCn) => (isCn ? pair.cn : pair.en);

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS_EN = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];
const WEEKDAYS_CN = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

const slugify = (text) =>
  String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_-]/gu, "");

const normalizeTag = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const artworkHref = (a) => `/artworks/${slugify(a?.title)}`;
const exhibitionHref = (e) => `/exhibitions/${slugify(e?.title)}`;

const yearValue = (item) => {
  const n = parseInt(item?.year, 10);
  return Number.isNaN(n) ? null : n;
};

const byYearDesc = (a, b) => {
  const ay = yearValue(a);
  const by = yearValue(b);
  if (ay === null && by === null) return 0;
  if (ay === null) return 1;
  if (by === null) return -1;
  return by - ay;
};

const startTimeOf = (ex) => {
  const d = parseExhibitionDate(ex?.date_start) || parseExhibitionDate(ex?.year);
  return d ? d.getTime() : Number.POSITIVE_INFINITY;
};

const byStartAsc = (a, b) => startTimeOf(a) - startTimeOf(b);

/**
 * Home-page "running now" rule. `isCurrentExhibition` treats any record with a
 * future end date as current, which wrongly labels an exhibition that has not
 * opened yet as ON VIEW. Here the start must also have passed.
 */
const isRunningExhibition = (ex) => {
  const now = Date.now();
  const start = parseExhibitionDate(ex?.date_start) || parseExhibitionDate(ex?.year);
  const end = parseExhibitionDate(ex?.date_end);
  if (start && start.getTime() > now) return false;
  if (end) {
    const endOfDay = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate(),
      23,
      59,
      59
    ).getTime();
    return endOfDay >= now;
  }
  if (start) return true;
  return isCurrentExhibition(ex);
};

const two = (n) => String(n).padStart(2, "0");

const formatClock = (date, isCn) => {
  if (!date) return "";
  const h = date.getHours();
  const m = date.getMinutes();
  if (!h && !m) return "";
  if (isCn) return `${h}:${two(m)}`;
  const suffix = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 || 12;
  return `${hour12}${m ? `:${two(m)}` : ""} ${suffix}`;
};

/** "September 11–October 30" / "2025年9月11日–10月30日". */
const rangeLabel = (item, isCn) => {
  const start = parseExhibitionDate(item?.date_start) || parseExhibitionDate(item?.year);
  const end = parseExhibitionDate(item?.date_end);
  if (!start && !end) return item?.year || pick(T.undated, isCn);

  const one = (d, withYear) => {
    if (!d) return "";
    if (isCn) return `${withYear ? `${d.getFullYear()}年` : ""}${d.getMonth() + 1}月${d.getDate()}日`;
    return `${MONTHS_EN[d.getMonth()]} ${d.getDate()}${withYear ? `, ${d.getFullYear()}` : ""}`;
  };

  if (start && end) {
    const withYear = start.getFullYear() !== end.getFullYear();
    return `${one(start, withYear)}–${one(end, withYear)}`;
  }
  return one(start || end, true);
};

/** Relative day label used in the schedule strip. */
const relativeDayLabel = (value, isCn) => {
  const d = parseExhibitionDate(value);
  if (!d) return "";
  const now = new Date();
  const startOf = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const today = startOf(now);
  const target = startOf(d);
  const diff = Math.round((target - today) / 86400000);
  if (diff === 0) return pick(T.today, isCn);
  if (diff === 1) return pick(T.tomorrow, isCn);
  return isCn ? WEEKDAYS_CN[d.getDay()] : WEEKDAYS_EN[d.getDay()];
};

const scheduleTimeLabel = (ex, isCn) => {
  const opening = parseExhibitionDate(ex?.opening_date);
  const clock = formatClock(opening, isCn);
  if (clock) return clock;
  return isRunningExhibition(ex) ? pick(T.onView, isCn) : pick(T.opening, isCn);
};

const dateParts = (item, isCn) => {
  const d =
    parseExhibitionDate(item?.date_start) ||
    parseExhibitionDate(item?.date_end) ||
    parseExhibitionDate(item?.year);
  if (!d) return { weekday: "", month: "", day: "" };
  return {
    weekday: isCn ? WEEKDAYS_CN[d.getDay()] : WEEKDAYS_EN[d.getDay()],
    month: isCn ? `${d.getMonth() + 1}月` : MONTHS_EN[d.getMonth()],
    day: String(d.getDate()),
  };
};

/* ────────────────────────────────────────────────────────────────────────── */
/* Atoms                                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

function MetaLine({ children, color, fontFamily, size = 12, style }) {
  return (
    <div
      style={{
        fontFamily,
        fontSize: size,
        lineHeight: 1.25,
        color,
        letterSpacing: "0.01em",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Skeleton({ height, style }) {
  return (
    <div
      className="home-surface"
      style={{
        width: "100%",
        height,
        ...style,
      }}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Hero                                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

function Hero({ item, kind, isCn, isMobile, colors, paper, fonts, displayFont, loading }) {
  const [hover, setHover] = useState(false);

  if (!item) {
    if (!loading) return null;
    return (
      <div style={{ padding: isMobile ? "16px 16px 0" : "24px 40px 0" }}>
        <Skeleton height={isMobile ? 420 : 520} />
      </div>
    );
  }

  const img = item.__cover || "";
  const isExhibition = kind === "exhibition";
  const href = isExhibition ? exhibitionHref(item) : artworkHref(item);
  const start = startTimeOf(item);
  const isFuture = isExhibition && start > Date.now();

  const tag = isExhibition
    ? pick(isFuture ? T.upcomingTag : T.nowPlaying, isCn)
    : pick(T.recentWork, isCn);

  const meta = isExhibition
    ? rangeLabel(item, isCn)
    : [item?.type, item?.year].filter(Boolean).join(" · ") || pick(T.undated, isCn);

  const titleSize = isMobile ? 32 : 48;

  return (
    <>
      <div
        className="home-hero"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: isMobile ? "4 / 5" : "21 / 9",
          maxHeight: isMobile ? "78vh" : 620,
          overflow: "hidden",
          background: "#111",
        }}
      >
        <Link
          href={href}
          aria-label={item.title || ""}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{ display: "block", width: "100%", height: "100%" }}
        >
          {img ? (
            <img
              src={img}
              alt={item.title || ""}
              fetchPriority="high"
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 35%",
                transform: hover ? "scale(1.012)" : "scale(1)",
                transition: "transform 0.9s cubic-bezier(0.2, 0.6, 0.2, 1)",
              }}
            />
          ) : (
            <div
              className="home-surface"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.45)",
                fontFamily: fonts.body,
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              {pick(T.noWorks, isCn)}
            </div>
          )}
        </Link>

        {/* NOW PLAYING tab — paper box with the folded bottom-right corner */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            background: paper,
            color: colors.text,
            fontFamily: fonts.body,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            lineHeight: 1.15,
            padding: "10px 17px 10px 12px",
            textAlign: "left",
            pointerEvents: "none",
            // Folded bottom-right corner: the still shows through the notch.
            clipPath:
              "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
          }}
        >
          {tag.split(" ").map((word, i) => (
            <span key={i} style={{ display: "block" }}>
              {word}
            </span>
          ))}
        </span>
      </div>

      <div
        style={{
          padding: isMobile ? "18px 16px 0" : "22px 40px 0",
          maxWidth: 1360,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <MetaLine color={colors.text} fontFamily={fonts.body} size={isMobile ? 12 : 13}>
          {meta}
        </MetaLine>

        <Link
          href={href}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h1
            style={{
              margin: "9px 0 0",
              fontFamily: displayFont,
              fontWeight: 700,
              fontStretch: "condensed",
              fontSize: titleSize,
              lineHeight: 1.03,
              letterSpacing: "0.005em",
              textTransform: "uppercase",
              color: colors.text,
              maxWidth: 1100,
              opacity: hover ? 0.82 : 1,
              textDecoration: hover ? "underline" : "none",
              textDecorationThickness: "1px",
              textUnderlineOffset: "6px",
              transition: "opacity 0.2s ease",
            }}
          >
            {item.title}
          </h1>
        </Link>
      </div>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Schedule strip                                                             */
/* ────────────────────────────────────────────────────────────────────────── */

function ScheduleStrip({ items, isCn, isMobile, colors, rule, fonts, displayFont }) {
  if (!items.length) return null;

  return (
    <div
      style={{
        border: `1px solid ${rule}`,
        display: "grid",
        gridTemplateColumns: `repeat(${
          isMobile ? 1 : Math.min(3, Math.max(1, items.length))
        }, minmax(0, 1fr))`,
        columnGap: isMobile ? 0 : 28,
        rowGap: isMobile ? 16 : 18,
        padding: isMobile ? "14px 14px 16px" : "16px 20px 19px",
        marginTop: isMobile ? 22 : 28,
        boxSizing: "border-box",
      }}
    >
      {Array.from({
        length: isMobile ? items.length : Math.min(3, Math.max(1, items.length)),
      }).map((_, i) => {
        const ex = items[i];
        if (!ex) return <div key={`empty-${i}`} style={{ minWidth: 0 }} />;
        return (
        <div key={ex.id || ex._id || i} style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: colors.text,
              opacity: 0.9,
              lineHeight: 1.2,
            }}
          >
            {isRunningExhibition(ex)
              ? pick(T.onView, isCn)
              : relativeDayLabel(ex?.date_start || ex?.year, isCn)}
          </div>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              minWidth: 0,
            }}
          >
            <div
              style={{
                flex: "0 0 auto",
                fontFamily: fonts.body,
                fontSize: 11,
                fontWeight: 600,
                color: colors.text,
                whiteSpace: "nowrap",
                paddingTop: 1,
              }}
            >
              {scheduleTimeLabel(ex, isCn)}
            </div>

            <Link
              href={exhibitionHref(ex)}
              style={{ textDecoration: "none", color: "inherit", minWidth: 0 }}
            >
              <div
                style={{
                  fontFamily: displayFont,
                  fontSize: isMobile ? 12 : 13,
                  fontWeight: 700,
                  fontStretch: "condensed",
                  lineHeight: 1.25,
                  color: colors.text,
                  textTransform: "uppercase",
                }}
              >
                {ex.title}
              </div>
              {ex.venue ? (
                <div
                  style={{
                    marginTop: 3,
                    fontFamily: fonts.body,
                    fontSize: 10.5,
                    lineHeight: 1.35,
                    color: colors.text,
                    opacity: 0.7,
                  }}
                >
                  {ex.venue}
                </div>
              ) : null}
            </Link>
          </div>
        </div>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Artwork card                                                               */
/* ────────────────────────────────────────────────────────────────────────── */

const ArtworkCard = React.memo(function ArtworkCard({
  artwork,
  isCn,
  isMobile,
  colors,
  isDark,
  rule,
  fonts,
  displayFont,
  index,
}) {
  const [hover, setHover] = useState(false);
  const img = artwork.__cover || "";
  const meta = [artwork.type, artwork.year].filter(Boolean).join(" · ") || pick(T.undated, isCn);

  return (
    <Link
      href={artworkHref(artwork)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        background: colors.background,
        padding: 10,
        boxShadow: isDark
          ? "0 2px 12px rgba(255,255,255,0.07)"
          : "0 2px 12px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.2s ease",
        minWidth: 0,
        ...(hover
          ? {
              boxShadow: isDark
                ? "0 6px 20px rgba(255,255,255,0.12)"
                : "0 6px 20px rgba(0,0,0,0.12)",
            }
          : {}),
      }}
    >
      <div
        className="home-surface"
        style={{
          width: "100%",
          aspectRatio: "3 / 2",
          overflow: "hidden",
        }}
      >
        {img ? (
          <img
            src={img}
            alt={artwork.title || ""}
            loading={index < 4 ? "eager" : "lazy"}
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hover ? "scale(1.02)" : "scale(1)",
              transition: "transform 0.7s cubic-bezier(0.2, 0.6, 0.2, 1)",
            }}
          />
        ) : null}
      </div>

      <div style={{ paddingTop: isMobile ? 9 : 11 }}>
        <MetaLine
          color={colors.text}
          fontFamily={fonts.body}
          size={isMobile ? 10.5 : 11.5}
          style={{ opacity: 0.95 }}
        >
          {meta}
        </MetaLine>

        <div
          style={{
            marginTop: 7,
            fontFamily: displayFont,
            fontWeight: 700,
            fontStretch: "condensed",
            fontSize: isMobile ? 18 : 20,
            lineHeight: 1.04,
            letterSpacing: "0.005em",
            textTransform: "uppercase",
            color: colors.text,
            opacity: hover ? 0.85 : 1,
            textDecoration: hover ? "underline" : "none",
            textDecorationThickness: "1px",
            textUnderlineOffset: "4px",
            transition: "opacity 0.2s ease",
          }}
        >
          {artwork.title}
        </div>
      </div>
    </Link>
  );
});

/* ────────────────────────────────────────────────────────────────────────── */
/* Upcoming list                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

function UpcomingRow({ item, isCn, colors, rule, fonts, displayFont }) {
  const parts = dateParts(item, isCn);
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={exhibitionHref(item)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "74px minmax(0, 1fr)",
        gap: 16,
        padding: "16px 0",
        borderTop: `1px solid ${rule}`,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontFamily: fonts.body, fontSize: 10.5, color: colors.text, opacity: 0.75 }}>
          {parts.weekday}
        </div>
        <div style={{ marginTop: 3, fontFamily: fonts.body, fontSize: 10.5, color: colors.text, opacity: 0.75 }}>
          {parts.month}
        </div>
        <div style={{ marginTop: 2, fontFamily: displayFont, fontSize: 26, fontWeight: 700, color: colors.text }}>
          {parts.day}
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: fonts.body, fontSize: 10.5, color: colors.text, opacity: 0.7 }}>
          {rangeLabel(item, isCn)}
        </div>
        <div
          style={{
            marginTop: 4,
            fontFamily: displayFont,
            fontSize: 15,
            fontWeight: 700,
            fontStretch: "condensed",
            lineHeight: 1.2,
            textTransform: "uppercase",
            color: colors.text,
            textDecoration: hover ? "underline" : "none",
            textDecorationThickness: "1px",
            textUnderlineOffset: "4px",
          }}
        >
          {item.title}
        </div>
        {item.venue ? (
          <div style={{ marginTop: 4, fontFamily: fonts.body, fontSize: 11, color: colors.text, opacity: 0.7 }}>
            {item.venue}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Writing rail + drawer                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Fixed vertical black tab on the right edge. Narrow and long, with vertical
 * type: WRITINGS (EN) / 文章 (CN). Hidden while the drawer is open.
 */
/* ────────────────────────────────────────────────────────────────────────── */
/* Page                                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

export default function HomePage() {
  const { isCn } = useContext(LanguageContext);
  const { isMobile } = useContext(DeviceContext);
  const { width: viewportWidth } = useWindowSize();
  const { colors, isDark } = useReverseTheme();

  const { fontFamily: titleFont } = useFont("artistName");
  const { fontFamily: bodyFont } = useFont("bodyText");
  // Display face comes from lib/typography.js (TYPE_SCALE.archiveDisplay),
  // never a hard-coded family stack in this component.
  const { fontFamily: displayFont } = useFont("archiveDisplay");

  const fonts = useMemo(() => ({ title: titleFont, body: bodyFont }), [titleFont, bodyFont]);

  const { data: rawArtworks = [], isLoading: artworksLoading } = useData("/api/artwork");
  const { data: rawExhibitions = [], isLoading: exhibitionsLoading } = useData("/api/exhibition");
  const { data: rawImages = [] } = useData("/api/image");
  const asList = (raw) =>
    Array.isArray(raw) ? raw : raw?.data && Array.isArray(raw.data) ? raw.data : [];

  // Cover fallback: artwork/exhibition cover field → an Image row whose tag
  // matches the title. This keeps the archive layout photographic even when
  // the record itself has no cover set.
  const imageByTag = useMemo(() => {
    const map = new Map();
    asList(rawImages).forEach((img) => {
      const url = img?.img_url;
      if (!url) return;
      [img.tag_en, img.tag_cn].forEach((tag) => {
        const key = normalizeTag(tag);
        if (key && !map.has(key)) map.set(key, url);
      });
    });
    return map;
  }, [rawImages]);

  const coverOf = (item) => {
    if (!item) return "";
    return (
      item.cover_img_url ||
      item.cover_image_url ||
      imageByTag.get(normalizeTag(item.title)) ||
      ""
    );
  };

  const artworks = useMemo(() => {
    const list = filterByLanguage(asList(rawArtworks), isCn).filter((a) => a && a.title);
    return [...list].sort(byYearDesc);
  }, [rawArtworks, isCn]);

  const exhibitions = useMemo(() => {
    const list = filterByLanguage(asList(rawExhibitions), isCn).filter((e) => e && e.title);
    return [...list].sort(byStartAsc);
  }, [rawExhibitions, isCn]);

  const featured = useMemo(() => {
    const current = exhibitions.filter(isRunningExhibition);
    if (current.length) return { kind: "exhibition", item: current[0] };
    if (exhibitions.length) {
      // No current show — feature the latest past show.
      return { kind: "exhibition", item: exhibitions[exhibitions.length - 1] };
    }
    if (artworks.length) return { kind: "artwork", item: artworks[0] };
    return { kind: null, item: null };
  }, [exhibitions, artworks]);

  const featuredWithCover = useMemo(() => {
    if (!featured.item) return featured;
    const direct = coverOf(featured.item);
    const fallback = coverOf(artworks[0]) || "/placeholder.png";
    return { ...featured, item: { ...featured.item, __cover: direct || fallback } };
  }, [featured, artworks, imageByTag]);

  const scheduleItems = useMemo(() => {
    const now = Date.now();
    const pool = exhibitions.filter(
      (ex) =>
        ex !== featured.item &&
        (isRunningExhibition(ex) || startTimeOf(ex) > now)
    );
    return pool.slice(0, 3).map((ex) => ({ ...ex, __cover: coverOf(ex) }));
  }, [exhibitions, featured, imageByTag]);

  const gridArtworks = useMemo(() => {
    const rest = artworks.filter((a) => a !== featured.item);
    const list = rest.length ? rest : artworks;
    return list.slice(0, 40).map((a) => ({ ...a, __cover: coverOf(a) }));
  }, [artworks, featured, imageByTag]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    const future = exhibitions.filter((ex) => startTimeOf(ex) > now);
    const current = exhibitions.filter(isRunningExhibition);
    const list = future.length
      ? future
      : current.length
      ? current
      : [...exhibitions].reverse();
    return {
      isFuture: future.length > 0,
      items: list.slice(0, 3).map((ex) => ({ ...ex, __cover: coverOf(ex) })),
    };
  }, [exhibitions, imageByTag]);

  const upcomingItems = upcoming.items;

  const isLoading = artworksLoading || exhibitionsLoading;

  // All public pages share the same loading state: nothing but the loader.
  if (isLoading) return <LoadingAnimation isLoading />;

  const paper = isDark ? "#000000" : "#ffffff";
  const rule = isDark ? "rgba(255,255,255,0.62)" : "rgba(17,17,17,0.62)";
  const px = isMobile ? 16 : 40;
  const gridCols = homeColumns(viewportWidth, isMobile);

  return (
    <>
    <motion.div
      className="home-archive"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      style={{
        backgroundColor: paper,
        color: colors.text,
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        paddingBottom: 96,
        boxSizing: "border-box",
      }}
    >
      <Hero
        item={featuredWithCover.item}
        kind={featuredWithCover.kind}
        isCn={isCn}
        isMobile={isMobile}
        colors={colors}
        paper={paper}
        fonts={fonts}
        displayFont={displayFont}
        loading={isLoading}
      />

      <div
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          padding: `0 ${px}px`,
          boxSizing: "border-box",
        }}
      >
        <ScheduleStrip
          items={scheduleItems}
          isCn={isCn}
          isMobile={isMobile}
          colors={colors}
          rule={rule}
          fonts={fonts}
          displayFont={displayFont}
        />

        <section data-nav-section style={{ marginTop: isMobile ? 34 : 46 }}>
          {isLoading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                columnGap: isMobile ? HOME_GRID.COLUMN_GAP_MOBILE : HOME_GRID.COLUMN_GAP,
                rowGap: isMobile ? HOME_GRID.ROW_GAP_MOBILE : HOME_GRID.ROW_GAP,
              }}
            >
              {Array.from({ length: gridCols * 2 }).map((_, i) => (
                <div key={i} style={{ borderTop: `1px solid ${rule}`, paddingTop: 12 }}>
                  <Skeleton height={isMobile ? 220 : 200} />
                  <Skeleton height={10} style={{ width: "38%", marginTop: 11 }} />
                  <Skeleton height={22} style={{ width: "88%", marginTop: 9 }} />
                </div>
              ))}
            </div>
          ) : gridArtworks.length === 0 ? (
            <div style={{ padding: "28px 0", fontSize: 13, opacity: 0.45 }}>
              {pick(T.empty, isCn)}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                columnGap: isMobile ? HOME_GRID.COLUMN_GAP_MOBILE : HOME_GRID.COLUMN_GAP,
                rowGap: isMobile ? HOME_GRID.ROW_GAP_MOBILE : HOME_GRID.ROW_GAP,
              }}
            >
              {gridArtworks.map((a, i) => (
                <ArtworkCard
                  key={a.id || a._id || `${a.title}-${i}`}
                  artwork={a}
                  index={i}
                  isCn={isCn}
                  isMobile={isMobile}
                  colors={colors}
                  isDark={isDark}
                  rule={rule}
                  fonts={fonts}
                  displayFont={displayFont}
                />
              ))}
            </div>
          )}

          <div
            style={{
              marginTop: isMobile ? 34 : 44,
              borderTop: `1px solid ${rule}`,
              paddingTop: 13,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <Link
              href="/artworks"
              style={{
                fontFamily: fonts.body,
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: colors.text,
                textDecoration: "none",
                opacity: 0.8,
              }}
            >
              {pick(T.allWorks, isCn)} →
            </Link>
          </div>
        </section>

        {upcomingItems.length > 0 && (
          <section data-nav-section style={{ marginTop: isMobile ? 46 : 64 }}>
            <div
              style={{
                borderTop: `1px solid ${rule}`,
                paddingTop: 13,
                paddingBottom: 10,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: displayFont,
                  fontWeight: 700,
                  fontStretch: "condensed",
                  fontSize: isMobile ? 18 : 24,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  color: colors.text,
                }}
              >
                {pick(upcoming.isFuture ? T.upcoming : T.onViewSection, isCn)}
              </h2>
            </div>

            {upcomingItems.map((ex, i) => (
              <UpcomingRow
                key={ex.id || ex._id || `${ex.title}-${i}`}
                item={ex}
                isCn={isCn}
                colors={colors}
                rule={rule}
                fonts={fonts}
                displayFont={displayFont}
              />
            ))}

            {upcomingItems[0]?.__cover ? (
              <div
                className="home-surface"
                style={{
                  width: "100%",
                  aspectRatio: "3 / 2",
                  maxHeight: 420,
                  overflow: "hidden",
                  marginTop: 18,
                }}
              >
                <img
                  src={upcomingItems[0].__cover}
                  alt={upcomingItems[0].title || ""}
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ) : null}
          </section>
        )}
      </div>
    </motion.div>

    </>
  );
}
