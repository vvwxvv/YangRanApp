// EventFormSection.jsx — matches updated Prisma Event model
import React, { useContext } from 'react';

/* ---------- internal imports ---------- */
import { LanguageContext } from '@/components/contexts/LanguageContext';

/* ---------- reusable component ---------- */
import TabbedFormManager from '@/components/forms/managers/TabbedFormManager';

/* ---------- centralised labels ---------- */
import EVENT_FORM_LABELS from '@/components/forms/labels/eventFormLabels';

/* =============================================================================
  Event Form Schema Definition (matches updated Prisma Event model)
============================================================================= */
const EVENT_SCHEMA = [
  {
    key: 'basic',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'subtitle', type: 'text' },
      { name: 'type', type: 'text' },
    ],
  },
  {
    key: 'datetime',
    fields: [
      // Year dropdown (1980 → current year) — shared YearSelector.
      { name: 'year', type: 'year' },
      { name: 'date_time', type: 'text' },
    ],
  },
  {
    key: 'location',
    fields: [
      { name: 'venue', type: 'text' },
      { name: 'address', type: 'text' },
    ],
  },
  {
    key: 'credits',
    fields: [
      { name: 'host', type: 'text' },
      { name: 'support', type: 'text' },
      { name: 'special_thanks', type: 'text' },
    ],
  },
  {
    key: 'content',
    fields: [
      { name: 'caption', type: 'multiline', rows: 3 },
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
    key: 'relations',   // 保留原 key 以兼容标签，但字段改为 related_artist
    type: 'relation',
    fieldName: 'related_artist',
    relation: {
      endpoint: 'about',
      labelKey: 'artist',
      languageField: 'language',
      matchLanguage: true,
      unique: true,
    },
    matchField: 'language',
    placeholder: { en: 'Select or type related artists', cn: '选择或输入相关艺术家' },
  },
  {
    key: 'links',
    fields: [
      { name: 'web_url', type: 'text' },
      { name: 'video_url', type: 'text' },
    ],
  },
  {
    // 排序：只显示编号 + 跳转排序页
    key: 'ordering',
    type: 'order',
    fieldName: 'order',
    label: { en: 'Order', cn: '排序' },
    orderPagePath: '/manager/event/reorder',
  },

];

/* =============================================================================
  Event Form Section Component
============================================================================= */
const EventFormSection = ({
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
  const enhancedSchema = EVENT_SCHEMA.map(section => {
    const enhancedSection = { ...section };
    
    if (EVENT_FORM_LABELS?.tabs?.[section.key]) {
      enhancedSection.label = EVENT_FORM_LABELS.tabs[section.key];
    }
    
    if (section.fields) {
      enhancedSection.fields = section.fields.map(field => ({
        ...field,
        label: EVENT_FORM_LABELS?.fields?.[field.name] || { en: field.name, cn: field.name }
      }));
    }
    
    if (section.key === 'introduction') {
      enhancedSection.addLabel = EVENT_FORM_LABELS?.buttons?.addIntroduction;
    }
    if (section.key === 'relations') {
      enhancedSection.addLabel = EVENT_FORM_LABELS?.buttons?.addRelatedArtist; // 更新按钮标签键
    }
    
    return enhancedSection;
  });

  const normalizeKey = (key) => key?.toLowerCase();

  const getLabelFunc = (key) => {
    const lang = isCn ? 'cn' : 'en';
    const normKey = normalizeKey(key);

    if (EVENT_FORM_LABELS?.fields?.[normKey]?.[lang]) {
      return EVENT_FORM_LABELS.fields[normKey][lang];
    }
    if (EVENT_FORM_LABELS?.tabs?.[normKey]?.[lang]) {
      return EVENT_FORM_LABELS.tabs[normKey][lang];
    }
    if (EVENT_FORM_LABELS?.buttons?.[normKey]?.[lang]) {
      return EVENT_FORM_LABELS.buttons[normKey][lang];
    }

    return key.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTabLabel = (tabKey, fallbackLabel) => {
    const lang = isCn ? 'cn' : 'en';
    return (
      EVENT_FORM_LABELS?.tabs?.[tabKey]?.[lang] ||
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

export default EventFormSection;