"use client";

import React, { useContext, useMemo, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { LanguageContext } from '@/components/contexts/LanguageContext';
import TabbedFormManager from '@/components/forms/managers/TabbedFormManager';
import WEB_FORM_LABELS from '@/components/forms/labels/webFormLabels'; // create this file
import { filterAndSortItems } from '@/utils/filterAndSortItems';
import {
  TAG_SOURCE_REGISTRY,
  getTagSourceByValue,
  getTagSourceLabel,
} from '@/components/forms/configs/tagSourceRegistry';

import MediaTagInfoBanner from '@/components/forms/other/MediaTagInfoBanner';
import MediaTagSourceSelector from '@/components/forms/selectors/MediaTagSourceSelector';
import MediaTagValueInputs from '@/components/forms/other/MediaTagValueInputs';

/* Helper: build options for dropdowns (same as image/video) */
const buildTagOptions = (items, sourceKey, isCn) => {
  if (!Array.isArray(items) || items.length === 0) return [];
  return filterAndSortItems({
    items, isCn, search: '',
    languageField: 'language', titleField: 'title', yearField: 'year',
    langValues: { cn: 'CN', en: 'EN' }, sortField: 'title', sortType: 'asc',
  }).map((item) => item ? ({
    id: item.id,
    value: item.title || '',
    label: item.title || (isCn ? '无标题' : 'Untitled'),
    type: sourceKey,
    description: item.year || item.date || '',
  }) : null).filter(Boolean);
};

/* ══════════════════════════════════════════════════════════════════════════
   WebFormSection
═══════════════════════════════════════════════════════════════════════════ */
const WebFormSection = ({
  form,
  disabled = false,
  getLabel,
  onFieldChange,
  colors = {},
  relatedData,
  dataState,
}) => {
  const { isCn } = useContext(LanguageContext);
  const data = relatedData ?? dataState ?? {};
  const tagSource = parseInt(form.watch('tag_source'), 10) || 0;

  /* Available source buttons (only those with non‑empty data) */
  const availableSources = useMemo(() => TAG_SOURCE_REGISTRY
    .filter((src) => src.key === 'none' || (Array.isArray(data[src.dataKey]) && data[src.dataKey].length > 0))
    .map((src) => ({ value: src.value, label: isCn ? src.label.cn : src.label.en })),
    [data, isCn]
  );

  /* Reset tag source if the selected source is no longer available */
  useEffect(() => {
    if (!availableSources.some((s) => s.value === tagSource)) {
      form.setValue('tag_source', '0');
      form.setValue('tag_en', '');
      form.setValue('tag_cn', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableSources]);

  const handleTagSourceChange = useCallback((value) => {
    form.setValue('tag_source', String(value));
    form.setValue('tag_en', '');
    form.setValue('tag_cn', '');
    onFieldChange?.('tag_source');
  }, [form, onFieldChange]);

  /* Tag options for the dropdowns based on active source */
  const activeSource = getTagSourceByValue(tagSource);
  const activeItems = activeSource.dataKey
    ? (Array.isArray(data[activeSource.dataKey]) ? data[activeSource.dataKey] : [])
    : [];

  const tagOptionsEN = useMemo(
    () => buildTagOptions(activeItems, activeSource.key, false),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeItems, activeSource.key]
  );
  const tagOptionsCN = useMemo(
    () => buildTagOptions(activeItems, activeSource.key, true),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeItems, activeSource.key]
  );

  const typeLabels = useMemo(() =>
    TAG_SOURCE_REGISTRY.filter((s) => s.key !== 'none').reduce((acc, s) => {
      acc[s.key] = isCn ? s.label.cn : s.label.en;
      return acc;
    }, {}),
    [isCn]
  );

  const sourceTypeLabel = getTagSourceLabel(tagSource, isCn).toLowerCase();

  /* ── Tab schema for web ── */
  const WEB_SCHEMA = [
    { key: 'basic', fields: [{ name: 'web_url', type: 'text' }] },
    { key: 'tags', type: 'custom', renderKey: 'tagsSection' },
    {
      key: 'content',
      fields: [
        { name: 'caption_en', type: 'multiline', rows: 3 },
        { name: 'caption_cn', type: 'multiline', rows: 3 },
        { name: 'type', type: 'text' },
      ],
    },
    {
      // 排序：只显示编号（该模型暂无排序页）
      key: 'ordering',
      type: 'order',
      fieldName: 'order',
      label: { en: 'Order', cn: '排序' },
    },
  ];

  const enhancedSchema = WEB_SCHEMA.map((section) => ({
    ...section,
    ...(WEB_FORM_LABELS?.tabs?.[section.key] && { label: WEB_FORM_LABELS.tabs[section.key] }),
    ...(section.fields && {
      fields: section.fields.map((f) => ({
        ...f,
        label: WEB_FORM_LABELS?.fields?.[f.name] || { en: f.name, cn: f.name },
      })),
    }),
  }));

  /* Custom renderer for the tags section (reuses same sub‑components) */
  const customRenderers = useMemo(() => ({
    tagsSection: () => (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <MediaTagInfoBanner />
        <MediaTagSourceSelector
          tagSource={tagSource}
          availableSources={availableSources}
          onChange={handleTagSourceChange}
          disabled={disabled}
          isCn={isCn}
        />
        <MediaTagValueInputs
          tagSource={tagSource}
          control={form.control}
          disabled={disabled}
          isCn={isCn}
          tagOptionsEN={tagOptionsEN}
          tagOptionsCN={tagOptionsCN}
          sourceTypeLabel={sourceTypeLabel}
          typeLabels={typeLabels}
          onFieldChange={onFieldChange}
        />
      </Box>
    ),
  }), [
    tagSource, availableSources, handleTagSourceChange, disabled, isCn,
    tagOptionsEN, tagOptionsCN, sourceTypeLabel, typeLabels,
    form.control, onFieldChange,
  ]);

  return (
    <TabbedFormManager
      form={form}
      schema={enhancedSchema}
      getLabelFunc={(key) => {
        const obj = WEB_FORM_LABELS?.tabs?.[key] || WEB_FORM_LABELS?.fields?.[key];
        return obj ? obj[isCn ? 'cn' : 'en'] : (getLabel?.(key) || key);
      }}
      onFieldChange={onFieldChange}
      colors={colors}
      disabled={disabled}
      customRenderers={customRenderers}
    />
  );
};

export default WebFormSection;