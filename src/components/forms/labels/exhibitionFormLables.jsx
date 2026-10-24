// exhibitionFormLabels.js — 适配 Prisma Exhibition 模型的表单标签配置
const EXHIBITION_FORM_LABELS = {
    // 字段标签 — 与 Exhibition 模型严格对应
    fields: {
      cover_img_url: { en: "Cover Image", cn: "封面图片" },
      title: { en: "Title", cn: "标题" },
      subtitle: { en: "Subtitle", cn: "副标题" },
      type: { en: "Type", cn: "类型" },
      date_start: { en: "Start Date", cn: "开始日期" },
      date_end: { en: "End Date", cn: "结束日期" },
      opening_date: { en: "Opening Date", cn: "开幕日期" },
      year: { en: "Year", cn: "年份" },
      venue: { en: "Venue", cn: "场馆" },
      location: { en: "Location", cn: "地点" },
      curator: { en: "Curator", cn: "策展人" },
      organiser: { en: "Organiser", cn: "主办方" },
      participating_artists: { en: "Participating Artists", cn: "参展艺术家" },
      caption: { en: "Caption", cn: "说明" },
      description: { en: "Description", cn: "描述" },
      introduction: { en: "Introduction", cn: "介绍" },
      press_release: { en: "Press Release", cn: "新闻稿" },
      related_artwork_title: { en: "Related Artwork Titles", cn: "相关作品标题" },
      related_artist: { en: "Related Gallery Artists", cn: "相关画廊艺术家" },
      video_url: { en: "Video URL", cn: "视频链接" },
      web_url: { en: "Web URL", cn: "网页链接" },
      order: { en: "Order", cn: "排序" },
      mark: { en: "Mark", cn: "标记" },
      language: { en: "Language", cn: "语言" },
      status: { en: "Status", cn: "状态" },
    },
  
    // Tab 标签 — 根据展览特点分组，方便表单分步编辑
    tabs: {
      basic: { en: "Basic Info", cn: "基本信息" },
      dates: { en: "Dates", cn: "日期" },
      location: { en: "Location & Organizers", cn: "地点与主办方" },
      content: { en: "Content", cn: "内容" },
      media: { en: "Media", cn: "媒体" },
      related: { en: "Related", cn: "相关" },
      settings: { en: "Settings", cn: "设置" },
      introduction: { en: "Introduction", cn: "介绍" },
      press_release: { en: "Press Release", cn: "新闻稿" },
      ordering: { en: "Ordering", cn: "排序" },
    },

    // 关联选择器的提示文案
    hints: {
      relatedArtwork: {
        en: "Pick matched-language artworks or type a title",
        cn: "从匹配语言的作品中选择，或直接输入标题",
      },
      relatedArtist: {
        en: "Pick from About artists or type a name",
        cn: "从「关于」的艺术家中选择，或直接输入姓名",
      },
    },
  
    // 按钮文案
    buttons: {
      addIntroduction: { en: "Add Introduction", cn: "添加介绍" },
      addPressRelease: { en: "Add Press Release", cn: "添加新闻稿" },
    },
  
    // 通用 UI 文案
    UI_TEXT: {
      uploadError: { en: "Upload failed", cn: "上传失败" },
      moreInfoSummary: { en: "More Information", cn: "更多信息" },
    },
  
    // 选择器（下拉框）的标签
    selectors: {
      mark: { en: "Mark", cn: "标记" },
      language: { en: "Language", cn: "语言" },
      status: { en: "Status", cn: "状态" },
      order: { en: "Order", cn: "排序" },
      selectMark: { en: "Select mark", cn: "选择标记" },
      selectLanguage: { en: "Select language", cn: "选择语言" },
      selectStatus: { en: "Select status", cn: "选择状态" },
    },
  
    // 枚举选项（可直接用于下拉组件）
    typeOptions: [
      { value: "solo", en: "Solo", cn: "个展" },
      { value: "group", en: "Group", cn: "群展" },
      { value: "biennale", en: "Biennale", cn: "双年展" },
      { value: "other", en: "Other", cn: "其他" },
    ],
    statusOptions: [
      { value: "upcoming", en: "Upcoming", cn: "即将展出" },
      { value: "ongoing", en: "Ongoing", cn: "正在展出" },
      { value: "past", en: "Past", cn: "已结束" },
      { value: "draft", en: "Draft", cn: "草稿" },
    ],
    languageOptions: [
      { value: "CN", en: "Chinese", cn: "中文" },
      { value: "EN", en: "English", cn: "英文" },
    ],
  };
  
  export default EXHIBITION_FORM_LABELS;