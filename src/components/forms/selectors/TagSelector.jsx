"use client";
import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import {
  Box,
  Typography,
  FormControl,
  TextField,
  Avatar,
  Chip,
  Stack,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import FieldError from "@/components/alerts/FieldError";
import useFont from '@/hooks/useFont';
import { TAG_SOURCE_REGISTRY } from '@/components/forms/configs/tagSourceRegistry';

const TagSelector = ({
  name,
  label,
  control,
  options = [],
  error,
  disabled = false,
  allowCustomInput = true,
  multiple = false,
  placeholder,
  onChange,
  tagSource = "tag",
  isCn = false,
  typeLabels = {},
  ...props
}) => {
  const { style: labelFontStyle, inputFontFamily } = useFont();

  // Default type labels derived from the shared tag-source registry, so
  // every schema registered there (artwork, event, series, project,
  // writing, ...) automatically gets a sensible fallback label here
  // without editing this file. Callers can still override/extend via
  // the `typeLabels` prop.
  const defaultTypeLabels = {
    ...TAG_SOURCE_REGISTRY.filter((s) => s.key !== 'none').reduce((acc, s) => {
      acc[s.key] = isCn ? s.label.cn : s.label.en;
      return acc;
    }, {}),
    custom: isCn ? "自定义标签" : "Custom tag",
  };

  const mergedTypeLabels = { ...defaultTypeLabels, ...typeLabels };

  // Generate a unique key for an option
  const generateOptionKey = useCallback((option, index) => {
    if (typeof option === "string") {
      return `str_${option.replace(/[^a-zA-Z0-9]/g, '_')}_${index}`;
    }
    if (option && typeof option === "object") {
      const id = option.id || option.value || option.label;
      if (id) {
        return `obj_${String(id).replace(/[^a-zA-Z0-9]/g, '_')}_${index}`;
      }
    }
    return `idx_${index}_${Date.now()}`;
  }, []);

  // Placeholder text
  const getPlaceholder = useCallback(() => {
    if (placeholder) return placeholder;
    return isCn ? "选择或输入..." : "Select or type...";
  }, [placeholder, isCn]);

  // Always show label
  const getOptionLabel = useCallback(
    (option) => {
      if (typeof option === "string") return option;
      if (option && typeof option === "object") {
        return option.label || option.value || option.id || "";
      }
      return "";
    },
    []
  );

  // Compare by id/value/label
  const isOptionEqualToValue = useCallback((option, value) => {
    if (!option || !value) return false;

    if (typeof option === "string" && typeof value === "string") {
      return option === value;
    }

    if (typeof option === "object" && typeof value === "string") {
      return (
        option.value === value ||
        option.id === value ||
        option.label === value
      );
    }

    if (typeof option === "object" && typeof value === "object") {
      return (
        option.value === value.value ||
        option.id === value.id ||
        option.label === value.label
      );
    }

    return false;
  }, []);

  // Replace handleAutocompleteChange with a robust version
  const handleAutocompleteChange = useCallback(
    (fieldOnChange, onChange) => (_, newValue) => {
      if (multiple) {
        fieldOnChange(newValue || []);
        if (onChange) onChange(newValue);
      } else {
        fieldOnChange(newValue || null);
        if (onChange) {
          if (typeof newValue === 'object' && newValue !== null) {
            onChange(newValue.label || newValue.value || newValue.id || '');
          } else {
            onChange(newValue || '');
          }
        }
      }
    },
    [multiple]
  );

  // Allow custom input as string if enabled
  const handleInputChange = useCallback(
    (fieldOnChange) => (_, newInputValue, reason) => {
      if (
        allowCustomInput &&
        reason === "input" &&
        !multiple &&
        typeof newInputValue === "string"
      ) {
        fieldOnChange(newInputValue);
      }
    },
    [allowCustomInput, multiple]
  );

  // Render selected tags as chips
  const renderTags = useCallback(
    (tagValue, getTagProps) =>
      tagValue.map((option, index) => {
        const label = getOptionLabel(option);
        const key = generateOptionKey(option, index);
        const { onDelete, ...chipProps } = getTagProps({ index });

        return (
          <Chip
            variant="outlined"
            label={label}
            {...chipProps}
            onDelete={(e) => {
              onDelete(e);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onDelete) onDelete(e);
            }}
            key={key}
            sx={labelFontStyle}
          />
        );
      }),
    [getOptionLabel, generateOptionKey, labelFontStyle]
  );

  // Render dropdown options
  const renderOption = useCallback(
    (props, option, { index }) => {
      const isStringOption = typeof option === "string";
      const optionLabel = getOptionLabel(option);
      const optionType = isStringOption ? "custom" : option.type;
      const optionTypeLabel =
        optionType && mergedTypeLabels[optionType.toLowerCase()]
          ? mergedTypeLabels[optionType.toLowerCase()]
          : optionType;

      const { key: propsKey, onClick, ...restProps } = props;
      const uniqueKey = generateOptionKey(option, index);

      return (
        <Box
          component="li"
          {...restProps}
          onClick={onClick}
          onTouchEnd={(e) => {
            e.preventDefault();
            if (onClick) onClick(e);
          }}
          key={uniqueKey}
          sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, ...labelFontStyle }}
        >
          {option?.avatar && (
            <Avatar
              key={`avatar-${uniqueKey}`}
              sx={{ width: 32, height: 32, flexShrink: 0 }}
              src={option.avatar}
              alt={optionLabel}
            />
          )}
          <Box key={`content-${uniqueKey}`} sx={{ flexGrow: 1 }}>
            <Typography
              key={`label-${uniqueKey}`}
              variant="body1"
              sx={{ fontWeight: "600", whiteSpace: "nowrap", ...labelFontStyle }}
              noWrap
            >
              {optionLabel}
            </Typography>
            <Stack
              key={`stack-${uniqueKey}`}
              direction="row"
              spacing={2}
              mt={0.25}
              flexWrap="wrap"
              alignItems="center"
            >
              {optionTypeLabel && (
                <Typography
                  key={`type-${uniqueKey}`}
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontStyle: "italic", ...labelFontStyle }}
                >
                  {optionTypeLabel}
                </Typography>
              )}
              {option?.description && (
                <Typography
                  key={`desc-${uniqueKey}`}
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    maxWidth: "60%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    ...labelFontStyle,
                  }}
                  title={option.description}
                >
                  {option.description}
                </Typography>
              )}
            </Stack>
          </Box>
        </Box>
      );
    },
    [getOptionLabel, mergedTypeLabels, generateOptionKey, labelFontStyle]
  );

  const renderInput = useCallback(
    (params) => (
      <TextField
        {...params}
        label={label || undefined} // Only show label if provided
        placeholder={getPlaceholder()}
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            fontFamily: inputFontFamily,
          },
          ...labelFontStyle,
        }}
        error={!!error}
        InputProps={{
          ...params.InputProps,
          style: {
            ...labelFontStyle,
            fontFamily: inputFontFamily,
          },
        }}
        InputLabelProps={label ? {
          style: {
            ...labelFontStyle,
            fontFamily: inputFontFamily,
          },
        } : undefined}
        onTouchEnd={(e) => {
          e.stopPropagation();
        }}
      />
    ),
    [label, getPlaceholder, error, labelFontStyle, inputFontFamily]
  );

  const noOptionsText = (
    <Box sx={{ py: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={labelFontStyle}>
        {isCn
          ? `无可用的${tagSource}选项`
          : `No ${tagSource} options available`}
      </Typography>
    </Box>
  );

  return (
    <FormControl
      fullWidth
      margin="normal"
      error={!!error}
      disabled={disabled}
      onTouchEnd={(e) => {
        e.stopPropagation();
      }}
    >
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange: fieldOnChange, value, ...field } }) => {
          const normalizeValue = (val) => {
            if (!val) return multiple ? [] : null;
            if (multiple) {
              return val.map(v =>
                typeof v === "object"
                  ? v
                  : options.find(opt => opt.id === v || opt.value === v || opt.label === v) || v
              );
            } else {
              if (typeof val === "string") {
                const matchingOption = options.find(opt =>
                  opt.id === val || opt.value === val || opt.label === val
                );
                if (matchingOption) {
                  return matchingOption;
                }
                return null;
              }
              return typeof val === "object" ? val : null;
            }
          };

          const currentValue = normalizeValue(value);

          return (
            <Autocomplete
              {...field}
              {...props}
              key={`${name}-${options.length}`}
              multiple={multiple}
              freeSolo={allowCustomInput}
              disabled={disabled}
              options={options}
              value={currentValue}
              onChange={handleAutocompleteChange(fieldOnChange, onChange)}
              onInputChange={handleInputChange(fieldOnChange)}
              getOptionLabel={getOptionLabel}
              isOptionEqualToValue={isOptionEqualToValue}
              groupBy={(option) => option?.type || undefined}
              renderTags={renderTags}
              renderInput={renderInput}
              renderOption={renderOption}
              noOptionsText={noOptionsText}
              selectOnFocus={allowCustomInput}
              clearOnBlur={false}
              handleHomeEndKeys={true}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  fontFamily: inputFontFamily,
                },
                ...labelFontStyle,
              }}
              componentsProps={{
                clearIndicator: {
                  onTouchEnd: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                },
                popupIndicator: {
                  onTouchEnd: (e) => {
                    e.stopPropagation();
                  }
                }
              }}
            />
          );
        }}
      />
      <FieldError errors={{ [name]: error }} name={name} />
    </FormControl>
  );
};

TagSelector.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  control: PropTypes.object.isRequired,
  options: PropTypes.array,
  error: PropTypes.object,
  disabled: PropTypes.bool,
  allowCustomInput: PropTypes.bool,
  multiple: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  tagSource: PropTypes.string,
  isCn: PropTypes.bool,
  typeLabels: PropTypes.object,
};

export default memo(TagSelector);