"use client";

import React, { useState, useCallback,useContext } from 'react';
import PDFViewer from '@/components/others/PDFViewer';
import { LanguageContext } from '@/components/contexts/LanguageContext';
import useFont from '@/hooks/useFont';
/**
 * PDFViewerButton Component
 * A button that opens a PDF viewer modal when clicked
 */
const PDFViewerButton = ({
  pdfUrl = '',
  buttonText = { cn: '下载简历', en: 'Download Resume' },
  titleCn = '',
  titleEn = '',
  authorCn = '',
  authorEn = '',
  year = '',
  colors = { text: 'var(--text-primary, #000000)', background: 'var(--background-primary, #ffffff)' },
  fontFamily,
  style = {},
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isCn } = useContext(LanguageContext);
  const { buttonFontFamily } = useFont();
  const resolvedFontFamily = fontFamily && fontFamily !== 'inherit' ? fontFamily : buttonFontFamily;

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <button
        onClick={handleOpen}
        className={className}
        style={{
          fontSize: '12px',
          padding: '8px 16px',
          borderRadius: '4px',
          border: `1px solid ${colors.text}30`,
          backgroundColor: 'transparent',
          color: colors.text,
          cursor: 'pointer',
          fontFamily: resolvedFontFamily,
          transition: 'all 0.2s ease',
          ...style,
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = `${colors.text}10`;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
        }}
      >
        {isCn ? buttonText.cn : buttonText.en}
      </button>

      <PDFViewer
        isOpen={isOpen}
        onClose={handleClose}
        pdfUrl={pdfUrl}
        titleCn={titleCn}
        titleEn={titleEn}
        authorCn={authorCn}
        authorEn={authorEn}
        year={year}
        colors={colors}
        fontFamily={resolvedFontFamily}
      />
    </>
  );
};

export default PDFViewerButton;