// Helper function for pluralization
import { L } from "@/components/labels/managerLabels";
const pluralize = (count, singular, plural) => {
  return count === 1 ? singular : plural;
};

const batch_text_labels = {
  CN: {
    PAGE_TITLE: "梦境批量编辑",
    DATA_INFO_PREFIX: "数据信息：",
    DATA_INFO_TEMPLATE: (total, filtered, hasPendingChanges) =>
      `数据信息：当前显示梦境数据，共 ${total} 条记录，已筛选 ${filtered} 条${
        hasPendingChanges ? " (有未保存的更改，排序已暂停)" : ""
      }`,
    NO_DATA_NOTICE: '提示：暂无数据。点击下方"添加行"按钮创建新记录。',
    UNSAVED_CHANGES_WARNING: "重要提示：有未保存的更改时，自动排序和字母筛选已暂停。保存后将恢复正常。",
    INSTRUCTIONS: "使用说明：双击单元格进行编辑。使用操作按钮保存、添加或删除项目。",
    EMPTY_TABLE_MESSAGE: '提示：暂无数据，请点击"添加行"创建新记录',
    CLICK_TO_EDIT: "双击编辑",
    SAVE_CHANGES_BEFORE_FILTER: "请先保存更改后再切换字母筛选",
    SAVE_CHANGES_BEFORE_SORT: "请先保存更改后再进行排序",
    SAVE_SUCCESS: "保存成功",
    SAVE_FAILED: "保存失败",
    DELETE_SUCCESS_TEMPLATE: (count) => `成功删除 ${count} 项`,
    DELETE_FAILED: L.delete_failed.cn,
    LOGIN_REQUIRED: "请登录以查看梦境数据",
    ERROR_LOADING: "加载梦境数据时出错",
    CONFIRM_DELETE_TITLE: L.confirm_delete.cn,
    CONFIRM_DELETE_MESSAGE: "确认：您确定要删除选定的项目吗？",
    CONFIRM_SAVE_TITLE: "确认保存",
    CONFIRM_SAVE_MESSAGE: (newCount, modifiedCount) => (
      <>
        保存摘要：您将保存 <b>{newCount}</b> 个新项 和{" "}
        <b>{modifiedCount}</b> 个已修改项。
        <br />
        重要提示：请仔细检查您的更改。此操作无法撤销。
      </>
    ),
    DELETE_BUTTON: L.delete.cn,
    CANCEL_BUTTON: L.cancel.cn,
    CONFIRM_BUTTON: "确认",
    CLOSE_BUTTON: "关闭",
    DATE_LABEL: "日期：",
    SUMMARY_LABEL: "摘要：",
    NO_VALUE: "无",
    NEW_TAG: "(新)",
    UNTITLED: "无标题",
  },
  EN: {
    PAGE_TITLE: "Dream Batch Edit",
    DATA_INFO_PREFIX: "Data Info: ",
    DATA_INFO_TEMPLATE: (total, filtered, hasPendingChanges) =>
      `Data Info: Currently showing dream data, ${total} total records, ${filtered} filtered${
        hasPendingChanges ? " (unsaved changes, sorting paused)" : ""
      }`,
    NO_DATA_NOTICE: 'Notice: No data found. Click "Add Row" button below to create new records.',
    UNSAVED_CHANGES_WARNING: "Important Note: Auto-sorting and alphabet filtering are paused while you have unsaved changes. Save to resume.",
    INSTRUCTIONS: "Instructions: Double-click cells to edit. Use the action buttons to save, add, or delete items.",
    EMPTY_TABLE_MESSAGE: 'Notice: No data. Click "Add Row" to create new records',
    CLICK_TO_EDIT: "Double-click to edit",
    SAVE_CHANGES_BEFORE_FILTER: "Please save changes before changing letter filter",
    SAVE_CHANGES_BEFORE_SORT: "Please save changes before sorting",
    SAVE_SUCCESS: "Changes saved successfully",
    SAVE_FAILED: "Failed to save changes",
    DELETE_SUCCESS_TEMPLATE: (count) => `Successfully deleted ${count} item(s)`,
    DELETE_FAILED: "Failed to delete items",
    LOGIN_REQUIRED: "Please login to view dream data.",
    ERROR_LOADING: "Error loading dream data",
    CONFIRM_DELETE_TITLE: L.confirm_delete.en,
    CONFIRM_DELETE_MESSAGE: "Confirmation: Are you sure you want to delete the selected items?",
    CONFIRM_SAVE_TITLE: "Confirm Save",
    CONFIRM_SAVE_MESSAGE: (newCount, modifiedCount) => (
      <>
        Save Summary: You are about to save <b>{newCount}</b>{" "}
        {pluralize(newCount, "new item", "new items")} and{" "}
        <b>{modifiedCount}</b>{" "}
        {pluralize(modifiedCount, "modified item", "modified items")}.
        <br />
        Important: Please review your changes carefully. This action cannot be undone.
      </>
    ),
    DELETE_BUTTON: L.delete.en,
    CANCEL_BUTTON: L.cancel.en,
    CONFIRM_BUTTON: "Confirm",
    CLOSE_BUTTON: "Close",
    DATE_LABEL: "Date: ",
    SUMMARY_LABEL: "Summary: ",
    NO_VALUE: "None",
    NEW_TAG: "(New)",
    UNTITLED: "Untitled",
  },
};

export default batch_text_labels;