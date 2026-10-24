"use client";
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { 
  MailOutlined, 
  InstagramOutlined, 
  CloseOutlined,
} from '@ant-design/icons';
import { useTheme } from 'next-themes';
import { LanguageContext } from '@/components/contexts/LanguageContext';
import { getSystemLabel } from '@/components/labels/system_labels';


const ContactModal = ({ isOpen, onClose }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isCn } = useContext(LanguageContext);



  useEffect(() => {
    setMounted(true);
  }, []);

  // Create contact items using your actual environment variables
  const allContactItems = useMemo(() => [
    {
      type: 'email',
      value: process.env.NEXT_PUBLIC_APP_PERSON_EMAIL,
      displayValue: "jinxycat@qq.com",
      icon: MailOutlined,
      label: getSystemLabel('email', isCn),
      getUrl: (value) => `mailto:${value}`,
      color: '#000000'
    },
    {
      type: 'instagram',
      value: process.env.NEXT_PUBLIC_APP_PERSON_INSTAGRAM || "",
      displayValue: "",
      icon: InstagramOutlined,
      label: getSystemLabel('instagram', isCn),
      getUrl: (value) => value.startsWith('http') ? value : `https://instagram.com/${value}`,
      color: '#000000'
    },
    {
      type: 'xiaohongshu',
      value: process.env.NEXT_PUBLIC_APP_PERSON_XIAOHONGSHU || "",
      displayValue: getSystemLabel('xiaohongshuHomepage', isCn),
      icon: () => (
        <svg viewBox="0 0 24 24" style={{ fontSize: '20px', color: '#ffffff' }} fill="currentColor">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.33 14.99 3.84 13.839 3.84 12.542c0-1.297.49-2.448 1.297-3.323.875-.807 2.026-1.297 3.323-1.297 1.297 0 2.448.49 3.323 1.297.807.875 1.297 2.026 1.297 3.323 0 1.297-.49 2.448-1.297 3.323-.875.807-2.026 1.297-3.323 1.297zm7.136 0c-1.297 0-2.448-.49-3.323-1.297-.807-.875-1.297-2.026-1.297-3.323 0-1.297.49-2.448 1.297-3.323.875-.807 2.026-1.297 3.323-1.297 1.297 0 2.448.49 3.323 1.297.807.875 1.297 2.026 1.297 3.323 0 1.297-.49 2.448-1.297 3.323-.875.807-2.026 1.297-3.323 1.297z"/>
        </svg>
      ),
      label: getSystemLabel('xiaohongshu', isCn),
      getUrl: (value) => value.startsWith('http') ? value : value,
      color: '#000000'
    },
    {
      type: 'facebook',
      value: process.env.NEXT_PUBLIC_APP_PERSON_FACEBOOK || "" ,
      displayValue: getSystemLabel('facebookHomepage', isCn),
      icon: () => (
        <svg viewBox="0 0 24 24" style={{ fontSize: '20px', color: '#ffffff' }} fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      label: getSystemLabel('facebook', isCn),
      getUrl: (value) => value.startsWith('http') ? value : value,
      color: '#000000'
    }
  ], [isCn]);

  // Filter out items with no data
  const contactItems = allContactItems.filter(item => item.value && item.value.trim() !== '');

  const isDark = mounted && resolvedTheme === 'dark';

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black bg-opacity-20 backdrop-blur-sm"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh'
            }}
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden"
              style={{
                backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: isDark 
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(20px)',
                pointerEvents: 'auto'
              }}
            >
              <div
                className="flex items-center justify-between p-6 border-b"
                style={{
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }}
              >
                <h2
                  className="text-xl font-bold text-center flex-1"
                  style={{ 
                    color: isDark ? '#ffffff' : '#000000',
                    textAlign: 'center'
                  }}
                >
                  {getSystemLabel('contactInformation', isCn)}
                </h2>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full transition-colors"
                  style={{
                    color: isDark ? '#ffffff' : '#000000',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <CloseOutlined style={{ fontSize: '18px' }} />
                </motion.button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {contactItems.map((item, index) => (
                    <React.Fragment key={item.type}>
                      <ContactItem 
                        {...item}
                        index={index}
                        isDark={isDark}
                      />
                      {index < contactItems.length - 1 && (
                        <div 
                          className="h-px w-full"
                          style={{
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Use portal to render modal at document root
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
};

const ContactItem = ({ type, value, displayValue, icon: IconComponent, label, getUrl, color, index, isDark }) => {
  
  // For email, use regular button since it doesn't need navigation
  if (type === 'email') {
    return (
      <motion.button
        onClick={() => window.open(getUrl(value), '_self')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center space-x-4 p-4 rounded-lg transition-all duration-200 w-full text-left cursor-pointer"
        style={{
          backgroundColor: isDark ? '#000000' : 'rgba(0, 0, 0, 0.02)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          color: isDark ? '#ffffff' : '#000000'
        }}
      >
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full"
          style={{ 
            backgroundColor: isDark ? '#ffffff' : '#ffffff',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
          }}
        >
          <IconComponent style={{ 
            color: isDark ? '#000000' : '#000000', 
            fontSize: '20px' 
          }} />
        </div>
        <div className="flex-1 text-left">
          <div
            className="text-sm font-medium opacity-70"
            style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}
          >
            {label}
          </div>
          <div className="text-base font-semibold">
            {displayValue}
          </div>
        </div>
      </motion.button>
    );
  }
  
  // For other links, use Next.js Link
  return (
    <Link href={getUrl(value)} target="_blank" rel="noopener noreferrer">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center space-x-4 p-4 rounded-lg transition-all duration-200 cursor-pointer"
        style={{
          backgroundColor: isDark ? '#000000' : 'rgba(0, 0, 0, 0.02)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          color: isDark ? '#ffffff' : '#000000'
        }}
      >
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full"
          style={{ backgroundColor: color }}
        >
          <IconComponent style={{ color: '#ffffff' }} />
        </div>
        <div className="flex-1 text-left">
          <div
            className="text-sm font-medium opacity-70"
            style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}
          >
            {label}
          </div>
          <div className="text-base font-semibold">
            {displayValue}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ContactModal; 