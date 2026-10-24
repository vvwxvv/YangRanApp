"use client";

import React, { useState, useCallback } from "react";
import { Edit, Trash2 as Delete } from "lucide-react";

// ─── Single action button ─────────────────────────────────────────────────────
const ActionButton = ({ onAction, ariaLabel, className }) => {
  const [pressed, setPressed] = useState(false);

  const handlePointerDown  = useCallback(() => setPressed(true),  []);
  const handlePointerLeave = useCallback(() => setPressed(false), []);
  const handlePointerUp    = useCallback((e) => {
    setPressed(false);
    e.stopPropagation();
    onAction?.();
  }, [onAction]);

  // Keyboard fallback
  const handleClick = useCallback((e) => {
    if (e.pointerType === "") {
      e.stopPropagation();
      onAction?.();
    }
  }, [onAction]);

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`${className} touch-manipulation`}
      style={{
        transform:               pressed ? "scale(0.88)" : "scale(1)",
        opacity:                 pressed ? 0.6 : 1,
        transition:              pressed
          ? "transform 0.05s ease-out, opacity 0.05s ease-out"
          : "transform 0.18s ease-out, opacity 0.18s ease-out",
        WebkitTapHighlightColor: "transparent",
        touchAction:             "manipulation",
        userSelect:              "none",
        WebkitUserSelect:        "none",
      }}
    >
      {/* pointerEvents:none prevents icon intercepting onPointerDown */}
      {ariaLabel?.includes("编辑") || ariaLabel === "Edit"
        ? <Edit   size={18} className="text-current" style={{ pointerEvents: "none" }} />
        : <Delete size={18} className="text-current" style={{ pointerEvents: "none" }} />
      }
    </button>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const EditDeleteButtonsInList = ({ onEdit, onDelete, item, config, isCn }) => {
  if (!onEdit && !onDelete) return null;

  const itemId = item?._id || item?.id;

  const handleEdit   = useCallback(() => onEdit?.(itemId), [onEdit,   itemId]);
  const handleDelete = useCallback(() => onDelete?.(item), [onDelete, item]);

  return (
    <div
      className={`flex items-center justify-center ${config.ui.spacing.buttonGap} pb-2`}
      style={{ marginTop: 50, marginBottom: 10 }}
    >
      {onEdit && (
        <ActionButton
          onAction={handleEdit}
          ariaLabel={isCn ? "编辑" : "Edit"}
          className={config.buttons.action}
        />
      )}

      {onEdit && onDelete && (
        <div className="h-6 w-1 bg-black dark:bg-white" aria-hidden="true" />
      )}

      {onDelete && (
        <ActionButton
          onAction={handleDelete}
          ariaLabel={isCn ? "删除" : "Delete"}
          className={config.buttons.action}
        />
      )}
    </div>
  );
};

export default EditDeleteButtonsInList;