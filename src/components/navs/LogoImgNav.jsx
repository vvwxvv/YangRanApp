"use client";

import React, { useContext, useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";

// 外部 hooks（保留导入，非组件）
import { useBreakpoint, useMenuOverflow, useLogoSize, useDrawerKeyboard, useDrawerFocusTrap } from "@/hooks/useNav";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import useFont from '@/hooks/useFont';
import useBackgroundColor from "@/hooks/useBackgroundColor";

// 外部组件（保留导入，非导航子组件）
import MenuIconButton from "@/components/buttons/MenuIconButton";
import ContactButton from "@/components/pages/contact/components/ContactButton";
import NewsletterPopup from "@/components/popups/NewsletterPopup";

// 上下文 & 数据
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { ManagerContext } from "@/components/contexts/ManagerContext";
import { DEFAULT_MENUS } from "@/utils/siteMetaDefaults";
import useSiteMeta from "@/hooks/useSiteMeta";

/* ============================================================
   0.  useAsyncAction（内联）
   ============================================================ */
function useAsyncAction(asyncFn, options = {}) {
  const { throttleMs = 800, onSuccess, onError } = options;

  const isMountedRef = useRef(true);
  const isExecutingRef = useRef(false);
  const requestIdRef = useRef(0);
  const lastClickAtRef = useRef(0);

  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const resetError = useCallback(() => setError(null), []);

  const execute = useCallback(
    async (...args) => {
      const now = Date.now();
      if (now - lastClickAtRef.current < throttleMs) return;
      if (isExecutingRef.current) return;

      lastClickAtRef.current = now;
      isExecutingRef.current = true;
      setIsExecuting(true);
      setError(null);

      const requestId = ++requestIdRef.current;

      try {
        const result = await asyncFn(...args);
        if (requestId !== requestIdRef.current) return;
        if (!isMountedRef.current) return;
        onSuccess?.(result);
        return result;
      } catch (err) {
        if (requestId === requestIdRef.current && isMountedRef.current) {
          setError(err);
          onError?.(err);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          isExecutingRef.current = false;
        }
        if (isMountedRef.current) {
          setIsExecuting(false);
        }
      }
    },
    [asyncFn, throttleMs, onSuccess, onError]
  );

  return { execute, isExecuting, error, resetError };
}

/* ============================================================
   1.  LogoBar（内联）
   ============================================================ */
const LogoBar = ({ height, isCn, logoWidth, logoHeight }) => {
  // LogoComponent 是一个外部组件，但我们可以直接引用（来自 @/components/titles/LogoComponent）
  // 由于需要内联所有组件，我们导入它，但它是单一组件，可以保留导入
  // 我们选择直接导入 LogoComponent
  const LogoComponent = require("@/components/titles/LogoComponent").default;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height,
        backgroundColor: "#fff",
        zIndex: 1299,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative", top: 4, pointerEvents: "none" }}>
        <LogoComponent
          logoSrc="/logo.png"
          logoAlt="LianPu TeaArt"
          logoWidth={logoWidth}
          logoHeight={logoHeight}
          fallbackTextEn="LianPu"
          fallbackTextCn="联谱"
          isCn={isCn}
        />
      </div>
    </div>
  );
};

/* ============================================================
   2.  NavLine（内联）
   ============================================================ */
const NavLine = ({ top, color }) => (
  <motion.div
    aria-hidden="true"
    initial={{ scaleX: 0, transformOrigin: "left" }}
    animate={{ scaleX: 1 }}
    transition={{ duration: 0.55, delay: 0.15 }}
    style={{
      position: "fixed",
      top,
      left: 0,
      right: 0,
      height: "1px",
      backgroundColor: color,
      zIndex: 1300,
      transformOrigin: "left",
    }}
  />
);

/* ============================================================
   3.  DesktopSeparator（内联）
   ============================================================ */
const DesktopSeparator = ({ color, dashed = false }) => {
  const desktopItemVariant = {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };
  return (
    <motion.span
      variants={desktopItemVariant}
      aria-hidden="true"
      style={
        dashed
          ? {
              display: "block",
              width: 0,
              height: 16,
              borderLeft: `1px dashed ${color}`,
              opacity: 0.45,
              flexShrink: 0,
              margin: "0 12px",
            }
          : {
              color,
              opacity: 0.35,
              fontSize: "clamp(11px, 1.1vw, 15px)",
              lineHeight: 1,
              userSelect: "none",
              flexShrink: 0,
              padding: "0 2px",
            }
      }
    >
      {dashed ? null : "|"}
    </motion.span>
  );
};

