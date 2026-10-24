import React from 'react';

/**
 * Renders a field from an item based on field configuration
 *
 * @param {Object} props - Component props
 * @param {Object} props.field - Field configuration object
 * @param {Object} props.item - Data item
 * @param {boolean} props.isTitle - Whether this field is a title
 * @param {boolean} props.isSummary - Whether this field is part of summary
 * @param {Object} props.config - UI configuration
 * @param {boolean} props.isCn - Whether to use Chinese labels
 * @param {Object} props.labelStyle - Additional styles for label
 * @param {Object} props.valueStyle - Additional styles for value
 */
const ItemFieldRenderer = React.memo(({ 
  field, 
  item, 
  isTitle = false, 
  isSummary = false, 
  config,
  isCn = false,
  labelStyle = {},
  valueStyle = {}
}) => {
  const { key, label, render } = field;
  const value = item[key];

  // Always resolve label to a string
  const resolvedLabel = typeof label === 'function' ? label(isCn) : label;
  const displayValue = render ? render(value, item) : value;

  // For debugging: always show the field if it's introduction
  if (key === 'introduction') {
    console.log(' Introduction field:', { key, value, resolvedLabel, displayValue });
  }

  if (isTitle) {
    return (
      <div 
        className={config.typography.title.className}
        style={config.typography.title.style}
      >
        {displayValue}
      </div>
    );
  }

  if (isSummary) {
    return (
      <div style={{ wordBreak: 'break-word', whiteSpace: 'normal', lineHeight: '1.4' }}>
        <span className={config.typography.label.className} style={labelStyle}>{resolvedLabel}:</span>{' '}
        <span style={valueStyle}>{displayValue}</span>
      </div>
    );
  }

  return (
    <div className="flex items-start" style={{ wordBreak: 'break-word', whiteSpace: 'normal', lineHeight: '1.4' }}>
      <span className={`${config.typography.label.className} ${config.typography.label.minWidth}`} style={labelStyle}>
        {resolvedLabel}:
      </span>
      <span 
        className={config.typography.value.className}
        style={{ ...config.typography.value.style, ...valueStyle }}
      >
        {displayValue}
      </span>
    </div>
  );
});

// Ensure proper display name for React DevTools
ItemFieldRenderer.displayName = 'ItemFieldRenderer';

export default ItemFieldRenderer; 