"use client";
import React, { useContext, useCallback } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Box,
} from "@mui/material";
import { LanguageContext } from '@/components/contexts/LanguageContext';
import useFont from '@/hooks/useFont';

const LanguageEditFormField = React.forwardRef(
  ({ value, onChange, disabled, getLabel }, ref) => {
    const LanguageOptions = ["CN", "EN"];
    const { isCn } = useContext(LanguageContext);
    const { inputFontFamily } = useFont();

    const handleChange = useCallback(
      (event) => {
        if (onChange) {
          onChange(event.target.value);
        }
      },
      [onChange]
    );

    const labelText = isCn ? "语言" : "Language";
    const placeholderText = isCn ? "请选择语言" : "Select language";

    return (
      <Box sx={{ mt: 6, mb: 6 }}>
        <FormControl fullWidth variant="outlined" disabled={disabled}>
          <InputLabel id="language-select-label" style={{ fontFamily: inputFontFamily }}>{labelText}</InputLabel>
          <Select
            labelId="language-select-label"
            id="language-select"
            name="language"
            value={value || ""}
            onChange={handleChange}
            label={labelText}
            inputRef={ref}
            sx={{ borderRadius: 2, fontFamily: inputFontFamily }}
          >
            <MenuItem value="" disabled style={{ fontFamily: inputFontFamily }}>
              {placeholderText}
            </MenuItem>
            {LanguageOptions.map((item) => (
              <MenuItem key={item} value={item} style={{ fontFamily: inputFontFamily }}>
                {isCn && item === "CN" ? "中文" : isCn && item === "EN" ? "英文" : item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  }
);

LanguageEditFormField.displayName = "LanguageEditFormField";

export default LanguageEditFormField;
