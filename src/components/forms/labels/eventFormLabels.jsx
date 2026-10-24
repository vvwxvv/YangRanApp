// eventFormLabels.js — matches Prisma Event model
const EVENT_FORM_LABELS = {
  tabs: {
    basic: { en: "Basic Info", cn: "基本信息" },
    datetime: { en: "Date & Time", cn: "日期与时间" },
    location: { en: "Location", cn: "地点" },
    credits: { en: "Credits", cn: "鸣谢" },
    content: { en: "Content", cn: "内容" },
    relations: { en: "Related Artworks", cn: "关联作品" },
    metadata: { en: "Metadata", cn: "元数据" },
    introduction: { en: "Introduction", cn: "引言" },
    links: { en: "Links", cn: "链接" },
    ordering: { en: "Ordering", cn: "排序" }
  },
  fields: {
    title: { en: "Title", cn: "标题" },
    type: { en: "Type", cn: "类型" },
    mark: { en: "Mark", cn: "标记" },
    year: { en: "Year", cn: "年份" },
    start_date: { en: "Start Date", cn: "开始日期" },
    end_date: { en: "End Date", cn: "结束日期" },
    open_time: { en: "Opening Hours", cn: "开放时间" },
    venue: { en: "Venue", cn: "场馆" },
    address: { en: "Address", cn: "地址" },
    host: { en: "Host", cn: "主办方" },
    support: { en: "Support", cn: "支持单位" },
    special_thanks: { en: "Special Thanks", cn: "特别鸣谢" },
    caption: { en: "Caption", cn: "说明文字" },
    cover_img_url: { en: "Cover Image URL", cn: "封面图链接" },
    related_artwork_title: { en: "Related Artwork Title", cn: "关联作品标题" },
    related_artist: { en: "Related Artist", cn: "相关艺术家" },
    order: { en: "Order", cn: "排序" },
    language: { en: "Language", cn: "语言" },
    introduction: { en: "Introduction Paragraph", cn: "引言段落" }
  },
  buttons: {
    addIntroduction: { en: "Add Paragraph", cn: "添加段落" },
    addRelatedArtwork: { en: "Add Related Artwork", cn: "添加关联作品" }
  }
};

export default EVENT_FORM_LABELS;
