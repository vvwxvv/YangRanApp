// ArrowBackButton.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

export const NavBackArrow = ({ color = 'var(--text-primary, black)', fontSize = '16px' }) => (
  <span
    className="flex items-center"
    style={{
      letterSpacing: 'normal',
      transition: 'letter-spacing 0.3s ease',
      background: 'transparent',
    }}
  >
    {/* removed the negative margin that was collapsing the arrows */}
    <span style={{ fontSize, color, transition: 'transform 0.2s ease' }}>&#8592;</span>
    <span style={{ fontSize, color, transition: 'transform 0.2s ease' }}>&#8592;</span>
    <span style={{ fontSize, color, transition: 'transform 0.2s ease' }}>&#8592;</span>
  </span>
);

const ArrowBackButton = ({ onBack, style }) => {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/') return null;

  const handleBackClick = () => {
    if (!pathname || pathname === '/') return;
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 1) {
      router.push('/' + segments.slice(0, -1).join('/'));
    } else {
      router.push('/');
    }
  };

  const finalOnBack = onBack || handleBackClick;

  const clickHandler = (e) => {
    e.stopPropagation();
    finalOnBack();
  };

  return (
    <div style={{ background: 'transparent', ...style }}>
      <motion.button
        onClick={clickHandler}
        className="flex items-center justify-center rounded-sm select-none cursor-pointer"
        style={{
          width: 48,
          height: 48,
          backgroundColor: 'transparent',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          userSelect: 'none',
        }}
        initial={{ scale: 1 }}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.08 }} // instant feedback
        aria-label="Go back"
      >
        <motion.div
          initial={{ letterSpacing: 'normal' }}
          whileHover={{
            letterSpacing: '2px',
            textDecoration: 'underline',
            transition: { duration: 0.3, ease: 'easeInOut' },
          }}
          className="arrows-container"
          style={{ background: 'transparent' }}
        >
          <NavBackArrow color="var(--text-primary, black)" fontSize="14px" />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default ArrowBackButton;