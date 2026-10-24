import React, {  useMemo } from 'react';
import { Input } from 'antd';


const { TextArea } = Input;

const FormField = ({ 
  label, 
  error, 
  children, 
  colors, 
  labelFontFamily 
}) => (
  <div>
    <label 
      style={{ 
        display: 'block', 
        marginBottom: '8px',
        color: colors?.text || '#000',
        fontFamily: labelFontFamily,
        fontSize: '14px',
        fontWeight: 500
      }}
    >
      {label}
    </label>
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

/**
 * TextAreaField component for reusable text areas
 */
const TextAreaField = ({
  name,
  label,
  placeholder,
  rows,
  disabled,
  error,
  field,
  colors,
  inputFontFamily,
  labelFontFamily
}) => {
  const inputStyles = useMemo(() => ({
    fontFamily: inputFontFamily,
    color: colors?.text || '#000',
    backgroundColor: colors?.background || '#fff',
    borderColor: colors?.border || '#ccc',
    borderRadius: '8px'
  }), [colors, inputFontFamily]);

  return (
    <FormField
      label={label}
      error={error}
      colors={colors}
      labelFontFamily={labelFontFamily}
    >
      <TextArea
        {...field}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        style={inputStyles}
        onChange={(e) => field.onChange(e.target.value)}
      />
    </FormField>
  );
};

export default TextAreaField;