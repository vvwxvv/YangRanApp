"use client";
import React from 'react';
import { Typography, Divider, Box } from '@mui/material';
import useFont from '@/hooks/useFont';

/**
 * FormTitle - A reusable form section title with optional divider.
 *
 * Props:
 * - title (string): The heading text to display.
 * - schemaNameEn (string): The schema name in English (e.g. 'Artwork').
 * - schemaNameCn (string): The schema name in Chinese (e.g. '作品').
 * - isCn (boolean): Whether to use Chinese or English for the schema name.
 * - showDivider (boolean): Whether to show a horizontal divider below the title.
 */
const FormTitle = ({ schemaNameEn, schemaNameCn, isCn, showDivider = true, colors }) => {
  const { contentTitleFontFamily, style: fontStyle } = useFont();
  // Compose the full title: SchemaName + Form Title
  let prefix = '';
  if (schemaNameEn && schemaNameCn) {
    prefix = isCn ? schemaNameCn : schemaNameEn;
  } else if (schemaNameEn) {
    prefix = schemaNameEn;
  } else if (schemaNameCn) {
    prefix = schemaNameCn;
  }

  const title = isCn ? "信息表单" : "Information Form";
  const fullTitle = prefix ? ` ${title} | ${prefix}  ` : title;
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontSize: { xs: '22px', sm: '26px' },
          fontWeight: 700,
          textAlign: 'center',
          color: colors?.text || 'var(--text-primary, #000000)',
          fontFamily: contentTitleFontFamily,
          ...fontStyle,
          mb: showDivider ? 2 : 1.5,
        }}
      >
        {fullTitle}
      </Typography>
      {showDivider && (
        <Divider
          variant="fullWidth"
          sx={{
            borderStyle: 'dashed',
            borderColor: colors?.border || 'grey.400',
            borderBottomWidth: 2,
            mt: 2,
            mb: 0,
          }}
        />
      )}
    </Box>
  );
};

export default FormTitle;
