// BibliographyFormSection.jsx — fully matches Prisma Bibliography model
import React, { useContext } from 'react';

/* ---------- internal imports ---------- */
import { LanguageContext } from '@/components/contexts/LanguageContext';

/* ---------- reusable component ---------- */
import TabbedFormManager from '@/components/forms/managers/TabbedFormManager';
import MultiRelationSelector from '@/components/forms/selectors/MultiRelationSelector';

/* ---------- centralised labels ---------- */
// 若你已存在 bibliographyFormLabels 可导入，此处直接定义本地对象保持与 Artwork 一致风格
const BIBLIOGRAPHY_FORM_LABELS = {
  tabs: {
    ordering: { en: 'Ordering', cn: '排序' },
    basic: { en: 'Basic Information', cn: '基本信息' },
    media: { en: 'Media Links', cn: '媒体链接' },
    relations: { en: 'Relations', cn: '关联信息' },
    related_artist: { en: 'Related Artists', cn: '相关艺术家' },
    metadata: { en: 'Metadata', cn: '元数据' },
  },
  fields: {
    title: { en: 'Title', cn: '标题' },
    subtitle: { en: 'Subtitle', cn: '副标题' },
    cover_img_url: { en: 'Cover Image URL', cn: '封面图片链接' },
    author: { en: 'Author', cn: '作者' },
    type: { en: 'Type', cn: '类型' },
    year: { en: 'Year', cn: '年份' },
    date: { en: 'Date', cn: '日期' },
    published_at: { en: 'Published At', cn: '出版时间' },
    pdf_url: { en: 'PDF URL', cn: 'PDF链接' },
    web_url: { en: 'Website URL', cn: '网页链接' },
    video_url: { en: 'Video URL', cn: '视频链接' },
    related_exhibition: { en: 'Related Exhibitions', cn: '相关展览' },
    related_artist: { en: 'Related Artists', cn: '相关艺术家' },
    order: { en: 'Order', cn: '排序' },
    language: { en: 'Language', cn: '语言' },
    mark: { en: 'Mark', cn: '标记' },
  },
  buttons: {
    addRelatedGalleryExhibition: { en: 'Add Exhibition', cn: '添加展览' },
  },
};

/* =============================================================================
  Bibliography Form Schema Definition (matches Prisma Bibliography model)
============================================================================= */
const BIBLIOGRAPHY_SCHEMA = [
  {
    key: 'relations',
    type: 'relation',
    fieldName: 'related_exhibition',
    label: { en: 'Related Exhibitions', cn: '相关展览' },
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
  },
  {
    key: 'related_artist',
    type: 'custom',
    renderKey: 'relatedArtistSection',
  },
  {
    key: 'basic',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'subtitle', type: 'text' },
      { name: 'author', type: 'text' },
      { name: 'type', type: 'text' },
      // Year dropdown (1980 → current year) — shared YearSelector.
      { name: 'year', type: 'year' },
      { name: 'date', type: 'text' },
      { name: 'published_at', type: 'text' },
      // Language dropdown — shared LanguageSelector (EN / CN).
      { name: 'language', type: 'language' },
    ],
  },
  {
    key: 'media',
    fields: [
      { name: 'pdf_url', type: 'text' },
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
    orderPagePath: '/manager/bibliography/reorder',
  },

];

/* =============================================================================
  Bibliography Form Section Component
============================================================================= */
const BibliographyFormSection = ({
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
  const enhancedSchema = BIBLIOGRAPHY_SCHEMA.map((section) => {
    const enhancedSection = { ...section };

    if (BIBLIOGRAPHY_FORM_LABELS?.tabs?.[section.key]) {
      enhancedSection.label = BIBLIOGRAPHY_FORM_LABELS.tabs[section.key];
    }

    if (section.fields) {
      enhancedSection.fields = section.fields.map((field) => ({
        ...field,
        label:
          BIBLIOGRAPHY_FORM_LABELS?.fields?.[field.name] || {
            en: field.name,
            cn: field.name,
          },
      }));
    }

    if (section.key === 'relations') {
      enhancedSection.addLabel =
        BIBLIOGRAPHY_FORM_LABELS?.buttons?.addRelatedGalleryExhibition || {
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

    if (BIBLIOGRAPHY_FORM_LABELS?.fields?.[normKey]?.[lang]) {
      return BIBLIOGRAPHY_FORM_LABELS.fields[normKey][lang];
    }
    if (BIBLIOGRAPHY_FORM_LABELS?.tabs?.[normKey]?.[lang]) {
      return BIBLIOGRAPHY_FORM_LABELS.tabs[normKey][lang];
    }
    if (BIBLIOGRAPHY_FORM_LABELS?.buttons?.[normKey]?.[lang]) {
      return BIBLIOGRAPHY_FORM_LABELS.buttons[normKey][lang];
    }

    return key.replace(/[_-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getTabLabel = (tabKey, fallbackLabel) => {
    const lang = isCn ? 'cn' : 'en';
    return (
      BIBLIOGRAPHY_FORM_LABELS?.tabs?.[tabKey]?.[lang] ||
      (fallbackLabel && fallbackLabel[lang]) ||
      tabKey.replace(/[_-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  /* ---------- 关联艺术家数据源（跨实体，从 About 取艺术家名） ---------- */
  const relatedArtistSources = [
    {
      endpoint: 'about',
      labelKey: 'artist',
      languageField: 'language',
      matchLanguage: true,
      unique: true,
    },
  ];

  const customRenderers = {
    relatedMediaSelectors,
    relatedContentSelectors,
    relatedArtistSection: () => (
      <MultiRelationSelector
        name="related_artist"
        label={getLabelFunc('related_artist')}
        control={form.control}
        sources={relatedArtistSources}
        disabled={disabled}
        isCn={isCn}
        colors={colors}
        placeholder={
          isCn ? '选择或输入相关艺术家' : 'Select or type related artists'
        }
        onChange={(vals) => onFieldChange?.('related_artist', vals)}
      />
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

export default BibliographyFormSection;