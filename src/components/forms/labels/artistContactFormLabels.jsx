// ArtistContactFormLabels.js — bilingual labels for ArtistContactForm
// Follows the same { tabs, fields, buttons } shape as aboutFormLabels.js

const GALLERY_CONTACT_FORM_LABELS = {
  tabs: {
    content: { en: 'Contact Info', cn: '联系信息' },
    address: { en: 'Address', cn: '地址' },
    social_media: { en: 'Social Media', cn: '社交媒体' },
  },

  fields: {
   artist_name: { en: 'Artist Name', cn: '艺术家姓名' },
    email: { en: 'Email', cn: '电子邮箱' },
    phone: { en: 'Phone', cn: '电话' },
    web_url: { en: 'Website URL', cn: '官网链接' },
    address: { en: 'Address Line', cn: '地址' },
    language: { en: 'Language', cn: '语言' },

    // social_media sub-fields
    platform: { en: 'Platform', cn: '平台' },
    account: { en: 'Account / Handle', cn: '账号' },
    url: { en: 'Link', cn: '链接' },
  },

  buttons: {
    addAddress: { en: 'Add Address Line', cn: '添加地址' },
    addSocialMedia: { en: 'Add Social Media', cn: '添加社交媒体' },
  },
};

export default GALLERY_CONTACT_FORM_LABELS;

// Common social platforms for the `platform` select field in social_media.
// "Other" lets the user type a value not in this list (handled as free text
// in the form if you swap the select for a text field, or simply pick the
// closest match) — extend this list freely as needed.
export const SOCIAL_PLATFORM_OPTIONS = [
  { value: 'Instagram', label: 'Instagram', labelCn: 'Instagram' },
  { value: 'Facebook', label: 'Facebook', labelCn: 'Facebook' },
  { value: 'X', label: 'X (Twitter)', labelCn: 'X（推特）' },
  { value: 'WeChat', label: 'WeChat', labelCn: '微信' },
  { value: 'Weibo', label: 'Weibo', labelCn: '微博' },
  { value: 'RED', label: 'RED (Xiaohongshu)', labelCn: '小红书' },
  { value: 'LinkedIn', label: 'LinkedIn', labelCn: 'LinkedIn' },
  { value: 'YouTube', label: 'YouTube', labelCn: 'YouTube' },
  { value: 'TikTok', label: 'TikTok / Douyin', labelCn: '抖音 / TikTok' },
  { value: 'Other', label: 'Other', labelCn: '其他' },
];