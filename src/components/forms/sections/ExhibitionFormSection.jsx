// ExhibitionFormSection.jsx — matches updated Prisma Exhibition model
// (related_artwork = string[] of artwork titles, picked with the shared relation selector)
import React, { useContext } from 'react';
import { Box } from '@mui/material';

/* ---------- internal imports ---------- */
import { LanguageContext } from '@/components/contexts/LanguageContext';

/* ---------- reusable component ---------- */
import TabbedFormManager from '@/components/forms/managers/TabbedFormManager';
import MultiRelationSelector from '@/components/forms/selectors/MultiRelationSelector';
import useFormTypeOptions from '@/hooks/useFormTypeOptions';

/* ---------- centralised labels ---------- */
import EXHIBITION_FORM_LABELS from '@/components/forms/labels/exhibitionFormLables';

/* =============================================================================
  Exhibition Form Schema Definition (matches updated Prisma Exhibition model)
============================================================================= */
const EXHIBITION_SCHEMA = [
  {
    key: 'basic',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'subtitle', type: 'text' },
      { name: 'type', type: 'select', options: 'typeOptions' },
      // Year dropdown (1980 → current year) — shared YearSelector.
      { name: 'year', type: 'year' },
      // Language dropdown — shared LanguageSelector (EN / CN).
      { name: 'language', type: 'language' },
    ],
  },
  {
    key: 'dates',
    fields: [
      { name: 'date_start', type: 'date' },
      { name: 'date_end', type: 'date' },
      { name: 'opening_date', type: 'date' },
    ],
  },
  {
    key: 'location',
    fields: [
      { name: 'venue', type: 'text' },
      { name: 'location', type: 'text' },
      { name: 'curator', type: 'text' },
      { name: 'organiser', type: 'text' },
      { name: 'participating_artists', type: 'text' },
    ],
  },
  {
    key: 'content',
    fields: [
      { name: 'caption', type: 'multiline', rows: 2 },
      { name: 'description', type: 'multiline', rows: 4 },
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
    key: 'settings',
    fields: [
      { name: 'status', type: 'select', options: 'statusOptions' },
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
    key: 'press_release',
    type: 'array',
    fieldName: 'press_release',
    rows: 3,
    multiline: true,
  },
  // 关联字段（同一个“关联”标签）：related_artwork + related_artist
  {
    key: 'related',
    type: 'custom',
    renderKey: 'relatedSection',
  },
  {
    // 排序：只显示编号 + 跳转排序页
    key: 'ordering',
    type: 'order',
    fieldName: 'order',
    label: { en: 'Order', cn: '排序' },
    orderPagePath: '/manager/exhibition/reorder',
  },

];

/* =============================================================================
  Exhibition Form Section Component
============================================================================= */
const ExhibitionFormSection = ({
  form,
  disabled = false,
  getLabel,
  onFieldChange,
  colors = {},
  relatedMediaSelectors,
  relatedContentSelectors,
}) => {
  const { isCn } = useContext(LanguageContext);

  // Type options come from the Meta settings (/manager/meta → formTypes.exhibition),
  // falling back to the built-in labels list.
  const typeFallback = React.useMemo(
    () =>
      (EXHIBITION_FORM_LABELS?.typeOptions || []).map((o) => ({
        value: o.value,
        label: isCn ? o.cn : o.en,
      })),
    [isCn]
  );
  const metaTypeOptions = useFormTypeOptions("exhibition", typeFallback);

  /* ---------- 将标签注入 Schema ---------- */
  const enhancedSchema = EXHIBITION_SCHEMA.map(section => {
    const enhancedSection = { ...section };

    // 为每个 section 添加 tab 标签
    if (EXHIBITION_FORM_LABELS?.tabs?.[section.key]) {
      enhancedSection.label = EXHIBITION_FORM_LABELS.tabs[section.key];
    }

    // 为每个字段添加 label
    if (section.fields) {
      enhancedSection.fields = section.fields.map(field => {
        const next = {
          ...field,
          label: EXHIBITION_FORM_LABELS?.fields?.[field.name] || { en: field.name, cn: field.name },
        };
        // Type selector → options managed in the site Meta.
        if (field.name === 'type' && metaTypeOptions.length) {
          next.options = metaTypeOptions;
        }
        return next;
      });
    }

    // 为数组字段添加"添加"按钮标签
    if (section.key === 'introduction') {
      enhancedSection.addLabel = EXHIBITION_FORM_LABELS?.buttons?.addIntroduction;
    }
    if (section.key === 'press_release') {
      enhancedSection.addLabel = EXHIBITION_FORM_LABELS?.buttons?.addPressRelease;
    }

    return enhancedSection;
  });

  /* ---------- 辅助函数：获取标签 ---------- */
  const normalizeKey = (key) => key?.toLowerCase();

  const getLabelFunc = (key) => {
    const lang = isCn ? 'cn' : 'en';
    const normKey = normalizeKey(key);

    if (EXHIBITION_FORM_LABELS?.fields?.[normKey]?.[lang]) {
      return EXHIBITION_FORM_LABELS.fields[normKey][lang];
    }
    if (EXHIBITION_FORM_LABELS?.tabs?.[normKey]?.[lang]) {
      return EXHIBITION_FORM_LABELS.tabs[normKey][lang];
    }
    if (EXHIBITION_FORM_LABELS?.buttons?.[normKey]?.[lang]) {
      return EXHIBITION_FORM_LABELS.buttons[normKey][lang];
    }
    if (EXHIBITION_FORM_LABELS?.selectors?.[normKey]?.[lang]) {
      return EXHIBITION_FORM_LABELS.selectors[normKey][lang];
    }

    return key.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTabLabel = (tabKey, fallbackLabel) => {
    const lang = isCn ? 'cn' : 'en';
    return (
      EXHIBITION_FORM_LABELS?.tabs?.[tabKey]?.[lang] ||
      (fallbackLabel && fallbackLabel[lang]) ||
      tabKey.replace(/[_-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  /* ---------- 关联数据源（跨实体） ----------
     related_artwork        → 从 Artwork 取作品标题（与“作品 → 相关展览”同一套逻辑）
     related_artist → 从 About 取艺术家名（去重，按语言匹配） */
  const relatedArtworkSources = [
    {
      endpoint: 'artwork',
      labelKey: 'title',
      descriptionKey: 'year',
      languageField: 'language',
      matchLanguage: true,
      unique: true,
    },
  ];
  const relatedArtistSources = [
    {
      endpoint: 'about',
      labelKey: 'artist',
      languageField: 'language',
      matchLanguage: true,
      unique: true,
    },
  ];

  // The record's own language drives the option lists (an EN exhibition only
  // lists EN artworks/artists).
  const relatedLanguage = String(form.watch('language') || (isCn ? 'CN' : 'EN'))
    .trim()
    .toUpperCase();

  /* ---------- 自定义渲染器 ---------- */
  const customRenderers = {
    relatedMediaSelectors,
    relatedContentSelectors,
    relatedSection: () => (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* related_artwork —— 从作品列表多选（与“作品 → 相关展览”同一套 UI/逻辑） */}
        <MultiRelationSelector
          name="related_artwork"
          label={getLabelFunc('related_artwork')}
          control={form.control}
          sources={relatedArtworkSources}
          language={relatedLanguage}
          allowCustom={false}
          disabled={disabled}
          isCn={isCn}
          colors={colors}
          placeholder={isCn ? '选择作品…' : 'Select artworks…'}
          hint={
            isCn
              ? '仅可选择语言相同的作品 · 排序在作品排序页设置'
              : 'Only artworks in the same language · ordering is set on the artwork order page'
          }
          onChange={(vals) => onFieldChange?.('related_artwork', vals)}
        />

        {/* related_artist —— 跨实体多选（字符串数组） */}
        <MultiRelationSelector
          name="related_artist"
          label={getLabelFunc('related_artist')}
          control={form.control}
          sources={relatedArtistSources}
          language={relatedLanguage}
          disabled={disabled}
          isCn={isCn}
          colors={colors}
          placeholder={
            isCn ? '选择或输入相关画廊艺术家' : 'Select or type related gallery artists'
          }
          hint={EXHIBITION_FORM_LABELS?.hints?.relatedArtist?.[isCn ? 'cn' : 'en']}
          onChange={(vals) => onFieldChange?.('related_artist', vals)}
        />
      </Box>
    ),
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

export default ExhibitionFormSection;