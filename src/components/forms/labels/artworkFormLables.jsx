// artworkFormLabels.js
const ARTWORK_FORM_LABELS = {
  tabs: {
    basic: { en: 'Basic Info', cn: '基本信息' },
    details: { en: 'Details', cn: '详细信息' },
    media: { en: 'Media Links', cn: '媒体链接' },
    pricing: { en: 'Pricing & Status', cn: '定价与状态' },
    metadata: { en: 'Metadata', cn: '元数据' },
    ordering: { en: 'Ordering', cn: '排序' },
    introduction: { en: 'Introduction', cn: '作品介绍' },
    // 关联区块（跨实体多选）
    relations: { en: 'Relations', cn: '关联' },
  },
  fields: {
    artist: { en: 'Artist', cn: '艺术家' },
    title: { en: 'Title', cn: '标题' },
    type: { en: 'Type', cn: '类型' },
    medium: { en: 'Medium', cn: '媒介' },
    year: { en: 'Year', cn: '年份' },
    size: { en: 'Size', cn: '尺寸' },
    series: { en: 'Series', cn: '系列' },
    caption: { en: 'Caption', cn: '说明' },
    duration: { en: 'Duration', cn: '时长' },
    credits: { en: 'Credits', cn: '鸣谢' },
    special_thanks: { en: 'Special Thanks', cn: '特别感谢' },
    video_url: { en: 'Video URL', cn: '视频链接' },
    web_url: { en: 'Website URL', cn: '网页链接' },
    cover_img_url: { en: 'Cover Image URL', cn: '封面图片链接' },
    related_exhibition: { en: 'Related Galleries/Exhibitions', cn: '关联画廊/展览' },
    work_value: { en: 'Value', cn: '价值' },
    sold: { en: 'Sold', cn: '已售' },
    order: { en: 'Order', cn: '排序' },
    // Per-page ordering — submitted as nested `order.<key>` paths.
    'order.artist_page_order': { en: 'Artist Page Order', cn: '艺术家页排序' },
    'order.exhibition_page_order': { en: 'Exhibition Page Order', cn: '展览页排序' },
    'order.art_fair_page_order': { en: 'Art Fair Page Order', cn: '艺博会页排序' },
    mark: { en: 'Mark', cn: '标记' },
    language: { en: 'Language', cn: '语言' },
    introduction: { en: 'Introduction Paragraph', cn: '介绍段落' }, // 用于数组项
  },
  buttons: {
    addIntroduction: { en: 'Add Paragraph', cn: '添加段落' },
    addRelatedGalleryExhibition: { en: 'Add Exhibition', cn: '添加展览' },
  },
};

export default ARTWORK_FORM_LABELS;