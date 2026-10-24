import React from 'react';
import { Tooltip } from 'antd';

/**
 * ImageTooltip - Simple tooltip wrapper for any component
 * Shows caption based on language (isCn)
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to wrap
 * @param {string} props.captionEn - English caption from Image model
 * @param {string} props.captionCn - Chinese caption from Image model
 * @param {boolean} props.isCn - Language switch
 * @param {string} props.placement - Tooltip position (top, bottom, left, right)
 */
const ImageCaptionTooltip = ({
  children,
  captionEn,
  captionCn,
  isCn = false,
  placement = 'bottom'
}) => {
  // Get tooltip content based on language
  const tooltipContent = isCn ? captionCn : captionEn;

  // If no caption available, just return children without tooltip
  if (!tooltipContent) {
    return children;
  }

  return (
    <Tooltip
      title={tooltipContent}
      placement={placement}
      arrow={false}
    >
      {children}
    </Tooltip>
  );
};

export default ImageCaptionTooltip;