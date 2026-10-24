import { L, LU, STATUS_LABELS, F, bilingual } from "@/components/labels/managerLabels";
// ArtistContactLabels.js
// Field labels based on ArtistContact Prisma model

export const fieldLabels = {
  // Core fields
 artist_name: bilingual(L.artist_name),
  opening_time: bilingual(L.opening_hours),
  email: bilingual(L.email),
  phone: bilingual(L.phone),
  address: bilingual(L.address),
  social_media: bilingual(L.social_media),
  web_url: bilingual(L.website_url_2),
  language: bilingual(L.language),
  order: bilingual(L.order_sequence),
  
  // Timestamps
  updatedAt: bilingual(L.last_updated),
};

// Page text labels
export const PAGE_TEXT = {
  // Page Title
  pageTitle: LU.artist_contact_management,
  
  // Item Name
  itemName: LU.artist_contact,
  
  // Create Button Tooltip
  createTooltip: LU.create_new_artist_contact,
  
  // Filter Labels
  filters: {
    language: LU.language,
   artist_name: LU.artist_name,
  },
  
  // Control Panel
  controlPanel: {
    sortByOrder: LU.sort_by_order,
    sortByOrderTooltip: LU.sort_contacts_by_order,
    sortByName: LU.sort_by_name,
    sortByNameTooltip: LU.sort_by_artist_name,
    exportData: LU.export_data,
    exportDataTooltip: LU.export_artist_contact_data,
  },
  
  // Field Labels
  fields: {
    artistName: LU.artist_name,
    openingTime: LU.opening_hours,
    email: LU.email,
    phone: LU.phone,
    address: LU.address,
    socialMedia: LU.social_media,
    webUrl: LU.website_url_2,
    language: LU.language,
    order: LU.order_sequence,
    updatedAt: LU.updated_at,
  },
  
  // Empty State Messages
  emptyState: {
    noData: LU.no_artist_contacts_found,
    noMatchingEntries: LU.no_matching_contacts,
  },
  
  // Delete Dialog
  deleteDialog: {
    title: LU.confirm_delete,
    confirm: LU.delete,
    cancel: LU.cancel,
  },
  
  // Error Messages
  errors: {
    loadingError: LU.error_loading_data,
    systemError: LU.system_error,
    tryAgain: LU.try_again,
    deleteError: LU.delete_failed,
    pleaseRetry: LU.please_try_again,
    ok: LU.ok,
  },
  
  // Export Messages
  export: {
    success: LU.export_success,
    error: LU.export_failed,
    entries: LU.contacts,
  },
};

// Action labels
export const actionLabels = {
  create_en: "Create Artist Contact",
  create_cn: "创建联系信息",
  edit_en: "Edit Artist Contact",
  edit_cn: "编辑联系信息",
  delete_en: "Delete Artist Contact",
  delete_cn: "删除联系信息",
  export_en: "Export Artist Contact Data",
  export_cn: L.export_artist_contact_data.cn,
  import_en: "Import Artist Contact Data",
  import_cn: "导入联系数据",
};

// Status labels
export const statusLabels = { ...STATUS_LABELS };

// Entity labels
export const entityLabels = {
  ArtistContact_en: L.artist_contact.en,
  ArtistContact_cn: L.artist_contacts.cn,
  ArtistContacts_en: L.artist_contacts.en,
  ArtistContacts_cn: "联系信息列表",
  untitled_en: "Untitled Contact",
  untitled_cn: "未命名联系信息",
};

// Filter labels
export const filterLabels = {
  all_languages_en: F.all_languages.en,
  all_languages_cn: F.all_languages.cn,
  all_galleries_en: "All Galleries",
  all_galleries_cn: "全部画廊",
};

// Sort labels
export const sortLabels = {
  sort_by_order_en: F.sort_by_order.en,
  sort_by_order_cn: F.sort_by_order.cn,
  sort_by_name_en: L.sort_by_name.en,
  sort_by_name_cn: L.sort_by_name.cn,
};

// Page labels
export const pageLabels = {
  title_en: L.artist_contact_management.en,
  title_cn: L.artist_contact_management.cn,
  description_en: "Manage Artist Contact information",
  description_cn: "管理联系信息",
};

