"use client";
import React from "react";
import { motion } from 'framer-motion';
import { Typography } from '@mui/material';
import useFont from '@/hooks/useFont';

export default function PageHeader({ 
  title,
  align = 'center', // Add alignment prop
  colors
}) {
  const { contentTitleFontFamily } = useFont();

  // Provide fallback title during hydration
  const displayTitle = title || "";

  // Default colors if not provided
  const defaultColors = {
    text: 'var(--text-primary, #000000)'
  };
  
  const themeColors = colors || defaultColors;

  // Responsive margins based on alignment
  const getMargins = () => {
    switch (align) {
      case 'left':
        return { marginTop: "25px", marginLeft: "20px", marginRight: "20px" };
      case 'right':
        return { marginTop: "25px", marginLeft: "20px", marginRight: "20px", textAlign: 'right' };
      case 'center':
      default:
        return { marginTop: "25px", marginLeft: "20px", marginRight: "20px", textAlign: 'center' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={getMargins()}
    >

        <Typography 
          variant="h4"
          component="h2"
          sx={{
            fontFamily: contentTitleFontFamily,
            fontWeight: 900,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            mb: 3,
            fontSize: '1.25rem',
            lineHeight: '25px',
            textAlign: align === 'center' ? 'center' : align === 'right' ? 'right' : 'left',
            color: themeColors.text,
            backgroundColor: 'transparent',
            background: 'transparent',
            boxShadow: 'none',
            border: 'none',
          }}
        >
          {displayTitle}
        </Typography>
   
    </motion.div>
  );
}
