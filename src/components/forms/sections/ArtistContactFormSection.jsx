// ArtistContactFormSection.jsx — 匹配 Prisma ArtistContact 模型（camelCase）
"use client";
import React, { useContext } from 'react';
import { LanguageContext } from '@/components/contexts/LanguageContext';
import TabbedFormManager from '@/components/forms/managers/TabbedFormManager';
import GALLERY_CONTACT_FORM_LABELS, {
  SOCIAL_PLATFORM_OPTIONS,
} from '@/components/forms/labels/artistContactFormLabels';

// 字段名对齐 schema / API config / defaultValues：artist_name, opening_time, web_url, social_media
// (此前误用了 Prisma 的 camelCase 命名，导致表单写入的字段与 schema/API 完全脱节)
const artist_contact_schema = [
  {
    key: 'content',
    fields: [
      { name: 'artist_name', type: 'text' },
      { name: 'email', type: 'text' },
      { name: 'phone', type: 'text' },
      { name: 'web_url', type: 'text' },
      // Language dropdown — shared LanguageSelector (EN / CN).
      { name: 'language', type: 'language' },
    ],
  },
  {
    key: 'address',
    type: 'array',
    fieldName: 'address',        // 保持 address
    multiline: false,
    // 注意：ArrayManager 已移除 JSON 粘贴，无需再设 allowJsonMode
  },
  {
    key: 'social_media',           // 对齐 snake_case
    type: 'object-array',
    fieldName: 'social_media',
    allowJsonMode: true,          // ObjectArrayManager 支持
    subFields: [
      { name: 'platform', type: 'select', options: SOCIAL_PLATFORM_OPTIONS },
      { name: 'account', type: 'text', placeholder: '' },
      { name: 'url', type: 'text', placeholder: '' },
    ],
  },
];

const ArtistContactFormSection = ({
  form,
  disabled = false,
  onFieldChange,
  colors = {},
}) => {
  const { isCn } = useContext(LanguageContext);
  const lang = isCn ? 'cn' : 'en';

  // 增强 schema：注入标签
  const enhancedSchema = artist_contact_schema.map((section) => {
    const enhancedSection = { ...section };

    if (GALLERY_CONTACT_FORM_LABELS?.tabs?.[section.key]) {
      enhancedSection.label = GALLERY_CONTACT_FORM_LABELS.tabs[section.key];
    }

    if (section.fields) {
      enhancedSection.fields = section.fields.map((field) => ({
        ...field,
        label:
          GALLERY_CONTACT_FORM_LABELS?.fields?.[field.name] ||
          { en: field.name, cn: field.name },
      }));
    }

    if (section.subFields) {
      enhancedSection.subFields = section.subFields.map((sub) => ({
        ...sub,
        label:
          GALLERY_CONTACT_FORM_LABELS?.fields?.[sub.name] ||
          { en: sub.name, cn: sub.name },
      }));
    }

    // 显式指定 add 按钮标签
    if (section.key === 'address') {
      enhancedSection.addLabel =
        GALLERY_CONTACT_FORM_LABELS?.buttons?.addAddress?.[lang] || 'Add Address Line';
    }
    if (section.key === 'social_media') {
      enhancedSection.addLabel =
        GALLERY_CONTACT_FORM_LABELS?.buttons?.addSocialMedia?.[lang] || 'Add Social Media';
    }

    return enhancedSection;
  });

  const getLabelFunc = (key) => {
    if (GALLERY_CONTACT_FORM_LABELS?.fields?.[key]?.[lang]) {
      return GALLERY_CONTACT_FORM_LABELS.fields[key][lang];
    }
    if (GALLERY_CONTACT_FORM_LABELS?.tabs?.[key]?.[lang]) {
      return GALLERY_CONTACT_FORM_LABELS.tabs[key][lang];
    }
    if (GALLERY_CONTACT_FORM_LABELS?.buttons?.[key]?.[lang]) {
      return GALLERY_CONTACT_FORM_LABELS.buttons[key][lang];
    }
    return key.replace(/[_-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <TabbedFormManager
      form={form}
      schema={enhancedSchema}
      getLabelFunc={getLabelFunc}
      onFieldChange={onFieldChange}
      colors={colors}
      disabled={disabled}
    />
  );
};

export default ArtistContactFormSection;