"use client";
import React, { useState, useCallback } from 'react';
import { Edit, Trash2 } from 'lucide-react';

const SIZE_MAP = {
  small:   { icon: 10, padding: 'p-1.5' },
  default: { icon: 12, padding: 'p-2'   },
  large:   { icon: 15, padding: 'p-2.5' },
};

/**
 * EditDeleteButtons
 *
 * @param {Function} onEdit   - Called when Edit is tapped/clicked
 * @param {Function} onDelete - Called when Delete is tapped/clicked
 * @param {boolean}  disabled - Disables both buttons
 * @param {string}   size     - "small" | "default" | "large"
 */

// ─── Single action button ─────────────────────────────────────────────────────
// Extracted so each button has independent pressed state without violating
// Rules of Hooks (no useState inside a conditional or map).
const ActionButton = ({ onAction, ariaLabel, iconSize, padding, disabled }) => {
  const [pressed, setPressed] = useState(false);

  const handlePointerDown  = useCallback(() => { if (!disabled) setPressed(true);  }, [disabled]);
  const handlePointerLeave = useCallback(() => setPressed(false), []);
  const handlePointerUp    = useCallback((e) => {
    setPressed(false);
    e.stopPropagation();
    if (!disabled) onAction?.(e);
  }, [disabled, onAction]);

  // Keyboard fallback (Enter / Space → pointerType "")
  const handleClick = useCallback((e) => {
    if (e.pointerType === "" && !disabled) {
      e.stopPropagation();
      onAction?.(e);
    }
  }, [disabled, onAction]);

  const buttonClass = [
    padding,
    'rounded-full',
    'transition-colors duration-150',
    'text-black dark:text-white',
    'hover:text-white dark:hover:text-black',
    'hover:bg-black dark:hover:bg-white',
    // active:scale-90 removed — CSS :active has ~300ms delay on mobile.
    // Press feedback is driven by pointer state below (instant).
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
    'focus-visible:ring-black dark:focus-visible:ring-white',
    'touch-manipulation select-none',
  ].join(' ');

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={buttonClass}
      style={{
        transform:               pressed && !disabled ? 'scale(0.88)' : 'scale(1)',
        opacity:                 pressed && !disabled ? 0.65 : 1,
        transition:              pressed
          ? 'transform 0.05s ease-out, opacity 0.05s ease-out'
          : 'transform 0.18s ease-out, opacity 0.18s ease-out',
        WebkitTapHighlightColor: 'transparent',
        touchAction:             'manipulation',
        userSelect:              'none',
        WebkitUserSelect:        'none',
      }}
    >
      {/* pointerEvents:none prevents icon intercepting onPointerDown */}
      {ariaLabel === 'Edit'
        ? <Edit   size={iconSize} style={{ pointerEvents: 'none' }} />
        : <Trash2 size={iconSize} style={{ pointerEvents: 'none' }} />
      }
    </button>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const EditDeleteButtons = ({
  onEdit,
  onDelete,
  disabled = false,
  size = 'default',
}) => {
  const { icon: iconSize, padding } = SIZE_MAP[size] ?? SIZE_MAP.default;

  return (
    <div className="flex items-center gap-1 mr-2.5 group">
      <ActionButton
        onAction={onEdit}
        ariaLabel="Edit"
        iconSize={iconSize}
        padding={padding}
        disabled={disabled}
      />

      <span
        aria-hidden="true"
        className={[
          'text-xs select-none pointer-events-none transition-colors',
          'text-black dark:text-white',
          'group-hover:text-white dark:group-hover:text-black',
        ].join(' ')}
      >
        |
      </span>

      <ActionButton
        onAction={onDelete}
        ariaLabel="Delete"
        iconSize={iconSize}
        padding={padding}
        disabled={disabled}
      />
    </div>
  );
};

export default EditDeleteButtons;