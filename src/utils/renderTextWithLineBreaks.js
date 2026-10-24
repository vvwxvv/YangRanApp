import React from 'react';
import formatText from './formatText';

/**
 * Render text with line breaks as React elements
 * @param {string} text - Text to render
 * @returns {React.ReactNode|null} - React elements with line breaks
 */
const renderTextWithLineBreaks = (text) => {
  if (!text) return null;
  const formattedText = formatText(text);
  
  return formattedText.split('\n').map((line, index, array) => (
    <span key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </span>
  ));
};

export default renderTextWithLineBreaks;