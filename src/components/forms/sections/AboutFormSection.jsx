// AboutFormSection.jsx — matches Prisma About model
import React, { useContext } from 'react';

/* ---------- internal imports ---------- */
import { LanguageContext } from '@/components/contexts/LanguageContext';

/* ---------- reusable component ---------- */
import TabbedFormManager from '@/components/forms/managers/TabbedFormManager';

/* ---------- centralised labels ---------- */
import ABOUT_FORM_LABELS from '@/components/forms/labels/aboutFormLabels';

/* =============================================================================
  About Form Schema Definition — matches Prisma About model
  Fields: artist, portrait_image_url, caption, introductions[], pdf_url, web_url, language, order, mark
============================================================================= */
const ABOUT_SCHEMA = [
  {
    key: 'content',
    fields: [
      { name: 'artist', type: 'text' },
      { name: 'caption', type: 'multiline', rows: 3 },
      { name: 'pdf_url', type: 'text' },   // 新增
      { name: 'web_url', type: 'text' },   // 新增
      // Language dropdown — shared LanguageSelector (EN / CN).
      { name: 'language', type: 'language' },
    ],
  },
  {
    key: 'introductions',
    type: 'array',
    fieldName: 'introductions',
    rows: 3,
    multiline: true,
  },
  {
    // 排序：只显示编号 + 跳转排序页
    key: 'ordering',
    type: 'order',
    fieldName: 'order',
    label: { en: 'Order', cn: '排序' },
    orderPagePath: '/manager/about/reorder',
  },
];

/* =============================================================================
  About Form Section Component
============================================================================= */
const AboutFormSection = ({
  form,
  disabled = false,
  onFieldChange,
  colors = {},
}) => {
  const { isCn } = useContext(LanguageContext);

  /* ---------- FORCE our labels into the schema itself ---------- */
  const enhancedSchema = ABOUT_SCHEMA.map(section => {
    const enhancedSection = { ...section };
    
    // Add label to section
    if (ABOUT_FORM_LABELS?.tabs?.[section.key]) {
      enhancedSection.label = ABOUT_FORM_LABELS.tabs[section.key];
    }
    
    // Add labels to each field
    if (section.fields) {
      enhancedSection.fields = section.fields.map(field => ({
        ...field,
        label: ABOUT_FORM_LABELS?.fields?.[field.name] || { en: field.name, cn: field.name }
      }));
    }
    
    // Add button labels
    if (section.key === 'introductions') {
      enhancedSection.addLabel = ABOUT_FORM_LABELS?.buttons?.addIntroduction?.[isCn ? 'cn' : 'en'] || 'Add Introduction';
    }
    
    return enhancedSection;
  });

  /* ---------- Simple label function ---------- */
  const getLabelFunc = (key) => {
    const lang = isCn ? 'cn' : 'en';
    
    if (ABOUT_FORM_LABELS?.fields?.[key]?.[lang]) {
      return ABOUT_FORM_LABELS.fields[key][lang];
    }
    
    if (ABOUT_FORM_LABELS?.tabs?.[key]?.[lang]) {
      return ABOUT_FORM_LABELS.tabs[key][lang];
    }
    
    if (ABOUT_FORM_LABELS?.buttons?.[key]?.[lang]) {
      return ABOUT_FORM_LABELS.buttons[key][lang];
    }
    
    return key.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  /* ---------- Tab label function ---------- */
  const getTabLabel = (tabKey, fallbackLabel) => {
    const lang = isCn ? 'cn' : 'en';
    return (
      ABOUT_FORM_LABELS?.tabs?.[tabKey]?.[lang] ||
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
      getLabel={getLabelFunc}
      labelFunc={getLabelFunc}
      getFieldLabel={getLabelFunc}
    />
  );
};

export default AboutFormSection;