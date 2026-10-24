'use client';
import React, { useState } from 'react';

/**
 * DebugPopup Component
 * Reusable popup component with customizable button and content
 */
const ButtonPopup = ({
  // Button props
  buttonLabel = 'Toggle',
  buttonBgColor = 'bg-blue-600',
  buttonHoverBgColor = 'hover:bg-blue-700',
  buttonSize = 'px-6 py-3',
  buttonFontSize = 'text-base',
  buttonPosition = 'bottom-8 right-8',
  
  // Popup props
  popupPosition = 'bottom-24 right-8',
  popupMaxWidth = 'max-w-xl',
  popupMaxHeight = 'max-h-96',
  popupBgColor = 'bg-gray-900',
  popupBgOpacity = 'bg-opacity-95',
  
  // Content
  content = null,
  children = null,
  
  // Control
  isOpen = false,
  onToggle = null,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use controlled or uncontrolled state
  const isPopupOpen = onToggle !== null ? isOpen : internalOpen;
  const handleToggle = () => {
    if (onToggle) {
      onToggle(!isOpen);
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className={`fixed ${buttonPosition} ${buttonBgColor} ${buttonHoverBgColor} text-white ${buttonSize} ${buttonFontSize} rounded-lg font-semibold transition-colors shadow-lg z-20`}
      >
        {buttonLabel}
      </button>

      {/* Popup Panel */}
      {isPopupOpen && (
        <div className={`fixed ${popupPosition} ${popupBgColor} ${popupBgOpacity} text-white p-6 rounded-lg ${popupMaxWidth} w-full ${popupMaxHeight} overflow-auto shadow-2xl z-20 backdrop-blur-sm`}>
          {content || children}
        </div>
      )}
    </>
  );
};

export default ButtonPopup;