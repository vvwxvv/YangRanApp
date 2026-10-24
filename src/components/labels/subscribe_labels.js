import { L, STATUS_LABELS, F } from "@/components/labels/managerLabels";
// Subscribe Labels - Centralized label management for subscribe-related components

// Field labels
export const fieldLabels = {
  name_en: L.name.en,
  name_cn: L.name.cn,
  email_en: F.email.en,
  email_cn: F.email.cn,
  isActive_en: L.active.en,
  isActive_cn: L.active.cn,
  createdAt_en: F.created_at.en,
  createdAt_cn: F.created_at.cn,
  yourName_en: F.your_name.en,
  yourName_cn: F.your_name.cn,
  enterEmail_en: F.your_email_com.en,
  enterEmail_cn: F.your_email_com.cn,
};

// Action labels
export const actionLabels = {
  create_en: "Create Subscribe",
  create_cn: "创建订阅",
  edit_en: "Edit Subscribe",
  edit_cn: "编辑订阅",
  delete_en: "Delete Subscribe",
  delete_cn: "删除订阅",
  export_en: "Export Subscribes",
  export_cn: "导出订阅",
  import_en: "Import Subscribes",
  import_cn: "导入订阅",
  subscribe_en: F.subscribe.en,
  subscribe_cn: F.subscribe.cn,
  subscribing_en: F.subscribing.en,
  subscribing_cn: F.subscribing.cn,
};

// Status labels
export const statusLabels = { ...STATUS_LABELS };

// Validation labels
export const validationLabels = {
  required_en: F.this_field_is_required.en,
  required_cn: F.this_field_is_required.cn,
  invalid_email_en: F.please_enter_a_valid_email_address.en,
  invalid_email_cn: F.please_enter_a_valid_email_address.cn,
};

// Entity labels
export const entityLabels = {
  subscribe_en: F.subscribe.en,
  subscribe_cn: F.subscribe.cn,
  subscribes_en: "Subscribes",
  subscribes_cn: "订阅",
  newsletter_en: "Newsletter",
  newsletter_cn: "新闻通讯",
};

// Form labels
export const formLabels = {
  submitButton_en: F.subscribe.en,
  submitButton_cn: F.subscribe.cn,
  submittingButton_en: F.subscribing.en,
  submittingButton_cn: F.subscribing.cn,
  successMessage_en: "Successfully subscribed to newsletter!",
  successMessage_cn: "成功订阅新闻通讯！",
  errorMessage_en: "Failed to subscribe",
  errorMessage_cn: "订阅失败",
  formErrorsMessage_en: "Please fix the form errors",
  formErrorsMessage_cn: "请修复表单错误",
  submissionErrorMessage_en: "Network error occurred",
  submissionErrorMessage_cn: "发生网络错误",
};

// Filter labels
export const filterLabels = {
  all_statuses_en: F.all_statuses.en,
  all_statuses_cn: F.all_statuses.cn,
  search_en: F.search.en,
  search_cn: F.search.cn,
  search_placeholder_en: "Search subscriptions...",
  search_placeholder_cn: "搜索订阅...",
};

// Sort labels
export const sortLabels = {
  sort_by_created_at_en: "Sort by Created Date",
  sort_by_created_at_cn: "按创建日期排序",
  sort_by_name_en: L.sort_by_name.en,
  sort_by_name_cn: L.sort_by_name_2.cn,
  sort_by_email_en: "Sort by Email",
  sort_by_email_cn: "按邮箱排序",
  sort_by_status_en: F.sort_by_status.en,
  sort_by_status_cn: F.sort_by_status.cn,
};

// Page labels
export const pageLabels = {
  title_cn: "订阅管理",
  title_en: "Subscribe Management",
  description_cn: "管理新闻通讯订阅",
  description_en: "Manage newsletter subscriptions",
  itemName_cn: "订阅",
  itemName_en: "Subscribe",
  page_title_en: "Subscribe Management",
  page_title_cn: "订阅管理",
};

