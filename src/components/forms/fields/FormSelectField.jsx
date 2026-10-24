// components/forms/formItems/fields/FormSelectField.jsx
import React from 'react';
import { Select } from 'antd';
import { Controller } from 'react-hook-form';
import FormField from './FormField';

const { Option } = Select;

/**
 * Reusable SelectField component for forms
 */
const FormSelectField = ({
  name,
  label,
  placeholder,
  control,
  error,
  options = [],
  disabled = false,
  loading = false,
  showSearch = true,
  allowClear = true,
  colors,
  labelFontFamily,
  inputFontFamily,
  inputStyles,
  onChange,
  onBlur,
  mode // 'multiple', 'tags', etc.
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormField
          label={label}
          error={error}
          colors={colors}
          labelFontFamily={labelFontFamily}
        >
          <Select
            {...field}
            id={name}
            mode={mode}
            placeholder={placeholder || label}
            disabled={disabled}
            loading={loading}
            showSearch={showSearch}
            allowClear={allowClear}
            style={{ width: '100%', ...inputStyles }}
            onChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
            onBlur={() => {
              field.onBlur();
              onBlur?.();
            }}
            value={field.value || (mode === 'multiple' ? [] : '')}
            filterOption={(input, option) =>
              (option?.children?.toLowerCase() ?? '').includes(input.toLowerCase())
            }
          >
            {options.map((option) => (
              <Option
                key={option.id || option.value}
                value={option.value}
                style={{
                  color: colors?.text || '#000',
                  backgroundColor: colors?.background || '#fff',
                  fontFamily: inputFontFamily
                }}
              >
                {option.displayLabel || option.label || option.value}
              </Option>
            ))}
          </Select>
        </FormField>
      )}
    />
  );
};

export default FormSelectField;