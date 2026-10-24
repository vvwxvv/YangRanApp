import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { useAsyncAction } from "@/hooks/useAsyncAction"; // 导入自定义 hook

/* ─────────────────────────────────────────────
   Tokens – single source of truth for colors
───────────────────────────────────────────── */
const token = (isDark) => ({
  border: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)",
  borderFocus: isDark ? "#fff" : "#000",
  bg: isDark ? "#1a1a1a" : "#fff",
  menuBg: isDark ? "#222" : "#fff",
  text: isDark ? "#f2f2f2" : "#111",
  selectedBg: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.07)",
  hoverBg: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)",
  shadow: isDark
    ? "0 8px 32px rgba(0,0,0,0.55)"
    : "0 8px 32px rgba(0,0,0,0.12)",
  scrollbar: isDark ? "#444" : "#ccc",
});

/* ─────────────────────────────────────────────
   Framer-Motion variants
───────────────────────────────────────────── */
const menuVariants = {
  closed: {
    opacity: 0,
    scaleY: 0.92,
    y: -4,
    transition: { duration: 0.13, ease: [0.4, 0, 1, 1] },
  },
  open: {
    opacity: 1,
    scaleY: 1,
    y: 0,
    transition: { duration: 0.18, ease: [0, 0, 0.2, 1] },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.12, delay: i * 0.025 },
  }),
};

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
const DropdownToggleButtonGroup = ({
  fieldGroup,
  setFieldGroup,
  allFieldGroups = [],
  isDark = false,
  placeholder = "Select Group",
  disabled = false,
  maxMenuHeight = 300,
  throttleMs = 800, // 新增：节流时间（毫秒），0 表示禁用节流
}) => {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const listId = useId();
  const triggerId = useId();

  const t = token(isDark);
  const selectedGroup = allFieldGroups.find((g) => g.key === fieldGroup);
  const selectedIndex = allFieldGroups.findIndex((g) => g.key === fieldGroup);

  /* ── Open / close ── */
  const openMenu = useCallback(() => {
    if (disabled) return;
    setOpen(true);
    setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [disabled, selectedIndex]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setFocusedIndex(-1);
  }, []);

  const toggleMenu = useCallback(() => {
    open ? closeMenu() : openMenu();
  }, [open, openMenu, closeMenu]);

  /* ── Async change with throttling ── */
  // 将 setFieldGroup 包装为异步函数（立即 resolve）
  const asyncChange = useCallback(async (key) => {
    setFieldGroup(key);
  }, [setFieldGroup]);

  const { execute, isExecuting } = useAsyncAction(asyncChange, {
    throttleMs: throttleMs > 0 ? throttleMs : 0,
    onSuccess: () => {
      // 选择成功后关闭菜单并聚焦触发器
      closeMenu();
      requestAnimationFrame(() => triggerRef.current?.focus());
    },
    onError: (err) => {
      console.warn("Dropdown selection error:", err);
    },
  });

  /* ── Selection ── */
  const handleSelect = useCallback(
    (key) => {
      if (disabled || isExecuting) return;

      if (throttleMs === 0) {
        // 无节流：直接更新
        setFieldGroup(key);
        closeMenu();
        requestAnimationFrame(() => triggerRef.current?.focus());
      } else {
        // 使用节流
        execute(key);
      }
    },
    [disabled, isExecuting, throttleMs, setFieldGroup, closeMenu, execute]
  );

  /* ── Click outside ── */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handler, true);
    document.addEventListener("touchstart", handler, true);
    return () => {
      document.removeEventListener("mousedown", handler, true);
      document.removeEventListener("touchstart", handler, true);
    };
  }, [open, closeMenu]);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < allFieldGroups.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : allFieldGroups.length - 1
          );
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedIndex >= 0 && allFieldGroups[focusedIndex]) {
            handleSelect(allFieldGroups[focusedIndex].key);
          }
          break;
        case "Escape":
          e.preventDefault();
          closeMenu();
          triggerRef.current?.focus();
          break;
        case "Home":
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedIndex(allFieldGroups.length - 1);
          break;
        case "Tab":
          closeMenu();
          break;
        default: {
          const char = e.key.toLowerCase();
          if (char.length === 1) {
            const idx = allFieldGroups.findIndex((g) =>
              g.label?.toLowerCase().startsWith(char)
            );
            if (idx >= 0) setFocusedIndex(idx);
          }
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, focusedIndex, allFieldGroups, handleSelect, closeMenu]);

  /* ── Scroll focused item into view ── */
  useEffect(() => {
    if (!open || focusedIndex < 0 || !menuRef.current) return;
    const items = menuRef.current.querySelectorAll("[role='option']");
    items[focusedIndex]?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex, open]);

  /* ── Styles ── */
  const triggerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    width: "100%",
    padding: "10px 14px",
    background: t.bg,
    color: t.text,
    border: `1.5px solid ${open ? t.borderFocus : t.border}`,
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    letterSpacing: "0.01em",
    cursor: disabled || isExecuting ? "not-allowed" : "pointer",
    opacity: disabled || isExecuting ? 0.45 : 1,
    outline: "none",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
    minHeight: "44px",
    boxSizing: "border-box",
  };

  const menuStyle = {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    width: "100%",
    background: t.menuBg,
    border: `1.5px solid ${t.border}`,
    borderRadius: "6px",
    boxShadow: t.shadow,
    zIndex: 9999,
    overflow: "hidden",
    transformOrigin: "top center",
  };

  const scrollStyle = {
    maxHeight: `${maxMenuHeight}px`,
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarWidth: "thin",
    scrollbarColor: `${t.scrollbar} transparent`,
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {/* ── Trigger button ── */}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-disabled={disabled || isExecuting}
        disabled={disabled || isExecuting}
        onClick={toggleMenu}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = `0 0 0 3px ${
            isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)"
          }`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
        style={triggerStyle}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selectedGroup?.label || placeholder}
          {isExecuting && " …"} {/* 可选：显示加载指示 */}
        </span>

        <motion.svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </button>

      {/* ── Dropdown menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown-menu"
            style={menuStyle}
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div
              ref={menuRef}
              id={listId}
              role="listbox"
              aria-labelledby={triggerId}
              style={scrollStyle}
            >
              {allFieldGroups.length === 0 ? (
                <div
                  style={{
                    padding: "12px 14px",
                    fontSize: "13px",
                    color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)",
                    textAlign: "center",
                  }}
                >
                  No options available
                </div>
              ) : (
                allFieldGroups.map((group, i) => {
                  const isSelected = group.key === fieldGroup;
                  const isFocused = i === focusedIndex;

                  return (
                    <motion.button
                      key={group.key}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => handleSelect(group.key)}
                      onMouseEnter={() => setFocusedIndex(i)}
                      tabIndex={-1}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        width: "100%",
                        padding: "10px 14px",
                        background: isSelected
                          ? t.selectedBg
                          : isFocused
                          ? t.hoverBg
                          : "transparent",
                        color: t.text,
                        fontSize: "13px",
                        fontWeight: isSelected ? "600" : "400",
                        cursor: isExecuting ? "not-allowed" : "pointer",
                        border: "none",
                        borderLeft: isSelected
                          ? `3px solid ${isDark ? "#fff" : "#000"}`
                          : "3px solid transparent",
                        textAlign: "left",
                        outline: isFocused
                          ? `2px solid ${isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.2)"}`
                          : "none",
                        outlineOffset: "-2px",
                        transition: "background 0.1s ease, border-color 0.1s ease",
                        WebkitTapHighlightColor: "transparent",
                        minHeight: "44px",
                        boxSizing: "border-box",
                        letterSpacing: "0.01em",
                        opacity: isExecuting ? 0.5 : 1,
                      }}
                      disabled={isExecuting}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: isSelected
                            ? isDark ? "#fff" : "#000"
                            : "transparent",
                          flexShrink: 0,
                          transition: "background 0.15s ease",
                        }}
                      />
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {group.label}
                      </span>
                    </motion.button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

DropdownToggleButtonGroup.propTypes = {
  fieldGroup: PropTypes.string,
  setFieldGroup: PropTypes.func.isRequired,
  allFieldGroups: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  isDark: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  maxMenuHeight: PropTypes.number,
  throttleMs: PropTypes.number, // 新增
};

export default DropdownToggleButtonGroup;