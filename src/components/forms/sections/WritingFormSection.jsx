import React, { useContext } from 'react';
import { Stack } from '@mui/material';

/* ---------- internal imports ---------- */
import { LanguageContext } from '@/components/contexts/LanguageContext';

/* ---------- reusable components ---------- */
import TabbedFormManager from '@/components/forms/managers/TabbedFormManager';

/* ---------- centralised labels ---------- */
import WRITING_FORM_LABELS from '@/components/forms/labels/writingFormLabels';

/* =============================================================================
Writing Form Schema Definition
============================================================================= */
const WRITING_SCHEMA = [
  {
    key: 'basic',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'subtitle', type: 'text' },
      { name: 'author', type: 'text' },
      // Year dropdown (1980 → current year) — shared YearSelector.
      { name: 'year', type: 'year' },
    ],
  },
  {
    key: 'content',
    fields: [
      { name: 'summary', type: 'multiline', rows: 3 },
      { name: 'caption',  type: 'multiline', rows: 3  },
    ],
  },
  {
    key: 'paragraphs',
    type: 'array',
    fieldName: 'paragraphs',
    multiline: true,
    rows: 5,
  },
  {
    key: 'metadata',
    fields: [
      { name: 'keywords', type: 'text' },
      { name: 'category', type: 'text' },
      { name: 'type', type: 'text' },
      { name: 'status', type: 'text' },
      { name: 'tag', type: 'text' },
      // Language dropdown — shared LanguageSelector (EN / CN).
      { name: 'language', type: 'language' },
    ],
  },
];

/* =============================================================================
Writing Form Section Component
============================================================================= */
const WritingFormSection = ({
  form,
  disabled = false,
  getLabel,
  onFieldChange,
  colors = {},
}) => {
  const { isCn } = useContext(LanguageContext);

  /* ---------- FORCE our labels into the schema itself ---------- */
  const enhancedSchema = WRITING_SCHEMA.map(section => {
    const enhancedSection = { ...section };

    // Add label to section
    if (WRITING_FORM_LABELS?.tabs?.[section.key]) {
      enhancedSection.label = WRITING_FORM_LABELS.tabs[section.key];
    }

    // Add labels to each field
    if (section.fields) {
      enhancedSection.fields = section.fields.map(field => ({
        ...field,
        label: WRITING_FORM_LABELS?.fields?.[field.name] || { en: field.name, cn: field.name },
      }));
    }

    // Add label for array type sections
    if (section.type === 'array' && section.fieldName) {
      enhancedSection.label = WRITING_FORM_LABELS?.fields?.[section.fieldName] || { 
        en: section.fieldName, 
        cn: section.fieldName 
      };
      enhancedSection.addLabel = WRITING_FORM_LABELS?.fields?.[`add${section.fieldName}`] || {
        en: `Add ${section.fieldName}`,
        cn: `添加${section.fieldName}`
      };
    }

    return enhancedSection;
  });

  // Normalize keys for label lookup
  const normalizeKey = (key) => key?.toLowerCase();

  /* ---------- Simple label function that ALWAYS uses our centralized labels ---------- */
  const getLabelFunc = (key) => {
    const lang = isCn ? 'cn' : 'en';
    const normKey = normalizeKey(key);

    // Check all possible locations for this label
    if (WRITING_FORM_LABELS?.fields?.[normKey]?.[lang]) {
      return WRITING_FORM_LABELS.fields[normKey][lang];
    }

    if (WRITING_FORM_LABELS?.tabs?.[normKey]?.[lang]) {
      return WRITING_FORM_LABELS.tabs[normKey][lang];
    }

    return key.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  /* ---------- Tab label function ---------- */
  const getTabLabel = (tabKey, fallbackLabel) => {
    const lang = isCn ? 'cn' : 'en';
    return (
      WRITING_FORM_LABELS?.tabs?.[tabKey]?.[lang] ||
      (fallbackLabel && fallbackLabel[lang]) ||
      tabKey.replace(/[_-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  /* ---------- render ---------- */
  return (
    <TabbedFormManager
      form={form}
      schema={enhancedSchema}
      getLabelFunc={getLabelFunc}
      getTabLabel={getTabLabel}
      onFieldChange={onFieldChange}
      colors={colors}
      disabled={disabled}
      isCn={isCn}
    />
  );
};

export default WritingFormSection;