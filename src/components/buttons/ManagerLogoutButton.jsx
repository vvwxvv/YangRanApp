"use client";

import { useState, useCallback, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import LogoutIcon from "@mui/icons-material/Logout";

/**
 * ManagerLogoutButton - Production-ready logout button for manager routes
 * @param {Object} props
 * @param {Object} props.colors - Theme colors { text, background }
 * @param {string} props.contentFontFamily - Font family for text
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disable the button
 * @param {string} props.ariaLabel - Accessible label override
 */
export default function ManagerLogoutButton({
  colors,
  contentFontFamily,
  onClick,
  disabled = false,
  ariaLabel = "Log out",
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Prevent ghost click on touch devices (touch → mouseover → click)
  const touchActivatedRef = useRef(false);

  const handleClick = useCallback(
    (e) => {
      if (disabled) return;
      onClick?.(e);
    },
    [disabled, onClick]
  );

  const handleMouseEnter = useCallback(() => {
    if (touchActivatedRef.current) return; // skip on touch devices
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);

  const handleMouseDown = useCallback(() => {
    if (!touchActivatedRef.current) setIsPressed(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleTouchStart = useCallback(() => {
    touchActivatedRef.current = true;
    setIsHovered(true);
    setIsPressed(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
    // Reset after a short delay so ghost mouse events are blocked
    setTimeout(() => {
      touchActivatedRef.current = false;
    }, 500);
  }, []);

  const handleTouchCancel = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
    touchActivatedRef.current = false;
  }, []);

  const isActive = isHovered || isFocused;

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      // Accessibility
      aria-label={ariaLabel}
      aria-disabled={disabled}
      role="button"
      type="button"
      disabled={disabled}
      // Framer Motion tap — disabled on reduced-motion
      whileTap={
        !prefersReducedMotion && !disabled
          ? { scale: 0.93, transition: { duration: 0.06 } }
          : {}
      }
      style={{
        // Reset
        appearance: "none",
        WebkitAppearance: "none",
        border: "none",
        background: "transparent",
        backgroundColor: "transparent",
        padding: 0,
        margin: 0,
        // Layout
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        // Sizing — min 44×44 touch target (Apple HIG / WCAG 2.5.5)
        minWidth: 44,
        minHeight: 44,
        width: 44,
        height: 44,
        // Cursor & interaction
        cursor: disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        // Focus ring via outline (visible on keyboard nav only)
        outline: isFocused ? `2px solid ${colors?.text ?? "var(--text-primary, #000)"}` : "none",
        outlineOffset: 2,
        borderRadius: 6,
        // Reduced opacity when disabled
        opacity: disabled ? 0.4 : 1,
        fontFamily: contentFontFamily,
        // GPU-composited so it doesn't repaint parent layers
        willChange: "transform",
      }}
    >
      <motion.span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: colors?.text ?? "currentColor",
          // Smooth opacity shift; skip on reduced-motion
          transition: prefersReducedMotion ? "none" : "opacity 0.12s ease",
          opacity: isActive ? 0.65 : isPressed ? 0.5 : 1,
          pointerEvents: "none", // let the button handle all events
        }}
      >
        <LogoutIcon sx={{ fontSize: "20px", display: "block" }} />
      </motion.span>
    </motion.button>
  );
}