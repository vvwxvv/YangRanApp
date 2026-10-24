// components/forms/fields/FormAutoCompleteField.jsx
//
// Free-text input WITH suggestions — used for fields whose value is a plain
// string but where we want to surface a managed list of options (e.g. the
// artwork "type" field, whose values are bilingual free text).
"use client";

import React from "react";
import { AutoComplete } from "antd";
import { Controller } from "react-hook-form";
import FormField from "./FormField";

const FormAutoCompleteField = ({
  name,
  label,
  placeholder,
  control,
  error,
  options = [],
  disabled = false,
  colors,
  labelFontFamily,
  inputStyles,
  onChange,
}) => {
  const acOptions = (options || []).map((option) => ({
    value: option.value ?? option.label,
    label: option.label ?? option.value,
  }));

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormField label={label} error={error} colors={colors} labelFontFamily={labelFontFamily}>
          <AutoComplete
            id={name}
            value={field.value ?? ""}
            options={acOptions}
            placeholder={placeholder || label}
            disabled={disabled}
            style={{ width: "100%", ...inputStyles }}
            filterOption={(input, option) =>
              String(option?.value ?? "")
                .toLowerCase()
                .includes(String(input ?? "").toLowerCase())
            }
            onChange={(value) => {
              field.onChange(value ?? "");
              onChange?.(value);
            }}
            onBlur={field.onBlur}
          />
        </FormField>
      )}
    />
  );
};

export default FormAutoCompleteField;
