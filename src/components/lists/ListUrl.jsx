import React from 'react';
import { Box } from '@mui/material';
import Link from 'next/link';

const ListUrl = ({ 
  url, 
  title, 
  fontFamily, 
  isCn = false,
  fontSize = '15px',
  fontWeight = 400,
  showTitle = true,
  titleFontSize = '13px',
  titleFontWeight = 'bold',
  padding = '4px 0',
  marginBottom = 3,
  horizontalPadding = 4
}) => {
  if (!url) return null;

  return (
    <Box sx={{ textAlign: 'left', mb: marginBottom, px: horizontalPadding }}>
      {showTitle && (
        <>
          <p style={{
            color: 'var(--text-primary, #000000)',
            fontSize: titleFontSize,
            fontFamily: fontFamily,
            fontWeight: titleFontWeight,
            margin: 0,
            marginBottom: '8px'
          }}>
            {title || (isCn ? "相关链接" : "Related Url")}
          </p>
        </>
      )}
      
      <Link 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          color: 'var(--text-primary, #000000)',
          textDecoration: 'none',
          fontSize: fontSize,
          fontWeight: fontWeight,
          fontFamily: fontFamily,
          wordBreak: 'break-all',
          display: 'block',
          transition: 'all 0.3s ease',
          letterSpacing: 'normal',
          border: 'none',
          padding: padding,
        }}
        onMouseEnter={(e) => {
          e.target.style.color = 'var(--text-primary, #000000)';
          e.target.style.textDecoration = 'underline';
          e.target.style.letterSpacing = '1.5px';
          e.target.style.border = `1px solid var(--text-primary, #000000)`;
          e.target.style.padding = '3px 4px';
        }}
        onMouseLeave={(e) => {
          e.target.style.color = 'var(--text-primary, #000000)';
          e.target.style.textDecoration = 'none';
          e.target.style.letterSpacing = 'normal';
          e.target.style.border = 'none';
          e.target.style.padding = padding;
        }}
      >
        {url}
      </Link>
    </Box>
  );
};

export default ListUrl;
