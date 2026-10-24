"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const DEBOUNCE_MS = 600;

const EditAndDeleteButtonOnManagerCard = ({
  icon: Icon,
  onClick,
  label,
  danger = false,
  isEdit = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pressed,   setPressed]   = useState(false);

  const lastClickRef  = useRef(0);
  const isMountedRef  = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // ─── Pointer handlers ─────────────────────────────────────────────────────
  // whileTap replaced — pointer state snaps scale instantly on touch,
  // no Framer gesture-recogniser delay.
  const handlePointerDown  = useCallback(() => { if (!isLoading) setPressed(true);  }, [isLoading]);
  const handlePointerLeave = useCallback(() => setPressed(false), []);

  const handlePointerUp = useCallback(async (e) => {
    setPressed(false);
    e.stopPropagation();

    const now = Date.now();
    if (now - lastClickRef.current < DEBOUNCE_MS || isLoading || !onClick) return;
    lastClickRef.current = now;

    if (isEdit) {
      setIsLoading(true);
      try {
        await onClick(e);
      } finally {
        // Guard: component may have unmounted if onClick triggered navigation
        if (isMountedRef.current) setIsLoading(false);
      }
    } else {
      onClick(e);
    }
  }, [isLoading, isEdit, onClick]);

  // Keyboard fallback (Enter / Space → pointerType "")
  const handleClick = useCallback(async (e) => {
    if (e.pointerType !== "") return;
    e.stopPropagation();

    const now = Date.now();
    if (now - lastClickRef.current < DEBOUNCE_MS || isLoading || !onClick) return;
    lastClickRef.current = now;

    if (isEdit) {
      setIsLoading(true);
      try { await onClick(e); }
      finally { if (isMountedRef.current) setIsLoading(false); }
    } else {
      onClick(e);
    }
  }, [isLoading, isEdit, onClick]);

  // ─── Styling ──────────────────────────────────────────────────────────────
  const isYellowHover = danger || isEdit;

  const buttonClass = [
    'w-9 h-9 flex items-center justify-center',
    'border-2 rounded-full',
    'transition-all duration-200',
    'touch-manipulation select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
    'focus-visible:ring-black dark:focus-visible:ring-white',
    isLoading
      ? 'bg-gray-200 border-gray-300 opacity-70 cursor-not-allowed text-gray-400'
      : [
          'bg-transparent dark:bg-white border-black dark:border-white text-black',
          isYellowHover
            ? 'hover:bg-yellow-200 hover:border-yellow-300 hover:text-black'
            : [
                'hover:bg-black hover:border-black hover:text-white',
                'dark:hover:bg-white dark:hover:border-white dark:hover:text-black',
              ].join(' '),
          'disabled:opacity-50 disabled:cursor-not-allowed',
        ].join(' '),
  ].join(' ');

  return (
    <motion.button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      disabled={isLoading}
      animate={{
        scale:   pressed && !isLoading ? 0.92 : 1,
        opacity: pressed && !isLoading ? 0.7  : 1,
      }}
      transition={
        pressed
          ? { duration: 0.05 }
          : { duration: 0.18, ease: 'easeOut' }
      }
      whileHover={!isLoading ? { scale: pressed ? 0.92 : 1.05 } : {}}
      className={buttonClass}
      aria-label={label}
      aria-busy={isLoading}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {isLoading && isEdit ? (
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <Icon size={16} style={{ pointerEvents: 'none' }} />
      )}
    </motion.button>
  );
};

export default EditAndDeleteButtonOnManagerCard;