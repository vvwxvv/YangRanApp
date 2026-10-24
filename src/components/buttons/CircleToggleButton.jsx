import React from 'react';

const CircleToggleButton = ({
  isActive = false,
  onToggle,
  fieldName = 'toggle',
  activeColor = 'var(--text-primary, black)',
  inactiveColor = 'red',
  diameter = 24, // in pixels
  borderWidth = 2,
  hoverColor = null,
  title = '',
  titleCn = '',
  isCn = false,
  className = '',
  style = {},
}) => {
  const size = `${diameter}px`;
  const borderSize = `${borderWidth}px`;
  
  // Generate hover color if not provided
  const defaultHoverColor = inactiveColor === 'red' ? 'red' : `${inactiveColor}50`;
  const finalHoverColor = hoverColor || defaultHoverColor;

  const buttonStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    border: `${borderSize} solid ${isActive ? activeColor : inactiveColor}`,
    backgroundColor: isActive ? activeColor : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    filter: 'var(--button-filter, none)',
    ...style,
  };

  const hoverStyle = {
    backgroundColor: isActive ? activeColor : `${finalHoverColor}20`,
  };

  const handleMouseEnter = (e) => {
    if (!isActive) {
      e.target.style.backgroundColor = `${finalHoverColor}20`;
    }
  };

  const handleMouseLeave = (e) => {
    if (!isActive) {
      e.target.style.backgroundColor = 'transparent';
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (onToggle) {
      onToggle(e);
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggle) {
      onToggle(e);
    }
  };

  const displayTitle = isCn ? titleCn : title;

  return (
    <button
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
      style={{
        ...buttonStyle,
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`touch-manipulation ${className}`}
      title={displayTitle}
      aria-label={displayTitle}
      data-field={fieldName}
      data-active={isActive}
    />
  );
};

export default CircleToggleButton; 