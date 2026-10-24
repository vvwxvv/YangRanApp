'use client';

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import PDFViewerButton from '@/components/buttons/PDFViewerButton';
import { LanguageContext } from '@/components/contexts/LanguageContext';

const progressPercentage = 90;

const PDF_CONFIG = {
  url: process.env.NEXT_PUBLIC_PDF_PORTFOLIO_URL || '',
  buttonText: { cn: '查看作品集PDF', en: 'View Portofolio PDF' },
  titleCn: '作品集PDF',
  titleEn: 'Portofolio PDF',
  authorCn: process.env.NEXT_PUBLIC_APP_PERSON_CN || '',
  authorEn: process.env.NEXT_PUBLIC_APP_PERSON_EN || '',
  year: '',
};

const ConstructionBWPageComponent = () => {
  const artistName = process.env.NEXT_PUBLIC_APP_PERSON_EN || '';
  const appType    = process.env.NEXT_PUBLIC_APP_TYPE || 'Website';
  const { isCn }   = useContext(LanguageContext);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#ffffff' }}>

      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,1) 1px, transparent 1px)`,
        backgroundSize: '40px 40px', opacity: 0.03,
      }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.5) 1px, transparent 1px)`,
        backgroundSize: '10px 10px', opacity: 0.02,
      }} />

      {/* ── Main content ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '20px', overflowY: 'auto',
        color: '#000',
      }}>
        <div style={{ textAlign: 'center', width: '100%', maxWidth: 896 }}>

          {/* Artist Name Badge */}
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }} style={{ marginBottom: 32 }}>
            <div style={{ display: 'inline-block' }}>
              <div style={{ fontSize: 12, letterSpacing: '0.2em', color: '#4b5563', marginBottom: 4 }}>{appType.toUpperCase()}</div>
              <div style={{ fontSize: 20, fontWeight: 300, letterSpacing: '0.05em', borderTop: '1px solid #000', borderBottom: '1px solid #000', padding: '8px 24px' }}>{artistName}</div>
            </div>
          </motion.div>

          {/* Spinning ring */}
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }} style={{ marginBottom: 32 }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                style={{ width: 56, height: 56, border: '2px solid #000', borderRadius: '50%' }} />
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: '50%' }} />
              </motion.div>
            </div>
          </motion.div>

          {/* UNDER CONSTRUCTION */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1.2 }} style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 300, letterSpacing: '0.2em' }}>
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'block', marginBottom: 8, fontSize: 36 }}>UNDER</motion.div>
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                style={{ display: 'block', fontSize: 36, letterSpacing: '0.2em' }}>CONSTRUCTION</motion.div>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}
            style={{ fontSize: 18, color: '#374151', marginBottom: 32, fontWeight: 300, letterSpacing: '0.05em' }}>
            Creating something extraordinary
          </motion.p>

          {/* PDF Button */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5, duration: 0.6 }} style={{ marginBottom: 40 }}>
            <motion.div animate={{ borderColor: ['rgba(0,0,0,0.2)', 'rgba(0,0,0,1)', 'rgba(0,0,0,0.2)'] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ display: 'inline-block', border: '2px solid #000', padding: '12px 40px' }}>
              <PDFViewerButton
                pdfUrl={PDF_CONFIG.url} buttonText={PDF_CONFIG.buttonText}
                titleCn={PDF_CONFIG.titleCn} titleEn={PDF_CONFIG.titleEn}
                authorCn={PDF_CONFIG.authorCn} authorEn={PDF_CONFIG.authorEn}
                year={PDF_CONFIG.year} colors="black" isCn={isCn}
              />
            </motion.div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 0.8 }}
            style={{ maxWidth: 448, margin: '0 auto', padding: '0 16px' }}>
            <div style={{ fontSize: 13, color: '#4b5563', marginBottom: 16, letterSpacing: '0.2em', fontWeight: 300 }}>PROGRESS</div>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '100%', backgroundColor: '#e5e7eb', height: 2, overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ delay: 2.5, duration: 2, ease: 'easeOut' }}
                  style={{ height: '100%', backgroundColor: '#000', position: 'relative' }}>
                  <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(75,85,99,0.5), transparent)' }} />
                </motion.div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <span style={{ fontSize: 12, color: '#6b7280' }}>0%</span>
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.5 }}
                  style={{ fontSize: 15, fontWeight: 300 }}>{progressPercentage}%</motion.span>
                <span style={{ fontSize: 12, color: '#6b7280' }}>100%</span>
              </div>
            </div>
          </motion.div>

          {/* Footer note */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 1 }} style={{ marginTop: 48 }}>
            <p style={{ fontSize: 13, color: '#4b5563', letterSpacing: '0.05em' }}>Stay tuned for updates</p>
          </motion.div>
        </div>
      </div>

      {/* Corner decorations */}
      {[
        { top: 20, left: 20, borderTop: '2px solid #000', borderLeft: '2px solid #000' },
        { top: 20, right: 20, borderTop: '2px solid #000', borderRight: '2px solid #000' },
        { bottom: 20, left: 20, borderBottom: '2px solid #000', borderLeft: '2px solid #000' },
        { bottom: 20, right: 20, borderBottom: '2px solid #000', borderRight: '2px solid #000' },
      ].map((pos, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', width: 32, height: 32, zIndex: 3, ...pos }}
          animate={{ opacity: [i % 2 === 0 ? 0.2 : 0.5, i % 2 === 0 ? 0.5 : 0.2, i % 2 === 0 ? 0.2 : 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i }}
        />
      ))}

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, zIndex: 3,
        background: 'linear-gradient(to top, #ffffff, transparent)', opacity: 0.5, pointerEvents: 'none',
      }} />
    </div>
  );
};

export default ConstructionBWPageComponent;