/* ============================================================
   4.  DesktopMenuItemContent（内联）
   ============================================================ */
const DesktopMenuItemContent = ({ label, fontFamily, color }) => {
  const DESKTOP_ITEM_WEIGHT = 300;
  const DESKTOP_LETTER_SPACING = "0.03em";
  const DESKTOP_ITEM_SIZE = "clamp(11px, 1.1vw, 15px)";
  const MIN_TOUCH_TARGET = 44;
  const DESKTOP_HOVER_OPACITY = 0.55;

  return (
    <motion.span
      style={{
        fontFamily,
        fontWeight: DESKTOP_ITEM_WEIGHT,
        letterSpacing: DESKTOP_LETTER_SPACING,
        fontSize: DESKTOP_ITEM_SIZE,
        color,
        display: "inline-block",
        padding: "6px 8px",
        minHeight: MIN_TOUCH_TARGET,
        lineHeight: "32px",
        whiteSpace: "nowrap",
      }}
      whileHover={{
        opacity: DESKTOP_HOVER_OPACITY,
        transition: { duration: 0.15 },
      }}
      whileTap={{ scale: 0.97 }}
    >
      {label}
    </motion.span>
  );
};

/* ============================================================
   5.  DesktopMenuItem（内联）
   ============================================================ */
const DesktopMenuItem = ({
  item,
  fontFamily,
  color,
  isSubscription,
  onSubscriptionClick,
}) => {
  const content = (
    <DesktopMenuItemContent label={item.label} fontFamily={fontFamily} color={color} />
  );

  if (isSubscription) {
    return (
      <button
        type="button"
        onClick={onSubscriptionClick}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={item.href} style={{ textDecoration: "none" }}>
      {content}
    </Link>
  );
};

/* ============================================================
   6.  NavDivider（内联）
   ============================================================ */
const NavDivider = ({ color }) => (
  <div
    aria-hidden="true"
    style={{
      margin: "0 16px",
      borderTop: `1px dashed ${color}`,
      opacity: 0.25,
    }}
  />
);

/* ============================================================
   7.  MobileMenuItemContent（内联）
   ============================================================ */
const MobileMenuItemContent = ({ item, colors, fontFamily }) => {
  const [hovered, setHovered] = useState(false);

  const MOBILE_ITEM_PADDING_Y = 12;
  const MOBILE_ITEM_PADDING_X = 16;
  const MIN_TOUCH_TARGET = 44;
  const MOBILE_HOVER_DURATION = 0.2;
  const MOBILE_ITEM_WEIGHT = 500;
  const MOBILE_LETTER_SPACING_HOVER = "0.08em";
  const MOBILE_LETTER_SPACING_REST = "0.02em";
  const MOBILE_ITEM_SIZE = "clamp(13px, 2.2vw, 15px)";
  const MOBILE_HOVER_TEXT = "#fff";
  const MOBILE_HOVER_BG = "#000";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        padding: `${MOBILE_ITEM_PADDING_Y}px ${MOBILE_ITEM_PADDING_X}px`,
        minHeight: MIN_TOUCH_TARGET,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: 14,
          marginRight: 8,
          fontWeight: 700,
          fontSize: 18,
          color: colors.text,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(-8px)",
          transition: `opacity ${MOBILE_HOVER_DURATION}s ease, transform ${MOBILE_HOVER_DURATION}s ease`,
          flexShrink: 0,
        }}
      >
        –
      </span>
      <span
        style={{
          fontFamily,
          fontWeight: MOBILE_ITEM_WEIGHT,
          letterSpacing: hovered
            ? MOBILE_LETTER_SPACING_HOVER
            : MOBILE_LETTER_SPACING_REST,
          fontSize: MOBILE_ITEM_SIZE,
          color: hovered ? MOBILE_HOVER_TEXT : colors.text,
          backgroundColor: hovered ? MOBILE_HOVER_BG : "transparent",
          padding: hovered ? "4px 10px" : "4px 0",
          borderRadius: 4,
          transition: `all ${MOBILE_HOVER_DURATION}s ease`,
          whiteSpace: "nowrap",
        }}
      >
        {item.label}
      </span>
    </div>
  );
};

/* ============================================================
   8.  MobileMenuItem（内联）
   ============================================================ */