// UI Text labels
export const uiTextLabels = {
  pageTitle: L.artist_contacts,
  artistName: L.artist_name,
  email: L.email,
  phone: L.phone,
  language: L.language,
  all: L.all,
  noItemsFound: L.no_items_found_matching_the_criteria,
  noEntriesFound: L.no_artist_contacts_found_matching_the_criteria,
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  fields: {
   artist_name: L.artist_name,
    email: L.email,
    phone: L.phone,
    language: L.language,
  }
};

// Display labels
export const displayLabels = {
  detailButtonText: (isCn) => isCn ? '查看详情' : 'See Details',
  emptyMessage: (isCn) => isCn ? '没有可显示的联系信息' : 'No Artist Contacts to display',
  noMatchMessage: (isCn) => isCn ? '未找到匹配的联系信息' : 'No matching contacts found',
  loadingMessage: (isCn) => isCn ? '加载中...' : 'Loading...',
  errorMessage: (isCn) => isCn ? '加载失败' : 'Failed to load',
};

// Control panel labels
export const controlPanelLabels = {
  language: L.language.cn,
  artistName: L.artist_name.cn,
  sortByOrder: L.sort_by_order.cn,
  sortByOrderTooltip: L.sort_by_order.en,
  sortByName: L.sort_by_name.cn,
  sortByNameTooltip: L.sort_by_name.en,
  artistNameLabel_en: L.artist_name.en,
  artistNameLabel_cn: L.artist_name.cn,
  languageLabel_en: F.language.en,
  languageLabel_cn: F.language.cn,
};

// Default content labels
export const defaultContentLabels = {
  listTitle: (isCn) => isCn ? "联系信息列表" : "CONTACT LIST",
  detailsLabel: (isCn) => isCn ? "联系信息详情" : "CONTACT DETAILS",
  untitled: (isCn) => isCn ? "未命名联系信息" : "Untitled Contact",
  noDescription: (isCn) => isCn ? '暂无描述' : 'No description available',
  back: (isCn) => isCn ? "返回" : "BACK",
};

// Field group labels
export const fieldGroupLabels = {
  basic: {
    title: (isCn) => isCn ? "基本信息" : "Basic Info",
  },
  contact: {
    title: (isCn) => isCn ? "联系方式" : "Contact Details",
  },
  classification: {
    title: (isCn) => isCn ? "分类" : "Classification",
  },
};

// Field labels for components (object with en/cn)
export const fieldLabelsForComponents = {
 artist_name: L.artist_name,
  opening_time: L.opening_hours,
  email: L.email,
  phone: L.phone,
  address: L.address,
  social_media: L.social_media,
  web_url: L.website_url_2,
  language: L.language,
  order: L.order_sequence,
};

// Delete dialog labels
export const deleteDialogLabels = {
  delete_dialog_this_item_en: "this Artist Contact",
  delete_dialog_this_item_cn: "该联系信息",
  confirmDeleteEntry_en: "Are you sure you want to delete this Artist Contact?",
  confirmDeleteEntry_cn: "确定要删除该联系信息吗？",
  thisEntry_en: "this contact",
  thisEntry_cn: "该联系信息",
};