// Display labels
export const displayLabels = {
  detailButtonText: (isCn) => isCn ? '查看详情' : 'See Details',
  emptyMessage: (isCn) => isCn ? '没有可显示的订阅' : 'No subscriptions to display',
  noMatchMessage: (isCn) => isCn ? '未找到匹配的订阅' : 'No matching subscriptions found',
  loadingMessage: (isCn) => isCn ? '加载中...' : 'Loading...',
  errorMessage: (isCn) => isCn ? '加载失败' : 'Failed to load',
  imageErrorText: 'Image unavailable',
};

// Default content labels
export const defaultContentLabels = {
  listTitle: (isCn) => isCn ? "订阅列表" : "SUBSCRIBE LIST",
  detailsLabel: (isCn) => isCn ? "订阅详情" : "SUBSCRIBE DETAILS",
  noName: (isCn) => isCn ? "无名称" : "No Name",
  noEmail: (isCn) => isCn ? "无邮箱" : "No Email",
  back: (isCn) => isCn ? "返回" : "BACK",
};

// Field group labels
export const fieldGroupLabels = {
  basic: {
    title: (isCn) => isCn ? "基本信息" : "Basic Info",
  },
};

// Field labels for components
export const fieldLabelsForComponents = {
  name: L.name,
  email: L.email,
  isActive: L.active,
  createdAt: L.created_at,
  yourName: L.your_name,
  enterEmail: L.your_email_com
};

// Delete dialog labels
export const deleteDialogLabels = {
  delete_dialog_this_item_en: "this subscription",
  delete_dialog_this_item_cn: "该订阅",
};

// Newsletter popup labels
export const newsletterPopupLabels = {
  yourName_en: F.your_name.en,
  yourName_cn: F.your_name.cn,
  enterEmail_en: F.your_email_com.en,
  enterEmail_cn: F.your_email_com.cn,
  subscribing_en: F.subscribing.en,
  subscribing_cn: F.subscribing.cn,
  subscribe_en: F.subscribe.en,
  subscribe_cn: F.subscribe.cn,
};

// Status options for static filter options
export const statusOptions = [
  { value: true, label_en: 'Active', label_cn: '激活' },
  { value: false, label_en: 'Inactive', label_cn: '未激活' }
];

// Combined labels object for easy access
export const subscribeLabels = {
  ...fieldLabels,
  ...actionLabels,
  ...statusLabels,
  ...validationLabels,
  ...entityLabels,
  ...formLabels,
  ...filterLabels,
  ...sortLabels,
  ...pageLabels,
  ...deleteDialogLabels,
  ...newsletterPopupLabels,
  display: displayLabels,
  defaultContent: defaultContentLabels,
  fieldGroups: fieldGroupLabels,
  fieldLabels: fieldLabelsForComponents,
  statusOptions: statusOptions,
};

// Helper function to get labels
export const getSubscribeLabel = (key, language = 'en') => {
  if (!key) return '';
  
  // Try direct field labels first
  if (fieldLabelsForComponents[key]) {
    return fieldLabelsForComponents[key][language] || fieldLabelsForComponents[key]['en'] || key;
  }
  
  // Try labels with language suffix
  const labelKey = `${key}_${language}`;
  if (subscribeLabels[labelKey]) {
    return subscribeLabels[labelKey];
  }
  
  // Fallback to English if Chinese not found
  if (language === 'cn') {
    const englishKey = `${key}_en`;
    if (subscribeLabels[englishKey]) {
      return subscribeLabels[englishKey];
    }
  }
  
  return key;
};

// Helper function to get field group labels
export const getSubscribeFieldGroupLabel = (groupKey, language = 'en') => {
  if (!groupKey || !fieldGroupLabels[groupKey]) return '';
  
  return fieldGroupLabels[groupKey].title(language === 'cn');
};

// Helper function to get static filter options
export const getStaticFilterOptions = (filterField, language = 'en') => {
  if (filterField === 'isActive') {
    return statusOptions.map(option => ({
      value: option.value,
      label: language === 'cn' ? option.label_cn : option.label_en
    }));
  }
  
  return [];
};

// Default export
export default subscribeLabels;
