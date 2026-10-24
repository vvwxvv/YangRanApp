"use client";
import React from "react";
import {
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  FormHelperText,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import useFont from '@/hooks/useFont';

const LanguageFormField = ({
  name = "language",   // Field name in form
  control,             // React Hook Form control object
  error,               // Validation error for this field
  disabled = false,    // Disable the field
  getLabel,            // Function for i18n label text
  defaultValue = "CN", // Default value to prevent uncontrolled state
  isCn,                // New prop for checking if the page is in Chinese
}) => {
  const { inputFontFamily } = useFont();
  const LanguageOptions = ["CN", "EN"];

  const labelText =
    typeof getLabel === "function" ? getLabel("language") || "Language" : "Language";

  // If control is missing, do not render Controller (fail gracefully)
  if (!control) {
    console.warn(`LanguageFormField: "control" prop is missing or null.`);
    return null; // or return a fallback UI if needed
  }

  return (
    <FormControl
      fullWidth
      variant="outlined"
      error={!!error}
      disabled={disabled}
    >
      <InputLabel id={`${name}-select-label`} style={{ fontFamily: inputFontFamily }}>{labelText}</InputLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Select
            labelId={`${name}-select-label`}
            id={`${name}-select`}
            label={labelText}
            {...field}
            value={field.value || defaultValue}
            disabled={disabled}
            sx={{ fontFamily: inputFontFamily }}
          >
            {LanguageOptions.map((item) => (
              <MenuItem key={item} value={item} style={{ fontFamily: inputFontFamily }}>
                {item}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {error && <FormHelperText>{error.message}</FormHelperText>}
      <FormHelperText>
        {`Current language: ${control?._formValues?.[name] || defaultValue}`}
      </FormHelperText>
    </FormControl>
  );
};

LanguageFormField.displayName = "LanguageFormField";

export default LanguageFormField;