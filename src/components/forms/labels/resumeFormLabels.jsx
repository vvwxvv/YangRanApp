// resumeFormLabels.js — matches Prisma Resume model
const RESUME_FORM_LABELS = {
  tabs: {
    basic: { en: "Basic Info", cn: "基本信息" },
    dates: { en: "Dates", cn: "日期" },
    content: { en: "Content", cn: "内容" },
    metadata: { en: "Metadata", cn: "元数据" },
    introduction: { en: "Introduction", cn: "引言" }
  },
  fields: {
    artist: { en: "Artist", cn: "艺术家" },
    year: { en: "Year", cn: "年份" },
    start_date: { en: "Start Date", cn: "开始日期" },
    end_date: { en: "End Date", cn: "结束日期" },
    type: { en: "Type", cn: "类型" },
    description: { en: "Description", cn: "描述" },
    language: { en: "Language", cn: "语言" },
    mark: { en: "Mark", cn: "标记" },
    introduction: { en: "Introduction Paragraph", cn: "引言段落" }
  },
  buttons: {
    addIntroduction: { en: "Add Paragraph", cn: "添加段落" }
  }
};

export default RESUME_FORM_LABELS;
