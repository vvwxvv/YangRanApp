// SeriesFormSection.jsx — matches Prisma Series model
import React, { useContext } from 'react';

/* ---------- internal imports ---------- */
import { LanguageContext } from '@/components/contexts/LanguageContext';

/* ---------- reusable component ---------- */
import TabbedFormManager from '@/components/forms/managers/TabbedFormManager';

/* ---------- centralised labels ---------- */
import SERIES_FORM_LABELS from '@/components/forms/labels/seriesFormLabels';

/* =============================================================================
  Series Form Schema Definition (matches Prisma Series model)
============================================================================= */
const SERIES_SCHEMA = [
  {
    key: 'basic',
    fields: [
      { name: 'artist', type: 'text' },
      { name: 'title', type: 'text' },
      { name: 'type', type: 'text' },
      { name: 'medium', type: 'text' },
      // Year dropdown (1980 → current year) — shared YearSelector.
      { name: 'year', type: 'year' },
      // Language dropdown — shared LanguageSelector (EN / CN).
      { name: 'language', type: 'language' },
    ],
  },
  {
    key: 'content',
    fields: [
      { name: 'caption', type: 'multiline', rows: 3 },
    ],
  },
  {
    key: 'credits',
    fields: [
      { name: 'credits', type: 'text' },
      { name: 'special_thanks', type: 'text' },
    ],
  },
  {
    key: 'introduction',
    type: 'array',
    fieldName: 'introduction',
    rows: 3,
    multiline: true,
  },
  {
    // 排序：只显示编号 + 跳转排序页
    key: 'ordering',
    type: 'order',
    fieldName: 'order',
    label: { en: 'Order', cn: '排序' },
    orderPagePath: '/manager/series/reorder',
  },

];

/* =============================================================================
  Series Form Section Component
============================================================================= */
const SeriesFormSection = ({
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
  const enhancedSchema = SERIES_SCHEMA.map(section => {
    const enhancedSection = { ...section };

    if (SERIES_FORM_LABELS?.tabs?.[section.key]) {
      enhancedSection.label = SERIES_FORM_LABELS.tabs[section.key];
    }

    if (section.fields) {
      enhancedSection.fields = section.fields.map(field => ({
        ...field,
        label: SERIES_FORM_LABELS?.fields?.[field.name] || { en: field.name, cn: field.name }
      }));
    }

    if (section.key === 'introduction') {
      enhancedSection.addLabel = SERIES_FORM_LABELS?.buttons?.addIntroduction;
    }

    return enhancedSection;
  });

  const normalizeKey = (key) => key?.toLowerCase();

  const getLabelFunc = (key) => {
    const lang = isCn ? 'cn' : 'en';
    const normKey = normalizeKey(key);

    if (SERIES_FORM_LABELS?.fields?.[normKey]?.[lang]) {
      return SERIES_FORM_LABELS.fields[normKey][lang];
    }
    if (SERIES_FORM_LABELS?.tabs?.[normKey]?.[lang]) {
      return SERIES_FORM_LABELS.tabs[normKey][lang];
    }
    if (SERIES_FORM_LABELS?.buttons?.[normKey]?.[lang]) {
      return SERIES_FORM_LABELS.buttons[normKey][lang];
    }

    return key.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTabLabel = (tabKey, fallbackLabel) => {
    const lang = isCn ? 'cn' : 'en';
    return (
      SERIES_FORM_LABELS?.tabs?.[tabKey]?.[lang] ||
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

export default SeriesFormSection;
