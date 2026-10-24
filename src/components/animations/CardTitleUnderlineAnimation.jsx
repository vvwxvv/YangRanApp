"use client";

import useFont from '@/hooks/useFont';

const CardTitleUnderlineAnimation = ({ title, isHovered, onClick }) => {
  const { contentTitleFontFamily } = useFont();

  if (!title) return null;
  
  return (
    <div 
      className={`card-title ${isHovered ? 'hovered' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(e); } : undefined}
      style={{ 
        fontSize: '16px', 
        fontFamily: contentTitleFontFamily,
        fontWeight: '600',
        color: 'var(--text-primary, #000000)',
        wordBreak: 'break-word',
        whiteSpace: 'normal',
        lineHeight: '1.4',
        marginLeft: '20px',
        marginTop: '20px',
        marginBottom: '4px',
        position: 'relative',
        display: 'inline-block',
        maxWidth: 'calc(100% - 40px)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {title}
      <style jsx>{`
        .card-title {
          position: relative;
        }
        
        .card-title::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--text-primary, #000000);
          transition: width 0.3s ease-in-out;
        }
        
        .card-title.hovered::after {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default CardTitleUnderlineAnimation;