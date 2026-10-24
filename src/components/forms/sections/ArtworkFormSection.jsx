// ArtworkFormSection.jsx — fully matches Prisma Artwork model
import React, { useContext } from 'react';

/* ---------- internal imports ---------- */
import { LanguageContext } from '@/components/contexts/LanguageContext';

/* ---------- reusable component ---------- */
import TabbedFormManager from '@/components/forms/managers/TabbedFormManager';
import useFormTypeOptions from '@/hooks/useFormTypeOptions';

/* ---------- centralised labels ---------- */
import ARTWORK_FORM_LABELS from '@/components/forms/labels/artworkFormLables';

/* =============================================================================
  Artwork Form Schema Definition (matches Prisma Artwork model)
============================================================================= */
const ARTWORK_SCHEMA = [
  {
    key: 'basic',
    fields: [
      { name: 'artist', type: 'text' },
      { name: 'title', type: 'text' },
      { name: 'type', type: 'autocomplete', options: 'typeOptions' },
      { name: 'medium', type: 'text' },
      // Year dropdown (1980 → current year) — shared YearSelector.
      { name: 'year', type: 'year' },
      { name: 'size', type: 'text' },
      { name: 'series', type: 'text' },
    ],
  },
  {
    key: 'details',
    fields: [
      { name: 'caption', type: 'multiline', rows: 3 },
      { name: 'duration', type: 'text' },
      { name: 'credits', type: 'text' },
      { name: 'special_thanks', type: 'text' },
    ],
  },
  {
    key: 'media',
    fields: [
      { name: 'video_url', type: 'text' },
      { name: 'web_url', type: 'text' },
    ],
  },
  {
    key: 'pricing',
    fields: [
      { name: 'work_value', type: 'text' },
      { name: 'sold', type: 'select', options: ['Yes', 'No'] },
    ],
  },
  {
    // 每页独立的排序：同一件作品在“艺术家页 / 展览页 / 艺博会页”可有不同顺序。
    // 表单只显示当前编号 + 跳转排序页（拖拽排序）。
    key: 'ordering',
    type: 'order',
    entity: 'artwork',
    orderPagePath: '/manager/artwork/order',
  },
  {
    key: 'introduction',
    type: 'array',
    fieldName: 'introduction',
    rows: 3,
    multiline: true,
  },
  {
    key: 'relations',                                     // 新增 relations 区块
    type: 'relation',                                     // 跨实体多选（不再手输）
    fieldName: 'related_exhibition',              // 对应 Prisma 字段
    label: { en: 'Related Exhibitions', cn: '相关展览' },
    // Options come from the existing Exhibitions, matched to the artwork's own
    // `language` field — nothing can be typed that isn't already there.
    relation: {
      endpoint: 'exhibition',
      labelKey: 'title',
      descriptionKey: 'year',
      languageField: 'language',
      matchLanguage: true,
      unique: true,
    },
    matchField: 'language',
    allowCustom: false,
    placeholder: { en: 'Select exhibitions…', cn: '选择展览…' },
    hint: {
      en: 'Only exhibitions in the same language can be selected',
      cn: '仅可选择语言相同的展览',
    },
    // addLabel 会从 ARTWORK_FORM_LABELS.buttons 中读取，若未定义则使用默认
  },
];

/* =============================================================================
  Artwork Form Section Component
============================================================================= */
const ArtworkFormSection = ({
  form,
  disabled = false,
  getLabel,
  onFieldChange,
  colors = {},
  relatedMediaSelectors,
  relatedContentSelectors,
}) => {
  const { isCn } = useContext(LanguageContext);

  // Type options come from the Meta settings (/manager/meta → formTypes.artwork).
  // The artwork "type" stays free text but now SUGGESTS these values.
  const metaTypeOptions = useFormTypeOptions("artwork", []);

  /* ---------- 将集中标签注入到 schema ---------- */
  const enhancedSchema = ARTWORK_SCHEMA.map((section) => {
    const enhancedSection = { ...section };

    if (ARTWORK_FORM_LABELS?.tabs?.[section.key]) {
      enhancedSection.label = ARTWORK_FORM_LABELS.tabs[section.key];
    }

    if (section.fields) {
      enhancedSection.fields = section.fields.map((field) => {
        const next = {
          ...field,
          label:
            ARTWORK_FORM_LABELS?.fields?.[field.name] || {
              en: field.name,
              cn: field.name,
            },
        };
        // Type → suggestions from the site Meta.
        if (field.name === 'type' && metaTypeOptions.length) {
          next.options = metaTypeOptions;
        }
        return next;
      });
    }

    if (section.key === 'introduction') {
      enhancedSection.addLabel = ARTWORK_FORM_LABELS?.buttons?.addIntroduction;
    }
    if (section.key === 'relations') {
      // 为 relations 区块添加添加按钮标签（可从 labels 中读取，若无则使用默认）
      enhancedSection.addLabel = ARTWORK_FORM_LABELS?.buttons?.addRelatedGalleryExhibition || {
        en: 'Add Exhibition',
        cn: '添加展览',
      };
    }

    return enhancedSection;
  });

  const normalizeKey = (key) => key?.toLowerCase();

  const getLabelFunc = (key) => {
    const lang = isCn ? 'cn' : 'en';
    const normKey = normalizeKey(key);

    if (ARTWORK_FORM_LABELS?.fields?.[normKey]?.[lang]) {
      return ARTWORK_FORM_LABELS.fields[normKey][lang];
    }
    if (ARTWORK_FORM_LABELS?.tabs?.[normKey]?.[lang]) {
      return ARTWORK_FORM_LABELS.tabs[normKey][lang];
    }
    if (ARTWORK_FORM_LABELS?.buttons?.[normKey]?.[lang]) {
      return ARTWORK_FORM_LABELS.buttons[normKey][lang];
    }

    return key.replace(/[_-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getTabLabel = (tabKey, fallbackLabel) => {
    const lang = isCn ? 'cn' : 'en';
    return (
      ARTWORK_FORM_LABELS?.tabs?.[tabKey]?.[lang] ||
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

export default ArtworkFormSection;