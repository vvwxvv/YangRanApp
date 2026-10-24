"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useFont from '@/hooks/useFont';

// ============================================
// TEXT LABELS CONFIGURATION
// ============================================
const TEXT_LABELS = {
  close: {
    cn: '关闭',
    en: 'Close'
  },
  loading: {
    cn: '加载中...',
    en: 'Loading...'
  },
  error: {
    cn: '无法加载PDF',
    en: 'Cannot load PDF'
  },
  openInNewTab: {
    cn: '新标签页打开',
    en: 'Open in new tab'
  },
  download: {
    cn: '下载',
    en: 'Download'
  }
};

// ============================================
// BREAKPOINTS
// ============================================
const MOBILE_BREAKPOINT = 768;

// ============================================
// STYLE CONFIGURATION
// ============================================
const getStyles = (isMobile) => ({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 9999,
  },
  modal: {
    maxWidth: isMobile ? '100vw' : '90vw',
    maxHeight: isMobile ? '100vh' : '90vh',
    width: isMobile ? '100vw' : '900px',
    height: isMobile ? '100vh' : '85vh',
    borderRadius: isMobile ? '0px' : '8px',
  },
  header: {
    padding: isMobile ? '12px 14px' : '16px 20px',
    borderBottomWidth: '1px',
  },
  title: {
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: isMobile ? '11px' : '12px',
    opacity: 0.7,
  },
  button: {
    fontSize: isMobile ? '11px' : '12px',
    padding: isMobile ? '5px 8px' : '6px 12px',
    borderRadius: '4px',
  },
  closeButton: {
    fontSize: isMobile ? '24px' : '20px',
    width: isMobile ? '36px' : '32px',
    height: isMobile ? '36px' : '32px',
  }
});

/**
 * PDFViewer Component
 * A reusable responsive modal component for viewing PDF files
 * 
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Callback when modal is closed
 * @param {string} pdfUrl - URL of the PDF file
 * @param {string} titleCn - Chinese title
 * @param {string} titleEn - English title
 * @param {string} authorCn - Chinese author name
 * @param {string} authorEn - English author name
 * @param {string} year - Publication year
 * @param {Object} colors - Theme colors { text, background }
 * @param {string} fontFamily - Font family to use
 * @param {boolean} isCn - Whether to show Chinese labels
 */