// Additional labels (placeholders, etc.)
export const additionalLabels = {
  // Placeholder and description labels
  selectLanguage_en: F.select_language.en,
  selectLanguage_cn: F.select_language.cn,
  selectGallery_en: "Select Gallery",
  selectGallery_cn: "选择画廊",
  artistNamePlaceholder_en: "Enter Artist Name",
  artistNamePlaceholder_cn: "输入艺术家姓名",
  openingTimePlaceholder_en: "Enter opening hours (e.g., Mon-Fri 9am-6pm)",
  openingTimePlaceholder_cn: "输入营业时间（例如：周一至周五 9:00-18:00）",
  emailPlaceholder_en: "Enter email address",
  emailPlaceholder_cn: "输入邮箱地址",
  phonePlaceholder_en: "Enter phone number",
  phonePlaceholder_cn: "输入电话号码",
  addressPlaceholder_en: "Enter address (one per line)",
  addressPlaceholder_cn: "输入地址（每行一个）",
  socialMediaPlaceholder_en: "Enter social media accounts (e.g., instagram:myacc, facebook:myfb)",
  socialMediaPlaceholder_cn: "输入社交媒体账号（例如：instagram:myacc, facebook:myfb）",
  webUrlPlaceholder_en: "Enter website URL",
  webUrlPlaceholder_cn: "输入网站链接",
  
  // Address labels
  address_en: F.address.en,
  address_cn: F.address.cn,
  addressSummary_en: "Address Lines",
  addressSummary_cn: "地址行",
  addressDescription_en: "Add address lines (one per line).",
  addressDescription_cn: "添加地址行（每行一个）。",
  addAddressButton_en: "Add Address Line",
  addAddressButton_cn: "添加地址行",
  removeAddressButton_en: F.remove.en,
  removeAddressButton_cn: F.remove.cn,
  
  // Social media labels
  social_media_en: L.social_media.en,
  social_media_cn: L.social_media.cn,
  socialMediaSummary_en: "Social Media Accounts",
  socialMediaSummary_cn: "社交媒体账号",
  socialMediaDescription_en: "Add social media accounts with platform, account name, and URL.",
  socialMediaDescription_cn: "添加社交媒体账号（平台、账号名和链接）。",
  addSocialMediaButton_en: "Add Account",
  addSocialMediaButton_cn: "添加账号",
  removeSocialMediaButton_en: F.remove.en,
  removeSocialMediaButton_cn: F.remove.cn,
  platformPlaceholder_en: "Platform (e.g., instagram)",
  platformPlaceholder_cn: "平台（例如：instagram）",
  accountPlaceholder_en: "Account name",
  accountPlaceholder_cn: "账号名",
  urlPlaceholder_en: "Profile URL",
  urlPlaceholder_cn: "个人链接",
  
  // Entity and collection labels
  no_entries_en: L.no_artist_contacts_found.en,
  no_entries_cn: "未找到联系信息",
  
  // Search and filter labels
  searchEntries_en: "Search Artist Contacts",
  searchEntries_cn: "搜索联系信息",
  
  // Status and error labels
  noFeaturedEntries_en: "No featured Artist Contacts available",
  noFeaturedEntries_cn: "暂无精选联系信息",
  noMatchingEntries_en: L.no_matching_artist_contacts_found.en,
  noMatchingEntries_cn: L.no_artist_contacts_found_matching_the_criteria.cn,
};

// UI Text Configuration (compact error/message strings)
export const UI_TEXT = {
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  ArtistContactManagement: L.artist_contact_management,
  noData: L.no_artist_contacts_available,
  noMatchingEntries: L.no_matching_artist_contacts_found,
  all: L.all,
  totalCount: L.total,
  exportSuccess: L.export_success,
  exportError: L.export_failed,
  exportInProgress: L.exporting
};

// Combined labels object for easy access
export const ArtistContactLabels = {
  ...fieldLabels,
  ...actionLabels,
  ...statusLabels,
  ...entityLabels,
  ...filterLabels,
  ...sortLabels,
  ...pageLabels,
  ...deleteDialogLabels,
  ...additionalLabels,
  uiText: uiTextLabels,
  display: displayLabels,
  controlPanel: controlPanelLabels,
  defaultContent: defaultContentLabels,
  fieldLabelsForComponents,
  UI_TEXT: UI_TEXT,
  PAGE_TEXT,
};

// Helper function to get labels
export const getArtistContactLabel = (key, language = 'en') => {
  if (!key) return '';
  
  // Try direct field labels first (slash format string)
  if (fieldLabels[key]) {
    // fieldLabels[key] is like bilingual(L.artist_name)
    if (language === 'en') {
      return fieldLabels[key].split('/')[0].trim();
    } else {
      return fieldLabels[key].split('/')[1]?.trim() || fieldLabels[key];
    }
  }
  
  // Try labels with language suffix
  const labelKey = `${key}_${language}`;
  if (ArtistContactLabels[labelKey]) {
    return ArtistContactLabels[labelKey];
  }
  
  // Fallback to English if Chinese not found
  if (language === 'cn') {
    const englishKey = `${key}_en`;
    if (ArtistContactLabels[englishKey]) {
      return ArtistContactLabels[englishKey];
    }
  }
  
  return key;
};

// Helper function to get UI text
export const getArtistContactUIText = (key, language = 'en') => {
  if (!key) return '';
  
  // Try to get from uiText configuration
  if (uiTextLabels[key]) {
    return uiTextLabels[key][language] || uiTextLabels[key]['en'] || key;
  }
  
  // Try nested fields
  if (key.includes('.')) {
    const [parent, child] = key.split('.');
    if (uiTextLabels[parent] && uiTextLabels[parent][child]) {
      return uiTextLabels[parent][child][language] || uiTextLabels[parent][child]['en'] || key;
    }
  }
  
  return key;
};

// Default export
export default ArtistContactLabels;