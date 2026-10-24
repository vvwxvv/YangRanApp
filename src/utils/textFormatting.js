import React from 'react';
import Link from 'next/link';

/**
 * Check if a URL is external (not part of the current domain)
 * @param {string} url - The URL to check
 * @returns {boolean} - True if external, false if internal
 */
const isExternalUrl = (url) => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
};

/**
 * Check if URL is a file download (pdf, doc, etc.)
 * @param {string} url - The URL to check
 * @returns {boolean} - True if it's a file download
 */
const isFileDownload = (url) => {
  const fileExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar', '.mp3', '.mp4', '.avi'];
  return fileExtensions.some(ext => url.toLowerCase().includes(ext));
};

/**
 * Process basic markdown formatting in text
 * @param {string} text - The text to process
 * @param {Object} linkOptions - Options for link rendering
 * @returns {React.ReactNode} - Processed text with markdown elements
 */
export const processMarkdown = (text, linkOptions = {}) => {
  const {
    prefetch = false,
    scroll = true,
    replace = false,
    shallow = false
  } = linkOptions;

  // Handle markdown patterns
  const parts = [];
  let remainingText = text;
  
  // Process **bold** text
  remainingText = remainingText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
    const placeholder = `__BOLD_${parts.length}__`;
    parts.push(<strong key={`bold-${parts.length}`}>{content}</strong>);
    return placeholder;
  });
  
  // Process *italic* text
  remainingText = remainingText.replace(/\*(.*?)\*/g, (match, content) => {
    const placeholder = `__ITALIC_${parts.length}__`;
    parts.push(<em key={`italic-${parts.length}`}>{content}</em>);
    return placeholder;
  });
  
  // Process `code` text
  remainingText = remainingText.replace(/`(.*?)`/g, (match, content) => {
    const placeholder = `__CODE_${parts.length}__`;
    parts.push(
      <code 
        key={`code-${parts.length}`}
        style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '2px 4px', 
          borderRadius: '3px',
          fontSize: '0.9em',
          fontFamily: 'monospace'
        }}
      >
        {content}
      </code>
    );
    return placeholder;
  });
  
  // Process [link](url) format with Next.js Link component
  remainingText = remainingText.replace(/\[(.*?)\]\((.*?)\)/g, (match, linkText, url) => {
    const placeholder = `__LINK_${parts.length}__`;
    
    // Check if it's an external URL or file download
    if (isExternalUrl(url) || isFileDownload(url)) {
      // External link or file download - use regular <a> tag
      parts.push(
        <a 
          key={`link-${parts.length}`}
          href={url} 
          target={isFileDownload(url) ? "_self" : "_blank"}
          rel="noopener noreferrer"
          style={{ 
            color: 'black', 
            textDecoration: 'underline' 
          }}
        >
          {linkText}
        </a>
      );
    } else {
      // Internal link - use Next.js Link component
      parts.push(
        <Link 
          key={`link-${parts.length}`}
          href={url}
          prefetch={prefetch}
          scroll={scroll}
          replace={replace}
          shallow={shallow}
          style={{ 
            color: 'black', 
            textDecoration: 'underline' 
          }}
        >
          {linkText}
        </Link>
      );
    }
    
    return placeholder;
  });
  
  // Split the remaining text by placeholders and reconstruct
  const tokens = remainingText.split(/(__[A-Z]+_\d+__)/);
  const result = tokens.map((token, index) => {
    const placeholderMatch = token.match(/__([A-Z]+)_(\d+)__/);
    if (placeholderMatch) {
      const partIndex = parseInt(placeholderMatch[2]);
      return parts[partIndex] || token;
    }
    return token;
  });
  
  return result.length > 1 ? result : text;
};

/**
 * Render text with line breaks and markdown formatting
 * @param {string} text - The text to render
 * @param {Object} options - Rendering options
 * @param {Object} options.lineStyle - Additional styles for each line
 * @param {string} options.emptyLineHeight - Height for empty lines (default: '12px')
 * @returns {React.ReactNode} - Formatted text with line breaks
 */
export const renderTextWithFormatting = (text, options = {}) => {
  if (!text) return null;
  
  const { 
    lineStyle = {}, 
    emptyLineHeight = '12px',
    marginBottom = '8px'
  } = options;
  
  // First, split by actual \n characters (handle both \n and \\n)
  const lines = text.split(/\\n|\n/);
  
  return lines.map((line, lineIndex) => {
    if (!line.trim()) {
      // Empty line - render as spacing
      return <div key={lineIndex} style={{ height: emptyLineHeight }} />;
    }
    
    // Process basic markdown in each line
    const processedLine = processMarkdown(line.trim());
    
    return (
      <div 
        key={lineIndex} 
        style={{ 
          marginBottom: marginBottom, 
          display: 'block',
          ...lineStyle
        }}
      >
        {processedLine}
      </div>
    );
  });
};

/**
 * Render array content with text formatting
 * @param {Array|string} items - Array of text items or single string
 * @param {Object} containerStyle - Styles for each container
 * @param {Object} textOptions - Options for text formatting
 * @returns {React.ReactNode} - Formatted array content
 */
export const renderArrayContent = (items, containerStyle = {}, textOptions = {}) => {
  if (!items) return null;
  
  const defaultContainerStyle = {
    textAlign: 'left',
    lineHeight: 1.6,
    fontSize: '13px',
    margin: '0 0 12px 0',
    color: '#666'
  };
  
  const finalContainerStyle = { ...defaultContainerStyle, ...containerStyle };
  
  if (!Array.isArray(items)) {
    // If it's a string instead of array, treat it as a single item
    if (typeof items === 'string') {
      return (
        <div style={finalContainerStyle}>
          {renderTextWithFormatting(items, textOptions)}
        </div>
      );
    }
    return null;
  }
  
  return items.map((item, idx) => (
    <div key={idx} style={finalContainerStyle}>
      {renderTextWithFormatting(item, textOptions)}
    </div>
  ));
};

/**
 * Simple function to just convert line breaks without markdown
 * @param {string} text - The text to process
 * @returns {React.ReactNode} - Text with line breaks
 */
export const renderLineBreaks = (text) => {
  if (!text) return null;
  
  return text.split(/\\n|\n/).map((line, index, array) => (
    <React.Fragment key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </React.Fragment>
  ));
};

// Export all functions as default object
export default {
  processMarkdown,
  renderTextWithFormatting,
  renderArrayContent,
  renderLineBreaks,
  isExternalUrl
};