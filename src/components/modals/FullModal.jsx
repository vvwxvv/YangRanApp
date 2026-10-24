"use client";
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReverseTheme } from '@/hooks/useReverseTheme';

// Mobile Full Screen Modal Component
const FullModal = ({ isOpen, onClose, children }) => {
  const { colors } = useReverseTheme();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-50"
          style={{ 
            height: '100vh', 
            width: '100vw',
            backgroundColor: colors.background
          }}
        >
          {/* Close button */}
          <motion.button
            onClick={onClose}
            whileHover={{ rotate: 90 }}
            className="absolute z-50 w-10 h-10 flex items-center justify-center rounded-full shadow-lg"
            aria-label="Close"
            style={{ 
              top: 100, 
              right: 20, 
              position: 'absolute', 
              cursor: 'pointer',
              backgroundColor: colors.background,
              border: `1px solid ${colors.border || colors.text}`,
              color: colors.text
            }}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </motion.button>
          
          {/* Content with scroll */}
          <div className="h-full w-full overflow-y-auto">
            <br/><br/><br/><br/>
              {children}
    
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

};

export default FullModal;