"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@mui/material';
import { useReverseTheme } from '@/hooks/useReverseTheme';
import useFont from '@/hooks/useFont';

const AnimatedUnderlineTitle = ({
  title,
  titleRef,
  isHovered = false,
  className = '',
  style = {},
  showOnHover = true,
}) => {
  const [isTitleHovered, setIsTitleHovered] = React.useState(false);
  const { colors } = useReverseTheme();
  const { contentTitleFontFamily } = useFont();

  // Show underline when card is hovered OR when title itself is hovered
  const shouldShowUnderline = isHovered || (showOnHover && isTitleHovered);

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      style={style}
      ref={titleRef}
      onMouseEnter={() => showOnHover && setIsTitleHovered(true)}
      onMouseLeave={() => showOnHover && setIsTitleHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Typography
        component="span"
        className="cursor-pointer"
        sx={{
          display: 'inline-block',
          fontFamily: contentTitleFontFamily,
          fontSize: style.fontSize || 'inherit',
          fontWeight: style.fontWeight || 'inherit',
          lineHeight: style.lineHeight || 'inherit',
          color: style.color || 'inherit',
        }}
      >
        {title}
      </Typography>

      <motion.div
        className="absolute bottom-0 left-0 z-10"
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: shouldShowUnderline ? '100%' : 0,
          opacity: shouldShowUnderline ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        style={{
          height: '1px',
          bottom: '-2px',
          backgroundColor: colors.text,
        }}
      />
    </motion.div>
  );
};

export default AnimatedUnderlineTitle;