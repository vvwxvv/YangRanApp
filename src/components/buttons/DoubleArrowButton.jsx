"use client";
import React, { useState, useCallback } from 'react';
import { ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * DoubleArrowButton
 *
 * @param {boolean}  isMobileDevice  - Enlarges touch target for mobile
 * @param {boolean}  isCn            - Switches aria-label to Chinese
 * @param {Function} onClick         - Click / tap handler
 * @param {string}   className       - Overrides wrapper <div> class entirely
 * @param {string}   buttonClassName - Appended to <button> class list
 */
const DoubleArrowButton = ({
  isMobileDevice  = false,
  isCn            = false,
  onClick,
  className,
  buttonClassName,
}) => {
  const [pressed, setPressed] = useState(false);

  const handlePointerDown  = useCallback(() => setPressed(true),  []);
  const handlePointerLeave = useCallback(() => setPressed(false), []);
  const handlePointerUp    = useCallback((e) => {
    setPressed(false);
    e.stopPropagation();
    onClick?.(e);
  }, [onClick]);

  // Keyboard fallback (Enter / Space → pointerType "")
  const handleClick = useCallback((e) => {
    if (e.pointerType === "") {
      e.stopPropagation();
      onClick?.(e);
    }
  }, [onClick]);

  // ─── Wrapper class ─────────────────────────────────────────────────────
  const wrapperClass = className ?? [
    'absolute',
    isMobileDevice ? 'bottom-2 right-2 z-50' : 'bottom-1 right-1 z-20',
  ].join(' ');

  // ─── Button class ──────────────────────────────────────────────────────
  const buttonClass = [
    'flex items-center justify-center rounded-full',
    isMobileDevice ? 'w-11 h-11' : 'w-8 h-8',
    'bg-transparent text-black dark:text-white',
    'hover:bg-black hover:text-white',
    'dark:hover:bg-white dark:hover:text-black',
    'transition-colors duration-200',
    'touch-manipulation select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
    'focus-visible:ring-black dark:focus-visible:ring-white',
    buttonClassName,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      <motion.button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        // whileTap replaced — pointer state drives scale instantly on touch
        animate={{
          scale:   pressed ? 0.9  : 1,
          opacity: pressed ? 0.65 : 1,
        }}
        transition={
          pressed
            ? { duration: 0.05 }
            : { duration: 0.18, ease: 'easeOut' }
        }
        whileHover={{ scale: pressed ? 0.9 : 1.1 }}
        aria-label={isCn ? '查看详情' : 'View details'}
        className={buttonClass}
        style={{
          WebkitTapHighlightColor: 'transparent',
          touchAction:             'manipulation',
          userSelect:              'none',
          WebkitUserSelect:        'none',
        }}
      >
        {/* pointerEvents:none prevents the icon intercepting onPointerDown */}
        <ChevronsRight
          size={isMobileDevice ? 24 : 16}
          style={{ pointerEvents: 'none' }}
        />
      </motion.button>
    </div>
  );
};

export default DoubleArrowButton;