"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import useFont from '@/hooks/useFont';

const IndexButton = ({ 
  label, 
  url, 
  className = '',
  style = {},
  onClick
}) => {
  const router = useRouter();
  const { buttonFontFamily } = useFont();

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    } else if (url) {
      router.push(url);
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    } else if (url) {
      router.push(url);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
      className={`
        inline-flex items-center justify-center
        px-4 py-2 text-sm font-medium
        text-black dark:text-white
        rounded-md
        focus:outline-none
        transition-all duration-200 ease-in-out
        touch-manipulation
        ${className}
      `}
      style={{
        fontFamily: buttonFontFamily,
        backgroundColor: 'transparent',
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        ...style
      }}
      whileHover={{ 
        scale: 1.02,
        y: -1
      }}
      whileTap={{ 
        scale: 0.98,
        y: 0
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        ease: "easeOut"
      }}
    >
      <KeyboardDoubleArrowRightIcon className="w-4 h-4 mr-2 text-black dark:text-white" />
      {label}
    </motion.button>
  );
};

export default IndexButton;
