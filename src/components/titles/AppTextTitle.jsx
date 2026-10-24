"use client";
import { Box, Typography } from "@mui/material";
import { motion } from 'framer-motion';
import useAppTitle from '@/hooks/useAppTitle';
import { useContext } from "react";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import useFont from '@/hooks/useFont';

// Position mode configuration
const POSITION_CONFIGS = {
  left: { justifyContent: 'flex-start', textAlign: 'left' },
  center: { justifyContent: 'center', textAlign: 'center' },
  right: { justifyContent: 'flex-end', textAlign: 'right' }
};

// Shared transparent styles for inner text/motion containers
const TRANSPARENT_STYLES = {
  backgroundColor: 'transparent',
  background: 'transparent',
  boxShadow: 'none',
  border: 'none',
};

const AppTextTitle = ({ 
  positionMode = 'center', 
  customTitle = null,
  customStyles = {},
  zIndex = 1000 
}) => {
  const { isCn, isLoading } = useContext(LanguageContext);
  const { colors } = useReverseTheme();
  const appPerson = useAppTitle(isCn ? 'cn' : 'en');
  const { contentTitleFontFamily } = useFont();

  const positionConfig = POSITION_CONFIGS[positionMode] || POSITION_CONFIGS.center;
  const title = customTitle || (isLoading ? "" : appPerson.displayName);
  const textColor = colors?.text || 'var(--text-primary, #000000)';
  // Responsive so the title never reaches the language switcher in the
  // top-right corner: on narrow viewports it shrinks instead of overlapping.
  const fontSize = 'clamp(16px, 3.4vw, 30px)';
  const lineHeight = 'clamp(16px, 3.4vw, 30px)';

  const containerStyles = {
    position: 'fixed',
    top: '-10px',
    left: 0,
    right: 0,
    zIndex,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '100vw',
    boxSizing: 'border-box',
    // Symmetric side padding keeps the title centred while reserving the
    // corners for the language switcher.
    padding: '5px clamp(58px, 7vw, 120px)',
    borderRadius: '6px',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: 'none',
    border: 'none',
    backgroundColor: 'var(--background-primary, #ffffff)', // <-- Updated to white
    background: 'var(--background-primary, #ffffff)',      // <-- Updated to white
    ...positionConfig,
    ...customStyles
  };

  const textStyles = {
    fontFamily: contentTitleFontFamily,
    fontWeight: 900,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontSize,
    lineHeight,
    color: textColor,
    mb: 3,
    textAlign: positionConfig.textAlign,
    ...TRANSPARENT_STYLES,
  };

  const motionStyles = {
    marginTop: '25px',
    marginLeft: '20px',
    marginRight: '20px',
    textAlign: positionConfig.textAlign,
    ...TRANSPARENT_STYLES,
  };

  return (
    <Box sx={containerStyles} className="app-text-title-blur">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={motionStyles}
      >
        <Typography sx={textStyles}>
          {title}
        </Typography>
      </motion.div>
    </Box>
  );
};

export default AppTextTitle;