const MobileMenuItem = ({
  item,
  index,
  totalItems,
  colors,
  fontFamily,
  isSubscription,
  onSubscriptionClick,
  onNavigate,
}) => {
  const drawerItemVariant = {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.18 } },
  };

  const inner = (
    <MobileMenuItemContent item={item} colors={colors} fontFamily={fontFamily} />
  );

  return (
    <motion.div variants={drawerItemVariant}>
      {isSubscription ? (
        <button
          type="button"
          onClick={onSubscriptionClick}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            padding: 0,
            textAlign: "left",
            cursor: "pointer",
            display: "block",
          }}
        >
          {inner}
        </button>
      ) : (
        <Link
          href={item.href}
          onClick={onNavigate}
          style={{ display: "block", textDecoration: "none" }}
        >
          {inner}
        </Link>
      )}
      {index < totalItems - 1 && <NavDivider color={colors.text} />}
    </motion.div>
  );
};

/* ============================================================
   9.  MobileDrawer（内联）
   ============================================================ */
const MobileDrawer = ({
  menuList,
  colors,
  fontFamily,
  backgroundColor,
  isOpen,
  onClose,
  isSubscription,
  onSubscriptionClick,
}) => {
  const drawerRef = useRef(null);
  useDrawerFocusTrap(drawerRef, isOpen);
  useDrawerKeyboard(isOpen, onClose);

  const DRAWER_BACKDROP = "rgba(0,0,0,0.3)";
  const DRAWER_MAX_WIDTH = "min(320px, 85vw)";
  const DRAWER_PADDING_TOP = 72;
  const DRAWER_PADDING_BOTTOM = 32;
  const MIN_TOUCH_TARGET = 44;
  const BACKDROP_FADE_DURATION = 0.2;
  const DRAWER_SLIDE_DURATION = 0.28;
  const MOBILE_STAGGER = 0.045;

  const drawerWrapVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.25, staggerChildren: MOBILE_STAGGER },
    },
  };

  const FULL_HEIGHT = {
    height: "100vh",
    minHeight: "100dvh",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: BACKDROP_FADE_DURATION }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: DRAWER_BACKDROP,
              zIndex: 1398,
            }}
          />
          <motion.div
            ref={drawerRef}
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: DRAWER_SLIDE_DURATION, ease: [0.32, 0, 0.67, 0] }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: DRAWER_MAX_WIDTH,
              ...FULL_HEIGHT,
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
              backgroundColor,
              zIndex: 1400,
              overflow: "hidden",
            }}
          >
            <button
              onClick={onClose}
              aria-label="Close menu"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: MIN_TOUCH_TARGET,
                height: MIN_TOUCH_TARGET,
                borderRadius: "50%",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.text,
                fontSize: 20,
                zIndex: 2,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              ✕
            </button>

            <div
              style={{
                height: "100%",
                width: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                WebkitOverflowScrolling: "touch",
                position: "relative",
                zIndex: 1,
              }}
            >
              <motion.nav
                variants={drawerWrapVariants}
                initial="hidden"
                animate="visible"
                style={{
                  paddingTop: DRAWER_PADDING_TOP,
                  paddingBottom: DRAWER_PADDING_BOTTOM,
                  minHeight: "100dvh",
                }}
              >
                {menuList.map((item, index) => (
                  <MobileMenuItem
                    key={item.href ?? index}
                    item={item}
                    index={index}
                    totalItems={menuList.length}
                    colors={colors}
                    fontFamily={fontFamily}
                    isSubscription={isSubscription(item.href)}
                    onSubscriptionClick={onSubscriptionClick}
                    onNavigate={onClose}
                  />
                ))}
              </motion.nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ============================================================
   10. LogoImgNav（主组件，最终导出）
   ============================================================ */
const BAR_HEIGHT_DESKTOP = 70;
const BAR_HEIGHT_MOBILE = 60;
const LOGO_SIZES = [
  { maxWidth: 480, width: 160, height: 32 },
  { maxWidth: 768, width: 200, height: 40 },
  { maxWidth: Infinity, width: 280, height: 54 },
];
const HAMBURGER_LEFT = 12;
const DESKTOP_NAV_PADDING_X = 24;

const DESKTOP_WRAP_VARIANTS = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, staggerChildren: 0.07 } },
};
const DESKTOP_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const HAMBURGER_STYLE = {
  background: "transparent",
  backgroundColor: "transparent",
  border: "none",
  boxShadow: "none",
  WebkitTapHighlightColor: "transparent",
};

