import { L, LU, STATUS_LABELS, F } from "@/components/labels/managerLabels";
// ─────────────────────────────────────────────
// enquire_labels.js
// Matches Prisma Enquire model fields exactly
// ─────────────────────────────────────────────

// Core field labels (bilingual objects)
export const fieldLabels = {
    name:                   L.name,
    email:                  L.email,
    message:                L.message,
    createdAt:              L.created_at,
    status:                 L.status,
  };
  
  // ─────────────────────────────────────────────
  // Page text labels
  // ─────────────────────────────────────────────
  export const PAGE_TEXT = {
    pageTitle: LU.enquiry_management,
  
    itemName: LU.enquiry,
  
    createTooltip: LU.create_new_enquiry,
  
    filters: {
      name:                   LU.name,
      email:                  LU.email,
      status:                 LU.status,
    },
  
    controlPanel: {
      sortByName:         LU.sort_by_name_2,
      sortByNameTooltip:  LU.sort_enquiries_by_name,
      sortByDate:         LU.sort_by_date,
      sortByDateTooltip:  LU.sort_enquiries_by_date,
      sortByStatus:       LU.sort_by_status,
      sortByStatusTooltip:LU.sort_enquiries_by_status,
      exportData:         LU.export_data,
      exportDataTooltip:  LU.export_enquiry_data,
    },
  
    fields: {
      name:                   LU.name,
      email:                  LU.email,
      message:                LU.message,
      createdAt:              LU.created_at,
      status:                 LU.status,
    },
  
    emptyState: {
      noData:            LU.no_enquiries_found,
      noMatchingEnquiries:LU.no_matching_enquiries,
    },
  
    deleteDialog: {
      title:   LU.confirm_delete,
      confirm: LU.delete,
      cancel:  LU.cancel,
    },
  
    errors: {
      loadingError: LU.error_loading_data,
      systemError:  LU.system_error,
      tryAgain:     LU.try_again,
      deleteError:  LU.delete_failed,
      pleaseRetry:  LU.please_try_again,
      ok:           LU.ok,
    },
  
    export: {
      success:   LU.export_success,
      error:     LU.export_failed,
      enquiries: LU.enquiries_2,
    },
  };
  
  // ─────────────────────────────────────────────
  // Action labels
  // ─────────────────────────────────────────────
  export const actionLabels = {
    create_en: 'Create Enquiry',
    create_cn: '创建咨询',
    edit_en:   'Edit Enquiry',
    edit_cn:   '编辑咨询',
    delete_en: 'Delete Enquiry',
    delete_cn: '删除咨询',
    export_en: 'Export Enquiries',
    export_cn: '导出咨询',
    import_en: 'Import Enquiries',
    import_cn: '导入咨询',
  };
  
  // ─────────────────────────────────────────────
  // Status labels
  // ─────────────────────────────────────────────
  export const statusLabels = { ...STATUS_LABELS };
  
  // ─────────────────────────────────────────────
  // Entity labels
  // ─────────────────────────────────────────────
  export const entityLabels = {
    enquiry_en: L.enquiry.en,
    enquiry_cn: L.enquiries.cn,
    enquiries_en: L.enquiries.en,
    enquiries_cn: L.enquiries.cn,
    untitledEnquiry_en: 'Untitled Enquiry',
    untitledEnquiry_cn: '无标题咨询',
  };
  
  // ─────────────────────────────────────────────
  // Filter labels
  // ─────────────────────────────────────────────
  export const filterLabels = {
    all_names_en:    'All Names',    all_names_cn:    '全部姓名',
    all_emails_en:   'All Emails',   all_emails_cn:   '全部邮箱',
    all_statuses_en: 'All Statuses', all_statuses_cn: '全部状态',
    all_artists_en: F.all_artists.en,
    all_artists_cn: F.all_artists.cn,
    all_artworks_en: 'All Artworks', all_artworks_cn: '全部作品',
  };
  
  // ─────────────────────────────────────────────
  // Sort labels
  // ─────────────────────────────────────────────
  export const sortLabels = {
    sort_by_date_en: L.sort_by_date.en,   sort_by_date_cn:   '按日期排序',
    sort_by_name_en: L.sort_by_name.en,   sort_by_name_cn:   '按姓名排序',
    sort_by_status_en: L.sort_by_status.en, sort_by_status_cn: '按状态排序',
  };
  
  // ─────────────────────────────────────────────
  // Page labels
  // ─────────────────────────────────────────────
  export const pageLabels = {
    title_en: L.enquiry_management.en,
    title_cn: L.enquiry_management.cn,
    description_en: L.manage_customer_enquiries_and_requests.en,
    description_cn: L.manage_customer_enquiries_and_requests.cn,
  };
  
  // ─────────────────────────────────────────────
  // UI Text labels
  // ─────────────────────────────────────────────
  export const uiTextLabels = {
    pageTitle:              L.enquiry_index,
    name:                   L.name,
    email:                  L.email,
    message:                L.message,
    createdAt:              L.created_at,
    status:                 L.status,
    all:                    L.all,
    other:                  L.other,
    noItemsFound: L.no_items_found_matching_the_criteria,
    noEnquiriesFound: L.no_enquiries_found_matching_the_criteria,
    loadingError: L.connection_failed,
    systemError:  L.system_temporarily_unavailable,
    tryAgain:     L.try_again,
    fields: {
      name:                   L.name,
      email:                  L.email,
      message:                L.message,
      createdAt:              L.created_at,
      status:                 L.status,
    },
  };
  
  // ─────────────────────────────────────────────
  // Display labels
  // ─────────────────────────────────────────────
  export const displayLabels = {
    detailButtonText: (isCn) => isCn ? '查看详情'    : 'See Details',
    emptyMessage:     (isCn) => isCn ? '没有可显示的咨询' : 'No enquiries to display',
    noMatchMessage:   (isCn) => isCn ? L.no_matching_enquiries_found.cn : L.no_matching_enquiries_found.en,
    loadingMessage:   (isCn) => isCn ? '加载中...'   : 'Loading...',
    errorMessage:     (isCn) => isCn ? '加载失败'    : 'Failed to load',
  };
  
  // ─────────────────────────────────────────────
  // Control panel labels
  // ─────────────────────────────────────────────
  export const controlPanelLabels = {
    name:           (isCn) => isCn ? L.name.cn : L.name.en,
    email:          (isCn) => isCn ? L.email.cn : L.email.en,
    status:         (isCn) => isCn ? L.status.cn : L.status.en,
    createdAt:      (isCn) => isCn ? '时间'   : 'Date',
  
    sortByName:          (isCn) => isCn ? '按姓名排序' : 'Sort by Name',
    sortByNameTooltip:   (isCn) => isCn ? L.sort_enquiries_by_name.cn : L.sort_enquiries_by_name.en,
    sortByDate:          (isCn) => isCn ? L.sort_by_date.cn : L.sort_by_date.en,
    sortByDateTooltip:   (isCn) => isCn ? L.sort_enquiries_by_date.cn : L.sort_enquiries_by_date.en,
    sortByStatus:        (isCn) => isCn ? L.sort_by_status.cn : L.sort_by_status.en,
    sortByStatusTooltip: (isCn) => isCn ? L.sort_enquiries_by_status.cn : L.sort_enquiries_by_status.en,
  
    // Backwards compatibility flat strings
    nameLabel_en: L.name.en,     nameLabel_cn:    '姓名',
    emailLabel_en: L.email.en,    emailLabel_cn:   '邮箱',
    statusLabel_en: L.status.en,   statusLabel_cn:  '状态',
    dateLabel_en: L.date.en,     dateLabel_cn:    '时间',
  };
  
  // ─────────────────────────────────────────────
  // Default content labels
  // ─────────────────────────────────────────────
  export const defaultContentLabels = {
    listTitle:     (isCn) => isCn ? '咨询列表'  : 'ENQUIRY LIST',
    detailsLabel:  (isCn) => isCn ? '咨询详情'  : 'ENQUIRY DETAILS',
    untitled:      (isCn) => isCn ? '无名氏'    : 'Unknown Sender',
    noDescription: (isCn) => isCn ? '暂无留言'  : 'No message provided',
    back:          (isCn) => isCn ? '返回'      : 'BACK',
  };
  
  // ─────────────────────────────────────────────
  // Field group labels
  // ─────────────────────────────────────────────
  export const fieldGroupLabels = {
    contact: {
      title: (isCn) => isCn ? '联系方式' : 'Contact Info',
    },
    message: {
      title: (isCn) => isCn ? '留言内容' : 'Message Details',
    },
    related: {
      title: (isCn) => isCn ? '相关信息' : 'Related Information',
    },
    system: {
      title: (isCn) => isCn ? '系统信息' : 'System Info',
    },
  };
  
  // ─────────────────────────────────────────────
  // Field labels for components — all Prisma Enquire fields
  // ─────────────────────────────────────────────
  export const fieldLabelsForComponents = {
    name:                   L.name,
    email:                  L.email,
    message:                L.message,
    createdAt:              L.created_at,
    status:                 L.status,
  };
  
  // ─────────────────────────────────────────────
  // Delete dialog labels
  // ─────────────────────────────────────────────
  export const deleteDialogLabels = {
    delete_dialog_this_item_en: F.this_enquiry.en,
    delete_dialog_this_item_cn: F.this_enquiry.cn,
    confirmDeleteEnquiry_en:    'Are you sure you want to delete this enquiry?',
    confirmDeleteEnquiry_cn:    '确定要删除该咨询吗？',
    thisEnquiry_en: F.this_enquiry.en,
    thisEnquiry_cn: F.this_enquiry.cn,
  };
  
  // ─────────────────────────────────────────────
  // Additional labels
  // ─────────────────────────────────────────────
  export const additionalLabels = {
    // Placeholder and description labels
    enterName_en:        'Enter name',        enterName_cn:        '输入姓名',
    enterEmail_en:       'Enter email',       enterEmail_cn:       '输入邮箱',
    selectStatus_en:     'Select Status',     selectStatus_cn:     '选择状态',
  
    // Enum values for status
    status_pending_en: L.pending.en,           status_pending_cn:   '待处理',
    status_responded_en: L.responded.en,         status_responded_cn: '已回复',
    status_closed_en: L.closed.en,            status_closed_cn:    '已关闭',
  
    // Entity / collection
    no_enquiries_en: L.no_enquiries_found.en,
    no_enquiries_cn: '未找到咨询',
  
    // Search and filter
    searchEnquiries_en: 'Search enquiries',
    searchEnquiries_cn: '搜索咨询',
  
    // Status and error
    noMatchingEnquiries_en: L.no_matching_enquiries_found.en,
    noMatchingEnquiries_cn: L.no_enquiries_found_matching_the_criteria.cn,
  };
  
  // ─────────────────────────────────────────────
  // UI Text Configuration
  // ─────────────────────────────────────────────
  export const UI_TEXT = {
    loadingError:     L.connection_failed,
    systemError:      L.system_temporarily_unavailable,
    tryAgain:         L.try_again,
    enquiryManagement:L.enquiry_management,
    noData:           L.no_enquiries_available,
    noMatchingEnquiries:L.no_matching_enquiries_found,
    all:              L.all,
    totalCount:       L.total,
    exportSuccess:    L.export_success,
    exportError:      L.export_failed,
    exportInProgress: L.exporting,
  };
  
  // ─────────────────────────────────────────────
  // Combined labels object
  // ─────────────────────────────────────────────
  export const enquireLabels = {
    ...fieldLabels,
    ...actionLabels,
    ...statusLabels,
    ...entityLabels,
    ...filterLabels,
    ...sortLabels,
    ...pageLabels,
    ...deleteDialogLabels,
    ...additionalLabels,
    uiText:         uiTextLabels,
    display:        displayLabels,
    controlPanel:   controlPanelLabels,
    defaultContent: defaultContentLabels,
    UI_TEXT,
    PAGE_TEXT,
  };
  
  // ─────────────────────────────────────────────
  // Helper: get field label
  // ─────────────────────────────────────────────
  export const getEnquireLabel = (key, language = 'en') => {
    if (!key) return '';
  
    // Try direct fieldLabels first (bilingual objects)
    if (fieldLabels[key]) {
      if (typeof fieldLabels[key] === 'object') {
        return fieldLabels[key][language] || fieldLabels[key]['en'] || key;
      }
      return fieldLabels[key];
    }
  
    // Try fieldLabelsForComponents
    if (fieldLabelsForComponents[key]) {
      return fieldLabelsForComponents[key][language]
        || fieldLabelsForComponents[key]['en']
        || key;
    }
  
    // Try flat key with language suffix
    const labelKey = `${key}_${language}`;
    if (enquireLabels[labelKey]) return enquireLabels[labelKey];
  
    // Fallback: English when CN not found
    if (language === 'cn') {
      const englishKey = `${key}_en`;
      if (enquireLabels[englishKey]) return enquireLabels[englishKey];
    }
  
    return key;
  };
  
  // ─────────────────────────────────────────────
  // Helper: get UI text
  // ─────────────────────────────────────────────
  export const getEnquireUIText = (key, language = 'en') => {
    if (!key) return '';
  
    if (uiTextLabels[key]) {
      return uiTextLabels[key][language] || uiTextLabels[key]['en'] || key;
    }
  
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      if (uiTextLabels[parent]?.[child]) {
        return uiTextLabels[parent][child][language]
          || uiTextLabels[parent][child]['en']
          || key;
      }
    }
  
    return key;
  };
  
  export default enquireLabels;