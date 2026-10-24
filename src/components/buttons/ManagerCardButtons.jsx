"use client";

import React, { useState, useCallback } from "react";
import useFont from '@/hooks/useFont';

// Reusable single button with pointer-event based press feedback.
// Avoids onClick + onTouchEnd double-fire pattern.
const ActionButton = ({ onAction, ariaLabel, className, children }) => {
  const [pressed, setPressed] = useState(false);
  const { buttonFontFamily } = useFont();

  const handlePointerDown = useCallback(() => setPressed(true), []);
  const handlePointerLeave = useCallback(() => setPressed(false), []);
  const handlePointerUp = useCallback(
    (e) => {
      setPressed(false);
      e.stopPropagation();
      onAction?.();
    },
    [onAction]
  );
  // Keyboard fallback (Enter / Space) — pointerType is "" for keyboard clicks
  const handleClick = useCallback(
    (e) => {
      if (e.pointerType === "") {
        e.stopPropagation();
        onAction?.();
      }
    },
    [onAction]
  );

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      aria-label={ariaLabel}
      className={className}
      style={{
        fontFamily: buttonFontFamily,
        transform: pressed ? "scale(0.88)" : "scale(1)",
        opacity: pressed ? 0.7 : 1,
        transition: pressed
          ? "transform 0.05s ease-out, opacity 0.05s ease-out"
          : "transform 0.15s ease-out, opacity 0.15s ease-out",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {children}
    </button>
  );
};

const ManagerButtons = React.memo(
  ({ onEdit, onDelete, itemId, isCn = false, className = "" }) => {
    const handleEdit   = useCallback(() => onEdit?.(itemId),   [onEdit,   itemId]);
    const handleDelete = useCallback(() => onDelete?.(itemId), [onDelete, itemId]);

    return (
      <div
        className={`absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 ${className}`}
      >
        <ActionButton
          onAction={handleEdit}
          ariaLabel={isCn ? "编辑项目" : "Edit item"}
          className="p-1.5 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-xs font-medium shadow-sm touch-manipulation"
        >
          {isCn ? "编辑" : "Edit"}
        </ActionButton>

        <ActionButton
          onAction={handleDelete}
          ariaLabel={isCn ? "删除项目" : "Delete item"}
          className="p-1.5 bg-red-600 dark:bg-red-500 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors text-xs font-medium shadow-sm touch-manipulation"
        >
          {isCn ? "删除" : "Delete"}
        </ActionButton>
      </div>
    );
  }
);

ManagerButtons.displayName = "ManagerButtons";

export default ManagerButtons;