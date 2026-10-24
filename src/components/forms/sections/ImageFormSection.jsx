"use client";

import React, { useContext, useMemo, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { LanguageContext } from '@/components/contexts/LanguageContext';
import TabbedFormManager from '@/components/forms/managers/TabbedFormManager';
import IMAGE_FORM_LABELS from '@/components/forms/labels/imageFormLabels';
import { filterAndSortItems } from '@/utils/filterAndSortItems';
import {
  TAG_SOURCE_REGISTRY,
  getTagSourceByValue,
  getTagSourceLabel,
} from '@/components/forms/configs/tagSourceRegistry';

/* ── modular sub-components ── */
import MediaTagInfoBanner    from '@/components/forms/other/MediaTagInfoBanner';
import MediaTagSourceSelector from '@/components/forms/selectors/MediaTagSourceSelector';
import MediaTagValueInputs   from '@/components/forms/other/MediaTagValueInputs';

/* ── helpers ─────────────────────────────────────────────────────────────── */
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
   ImageFormSection
═══════════════════════════════════════════════════════════════════════════ */
const ImageFormSection = ({
  form,
  disabled = false,
  getLabel,
  onFieldChange,
  colors = {},
  relatedData,
  dataState,
}) => {
  const { isCn } = useContext(LanguageContext);
  const data      = relatedData ?? dataState ?? {};
  const tagSource = parseInt(form.watch('tag_source'), 10) || 0;

  /* available source buttons */
  const availableSources = useMemo(() => TAG_SOURCE_REGISTRY
    .filter((src) => src.key === 'none' || (Array.isArray(data[src.dataKey]) && data[src.dataKey].length > 0))
    .map((src) => ({ value: src.value, label: isCn ? src.label.cn : src.label.en })),
    [data, isCn]
  );

  /* reset when source removed from list */
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

  /* tag options for dropdowns */
  const activeSource  = getTagSourceByValue(tagSource);
  const activeItems   = activeSource.dataKey
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

  /* ── tab schema ── */
  const IMAGE_SCHEMA = [
    { key: 'tags',    type: 'custom', renderKey: 'tagsSection' },
    {
      key: 'content',
      fields: [
        { name: 'caption_en', type: 'multiline', rows: 3 },
        { name: 'caption_cn', type: 'multiline', rows: 3 },
        { name: 'type',       type: 'text' },
      ],
    },
  ];

  const enhancedSchema = IMAGE_SCHEMA.map((section) => ({
    ...section,
    ...(IMAGE_FORM_LABELS?.tabs?.[section.key] && { label: IMAGE_FORM_LABELS.tabs[section.key] }),
    ...(section.fields && {
      fields: section.fields.map((f) => ({
        ...f,
        label: IMAGE_FORM_LABELS?.fields?.[f.name] || { en: f.name, cn: f.name },
      })),
    }),
  }));

  /* ── custom tag panel (composed from sub-components) ── */
  const customRenderers = useMemo(() => ({
    tagsSection: () => (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* 1 — Info banner */}
        <MediaTagInfoBanner/>

        {/* 2 — Source selector */}
        <MediaTagSourceSelector
          tagSource={tagSource}
          availableSources={availableSources}
          onChange={handleTagSourceChange}
          disabled={disabled}
          isCn={isCn}
        />

        {/* 3 — Tag value inputs */}
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
        const obj = IMAGE_FORM_LABELS?.tabs?.[key] || IMAGE_FORM_LABELS?.fields?.[key];
        return obj ? obj[isCn ? 'cn' : 'en'] : (getLabel?.(key) || key);
      }}
      onFieldChange={onFieldChange}
      colors={colors}
      disabled={disabled}
      customRenderers={customRenderers}
    />
  );
};

export default ImageFormSection;