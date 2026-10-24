"use client";

import React, {
  useContext,
  useMemo,
} from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import useFont from '@/hooks/useFont';
import { useReverseTheme } from "@/hooks/useReverseTheme";
import AlertInfo from "@/components/alerts/AlertInfo";
import LoadingAnimation from "@/components/animations/LoadingAnimation";
import useBibliographyData from "@/components/pages/news/hooks/useBibliographyData";

// ============================================================================
// UI CONFIGURATION
// ============================================================================
const CONFIG = {
  PAGE: {
    PADDING_LEFT_DESKTOP: 100,
    PADDING_RIGHT_DESKTOP: 50,
    PADDING_LEFT_MOBILE: 50,
    PADDING_RIGHT_MOBILE: 20,
    PADDING_TOP_DESKTOP: 30,
    PADDING_TOP_MOBILE: 24,
    PADDING_BOTTOM: 120,
    OFFSET_TOP: -10,
  },

  HEADING: {
    FONT_SIZE_DESKTOP: "20px",
    FONT_SIZE_MOBILE: "20px",
    FONT_WEIGHT: 500,
    LETTER_SPACING: "0.01em",
    OFFSET_LEFT: 0,
    OFFSET_TOP: 50,
    OFFSET_LEFT_MOBILE: 0,
    OFFSET_TOP_MOBILE: 0,
    ALIGN: "left",
    OFFSET_RIGHT: 0,
    TO_LIST_GAP_DESKTOP: 70,
    TO_LIST_GAP_MOBILE: 40,
  },

  LIST: {
    COLUMN_WIDTH: "100%",
    OFFSET_TOP: 50,
    ITEM_GAP_DESKTOP: 10,
    ITEM_GAP_MOBILE: 10,
 // Font size matches the About page body (AboutPageComponent
    //   CONFIG.text.body.size = "13px") on both breakpoints.
    ITEM_FONT_SIZE_DESKTOP: "13px",
    ITEM_FONT_SIZE_MOBILE: "13px",
    ITEM_FONT_WEIGHT: 347,
    ITEM_LINE_HEIGHT: 1.4,
    ITEM_LETTER_SPACING: "0.02em",
    ITEM_COLOR: null,
    ITEM_COLOR_ACTIVE: null,
    UNDERLINE_COLOR: null,
    UNDERLINE_DURATION: 0.3,
    // 类型和关联艺术家的字体大小（与主标题相同或略小，此处统一）
    META_FONT_SIZE_DESKTOP: "13px",
    META_FONT_SIZE_MOBILE: "13px",
    META_OPACITY: 0.7,
  },

  EMPTY_STATE: {
    FONT_SIZE: "13px",
    OPACITY: 0.3,
    LETTER_SPACING: "0.1em",
  },

  TEXT: {
    HEADING: { en: "News", cn: "新闻" },
    EMPTY: { en: "No news", cn: "暂无新闻" },
    ERROR_MESSAGE: { en: "Loading Failed", cn: "加载失败" },
    RETRY_BUTTON: { en: "Retry", cn: "重试" },
  },
};

// ============================================================================
// Helpers
// ============================================================================
const pick = (isCn, pair) => (isCn ? pair.cn : pair.en);

const getSafeHref = (item) => {
  if (item.web_url) return item.web_url;
  if (item.pdf_url) return item.pdf_url;
  if (item.video_url) return item.video_url;
  return "#";
};

const resolveListColors = (themeText) => {
  const base = CONFIG.LIST.ITEM_COLOR || themeText;
  const active = CONFIG.LIST.ITEM_COLOR_ACTIVE || base;
  const underline = CONFIG.LIST.UNDERLINE_COLOR || active;
  return { base, active, underline };
};

const HEADING_ALIGN_RIGHT = CONFIG.HEADING.ALIGN === "right";

