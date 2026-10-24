// EventAdditionalInfoSection.jsx
import React from 'react';

// Reusable FormField wrapper component
const FormField = ({ 
  label, 
  error, 
  children, 
  colors, 
  labelFontFamily 
}) => (
  <div style={{ marginBottom: '16px' }}>
    {label && (
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: '500',
        fontFamily: labelFontFamily,
        color: colors?.text || '#333'
      }}>
        {label}
      </label>
    )}
    {children}
    {error && (
      <div style={{ 
        color: '#d32f2f', 
        fontSize: '12px', 
        marginTop: '4px',
        fontFamily: labelFontFamily
      }}>
        {error.message}
      </div>
    )}
  </div>
);

export default FormField;