import React, { useCallback } from 'react';
import TextUnderlineAnimation from '@/components/animations/TextUnderlineAnimation';

/* =============================================================================
  LangToggle — production-ready EN / CN toggle
  Props:
    formLang   → 'EN' | 'CN'
    onChange   → (lang: 'EN' | 'CN') => void
    className  → optional extra class
    style      → optional extra inline style
============================================================================= */
const LANGS = ['EN', 'CN'];

const LangToggle = ({ formLang, onChange, className = '', style }) => {
  // Stable handler — avoids creating new functions per render
  const handleClick = useCallback(
    (lang) => {
      if (lang !== formLang) onChange(lang);
    },
    [formLang, onChange]
  );

  return (
    <div
      role="group"
      aria-label="Select form language"
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '16px',
        userSelect: 'none',
        ...style,
      }}
    >
      {LANGS.map((lang) => {
        const isActive = formLang === lang;

        return (
          <button
            key={lang}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`Switch to ${lang === 'EN' ? 'English' : 'Chinese'}`}
            onClick={() => handleClick(lang)}
            // Touch-friendly: prevent 300ms tap delay on mobile browsers
            onTouchEnd={(e) => {
              e.preventDefault();
              handleClick(lang);
            }}
            style={{
              // Reset
              padding: 0,
              margin: 0,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              // Sizing — minimum 44×44 touch target (Apple HIG / WCAG 2.5.5)
              minWidth: '44px',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              // Appearance
              cursor: isActive ? 'default' : 'pointer',
              WebkitTapHighlightColor: 'transparent', // remove blue flash on iOS
              touchAction: 'manipulation',            // disable double-tap zoom
            }}
          >
            <TextUnderlineAnimation
              title={lang}
              isHovered={isActive}
              fontSize="12px"
              color={isActive ? '#000' : '#999'}
              fontWeight="600"
            />
          </button>
        );
      })}
    </div>
  );
};

export default LangToggle;