// ============================================================================
// 书目条目 — 单行，无标签，艺术家+标题+类型，悬停下划线
// ============================================================================
const BibliographyItem = React.memo(function BibliographyItem({
  item,
  index,
  isMobile,
  listColors,
  fontFamily,
}) {
  const href = getSafeHref(item);
  const isExternal = href !== "#" && (href.startsWith("http") || href.startsWith("//"));

  const itemGap = isMobile
    ? CONFIG.LIST.ITEM_GAP_MOBILE
    : CONFIG.LIST.ITEM_GAP_DESKTOP;

  const metaFontSize = isMobile
    ? CONFIG.LIST.META_FONT_SIZE_MOBILE
    : CONFIG.LIST.META_FONT_SIZE_DESKTOP;

  // 关联艺术家：取 related_exhibition 第一个，或全部用逗号连接
  const relatedArtists = item.related_exhibition && item.related_exhibition.length > 0
    ? item.related_exhibition.join(", ")
    : null;

  // 构建显示内容：艺术家（如果有） + 标题 + 类型（如果有）
  const displayParts = [];
  if (relatedArtists) displayParts.push(relatedArtists);
  displayParts.push(item.title || "Untitled");
  if (item.type) displayParts.push(item.type);

  // 用分隔符连接：艺术家 · 标题 · 类型
  const displayText = displayParts.join(" · ");

  const titleContent = item.title || "Untitled";

  // 改为使用 motion 版本：
  const MotionA = motion.a;
  const MotionSpan = motion.span;

  const titleWithUnderlineMotion = href !== "#" ? (
    <MotionA
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      style={{
        display: "inline-block",
        textDecoration: "none",
        color: listColors.base,
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        position: "relative",
        padding: "2px 0",
        cursor: "pointer",
      }}
      whileHover={{ color: listColors.active }}
      transition={{ duration: 0.2 }}
    >
      {titleContent}
      <MotionSpan
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "1px",
          backgroundColor: listColors.underline,
          transformOrigin: "left",
          pointerEvents: "none",
        }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: CONFIG.LIST.UNDERLINE_DURATION, ease: "easeInOut" }}
      />
    </MotionA>
  ) : (
    <span style={{ color: listColors.base, padding: "2px 0" }}>{titleContent}</span>
  );

  // 整行内容
  const content = (
    <>
      {relatedArtists && (
        <span style={{ opacity: CONFIG.LIST.META_OPACITY, fontSize: metaFontSize }}>
          {relatedArtists}
          <span style={{ margin: "0 4px" }}>·</span>
        </span>
      )}
      {titleWithUnderlineMotion}
      {item.type && (
        <span style={{ opacity: CONFIG.LIST.META_OPACITY, fontSize: metaFontSize, marginLeft: "4px" }}>
          <span style={{ margin: "0 4px" }}>·</span>
          {item.type}
        </span>
      )}
    </>
  );

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: isMobile ? 0 : index * 0.04,
        duration: 0.45,
        ease: "easeOut",
      }}
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        textAlign: "left",
        marginBottom: `${itemGap}px`,
        fontSize: isMobile
          ? CONFIG.LIST.ITEM_FONT_SIZE_MOBILE
          : CONFIG.LIST.ITEM_FONT_SIZE_DESKTOP,
        lineHeight: CONFIG.LIST.ITEM_LINE_HEIGHT,
        letterSpacing: CONFIG.LIST.ITEM_LETTER_SPACING,
        fontWeight: CONFIG.LIST.ITEM_FONT_WEIGHT,
        fontFamily,
        color: listColors.base,
      }}
    >
      {content}
    </motion.li>
  );
});

// ============================================================================
// 书目列表
// ============================================================================
const BibliographyList = React.memo(function BibliographyList({
  items,
  isMobile,
  listColors,
  fontFamily,
}) {
  return (
    <ul
      style={{
        width: "100%",
        margin: 0,
        padding: 0,
        position: "relative",
        top: `${CONFIG.LIST.OFFSET_TOP}px`,
        listStyle: "none",
      }}
    >
      {items.map((item, i) => (
        <BibliographyItem
          key={item.id}
          item={item}
          index={i}
          isMobile={isMobile}
          listColors={listColors}
          fontFamily={fontFamily}
        />
      ))}
    </ul>
  );
});

