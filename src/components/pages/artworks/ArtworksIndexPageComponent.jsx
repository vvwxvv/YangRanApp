"use client";

import React from 'react';
import IndexPageLayout from '@/components/layouts/IndexPageLayout';
import { artworkConfig } from '@/components/configs/artworkConfig';
import { getArtworkUIText } from '@/components/labels/artwork_labels';
import { imageConfig } from '@/components/configs/imageConfig';

export default function ArtworksIndexPage({ isManageMode = false }) {
  return (
    <IndexPageLayout
      schemaName="artwork"
      schemaConfig={artworkConfig}
      imageConfig={imageConfig}
      uiTextGetter={getArtworkUIText}
      fieldMappings={{
        language: 'language',
        title: 'title',
        year: 'year',
        id: '_id',
        slug: 'slug',
        coverImage: 'cover_img_url',
        category: 'artist',
        type: 'type',
        description: 'description',
        artist: 'artist',
        medium: 'medium',
        dimensions: 'dimensions',
        location: 'location',
      }}
      languageConfig={{ cn: 'CN', en: 'EN' }}
      sortConfig={{ field: 'year', type: 'desc' }}
      groupConfig={{ enabled: true, field: 'category' }}
      filterConfig={{
        categoryFields: ['category'],
        typeField: 'type',
        yearField: 'year',
        fields: [
          {
            key: 'category',
            type: 'category',
            labelKey: 'artist',
            resetOthers: ['year', 'type'],
          },
          {
            key: 'year',
            type: 'year',
            labelKey: 'year',
            dependsOn: 'category',
            resetOthers: ['category', 'type'],
          },
          {
            key: 'type',
            type: 'type',
            labelKey: 'type',
            resetOthers: ['category', 'year'],
          },
        ],
      }}
      hoverCardConfig={{
        fields: [
          {
            key: 'title',
            label: 'Title',
            getValue: (item, fm) => item[fm.title],
          },
          {
            key: 'year',
            label: 'Year',
            getValue: (item, fm) => item[fm.year] || '--',
          },
          {
            key: 'type',
            label: 'Type',
            getValue: (item, fm) => {
              const typeOption = artworkConfig.typeOptions?.find(
                (opt) => opt.label_en === item[fm.type] || opt.label_cn === item[fm.type]
              );
              return typeOption ? typeOption.label_en : item[fm.type];
            },
          },
          {
            key: 'category',
            label: 'Artist',
            getValue: (item, fm) => item[fm.category],
          },
        ],
        imageKey: 'coverImage',
      }}
      baseRoute="artworks"
      typeOptions={artworkConfig.typeOptions || []}
      isManageMode={isManageMode}
    />
  );
}