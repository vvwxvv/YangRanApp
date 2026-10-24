"use client";
import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { Controller } from "react-hook-form";
import useFont from '@/hooks/useFont';

const CategorySelector = ({
  name,
  control,
  errors = {},
  options = [],
  label = "Select",
  disabled = false,
  onChange,
}) => {
  const { inputFontFamily, labelFontFamily } = useFont();
  const labelId = `${name}-label`;
  const hasError = !!errors[name];

  return (
    <FormControl
      fullWidth
      margin="normal"
      error={hasError}
      disabled={disabled}
      sx={{ minWidth: 120 }}
    >
      <InputLabel id={labelId} style={{ fontFamily: labelFontFamily }}>{label}</InputLabel>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            labelId={labelId}
            id={`${name}-select`}
            label={label}
            variant="outlined"
            sx={{ borderRadius: 2, fontFamily: inputFontFamily }}
            onChange={(e) => {
              field.onChange(e);
              if (onChange) onChange(e);
            }}
          >
            {options.map((option) => {
              const isObject = typeof option === "object";
              const value = isObject ? option.value : option;
              const label = isObject ? option.label : option;

              return (
                <MenuItem key={value} value={value} style={{ fontFamily: inputFontFamily }}>
                  {label}
                </MenuItem>
              );
            })}
          </Select>
        )}
      />

      {hasError && (
        <FormHelperText>{errors[name]?.message}</FormHelperText>
      )}
    </FormControl>
  );
};

export default CategorySelector;
