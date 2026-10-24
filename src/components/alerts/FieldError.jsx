"use client";
import React from "react";
import { Typography } from "@mui/material";
import useFont from '@/hooks/useFont';

/**
 * FieldError displays a validation message from react-hook-form errors.
 * It supports dot-notation for nested fields (e.g., "user.name.first").
 */
const FieldError = ({ errors = {}, name }) => {
  const { contentFontFamily } = useFont();
  if (!name) return null;

  // Support dot notation for nested errors
  const getNestedError = (obj, path) => {
    return path
      .split(".")
      .reduce((acc, part) => (acc && acc[part] ? acc[part] : null), obj);
  };

  const error = getNestedError(errors, name);

  return error?.message ? (
    <Typography
      color="error"
      variant="caption"
      sx={{ mt: 0.5, display: "block", fontFamily: contentFontFamily }}
    >
      {error.message}
    </Typography>
  ) : null;
};

export default FieldError;