// ============================================================================
// 空状态
// ============================================================================
const EmptyState = React.memo(function EmptyState({ isCn, fontFamily, text }) {
  return (
    <p
      style={{
        fontFamily,
        fontSize: CONFIG.EMPTY_STATE.FONT_SIZE,
        color: text,
        opacity: CONFIG.EMPTY_STATE.OPACITY,
        letterSpacing: CONFIG.EMPTY_STATE.LETTER_SPACING,
        textTransform: "uppercase",
        marginTop: `${CONFIG.HEADING.TO_LIST_GAP_DESKTOP}px`,
      }}
    >
      {pick(isCn, CONFIG.TEXT.EMPTY)}
    </p>
  );
});

// ============================================================================
// PLAIN WHITE LOADING STATE
//   No skeleton lines, no blocks, no animation — just a blank
//   white screen while bibliography data is being fetched.
// ============================================================================
function BibliographyLoading() {
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#ffffff",
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
// 主页面组件
// ============================================================================
export default function BibliographyPageComponent() {
  const { isCn } = useContext(LanguageContext);
  const { isMobile } = useContext(DeviceContext);
  const { fontFamily } = useFont();
  const { colors } = useReverseTheme();

  const text = colors.text;
  const bg = colors.background;

  const { data: items = [], isLoading, error, handleRetry } = useBibliographyData();

  const listColors = useMemo(() => resolveListColors(text), [text]);

  if (isLoading) {
    return <BibliographyLoading />;
  }

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
        boxSizing: "border-box",
        fontFamily,
        paddingTop: isMobile ? CONFIG.PAGE.PADDING_TOP_MOBILE : CONFIG.PAGE.PADDING_TOP_DESKTOP,
        paddingLeft: isMobile ? CONFIG.PAGE.PADDING_LEFT_MOBILE : CONFIG.PAGE.PADDING_LEFT_DESKTOP,
        paddingRight: isMobile ? CONFIG.PAGE.PADDING_RIGHT_MOBILE : CONFIG.PAGE.PADDING_RIGHT_DESKTOP,
        paddingBottom: CONFIG.PAGE.PADDING_BOTTOM,
        marginTop: CONFIG.PAGE.OFFSET_TOP,
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          fontFamily,
          fontSize: isMobile
            ? CONFIG.HEADING.FONT_SIZE_MOBILE
            : CONFIG.HEADING.FONT_SIZE_DESKTOP,
          fontWeight: CONFIG.HEADING.FONT_WEIGHT,
          letterSpacing: CONFIG.HEADING.LETTER_SPACING,
          color: text,
          margin: 0,
          position: "relative",
          textAlign: HEADING_ALIGN_RIGHT ? "right" : "left",
          top: isMobile ? CONFIG.HEADING.OFFSET_TOP_MOBILE : CONFIG.HEADING.OFFSET_TOP,
          left: HEADING_ALIGN_RIGHT
            ? undefined
            : (isMobile ? CONFIG.HEADING.OFFSET_LEFT_MOBILE : CONFIG.HEADING.OFFSET_LEFT),
          right: HEADING_ALIGN_RIGHT ? CONFIG.HEADING.OFFSET_RIGHT : undefined,
        }}
      >
        {pick(isCn, CONFIG.TEXT.HEADING)}
      </motion.h1>

      {items.length === 0 ? (
        <EmptyState isCn={isCn} fontFamily={fontFamily} text={text} />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginTop: isMobile
              ? CONFIG.HEADING.TO_LIST_GAP_MOBILE
              : CONFIG.HEADING.TO_LIST_GAP_DESKTOP,
            width: "100%",
          }}
        >
          <BibliographyList
            items={items}
            isMobile={isMobile}
            listColors={listColors}
            fontFamily={fontFamily}
          />
        </div>
      )}
    </div>
  );
}