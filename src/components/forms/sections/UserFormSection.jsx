// UserFormSection.jsx
import React, { useContext, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/* ---------- internal imports ---------- */
import { LanguageContext } from '@/components/contexts/LanguageContext';
import { getSystemLabel } from '@/components/labels/system_labels';
import useFont from '@/hooks/useFont';

/* ---------- sub-components ---------- */
import FormTextField from '@/components/forms/fields/FormTextField';

/* ---------- centralised labels ---------- */
import USER_FORM_LABELS from '@/components/forms/labels/userFormLabels';

/* =============================================================================
  Field meta – ONLY real User-model fields
============================================================================= */
const FIELD_META = [
  { name: 'username',     type: 'text' },
  { name: 'email',        type: 'text' },
  { name: 'password',     type: 'password' },
];

/* =============================================================================
  Main Component
============================================================================= */
const UserFormSection = ({
  form,
  disabled = false,
  getLabel,
  onFieldChange,
  colors = {},
}) => {
  const theme = useTheme();
  const { isCn } = useContext(LanguageContext);
  const { inputFontFamily, labelFontFamily } = useFont();

  /* ---------- labels ---------- */
  const getFieldLabel = (key) =>
    getLabel?.(key) ??
    USER_FORM_LABELS.fields[key]?.[isCn ? 'cn' : 'en'] ??
    getSystemLabel(key, isCn);

  const paletteColor = (key) => colors[key] || theme.palette[key] || theme.palette.grey[key];

  const inputStyles = useMemo(
    () => ({
      fontFamily: inputFontFamily,
      color: paletteColor('text') || '#000',
      backgroundColor: paletteColor('background') || '#fff',
      borderColor: paletteColor('border') || '#ccc',
      borderRadius: '8px',
    }),
    [colors, theme, inputFontFamily]
  );

  /* ---------- render ---------- */
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* simple fields */}
      {FIELD_META.filter((meta) => !(meta.hideIf && meta.hideIf())).map(
        (meta) => (
          <FormTextField
            key={meta.name}
            name={meta.name}
            label={getFieldLabel(meta.name)}
            control={form.control}
            error={form.formState.errors[meta.name]}
            disabled={disabled}
            type={meta.type}
            colors={colors}
            labelFontFamily={labelFontFamily}
            inputStyles={inputStyles}
            onChange={() => onFieldChange?.(meta.name)}
            placeholder={getFieldLabel(meta.name)}
          />
        )
      )}
    </Box>
  );
};

export default UserFormSection;
