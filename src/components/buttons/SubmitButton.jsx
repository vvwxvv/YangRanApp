"use client";
import React, { useState, useCallback } from 'react';
import { FormControl, Button } from '@mui/material';
import { motion } from "framer-motion";
import { itemVariants } from "@/components/animations/AnimationVariants";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import { Loader2 } from 'lucide-react';

// ─── Style Constants ──────────────────────────────────────────────────────────
const BASE_BUTTON_STYLES = {
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: '8px',
  position: 'relative',
  transition: 'all 0.2s ease-in-out',
  touchAction: 'manipulation',
  WebkitTapHighlightColor: 'transparent',
  userSelect: 'none',
  cursor: 'pointer',
};

// ─── Size Map ─────────────────────────────────────────────────────────────────
const SIZE_MAP = {
  small:  { py: 0.5, px: 1.5, fontSize: '12px', minHeight: '32px' },
  medium: { py: 1,   px: 2,   fontSize: '14px', minHeight: '40px' },
  large:  { py: 1.5, px: 3,   fontSize: '16px', minHeight: '48px' },
};

const ICON_SIZE_MAP = { small: 13, medium: 16, large: 19 };

const VARIANTS = ['primary', 'secondary', 'success', 'error', 'warning'];
const DEFAULT_TEXTS = { submit: 'Submit', submitting: 'Submitting…' };

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * SubmitButton
 *
 * @param {boolean}  isSubmitting     - Form is currently submitting
 * @param {string}   submitText       - Label when idle
 * @param {string}   submittingText   - Label when submitting
 * @param {boolean}  isCn             - Drives animation key for lang switch
 * @param {string}   variant          - primary | secondary | success | error | warning
 * @param {string}   size             - small | medium | large
 * @param {boolean}  fullWidth        - Stretch to container width
 * @param {boolean}  disabled         - Explicitly disabled
 * @param {Function} onClick          - Optional click handler
 * @param {Object}   customStyles     - { button: {}, formControl: {} } overrides
 * @param {boolean}  showLoadingIcon  - Show spinner while submitting
 * @param {boolean}  disableAnimation - Skip Framer Motion wrapper
 * @param {string}   ariaLabel        - Accessibility label override
 * @param {Object}   colors           - Theme color object override
 */
const SubmitButton = ({
  isSubmitting     = false,
  submitText       = DEFAULT_TEXTS.submit,
  submittingText   = DEFAULT_TEXTS.submitting,
  isCn             = false,
  variant          = 'primary',
  size             = 'medium',
  fullWidth        = true,
  disabled         = false,
  onClick,
  customStyles     = {},
  showLoadingIcon  = true,
  disableAnimation = false,
  ariaLabel,
  colors,
  ...rest
}) => {
  // ─── Press state ─────────────────────────────────────────────
  // whileTap uses Framer's gesture recogniser which delays ~50ms on mobile
  // while it decides whether the touch is a tap or a scroll.
  // Driving scale from pointerDown state snaps the animation instantly.
  const [pressed, setPressed] = useState(false);

  // ─── Validation ─────────────────────────────────────────────
  const resolvedVariant = VARIANTS.includes(variant)
    ? variant
    : (console.warn(`SubmitButton: unknown variant "${variant}", using "primary".`), 'primary');

  const resolvedSize = SIZE_MAP[size] ? size : 'medium';
  const isDisabled   = disabled || isSubmitting;

  // ─── Theme ──────────────────────────────────────────────────
  const themeColors = useReverseTheme();
  const c = colors || themeColors.colors;

  // ─── Button sx ──────────────────────────────────────────────
  const buttonSx = {
    ...BASE_BUTTON_STYLES,
    ...SIZE_MAP[resolvedSize],
    backgroundColor: c.background,
    color:           c.text,
    border:          `1px solid ${c.border}`,
    boxShadow:       '0 4px 12px rgba(0,0,0,0.15)',

    '&:hover': {
      backgroundColor:         c.background,
      color:                   c.text,
      boxShadow:               '0 6px 16px rgba(0,0,0,0.2)',
      transform:               'translateY(-1px)',
      border:                  `2px solid ${c.border}`,
      textDecoration:          'underline',
      textUnderlineOffset:     '3px',
      textDecorationThickness: '2px',
      textDecorationColor:     c.text,
    },

    '&:active': {
      transform:               'translateY(0)',
      boxShadow:               '0 2px 8px rgba(0,0,0,0.15)',
      textDecoration:          'underline',
      textUnderlineOffset:     '3px',
      textDecorationThickness: '2px',
      textDecorationColor:     c.text,
    },

    '&.Mui-disabled': {
      backgroundColor: c.surface,
      color:           c.text,
      opacity:         0.55,
      boxShadow:       'none',
      border:          `1px solid ${c.border}`,
      cursor:          'not-allowed',
      pointerEvents:   'auto',
    },

    ...customStyles.button,
  };

  // ─── Handlers ────────────────────────────────────────────────
  // No onTouchEnd — touch→click is handled natively by the browser.
  // Pointer events unify mouse + touch in one clean event stream.
  const handlePointerDown  = useCallback(() => { if (!isDisabled) setPressed(true);  }, [isDisabled]);
  const handlePointerUp    = useCallback((e) => {
    setPressed(false);
    if (isDisabled) return;
    onClick?.(e);
  }, [isDisabled, onClick]);
  const handlePointerLeave = useCallback(() => setPressed(false), []);

  // Keyboard fallback: Enter/Space on a focused button fires a click
  // with pointerType === "" — handle it here, not in a separate onKeyDown.
  const handleClick = useCallback((e) => {
    if (e.pointerType === "" && !isDisabled) onClick?.(e);
  }, [isDisabled, onClick]);

  // ─── Loading icon ─────────────────────────────────────────────
  const loadingIcon = showLoadingIcon && isSubmitting
    ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'inline-flex', alignItems: 'center', marginRight: 4 }}
        >
          <Loader2 size={ICON_SIZE_MAP[resolvedSize]} />
        </motion.span>
      )
    : null;

  // ─── Wrapper ─────────────────────────────────────────────────
  const label = isSubmitting ? submittingText : submitText;

  const Wrapper      = disableAnimation ? React.Fragment : motion.div;
  const wrapperKey   = disableAnimation ? undefined : `submit-btn-${isCn ? 'cn' : 'en'}`;
  const wrapperProps = disableAnimation
    ? {}
    : {
        variants: itemVariants,
        whileHover: { scale: pressed ? 0.97 : 1.02 }, // don't fight press animation
        // whileTap removed — pointer state drives scale instead (see above)
        animate: {
          scale:   pressed ? 0.97 : 1,
          opacity: pressed ? 0.85 : 1,
        },
        transition: pressed
          ? { duration: 0.05 }
          : { type: 'spring', stiffness: 400, damping: 17 },
      };

  return (
    <Wrapper key={wrapperKey} {...wrapperProps}>
      <FormControl fullWidth={fullWidth} sx={customStyles.formControl}>
        <Button
          type="submit"
          variant="contained"
          disabled={isDisabled}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
          startIcon={loadingIcon}
          sx={buttonSx}
          aria-label={ariaLabel ?? label}
          aria-busy={isSubmitting}
          aria-disabled={isDisabled}
          {...rest}
        >
          {label}
        </Button>
      </FormControl>
    </Wrapper>
  );
};

export default SubmitButton;