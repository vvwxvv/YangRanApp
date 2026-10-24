"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion } from 'framer-motion';
import useFont from '@/hooks/useFont';

const ANIMATION_CONFIG = {
  logo: {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  },
};

const LogoComponent = React.memo(({ 
  logoSrc, 
  logoAlt, 
  logoWidth = 280, 
  logoHeight = 54,
  fallbackTextEn,
  fallbackTextCn,
  isCn 
}) => {
  const [logoError, setLogoError] = useState(false);
  const { contentFontFamily } = useFont();

  const handleLogoError = useCallback(() => {
    console.log('Logo failed to load, showing fallback text');
    setLogoError(true);
  }, []);

  const displayText = useMemo(() => {
    // Use environment variables as primary fallback, then props
    const envTitleEn = process.env.NEXT_PUBLIC_APP_PERSON_EN;
    const envTitleCn = process.env.NEXT_PUBLIC_APP_PERSON_CN;
    
    const titleEn = envTitleEn || fallbackTextEn || "App Title";
    const titleCn = envTitleCn || fallbackTextCn || "应用标题";
    
    return isCn ? titleCn : titleEn;
  }, [isCn, fallbackTextEn, fallbackTextCn]);

  // Determine if we should show the fallback text
  const shouldShowFallback = logoError || !logoSrc || logoSrc === "";

  return (
    <motion.div
      className="logo-container"
      whileHover={ANIMATION_CONFIG.logo.hover}
      whileTap={ANIMATION_CONFIG.logo.tap}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        background: 'transparent',
      }}
    >
      {!shouldShowFallback ? (
        <img
          src={logoSrc}
          alt={logoAlt}
          style={{ 
            height: logoHeight, 
            width: 'auto', 
            maxWidth: logoWidth, 
            objectFit: 'contain' 
          }}
          draggable={false}
          onError={handleLogoError}
        />
      ) : (
        <span
          style={{
            fontFamily: contentFontFamily,
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--text-primary, #000000)',
            letterSpacing: '1px',
            textAlign: 'center',
            minHeight: `${logoHeight}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            background: 'transparent',
          }}
        >
          {displayText}
        </span>
      )}
    </motion.div>
  );
});

LogoComponent.displayName = 'LogoComponent';

export default LogoComponent;
