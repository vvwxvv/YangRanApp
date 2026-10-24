"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box } from "@mui/material";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";


// 外部 hooks / 工具
import { useInteraction } from "@/hooks/useInteraction";
import { useMenuItemNavigation } from "@/hooks/useMenuItemNavigation";
import { TAP_STYLE, buildInteractiveStyle } from "@/hooks/useInteractionStyles";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import useFont from '@/hooks/useFont';
import useBackgroundColor from "@/hooks/useBackgroundColor";

// 外部组件（不内联）
import AnimatedUnderline from "@/components/animations/AnimatedUnderline";
import AnimatedHorizontalLine from "@/components/animations/AnimatedHorizontalLine";
import VerticalSeparator from "@/components/others/VerticalSeparator";
import AppTextTitle from "@/components/titles/AppTextTitle";
import MenuIconButton from "@/components/buttons/MenuIconButton";
import LanguageSwitcherInMenu from "@/components/switchers/LanguageSwitcherInMenu";

// 上下文 & 数据
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { DeviceContext } from "@/components/contexts/DeviceContext";
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
   1.  NavLink（内联）
   ============================================================ */
const NavLink = ({
  href,
  isSubscription = false,
  onClick,
  onKeyDown,
  onBlur,
  handlers,
  style,
  ariaLabel,
  children,
}) => {
  const router = useRouter(); // 需要在顶部导入 useRouter
  const lastPointerDownRef = useRef(0);
  const navigatingRef = useRef(false);

  const handlePointerDown = useCallback(() => {
    lastPointerDownRef.current = Date.now();
  }, []);

  const handleClick = useCallback(
    (e) => {
      const now = Date.now();
      const elapsed = now - lastPointerDownRef.current;
      if (elapsed > 0 && elapsed < 80) {
        e.preventDefault();
        return;
      }
      if (isSubscription) {
        e.preventDefault();
        onClick?.(e);
        return;
      }
      if (navigatingRef.current) {
        e.preventDefault();
        return;
      }
      navigatingRef.current = true;
      onClick?.(e);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          navigatingRef.current = false;
        });
      });
    },
    [isSubscription, onClick]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (isSubscription) {
          onClick?.(e);
        } else if (href && !navigatingRef.current) {
          navigatingRef.current = true;
          router.push(href);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              navigatingRef.current = false;
            });
          });
        }
      }
      onKeyDown?.(e);
    },
    [isSubscription, href, router, onClick, onKeyDown]
  );

  return (
    <Link
      href={isSubscription ? "#" : href || "/"}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      onBlur={onBlur}
      role={isSubscription ? "button" : undefined}
      tabIndex={0}
      aria-label={ariaLabel}
      draggable={false}
      style={{
        ...style,
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      {...handlers}
    >
      {children}
    </Link>
  );
};

/* ============================================================
   2.  MenuLabel（内联）
   ============================================================ */
const MenuLabel = ({
  label,
  colors,
  fontFamily,
  hovered,
  pressed,
  variant = "desktop",
}) => {
  const isMobileVariant = variant === "mobile";
  const fontSize = "16px";

  return (
    <motion.span
      className={`tracking-${isMobileVariant ? "tight" : "normal"} font-sans relative ${
        isMobileVariant ? "font-semibold px-3 py-2 rounded" : "font-light px-2 py-1"
      }`}
      style={{
        fontFamily,
        color: colors.text,
        fontSize,
        opacity: pressed
          ? isMobileVariant
            ? 0.6
            : 0.5
          : hovered
          ? isMobileVariant
            ? 0.8
            : 0.7
          : 1,
        transform: pressed ? `scale(${isMobileVariant ? 0.97 : 0.96})` : "scale(1)",
        transition: "all 0.15s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {label}
    </motion.span>
  );
};

/* ============================================================
   3.  MenuDivider（内联）
   ============================================================ */
const MenuDivider = ({ colors }) => (
  <div className="mx-4">
    <div
      style={{
        borderTop: `1px dashed ${colors.text}`,
        opacity: 0.3,
        marginBottom: "0.5rem",
      }}
    />
  </div>
);

/* ============================================================
   4.  DesktopDropdown（内联）
   ============================================================ */
const CONNECTOR_H = 8;
const ACCENT_W = 3;
const CLOSE_DELAY = 160;

const panelVariants = {
  hidden: {
    opacity: 0,
    y: -6,
    scaleY: 0.93,
    transition: { duration: 0.1, ease: [0.4, 0, 1, 1] },
  },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -4,
    scaleY: 0.96,
    transition: { duration: 0.1, ease: [0.4, 0, 1, 1] },
  },
};

const DropdownItem = ({
  item,
  colors,
  contentFontFamily,
  onSubscriptionClick,
  onClose,
}) => {
  const {
    hovered,
    pressed,
    handlers,
    reset,
    handleClick,
    handleKeyDown,
    isSubscription,
  } = useMenuItemNavigation({ href: item.href, onSubscriptionClick });

  const handleItemClick = useCallback(
    (e) => {
      handleClick(e);
      onClose?.();
    },
    [handleClick, onClose]
  );

  return (
    <NavLink
      href={item.href}
      isSubscription={isSubscription}
      onClick={handleItemClick}
      onKeyDown={handleKeyDown}
      onBlur={reset}
      handlers={handlers}
      ariaLabel={item.label}
      role="menuitem"
      style={{
        display: "block",
        textDecoration: "none",
        outline: "none",
        border: "none",
        backgroundColor: "transparent",
        padding: 0,
        width: "100%",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        userSelect: "none",
        ...TAP_STYLE,
        transform: pressed ? "scale(0.975)" : "scale(1)",
        transition: "transform 0.08s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <Box
        sx={{
          px: 1.75,
          py: "9px",
          position: "relative",
          backgroundColor: pressed
            ? `${colors.text}13`
            : hovered
            ? `${colors.text}08`
            : "transparent",
          transition: "background-color 0.12s ease",
        }}
      >
        <MenuLabel
          label={item.label}
          colors={colors}
          fontFamily={contentFontFamily}
          hovered={hovered}
          pressed={pressed}
          variant="desktop"
        />
        <AnimatedUnderline active={hovered || pressed} color={colors.text} />
      </Box>
    </NavLink>
  );
};

const DesktopDropdown = ({
  items,
  isOpen,
  colors,
  contentFontFamily,
  onSubscriptionClick,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [keepOpen, setKeepOpen] = useState(false);
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      clearTimeout(timerRef.current);
      setKeepOpen(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && !keepOpen) return;
    const close = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setKeepOpen(false);
        onClose?.();
      }
    };
    document.addEventListener("pointerdown", close, true);
    return () => document.removeEventListener("pointerdown", close, true);
  }, [isOpen, keepOpen, onClose]);

  useEffect(() => {
    if (!isOpen && !keepOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setKeepOpen(false);
        onClose?.();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, keepOpen, onClose]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handlePointerEnter = useCallback(
    (e) => {
      if (e.pointerType === "touch") return;
      clearTimeout(timerRef.current);
      setKeepOpen(true);
      onMouseEnter?.();
    },
    [onMouseEnter]
  );

  const handlePointerLeave = useCallback(
    (e) => {
      if (e.pointerType === "touch") return;
      timerRef.current = setTimeout(() => {
        setKeepOpen(false);
        onMouseLeave?.();
      }, CLOSE_DELAY);
    },
    [onMouseLeave]
  );

  const handleItemClose = useCallback(() => {
    setKeepOpen(false);
    onClose?.();
  }, [onClose]);

  const show = isOpen || keepOpen;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={containerRef}
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 1000,
            minWidth: "140px",
            paddingTop: CONNECTOR_H,
            transformOrigin: "top left",
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${ACCENT_W}px`,
              height: `${CONNECTOR_H}px`,
              backgroundColor: colors.text,
            }}
          />
          <Box
            role="menu"
            aria-orientation="vertical"
            sx={{
              py: "4px",
              backgroundColor: colors.background,
              borderLeft: `${ACCENT_W}px solid ${colors.text}`,
              borderTop: `1px solid ${colors.text}20`,
              borderRight: `1px solid ${colors.text}18`,
              borderBottom: `1px solid ${colors.text}18`,
              boxShadow: `3px 3px 0px ${colors.text}14, 0 10px 28px ${colors.text}0D`,
            }}
          >
            {items.map((sub, i) => (
              <DropdownItem
                key={sub.href ?? i}
                item={sub}
                colors={colors}
                contentFontFamily={contentFontFamily}
                onSubscriptionClick={onSubscriptionClick}
                onClose={handleItemClose}
              />
            ))}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ============================================================
   5.  DesktopMenuItem（内联）
   ============================================================ */
const HIDDEN_DESKTOP_LABELS = ["Contact", "联系"];

const DesktopMenuItem = ({
  item,
  colors,
  contentFontFamily,
  onSubscriptionClick,
}) => {
  if (HIDDEN_DESKTOP_LABELS.includes(item.label)) {
    return null;
  }

  const hasDropdown = Array.isArray(item.dropdown) && item.dropdown.length > 0;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimeoutRef = useRef(null);

  const {
    hovered,
    pressed,
    handlers: baseHandlers,
    reset,
    handleClick: baseHandleClick,
    handleKeyDown,
    isSubscription,
  } = useMenuItemNavigation({
    href: item.href,
    onSubscriptionClick,
  });

  const handleMouseEnter = useCallback(
    (e) => {
      baseHandlers.onMouseEnter?.(e);
      if (hasDropdown) {
        clearTimeout(closeTimeoutRef.current);
        setDropdownOpen(true);
      }
    },
    [baseHandlers, hasDropdown]
  );

  const handleMouseLeave = useCallback(
    (e) => {
      baseHandlers.onMouseLeave?.(e);
      if (hasDropdown) {
        closeTimeoutRef.current = setTimeout(() => {
          setDropdownOpen(false);
        }, 150);
      }
    },
    [baseHandlers, hasDropdown]
  );

  const handleClick = useCallback(
    (e) => {
      if (hasDropdown) {
        e.preventDefault();
        setDropdownOpen((prev) => !prev);
        return;
      }
      baseHandleClick(e);
    },
    [hasDropdown, baseHandleClick]
  );

  const handleCloseDropdown = useCallback(() => {
    setDropdownOpen(false);
  }, []);

  const handlers = {
    ...baseHandlers,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: -10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.3 },
        },
      }}
      style={{ position: "relative" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NavLink
        href={item.href}
        isSubscription={isSubscription}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onBlur={reset}
        handlers={handlers}
        ariaLabel={item.label}
        aria-haspopup={hasDropdown ? "true" : undefined}
        aria-expanded={hasDropdown ? dropdownOpen : undefined}
        style={{
          ...TAP_STYLE,
          display: "inline-block",
          textDecoration: "none",
          outline: "none",
          border: "none",
          backgroundColor: "transparent",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <motion.div className="relative">
          <MenuLabel
            label={item.label}
            colors={colors}
            fontFamily={contentFontFamily}
            hovered={hovered || dropdownOpen}
            pressed={pressed}
            variant="desktop"
          />
          <AnimatedUnderline
            active={hovered || pressed || dropdownOpen}
            color={colors.text}
          />
        </motion.div>
      </NavLink>

      {hasDropdown && (
        <DesktopDropdown
          items={item.dropdown}
          isOpen={dropdownOpen}
          colors={colors}
          contentFontFamily={contentFontFamily}
          onSubscriptionClick={onSubscriptionClick}
          onClose={handleCloseDropdown}
        />
      )}
    </motion.div>
  );
};

/* ============================================================
   6.  DesktopContactItem（内联）
   ============================================================ */
const DesktopContactItem = ({ colors, contentFontFamily, isCn }) => {
  const { hovered, pressed, handlers, reset } = useInteraction({
    touchHoverDelay: 100,
  });

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: -10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.3 },
        },
      }}
    >
      <button
        style={{
          backgroundColor: "transparent",
          border: "none",
          padding: 0,
          height: "auto",
          ...TAP_STYLE,
        }}
      >
        <div onBlur={reset} style={{ display: "inline-block" }} {...handlers}>
          <motion.div className="relative">
            <MenuLabel
              label={isCn ? "联系" : "Contact"}
              colors={colors}
              fontFamily={contentFontFamily}
              hovered={hovered}
              pressed={pressed}
              variant="desktop"
            />
            <AnimatedUnderline active={hovered || pressed} color={colors.text} />
          </motion.div>
        </div>
      </button>
    </motion.div>
  );
};

/* ============================================================
   7.  DesktopNavLayout（内联）
   ============================================================ */
const DesktopNavLayout = ({
  colors,
  menuList,
  contentFontFamily,
  isManagerPage,
  isCn,
  onSubscriptionClick,
}) => {
  const filteredMenuList = useMemo(
    () => menuList.filter((item) => !HIDDEN_DESKTOP_LABELS.includes(item.label)),
    [menuList]
  );

  return (
    <div
      className="fixed top-8 left-0 right-0"
      style={{ zIndex: 1400, width: "100vw" }}
    >
      <div className="flex flex-col items-center space-y-4 w-full">
        <AppTextTitle positionMode="center" zIndex={1400} />

        <AnimatedHorizontalLine
          colors={colors}
          style={{ maxWidth: "100%", zIndex: 1401, position: "relative" }}
        />

        <motion.div
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, staggerChildren: 0.1 },
            },
          }}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-center w-full"
          style={{
            backgroundColor: "transparent",
            padding: "8px 0",
            width: "100vw",
            maxWidth: "100vw",
          }}
        >
          {filteredMenuList.map((item, index) => (
            <React.Fragment key={item.href ?? index}>
              <DesktopMenuItem
                item={item}
                colors={colors}
                contentFontFamily={contentFontFamily}
                onSubscriptionClick={onSubscriptionClick}
              />
              {index < filteredMenuList.length - 1 && (
                <VerticalSeparator colors={colors} />
              )}
            </React.Fragment>
          ))}

          {!isManagerPage && (
            <>
              <VerticalSeparator colors={colors} />
              <DesktopContactItem
                colors={colors}
                contentFontFamily={contentFontFamily}
                isCn={isCn}
              />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

/* ============================================================
   8.  MobileDropdown（内联）
   ============================================================ */
const dropdownVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut", staggerChildren: 0.04 },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.1 } },
};

const MobileDropdownItem = ({
  item,
  colors,
  contentFontFamily,
  onSubscriptionClick,
  onNavigate,
}) => {
  const {
    hovered,
    pressed,
    handlers,
    reset,
    handleClick,
    handleKeyDown,
    isSubscription,
  } = useMenuItemNavigation({
    href: item.href,
    onSubscriptionClick,
  });

  const handleItemClick = useCallback(
    (e) => {
      handleClick(e);
      onNavigate?.();
    },
    [handleClick, onNavigate]
  );

  return (
    <motion.div variants={itemVariants}>
      <NavLink
        href={item.href}
        isSubscription={isSubscription}
        onClick={handleItemClick}
        onKeyDown={handleKeyDown}
        onBlur={reset}
        handlers={handlers}
        ariaLabel={item.label}
        style={{
          display: "block",
          textDecoration: "none",
          outline: "none",
          border: "none",
          backgroundColor: "transparent",
          padding: 0,
          width: "100%",
        }}
      >
        <div
          style={{
            paddingLeft: "20px",
            paddingTop: "10px",
            paddingBottom: "10px",
            borderRadius: "4px",
            position: "relative",
            backgroundColor: pressed
              ? `${colors.text}12`
              : hovered
              ? `${colors.text}08`
              : "transparent",
            transition: "background-color 0.15s ease",
          }}
        >
          <MenuLabel
            label={item.label}
            colors={colors}
            fontFamily={contentFontFamily}
            hovered={hovered}
            pressed={pressed}
            variant="mobile"
          />
          <AnimatedUnderline active={hovered || pressed} color={colors.text} />
        </div>
      </NavLink>
    </motion.div>
  );
};

const MobileDropdown = ({
  item,
  colors,
  contentFontFamily,
  onSubscriptionClick,
  onNavigate,
}) => {
  const [expanded, setExpanded] = useState(false);
  const {
    hovered: parentHovered,
    pressed: parentPressed,
    handlers: parentHandlers,
  } = useInteraction({ touchHoverDelay: 80 });

  const toggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <button
        onClick={toggleExpand}
        {...parentHandlers}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "12px 0",
          background: "transparent",
          border: "none",
          outline: "none",
          cursor: "pointer",
          fontFamily: contentFontFamily,
          position: "relative",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
          userSelect: "none",
          ...TAP_STYLE,
          transform: parentPressed ? "scale(0.98)" : "scale(1)",
          transition: "transform 0.12s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <span
          style={{
            color: colors.text,
            fontSize: "18px",
            fontFamily: contentFontFamily,
            fontWeight: 400,
            opacity: parentPressed ? 0.7 : 1,
            transition: "opacity 0.12s ease",
          }}
        >
          {item.label}
        </span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "24px",
            height: "24px",
            color: colors.text,
            fontSize: "14px",
            opacity: parentPressed ? 0.4 : 0.6,
            transition: "opacity 0.12s ease",
          }}
        >
          ▾
        </motion.span>
        <AnimatedUnderline
          active={parentHovered || parentPressed || expanded}
          color={colors.text}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              overflow: "hidden",
              borderLeft: `2px solid ${colors.text}20`,
              marginLeft: "4px",
              marginBottom: "4px",
            }}
          >
            {item.dropdown.map((subItem, idx) => (
              <MobileDropdownItem
                key={subItem.href ?? idx}
                item={subItem}
                colors={colors}
                contentFontFamily={contentFontFamily}
                onSubscriptionClick={onSubscriptionClick}
                onNavigate={onNavigate}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ============================================================
   9.  MobileMenuItem（内联）
   ============================================================ */
const MobileMenuItem = ({
  item,
  index,
  totalItems,
  colors,
  contentFontFamily,
  onSubscriptionClick,
  onNavigate,
}) => {
  const {
    hovered,
    pressed,
    handlers,
    reset,
    handleClick,
    handleKeyDown,
    isSubscription,
  } = useMenuItemNavigation({
    href: item.href,
    onSubscriptionClick,
    onNavigate,
  });

  const itemStyle = buildInteractiveStyle({
    pressed,
    hovered,
    textColor: colors.text,
    baseStyle: { backgroundColor: "transparent", borderRadius: "8px" },
    pressedScale: 0.97,
    hoveredScale: 1.0,
    pressedOpacity: 0.7,
    hoveredOpacity: 1,
    pressedBgAlpha: "12",
    hoveredBgAlpha: "08",
  });

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.2 },
        },
      }}
      className="mb-1"
      style={{ backgroundColor: "transparent" }}
    >
      <NavLink
        href={item.href}
        isSubscription={isSubscription}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onBlur={reset}
        handlers={handlers}
        ariaLabel={item.label}
        style={{
          ...itemStyle,
          display: "block",
          width: "100%",
          textDecoration: "none",
          outline: "none",
          border: "none",
        }}
      >
        <motion.div
          className="flex items-center p-4 relative"
          style={{ backgroundColor: "transparent" }}
        >
          <div
            className="w-2.5 h-px mr-3"
            style={{ backgroundColor: "transparent" }}
          />
          <MenuLabel
            label={item.label}
            colors={colors}
            fontFamily={contentFontFamily}
            hovered={hovered}
            pressed={pressed}
            variant="mobile"
          />
          <AnimatedUnderline active={hovered || pressed} color={colors.text} />
        </motion.div>
      </NavLink>

      {index < totalItems - 1 && <MenuDivider colors={colors} />}
    </motion.div>
  );
};

/* ============================================================
   10. MobileMenuListDrawer（内联）
   ============================================================ */
const MobileMenuListDrawer = ({
  isOpen,
  onClose,
  menuList,
  colors,
  contentFontFamily,
  backgroundColor,
  onSubscriptionClick,
}) => {
  const {
    hovered: closeHovered,
    pressed: closePressed,
    handlers: closeHandlers,
  } = useInteraction({ touchHoverDelay: 80 });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          exit={{ x: "-100vw" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed h-full w-full"
          style={{
            left: 0,
            top: 0,
            backgroundColor: "white",
            zIndex: 1400,
            boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
            border: "none",
            pointerEvents: "auto",
            width: "100vw",
            height: "100vh",
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-20 right-4 w-10 h-10 rounded-full transition-colors"
            style={{
              zIndex: 1401,
              backgroundColor: closePressed
                ? "rgba(0,0,0,0.12)"
                : closeHovered
                ? "rgba(0,0,0,0.06)"
                : "transparent",
              color: "black",
              border: "none",
              outline: "none",
              fontSize: "18px",
              fontWeight: "bold",
              ...TAP_STYLE,
              transform: closePressed ? "scale(0.9)" : "scale(1)",
              transition: "all 0.15s cubic-bezier(0.4,0,0.2,1)",
            }}
            {...closeHandlers}
          >
            ✕
          </button>

          <motion.div
            variants={{
              container: {
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { duration: 0.3, staggerChildren: 0.05 },
                },
              },
            }}
            initial="hidden"
            animate="visible"
            className="pt-20 px-0 h-full w-full"
            style={{
              backgroundColor,
              background: backgroundColor,
              height: "100%",
              width: "100%",
              paddingTop: "80px",
              paddingLeft: "20px",
              paddingRight: "20px",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            {menuList.map((item, index) =>
              item.dropdown && item.dropdown.length > 0 ? (
                <MobileDropdown
                  key={item.href ?? index}
                  item={item}
                  colors={colors}
                  contentFontFamily={contentFontFamily}
                  onSubscriptionClick={onSubscriptionClick}
                  onNavigate={onClose}
                />
              ) : (
                <MobileMenuItem
                  key={item.href ?? index}
                  item={item}
                  index={index}
                  totalItems={menuList.length}
                  colors={colors}
                  contentFontFamily={contentFontFamily}
                  onSubscriptionClick={onSubscriptionClick}
                  onNavigate={onClose}
                />
              )
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ============================================================
   11. MobileNavLayout（内联）
   ============================================================ */
const MobileNavLayout = ({
  colors,
  isDrawerOpen,
  onDrawerToggle,
  menuList,
  contentFontFamily,
  backgroundColor,
  onSubscriptionClick,
}) => (
  <>
    <AppTextTitle positionMode="center" zIndex={1400} />

    {!isDrawerOpen && (
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          position: "fixed",
          top: "60px",
          left: 0,
          right: 0,
          height: "1px",
          backgroundColor: colors.text,
          width: "100%",
          zIndex: 1401,
        }}
      />
    )}

    <div
      className="fixed top-2 left-4"
      style={{ zIndex: 1400, backgroundColor: "transparent" }}
    >
      {!isDrawerOpen && (
        <MenuIconButton
          colors={colors}
          onClick={() => onDrawerToggle(true)}
        />
      )}

      <MobileMenuListDrawer
        isOpen={isDrawerOpen}
        onClose={() => onDrawerToggle(false)}
        menuList={menuList}
        colors={colors}
        contentFontFamily={contentFontFamily}
        backgroundColor={backgroundColor}
        onSubscriptionClick={onSubscriptionClick}
      />
    </div>
  </>
);

/* ============================================================
   12. ManagerNav（最终导出）
   ============================================================ */
const FOCUS_RING_STYLE = `
  a:focus-visible, button:focus-visible {
    outline: 2px solid var(--text-primary, currentColor);
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export default function ManagerNav() {
  const { isCn } = useContext(LanguageContext);
  const { isMobile } = useContext(DeviceContext);
  const { isManager } = useContext(ManagerContext);

  const { colors } = useReverseTheme();
  const { fontFamily: contentFontFamily } = useFont("managerNavLink");
  const { backgroundColor } = useBackgroundColor("transparent", {
    useCustomColor: true,
  });
  const pathname = usePathname();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const languageKey = isCn ? "cn" : "en";
  // Menus come from the Meta document (manager-editable) with the JSON as fallback.
  const { meta: siteMeta } = useSiteMeta();
  const menuSource = siteMeta?.menu || DEFAULT_MENUS;
  const menuList = isManager
    ? menuSource.managerMenu?.[languageKey] || []
    : menuSource.mainMenu?.[languageKey] || [];
  const isManagerPage = pathname?.startsWith("/manager/");

  // 使用 useAsyncAction 包装订阅动作
  const handleSubscribe = useCallback(async () => {
    // 模拟异步请求（例如调用 API）
    console.log("Subscribing...");
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log("Subscribed successfully!");
    // 可以在此触发 UI 通知等
  }, []);

  const { execute: executeSubscribe, isExecuting } = useAsyncAction(handleSubscribe, {
    throttleMs: 1000,
    onSuccess: () => console.log("onSuccess callback"),
    onError: (err) => console.log("Subscription error:", err),
  });

  // 如果有其他自定义动作，也可以类似包装
  // 此处仅演示订阅功能，其他动作可留空或包装

  const handleDrawerToggle = useCallback((isOpen) => {
    setIsDrawerOpen(isOpen);
  }, []);

  return (
    <>
      <style>{FOCUS_RING_STYLE}</style>

      {/* Language switcher — top-right on EVERY manager page. The manager nav
          is centre-aligned, so this is the only control in that corner.
          Hidden while the mobile drawer covers the screen. */}
      {!(isMobile && isDrawerOpen) && (
        <LanguageSwitcherInMenu
          sx={{
            top: isMobile ? "14px" : "24px",
            right: isMobile ? "16px" : "32px",
          }}
        />
      )}

      {isMobile ? (
        <MobileNavLayout
          colors={colors}
          isDrawerOpen={isDrawerOpen}
          onDrawerToggle={handleDrawerToggle}
          menuList={menuList}
          contentFontFamily={contentFontFamily}
          backgroundColor={backgroundColor}
          onSubscriptionClick={executeSubscribe}
        />
      ) : (
        <DesktopNavLayout
          colors={colors}
          menuList={menuList}
          contentFontFamily={contentFontFamily}
          isManagerPage={isManagerPage}
          isCn={isCn}
          onSubscriptionClick={executeSubscribe}
        />
      )}
    </>
  );
}