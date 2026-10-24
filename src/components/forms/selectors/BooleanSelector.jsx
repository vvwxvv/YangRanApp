import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import useFont from '@/hooks/useFont';
import { getBooleanOptions } from '@/components/forms/utils/formDataUtils';

const BooleanSelector = ({ 
  value, 
  onChange, 
  disabled, 
  getLabel, 
  language = 'en',
  fieldName = 'boolean',
  ...registerProps 
}) => {
  const { style: labelFontStyle, labelFontFamily } = useFont();
  
  // Get boolean options from JSON configuration
  const booleanOptions = getBooleanOptions(language);
  
  // Handle both direct onChange and react-hook-form onChange
  const handleChange = (event) => {
    if (onChange) {
      onChange(event);
    }
    // Also call react-hook-form onChange if provided
    if (registerProps.onChange) {
      registerProps.onChange(event);
    }
  };

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel 
        id={`${fieldName}-label`} 
        style={{ ...labelFontStyle, fontFamily: labelFontFamily, color: '#000000' }}
      >
        {getLabel ? getLabel(fieldName) : fieldName}
      </InputLabel>
      <Select
        labelId={`${fieldName}-label`}
        id={fieldName}
        value={value}
        label={getLabel ? getLabel(fieldName) : fieldName}
        onChange={handleChange}
        variant="outlined"
        sx={{ 
          borderRadius: '8px', 
          ...labelFontStyle, 
          fontFamily: labelFontFamily,
          '& .MuiSelect-select': {
            color: '#000000',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#000000',
          },
        }}
        inputProps={{ 
          style: { ...labelFontStyle, fontFamily: labelFontFamily, color: '#000000' } 
        }}
        {...registerProps}
      >
        {booleanOptions.map((option) => (
          <MenuItem 
            key={option.value} 
            value={option.value} 
            style={{ ...labelFontStyle, fontFamily: labelFontFamily, color: '#000000' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BooleanSelector; 