const PDFViewer = ({
  isOpen = false,
  onClose,
  pdfUrl = '',
  titleCn = '',
  titleEn = '',
  authorCn = '',
  authorEn = '',
  year = '',
  colors = { text: '#000000', background: '#ffffff' },
  fontFamily,
  isCn = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const { contentFontFamily } = useFont();
  const resolvedFontFamily = fontFamily && fontFamily !== 'inherit' ? fontFamily : contentFontFamily;

  const isMobile = windowWidth < MOBILE_BREAKPOINT;
  const STYLES = getStyles(isMobile);
  const lang = isCn ? 'cn' : 'en';

  // Track window resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [isOpen]);

  // Handle iframe load
  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Handle iframe error
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  // Handle close
  const handleClose = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    onClose?.();
  }, [onClose]);

  // Handle open in new tab
  const handleOpenInNewTab = useCallback(() => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  }, [pdfUrl]);

  // Handle download
  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfUrl.split('/').pop() || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pdfUrl]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  // Format display title
  const displayTitle = (isCn ? titleCn : titleEn) || titleCn || titleEn || 'PDF Document';
  const displaySubtitle = [
    authorCn || authorEn
      ? isCn
        ? authorCn || authorEn
        : authorEn || authorCn
      : '',
    year
  ].filter(Boolean).join(' · ');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: isMobile ? 'stretch' : 'center',
            justifyContent: 'center',
            backgroundColor: STYLES.overlay.backgroundColor,
            zIndex: STYLES.overlay.zIndex,
            fontFamily: resolvedFontFamily,
          }}
        >
          <motion.div
            initial={{ scale: isMobile ? 1 : 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: isMobile ? 1 : 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              width: STYLES.modal.width,
              maxWidth: STYLES.modal.maxWidth,
              height: STYLES.modal.height,
              maxHeight: STYLES.modal.maxHeight,
              backgroundColor: colors.background,
              borderRadius: STYLES.modal.borderRadius,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: isMobile ? 'none' : '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: STYLES.header.padding,
                borderBottom: `${STYLES.header.borderBottomWidth} solid ${colors.text}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
                gap: '8px',
              }}
            >
              {/* Close button — on mobile show first (left side) */}
              {isMobile && (
                <button
                  onClick={handleClose}
                  aria-label="Close"
                  style={{
                    width: STYLES.closeButton.width,
                    height: STYLES.closeButton.height,
                    fontSize: STYLES.closeButton.fontSize,
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: colors.text,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    flexShrink: 0,
                    padding: 0,
                  }}
                >
                  ×
                </button>
              )}

              {/* Title Section */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: STYLES.title.fontSize,
                    fontWeight: STYLES.title.fontWeight,
                    color: colors.text,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {displayTitle}
                </div>
                {displaySubtitle && (
                  <div
                    style={{
                      fontSize: STYLES.subtitle.fontSize,
                      color: colors.text,
                      opacity: STYLES.subtitle.opacity,
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {displaySubtitle}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                {/* Open in new tab */}
                <button
                  onClick={handleOpenInNewTab}
                  style={{
                    fontSize: STYLES.button.fontSize,
                    padding: STYLES.button.padding,
                    borderRadius: STYLES.button.borderRadius,
                    border: `1px solid ${colors.text}30`,
                    backgroundColor: 'transparent',
                    color: colors.text,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isMobile ? '↗' : TEXT_LABELS.openInNewTab[lang]}
                </button>

                {/* Download (only for local PDFs) */}
                {pdfUrl.startsWith('/') && (
                  <button
                    onClick={handleDownload}
                    style={{
                      fontSize: STYLES.button.fontSize,
                      padding: STYLES.button.padding,
                      borderRadius: STYLES.button.borderRadius,
                      border: `1px solid ${colors.text}30`,
                      backgroundColor: 'transparent',
                      color: colors.text,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isMobile ? '↓' : TEXT_LABELS.download[lang]}
                  </button>
                )}

                {/* Close button — desktop only (right side) */}
                {!isMobile && (
                  <button
                    onClick={handleClose}
                    aria-label="Close"
                    style={{
                      width: STYLES.closeButton.width,
                      height: STYLES.closeButton.height,
                      fontSize: STYLES.closeButton.fontSize,
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: colors.text,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* PDF Content */}
            <div style={{ flex: 1, position: 'relative', backgroundColor: '#f5f5f5', minHeight: 0 }}>
              {/* Loading State */}
              {isLoading && !hasError && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.background,
                    zIndex: 1,
                  }}
                >
                  <span style={{ fontSize: '14px', color: colors.text, opacity: 0.6 }}>
                    {TEXT_LABELS.loading[lang]}
                  </span>
                </div>
              )}

              {/* Error State */}
              {hasError && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.background,
                    padding: isMobile ? '24px' : '0',
                    zIndex: 1,
                  }}
                >
                  <span style={{
                    fontSize: '14px',
                    color: colors.text,
                    opacity: 0.6,
                    marginBottom: '16px',
                    textAlign: 'center',
                  }}>
                    {TEXT_LABELS.error[lang]}
                  </span>
                  <button
                    onClick={handleOpenInNewTab}
                    style={{
                      fontSize: STYLES.button.fontSize,
                      padding: '8px 16px',
                      borderRadius: STYLES.button.borderRadius,
                      border: `1px solid ${colors.text}30`,
                      backgroundColor: 'transparent',
                      color: colors.text,
                      cursor: 'pointer',
                    }}
                  >
                    {TEXT_LABELS.openInNewTab[lang]}
                  </button>
                </div>
              )}

              {/* PDF iframe */}
              {!hasError && (
                <iframe
                  src={`${pdfUrl}#toolbar=${isMobile ? '0' : '1'}&navpanes=0&view=FitH`}
                  onLoad={handleLoad}
                  onError={handleError}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: isLoading ? 'none' : 'block',
                  }}
                  title={displayTitle}
                  allow="fullscreen"
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PDFViewer;