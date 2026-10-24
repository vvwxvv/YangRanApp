// components/forms/formItems/fields/FormTextField.jsx
import React from 'react';
import { Input } from 'antd';
import { Controller } from 'react-hook-form';
import FormField from './FormField';

const { TextArea } = Input;

/**
 * Reusable TextField component for forms
 */
const FormTextField = ({
  name,
  label,
  placeholder,
  control,
  error,
  disabled = false,
  multiline = false,
  rows = 1,
  colors,
  labelFontFamily,
  inputStyles,
  onChange,
  onBlur
}) => {
  const InputComponent = multiline ? TextArea : Input;
  const extraProps = multiline ? { rows } : {};

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
          <InputComponent
            {...field}
            {...extraProps}
            id={name}
            placeholder={placeholder || label}
            disabled={disabled}
            style={inputStyles}
            onChange={(e) => {
              field.onChange(e.target.value);
              onChange?.(e);
            }}
            onBlur={(e) => {
              field.onBlur();
              onBlur?.(e);
            }}
          />
        </FormField>
      )}
    />
  );
};

export default FormTextField;