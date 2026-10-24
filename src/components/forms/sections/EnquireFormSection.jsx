// EnquireFormSection.jsx — matches Prisma Enquire model
import React, { useContext } from 'react';

/* ---------- internal imports ---------- */
import { LanguageContext } from '@/components/contexts/LanguageContext';

/* ---------- reusable component ---------- */
import TabbedFormManager from '@/components/forms/managers/TabbedFormManager';

/* ---------- centralised labels ---------- */
// You will need to create this label file based on the enquireLabels we generated earlier
import ENQUIRE_FORM_LABELS from '@/components/forms/labels/enquireFormLabels';

/* =============================================================================
  Enquire Form Schema Definition (matches Prisma Enquire model)
============================================================================= */
const ENQUIRE_SCHEMA = [
  {
    key: 'contact',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'email', type: 'text', required: true },
    ],
  },
  {
    key: 'message',
    fields: [
      { name: 'message', type: 'multiline', rows: 5 },
    ],
  },
  {
    key: 'system',
    fields: [
      { name: 'status', type: 'select', options: ['Pending', 'Responded', 'Closed'] },
      // createdAt is typically handled by the DB/server, but if you need to display it:
      // { name: 'createdAt', type: 'text', disabled: true },
    ],
  }
];

/* =============================================================================
  Enquire Form Section Component
============================================================================= */
const EnquireFormSection = ({
  form,
  disabled = false,
  getLabel,
  onFieldChange,
  colors = {},
  relatedMediaSelectors,
  relatedContentSelectors,
}) => {
  const { isCn } = useContext(LanguageContext);

  /* ---------- 将集中标签注入到 schema ---------- */
  const enhancedSchema = ENQUIRE_SCHEMA.map((section) => {
    const enhancedSection = { ...section };

    if (ENQUIRE_FORM_LABELS?.tabs?.[section.key]) {
      enhancedSection.label = ENQUIRE_FORM_LABELS.tabs[section.key];
    }

    if (section.fields) {
      enhancedSection.fields = section.fields.map((field) => ({
        ...field,
        label:
          ENQUIRE_FORM_LABELS?.fields?.[field.name] || {
            en: field.name,
            cn: field.name,
          },
      }));
    }

    return enhancedSection;
  });

  const normalizeKey = (key) => key?.toLowerCase();

  const getLabelFunc = (key) => {
    const lang = isCn ? 'cn' : 'en';
    const normKey = normalizeKey(key);

    if (ENQUIRE_FORM_LABELS?.fields?.[normKey]?.[lang]) {
      return ENQUIRE_FORM_LABELS.fields[normKey][lang];
    }
    if (ENQUIRE_FORM_LABELS?.tabs?.[normKey]?.[lang]) {
      return ENQUIRE_FORM_LABELS.tabs[normKey][lang];
    }
    if (ENQUIRE_FORM_LABELS?.buttons?.[normKey]?.[lang]) {
      return ENQUIRE_FORM_LABELS.buttons[normKey][lang];
    }

    return key.replace(/[_-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getTabLabel = (tabKey, fallbackLabel) => {
    const lang = isCn ? 'cn' : 'en';
    return (
      ENQUIRE_FORM_LABELS?.tabs?.[tabKey]?.[lang] ||
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

export default EnquireFormSection;