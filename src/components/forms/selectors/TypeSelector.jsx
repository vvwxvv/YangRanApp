// TypeSelector.jsx
import React from 'react';
import { Select } from 'antd';
import { Controller } from "react-hook-form";
import useFont from '@/hooks/useFont';

const { Option } = Select;

const TypeSelector = ({ 
  form,
  name = "type", // Add name prop for flexibility
  value, 
  onChange, 
  disabled, 
  getLabel, 
  onFieldChange,
  colors,
  options = [],
  placeholder,
  isCn = false,
  ...registerProps 
}) => {
  const { style: labelFontStyle, inputFontFamily, labelFontFamily } = useFont();

  if (form) {
    return (
      <Controller
        name={name} // Use the name prop instead of hardcoded "type"
        control={form.control}
        render={({ field }) => (
          <div 
            style={{ marginBottom: '16px' }}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <label 
              className="form-label" 
              style={{ 
                color: colors?.text || '#2c2c2c',
                fontFamily: labelFontFamily,
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                display: 'block'
              }}
            >
              {getLabel ? getLabel('type', isCn) : 'Type'}
            </label>
            <Select
              {...field}
              id={name}
              placeholder={placeholder || getLabel?.('typePlaceholder', isCn) || (isCn ? '选择类型' : 'Select type')}
              disabled={disabled}
              showSearch
              allowClear
              style={{
                width: '100%',
                fontFamily: inputFontFamily,
                color: colors?.text || '#2c2c2c',
                backgroundColor: colors?.background || '#fff',
                borderColor: colors?.border || '#d9d9d9',
                borderRadius: '8px',
              }}
              onChange={(value) => {
                // Ensure the value is properly set
                const newValue = value || "";
                field.onChange(newValue);
                onFieldChange && onFieldChange(name);
                
                // Trigger validation if needed
                form.trigger(name);
              }}
              onTouchEnd={(e) => e.stopPropagation()}
              value={field.value || undefined} // Use undefined instead of empty string for better handling
              popupRender={(menu) => (
                <div onTouchEnd={(e) => e.stopPropagation()}>
                  {menu}
                </div>
              )}
            >
              <Option 
                value="" 
                style={{
                  color: colors?.text || '#2c2c2c',
                  backgroundColor: colors?.background || '#fff',
                  fontFamily: inputFontFamily,
                }}
              >
                <em>{isCn ? '选择类型' : 'Select type'}</em>
              </Option>
              {options.map((type) => (
                <Option 
                  key={type.id} 
                  value={type.value} 
                  style={{
                    color: colors?.text || '#2c2c2c',
                    backgroundColor: colors?.background || '#fff',
                    fontFamily: inputFontFamily,
                  }}
                >
                  {type.label}
                </Option>
              ))}
            </Select>
            {form.formState.errors?.[name] && (
              <div 
                style={{ 
                  color: '#d32f2f', 
                  fontSize: '12px', 
                  marginTop: '4px',
                  fontFamily: labelFontFamily
                }}
              >
                {form.formState.errors[name].message}
              </div>
            )}
          </div>
        )}
      />
    );
  }

  // ... rest of the component for non-form usage
};

export default TypeSelector;