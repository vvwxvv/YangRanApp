"use client";
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';

const ThreeArrowBackButton = ({ onBack }) => {
  const router   = useRouter();
  const pathname = usePathname();
  const [pressed, setPressed] = useState(false);

  // Don't render on home page
  if (pathname === '/') return null;

  // Built-in parent-path navigation
  const handleBackClick = useCallback(() => {
    const segments = pathname.split('/').filter(Boolean);
    const target   = segments.length > 1
      ? '/' + segments.slice(0, -1).join('/')
      : '/';
    router.push(target);
  }, [pathname, router]);

  const finalOnBack = onBack ?? handleBackClick;

  // Pointer handlers — no e.preventDefault() so the browser doesn't
  // suppress the synthetic click on mobile.
  const handlePointerDown  = useCallback(() => setPressed(true),  []);
  const handlePointerLeave = useCallback(() => setPressed(false), []);
  const handlePointerUp    = useCallback((e) => {
    setPressed(false);
    e.stopPropagation();
    finalOnBack();
  }, [finalOnBack]);

  // Keyboard fallback (Enter / Space)
  const handleClick = useCallback((e) => {
    if (e.pointerType === '') finalOnBack();
  }, [finalOnBack]);

  return (
    <motion.button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      animate={{
        scale:   pressed ? 0.88 : 1,
        opacity: pressed ? 0.6  : 1,
      }}
      transition={
        pressed
          ? { duration: 0.05 }
          : { type: 'spring', stiffness: 400, damping: 25 }
      }
      whileHover={{ scale: pressed ? 0.88 : 1.08 }}
      aria-label="Go back"
      style={{
        position:        'fixed',
        right:           '50px',
        top:             '20px',
        display:         'flex',
        justifyContent:  'center',
        alignItems:      'center',
        padding:         '12px 16px',
        cursor:          'pointer',
        backgroundColor: 'transparent',
        border:          'none',
        borderRadius:    '12px',
        zIndex:          12000,
        minWidth:        '60px',
        minHeight:       '60px',
        WebkitTapHighlightColor: 'transparent',
        touchAction:     'manipulation',
        userSelect:      'none',
        WebkitUserSelect:'none',
      }}
    >
      <motion.div
        animate={{ x: pressed ? -4 : 0 }}
        whileHover={{ x: -3 }}
        transition={
          pressed
            ? { duration: 0.05 }
            : { type: 'spring', stiffness: 400, damping: 25 }
        }
        style={{
          display:    'flex',
          alignItems: 'center',
          color:      'var(--text-primary, #000000)',
          pointerEvents: 'none', // inner div must not capture pointer events
        }}
      >
        <ArrowLeftIcon />
      </motion.div>
    </motion.button>
  );
};

export default ThreeArrowBackButton;