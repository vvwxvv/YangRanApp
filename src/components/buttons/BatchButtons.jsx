"use client";

import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Stack } from "@mui/material";
import { StyledButton } from "./styledTableComponents";
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { getSystemLabel } from "@/components/labels/system_labels";
import { motion } from "framer-motion";
import useButtonStyle from "@/hooks/useButtonStyle";

const getTableLabel = (key, isCn) => getSystemLabel(key, isCn ? "CN" : "EN");

// ─── Reusable animated wrapper ────────────────────────────────────────────────
// Replaces the repeated `motion.div whilehover={...}` pattern (which was also
// using the wrong lowercase `whilehover` prop — silently ignored by Framer).
const MotionButton = ({ hoverStyle, onClick, disabled, children, buttonStyle }) => {
  const [pressed, setPressed] = useState(false);

  const handlePointerDown  = useCallback(() => { if (!disabled) setPressed(true);  }, [disabled]);
  const handlePointerLeave = useCallback(() => setPressed(false), []);
  const handlePointerUp    = useCallback((e) => {
    setPressed(false);
    if (!disabled) onClick?.(e);
  }, [disabled, onClick]);

  // Keyboard fallback
  const handleClick = useCallback((e) => {
    if (e.pointerType === "" && !disabled) onClick?.(e);
  }, [disabled, onClick]);

  return (
    <motion.div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      // ↓ whileHover (camelCase) — `whilehover` lowercase is silently ignored
      whileHover={pressed || disabled ? undefined : hoverStyle}
      animate={{
        scale:   pressed && !disabled ? 0.95 : 1,
        opacity: pressed && !disabled ? 0.7  : 1,
      }}
      transition={
        pressed
          ? { duration: 0.05 }
          : { duration: 0.18, ease: "easeOut" }
      }
      style={{
        display:             "inline-block",
        WebkitTapHighlightColor: "transparent",
        touchAction:         "manipulation",
        userSelect:          "none",
        WebkitUserSelect:    "none",
      }}
    >
      {/* StyledButton receives no onClick — MotionButton owns all pointer logic */}
      <StyledButton
        tabIndex={-1}       // wrapper is the interactive element
        disabled={disabled}
        style={{ ...buttonStyle, pointerEvents: "none" }}
      >
        {children}
      </StyledButton>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function BatchButtons({
  hasChanges    = false,
  isSaving      = false,
  selectedRows  = [],
  processedData = [],
  onSave,
  onAdd,
  onDelete,
  onExport,
  onEdit,
  isCn,
  mode = "batch",
}) {
  const safeSelectedRows = Array.isArray(selectedRows) ? selectedRows : [];
  const {
    editButtonStyle,
    editButtonHover,
    deleteButtonStyle,
    deleteButtonHover,
  } = useButtonStyle();

  // ── Item mode ───────────────────────────────────────────────────────────
  if (mode === "item") {
    return (
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap">
        <MotionButton
          hoverStyle={editButtonHover}
          buttonStyle={{ ...editButtonStyle }}
          onClick={onEdit}
        >
          <EditIcon style={{ pointerEvents: "none" }} />
          {getTableLabel("edit", isCn)}
        </MotionButton>

        <MotionButton
          hoverStyle={deleteButtonHover}
          buttonStyle={{ ...deleteButtonStyle }}
          onClick={onDelete}
        >
          <DeleteIcon style={{ pointerEvents: "none" }} />
          {getTableLabel("delete", isCn)}
        </MotionButton>
      </Stack>
    );
  }

  // ── Batch mode ──────────────────────────────────────────────────────────
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap">
      <StyledButton
        variant="contained"
        startIcon={<SaveIcon style={{ pointerEvents: "none" }} />}
        onClick={onSave}
        disabled={!hasChanges || isSaving}
      >
        {isSaving ? getTableLabel("saving", isCn) : getTableLabel("save", isCn)}
      </StyledButton>

      <StyledButton
        variant="outlined"
        startIcon={<AddIcon style={{ pointerEvents: "none" }} />}
        onClick={onAdd}
      >
        {getTableLabel("addRow", isCn)}
      </StyledButton>

      <MotionButton
        hoverStyle={deleteButtonHover}
        buttonStyle={{ ...deleteButtonStyle }}
        onClick={onDelete}
        disabled={safeSelectedRows.length === 0}
      >
        <DeleteIcon style={{ pointerEvents: "none" }} />
        {getTableLabel("deleteSelected", isCn)}
        {safeSelectedRows.length > 0 && ` (${safeSelectedRows.length})`}
      </MotionButton>

      <StyledButton
        variant="outlined"
        startIcon={<DownloadIcon style={{ pointerEvents: "none" }} />}
        onClick={onExport}
        disabled={processedData.length === 0}
      >
        {getTableLabel("exportData", isCn)}
      </StyledButton>
    </Stack>
  );
}

BatchButtons.propTypes = {
  hasChanges:    PropTypes.bool,
  isSaving:      PropTypes.bool,
  selectedRows:  PropTypes.array,
  processedData: PropTypes.array,
  onSave:        PropTypes.func,
  onAdd:         PropTypes.func,
  onDelete:      PropTypes.func,
  onExport:      PropTypes.func,
  onEdit:        PropTypes.func,
  isCn:          PropTypes.bool,
  mode:          PropTypes.oneOf(["batch", "item"]),
};