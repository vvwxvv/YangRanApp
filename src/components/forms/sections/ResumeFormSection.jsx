// ResumeFormSection.jsx — matches Prisma Resume model
import React, { useContext } from 'react';

/* ---------- internal imports ---------- */
import { LanguageContext } from '@/components/contexts/LanguageContext';

/* ---------- reusable component ---------- */
import TabbedFormManager from '@/components/forms/managers/TabbedFormManager';

/* ---------- centralised labels ---------- */
import RESUME_FORM_LABELS from '@/components/forms/labels/resumeFormLabels';

/* =============================================================================
  Resume Form Schema Definition (matches Prisma Resume model)
============================================================================= */
const RESUME_SCHEMA = [
  {
    key: 'basic',
    fields: [
      { name: 'artist', type: 'text' },
      { name: 'type', type: 'text' },
      // Year dropdown (1980 → current year) — shared YearSelector.
      { name: 'year', type: 'year' },
      // Language dropdown — shared LanguageSelector (EN / CN).
      { name: 'language', type: 'language' },
    ],
  },
  {
    key: 'dates',
    fields: [
      { name: 'start_date', type: 'text' },
      { name: 'end_date', type: 'text' },
    ],
  },
  {
    key: 'content',
    fields: [
      { name: 'description', type: 'multiline', rows: 3 },
    ],
  },
  {
    key: 'introduction',
    type: 'array',
    fieldName: 'introduction',
    rows: 3,
    multiline: true,
  },
];

/* =============================================================================
  Resume Form Section Component
============================================================================= */
const ResumeFormSection = ({
  form,
  disabled = false,
  getLabel,
  onFieldChange,
  colors = {},
  relatedMediaSelectors,
  relatedContentSelectors,
}) => {
  const { isCn } = useContext(LanguageContext);

  /* ---------- FORCE our labels into the schema itself ---------- */
  const enhancedSchema = RESUME_SCHEMA.map(section => {
    const enhancedSection = { ...section };

    if (RESUME_FORM_LABELS?.tabs?.[section.key]) {
      enhancedSection.label = RESUME_FORM_LABELS.tabs[section.key];
    }

    if (section.fields) {
      enhancedSection.fields = section.fields.map(field => ({
        ...field,
        label: RESUME_FORM_LABELS?.fields?.[field.name] || { en: field.name, cn: field.name }
      }));
    }

    if (section.key === 'introduction') {
      enhancedSection.addLabel = RESUME_FORM_LABELS?.buttons?.addIntroduction;
    }

    return enhancedSection;
  });

  const normalizeKey = (key) => key?.toLowerCase();

  const getLabelFunc = (key) => {
    const lang = isCn ? 'cn' : 'en';
    const normKey = normalizeKey(key);

    if (RESUME_FORM_LABELS?.fields?.[normKey]?.[lang]) {
      return RESUME_FORM_LABELS.fields[normKey][lang];
    }
    if (RESUME_FORM_LABELS?.tabs?.[normKey]?.[lang]) {
      return RESUME_FORM_LABELS.tabs[normKey][lang];
    }
    if (RESUME_FORM_LABELS?.buttons?.[normKey]?.[lang]) {
      return RESUME_FORM_LABELS.buttons[normKey][lang];
    }

    return key.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTabLabel = (tabKey, fallbackLabel) => {
    const lang = isCn ? 'cn' : 'en';
    return (
      RESUME_FORM_LABELS?.tabs?.[tabKey]?.[lang] ||
      (fallbackLabel && fallbackLabel[lang]) ||
      tabKey.replace(/[_-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const customRenderers = {
    relatedMediaSelectors,
    relatedContentSelectors,
  };

  return (
    <TabbedFormManager
      form={form}
      schema={enhancedSchema}
      getLabelFunc={getLabelFunc}
      getTabLabel={getTabLabel}
      onFieldChange={onFieldChange}
      colors={colors}
      disabled={disabled}
      customRenderers={customRenderers}
      isCn={isCn}
      getLabel={getLabelFunc}
      labelFunc={getLabelFunc}
      getFieldLabel={getLabelFunc}
    />
  );
};

export default ResumeFormSection;
