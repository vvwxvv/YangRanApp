"use client";

import React, { useState, useCallback } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";

/**
 * AddButton
 *
 * @param {Function} onClick       — called on press
 * @param {string}   tooltipTitle  — tooltip text
 * @param {Object}   sx            — MUI sx overrides
 * @param {Object}   style         — inline style overrides
 * @param {boolean}  disabled      — disables the button
 * @param {string}   className     — extra CSS classes
 * @param {Object}   fontStyle     — merged into sx
 */
const AddButton = ({
  onClick,
  tooltipTitle = "Add",
  sx           = {},
  style        = {},
  disabled     = false,
  className    = "",
  fontStyle    = {},
  ...props
}) => {
  const [pressed, setPressed] = useState(false);

  const handlePointerDown  = useCallback((e) => {
    e.stopPropagation();
    if (!disabled) setPressed(true);
  }, [disabled]);

  const handlePointerLeave = useCallback(() => setPressed(false), []);

  const handlePointerUp    = useCallback((e) => {
    setPressed(false);
    e.stopPropagation();
    if (!disabled) onClick?.(e);
  }, [disabled, onClick]);

  // Keyboard fallback (Enter / Space → pointerType "")
  const handleClick = useCallback((e) => {
    if (e.pointerType === "" && !disabled) onClick?.(e);
  }, [disabled, onClick]);

  const defaultSx = {
    color:           "var(--text-primary, #000000)",
    width:           40,
    height:          40,
    backgroundColor: "transparent",
    cursor:          disabled ? "not-allowed" : "pointer",
    transform:       pressed ? "scale(0.88)" : "scale(1)",
    opacity:         pressed ? 0.55 : 1,
    transition:      pressed
      ? "transform 0.05s ease-out, opacity 0.05s ease-out"
      : "transform 0.18s ease-out, opacity 0.18s ease-out",
    "&:hover": {
      backgroundColor: "transparent",
      opacity:         pressed ? 0.55 : 0.7,
    },
    "&.Mui-disabled": {
      opacity:        0.4,
      pointerEvents: "auto", // keeps cursor: not-allowed visible
      cursor:        "not-allowed",
    },
    touchAction:             "manipulation",
    WebkitTapHighlightColor: "transparent",
    userSelect:              "none",
    WebkitUserSelect:        "none",
    ...fontStyle,
    ...sx,
  };

  return (
    <Tooltip title={tooltipTitle}>
      {/* Tooltip requires a single forwardRef child — span wrapper satisfies
          that when IconButton is disabled (MUI disables pointer events on it) */}
      <span style={{ display: "inline-flex" }}>
        <IconButton
          type="button"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
          disabled={disabled}
          aria-label={tooltipTitle}
          className={`touch-manipulation ${className}`}
          sx={defaultSx}
          style={{
            WebkitTapHighlightColor: "transparent",
            touchAction:             "manipulation",
            ...style,
          }}
          {...props}
        >
          <Add style={{ pointerEvents: "none" }} />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default AddButton;