export default function LogoImgNav() {
  const { isCn } = useContext(LanguageContext);
  const { isManager } = useContext(ManagerContext);
  const { colors } = useReverseTheme();
  const { fontFamily: contentFontFamily } = useFont("navLink");
  const pathname = usePathname();

  const [showNewsletter, setShowNewsletter] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { width, isMobile, isNarrow } = useBreakpoint();
  const { backgroundColor } = useBackgroundColor("transparent", { useCustomColor: true });

  const languageKey = isCn ? "cn" : "en";
  // Menus come from the Meta document (manager-editable) with the JSON as fallback.
  const { meta: siteMeta } = useSiteMeta();
  const menuSource = siteMeta?.menu || DEFAULT_MENUS;
  const menuList = isManager
    ? menuSource.managerMenu?.[languageKey] || []
    : menuSource.mainMenu?.[languageKey] || [];

  const { rowRef, overflows } = useMenuOverflow(menuList.length);

  const useDrawer = isMobile || isNarrow || overflows;
  const isManagerPage = pathname?.startsWith("/manager/");
  const barHeight = isMobile ? BAR_HEIGHT_MOBILE : BAR_HEIGHT_DESKTOP;

  const { width: logoWidth, height: logoHeight } = useLogoSize(width, LOGO_SIZES);

  // 订阅异步动作（使用 useAsyncAction）
  const handleSubscribe = useCallback(async () => {
    // 模拟订阅请求（例如发送邮件）
    console.log("Subscribing...");
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log("Subscribed successfully!");
    // 成功后打开弹窗（由 onSuccess 触发）
  }, []);

  const { execute: executeSubscribe, isExecuting } = useAsyncAction(handleSubscribe, {
    throttleMs: 1000,
    onSuccess: () => {
      setShowNewsletter(true);
    },
    onError: (err) => {
      console.log("Subscription error:", err);
      // 可显示错误提示
    },
  });

  const isSubscription = useCallback(
    (href) => href === "/subscribe" || href === "/manager/subscribe",
    []
  );

  const handleSubscriptionClick = useCallback(
    (e) => {
      e?.preventDefault();
      executeSubscribe();
    },
    [executeSubscribe]
  );

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <>
      <LogoBar
        height={barHeight}
        isCn={isCn}
        logoWidth={logoWidth}
        logoHeight={logoHeight}
      />
      <NavLine top={barHeight} color={colors.text} />

      {useDrawer && !drawerOpen && (
        <div
          style={{
            position: "fixed",
            top: (barHeight - 44) / 2,
            left: HAMBURGER_LEFT,
            zIndex: 1400,
            background: "transparent",
          }}
        >
          <MenuIconButton
            colors={colors}
            onClick={openDrawer}
            style={HAMBURGER_STYLE}
          />
        </div>
      )}

      <MobileDrawer
        menuList={menuList}
        colors={colors}
        fontFamily={contentFontFamily}
        backgroundColor={backgroundColor}
        isOpen={drawerOpen}
        onClose={closeDrawer}
        isSubscription={isSubscription}
        onSubscriptionClick={handleSubscriptionClick}
      />

      {!useDrawer && (
        <div
          style={{
            position: "fixed",
            top: barHeight,
            left: 0,
            right: 0,
            zIndex: 1300,
          }}
        >
          <motion.nav
            ref={rowRef}
            variants={DESKTOP_WRAP_VARIANTS}
            initial="hidden"
            animate="visible"
            aria-label="Main navigation"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "nowrap",
              padding: `0 ${DESKTOP_NAV_PADDING_X}px`,
              gap: 0,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {menuList.map((item, index) => (
              <React.Fragment key={item.href ?? index}>
                <motion.div variants={DESKTOP_ITEM_VARIANTS}>
                  <DesktopMenuItem
                    item={item}
                    fontFamily={contentFontFamily}
                    color={colors.text}
                    isSubscription={isSubscription(item.href)}
                    onSubscriptionClick={handleSubscriptionClick}
                  />
                </motion.div>
                {index < menuList.length - 1 && (
                  <DesktopSeparator color={colors.text} />
                )}
              </React.Fragment>
            ))}

            {!isManagerPage && (
              <>
                <DesktopSeparator color={colors.text} dashed />
                <motion.div variants={DESKTOP_ITEM_VARIANTS}>
                  <ContactButton
                    variant="ghost"
                    size="small"
                    style={{ background: "none", border: "none", padding: 0 }}
                  >
                    <DesktopMenuItemContent
                      label={isCn ? "联系" : "CONTACT"}
                      fontFamily={contentFontFamily}
                      color={colors.text}
                    />
                  </ContactButton>
                </motion.div>
              </>
            )}
          </motion.nav>
        </div>
      )}

      {showNewsletter && !isManager && (
        <NewsletterPopup focusOnOpen onClose={() => setShowNewsletter(false)} />
      )}
    </>
  );
}