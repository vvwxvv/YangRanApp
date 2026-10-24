"use client";

import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { ArrowForwardIos as ArrowForwardIcon } from "@mui/icons-material";
import { getEventLabel } from "@/components/labels/event_labels";

// ─── Underline ────────────────────────────────────────────────────────────────
const EventListUnderline = ({ isHovered, isPressed }) => (
  <Box
    component="span"
    sx={{ position: "absolute", left: 0, right: 0, bottom: -2, height: "2px", zIndex: 0 }}
  >
    <span
      style={{
        display:         "block",
        width:           "100%",
        height:          "2px",
        background:      "linear-gradient(90deg, var(--text-primary, #000000) 0%, rgba(0,0,0,0.6) 100%)",
        borderRadius:    "1px",
        transform:       isHovered && !isPressed ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition:      "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents:   "none",
      }}
    />
  </Box>
);

EventListUnderline.propTypes = {
  isHovered: PropTypes.bool.isRequired,
  isPressed: PropTypes.bool.isRequired,
};

// ─── Arrow ────────────────────────────────────────────────────────────────────
const EventListArrow = ({ isSelected }) => (
  <div
    className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0 pr-1 md:pr-2"
    style={{ position: "relative", zIndex: 1, pointerEvents: "none" }}
  >
    <ArrowForwardIcon
      className="text-black dark:text-white"
      style={{ pointerEvents: "none" }}
    />
  </div>
);

EventListArrow.propTypes = {
  isSelected: PropTypes.bool.isRequired,
};

// ─── Main component ───────────────────────────────────────────────────────────
const ListSelectButton = ({
  event,
  isSelected,
  onSelect,
  contentFontFamily,
  isHovered,
  renderMeta,
}) => {
  const [pressed, setPressed] = useState(false);

  const itemId = event?._id || event?.id;

  const handlePointerDown  = useCallback(() => setPressed(true),  []);
  const handlePointerLeave = useCallback(() => setPressed(false), []);
  const handlePointerUp    = useCallback((e) => {
    setPressed(false);
    e.stopPropagation();
    onSelect?.(itemId);
  }, [onSelect, itemId]);

  // Keyboard fallback
  const handleClick = useCallback((e) => {
    if (e.pointerType === "") {
      e.stopPropagation();
      onSelect?.(itemId);
    }
  }, [onSelect, itemId]);

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      aria-label={`Select event: ${event.title}`}
      aria-pressed={isSelected}
      className={[
        "w-full text-left transition-all duration-200 p-3 md:p-4 group relative border-b border-black dark:border-white touch-manipulation",
        isSelected
          ? "bg-white dark:bg-black text-black dark:text-white border-b-2 border-black dark:border-white"
          : "hover:border-b-black dark:hover:border-b-white hover:border-b-[1px]",
      ].join(" ")}
      style={{
        transform:               pressed ? "scale(0.99)" : "scale(1)",
        opacity:                 pressed ? 0.75 : 1,
        transition:              pressed
          ? "transform 0.05s ease-out, opacity 0.05s ease-out"
          : "transform 0.18s ease-out, opacity 0.18s ease-out",
        WebkitTapHighlightColor: "transparent",
        touchAction:             "manipulation",
        userSelect:              "none",
        WebkitUserSelect:        "none",
      }}
    >
      <div className="flex items-center justify-between w-full">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <Box className="flex items-center space-x-3 relative">
            <EventListUnderline isHovered={isHovered} isPressed={pressed} />
            <Typography
              variant="body1"
              className="font-black tracking-tight leading-tight break-words whitespace-normal"
              sx={{
                fontWeight:  900,
                fontFamily:  contentFontFamily,
                wordBreak:   "break-word",
                whiteSpace:  "normal",
                fontSize:    "14px",
                position:    "relative",
                zIndex:      1,
                pointerEvents: "none",
              }}
            >
              {event.title || getEventLabel("untitled")}
            </Typography>
            {renderMeta}
          </Box>
        </div>

        <EventListArrow isSelected={isSelected} />
      </div>
    </button>
  );
};

ListSelectButton.propTypes = {
  event:             PropTypes.object.isRequired,
  isSelected:        PropTypes.bool.isRequired,
  onSelect:          PropTypes.func.isRequired,
  contentFontFamily: PropTypes.string,
  isHovered:         PropTypes.bool.isRequired,
  renderMeta:        PropTypes.node,
};

export default ListSelectButton;