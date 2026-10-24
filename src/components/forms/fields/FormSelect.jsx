import React from 'react';
import { Controller } from 'react-hook-form';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

const FormSelect = ({
  name,
  label,
  control,
  options = [],
  disabled = false,
  onChange,
  placeholder = '',
  error,
  colors = {},
  required = false,
  multiple = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error: fieldError } }) => {
        const errorMessage = error?.message || fieldError?.message;

        return (
          <FormControl 
            fullWidth 
            error={!!errorMessage}
            disabled={disabled}
          >
            <InputLabel id={`${name}-label`}>
              {label}
              {required && ' *'}
            </InputLabel>
            <Select
              {...field}
              labelId={`${name}-label`}
              id={name}
              label={label}
              multiple={multiple}
              onChange={(e) => {
                field.onChange(e);
                onChange?.(e.target.value);
              }}
              displayEmpty
              sx={{
                backgroundColor: colors.background || '#fff',
                borderRadius: '8px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.border || '#ccc',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.primary || '#000',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.primary || '#000',
                },
                '&.Mui-disabled': {
                  backgroundColor: colors.disabled || '#f5f5f5',
                },
              }}
            >
              {placeholder && (
                <MenuItem value="" disabled>
                  <em>{placeholder}</em>
                </MenuItem>
              )}
              {options.map((option) => (
                <MenuItem 
                  key={option.value} 
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errorMessage && (
              <FormHelperText error>
                {errorMessage}
              </FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
};

export default FormSelect;