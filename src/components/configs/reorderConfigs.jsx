import { F } from "@/components/labels/managerLabels";
// ======================== 各 Schema 重排序配置（基于 Prisma 模型） ========================

// ---------- Artwork ----------
export const artworkReorderConfig = {
  schemaName: 'artwork',
  pageTitleKey: 'artworkOrderManagement',
  displayFields: ['title', 'artist', 'type', 'year'],
  sortFields: ['year', 'type', 'artist'],
  groupFields: ['type', 'language'],
  sortTypes: {
    year: 'string',
    type: 'string',
    artist: 'string',
    language: 'string',
  },
  titleField: 'title',
  artistField: 'artist',
  yearField: 'year',
  seriesField: 'series',
  groupTitleTemplate: 'Type: {groupKey} ({count} artworks)',
  noGroupLabel: 'No Type',
  apiEndpoint: '/api/artwork/reorder',
};

// ---------- Video ----------
export const videoReorderConfig = {
  schemaName: 'video',
  pageTitleKey: 'videoOrderManagement',
  displayFields: ['tag_en', 'tag_cn', 'type', 'caption_en', 'caption_cn'],
  sortFields: ['type', 'tag_en', 'tag_cn'],
  groupFields: ['type'],
  sortTypes: {
    type: 'string',
    tag_en: F.string.en,
    tag_cn: F.string.cn,
  },
  titleField: 'tag_en',
  artistField: null,
  yearField: null,
  seriesField: null,
  groupTitleTemplate: 'Type: {groupKey} ({count} videos)',
  noGroupLabel: 'No Type',
  apiEndpoint: '/api/video/reorder',
};

// ---------- Web ----------
export const webReorderConfig = {
  schemaName: 'web',
  pageTitleKey: 'webOrderManagement',
  displayFields: ['tag_en', 'tag_cn', 'type', 'caption_en', 'caption_cn'],
  sortFields: ['type', 'tag_en', 'tag_cn'],
  groupFields: ['type'],
  sortTypes: {
    type: 'string',
    tag_en: F.string.en,
    tag_cn: F.string.cn,
  },
  titleField: 'tag_en',
  artistField: null,
  yearField: null,
  seriesField: null,
  groupTitleTemplate: 'Type: {groupKey} ({count} web items)',
  noGroupLabel: 'No Type',
  apiEndpoint: '/api/web/reorder',
};

// ---------- Writing ----------
export const writingReorderConfig = {
  schemaName: 'writing',
  pageTitleKey: 'writingReorderManager',
  displayFields: ['title', 'author', 'category', 'status', 'year'],
  sortFields: ['year', 'category', 'status'],
  groupFields: ['category', 'status', 'author'],
  sortTypes: {
    year: 'string',
    category: 'string',
    status: 'string',
    author: 'string',
  },
  titleField: 'title',
  subtitleField: 'subtitle',
  artistField: 'author',
  yearField: 'year',
  categoryField: 'category',
  statusField: 'status',
  groupTitleTemplate: 'Category: {groupKey} ({count} writings)',
  noGroupLabel: 'No Category',
  apiEndpoint: '/api/writing/reorder',
};

// ---------- Image ----------
export const imageReorderConfig = {
  schemaName: 'image',
  pageTitleKey: 'imageOrderManagement',
  displayFields: ['tag_en', 'tag_cn', 'type', 'caption_en', 'caption_cn'],
  sortFields: ['type', 'tag_en', 'tag_cn'],
  groupFields: ['type'],
  sortTypes: {
    type: 'string',
    tag_en: F.string.en,
    tag_cn: F.string.cn,
  },
  titleField: 'tag_en',
  artistField: null,
  yearField: null,
  seriesField: null,
  groupTitleTemplate: 'Type: {groupKey} ({count} images)',
  noGroupLabel: 'No Type',
  apiEndpoint: '/api/image/reorder',
};

// ---------- Event ----------
export const eventReorderConfig = {
  schemaName: 'event',
  pageTitleKey: 'eventOrderManagement',
  displayFields: ['title', 'type', 'year', 'venue'],
  sortFields: ['year', 'type', 'venue'],
  groupFields: ['type', 'venue'],
  sortTypes: {
    year: 'string',
    type: 'string',
    venue: 'string',
  },
  titleField: 'title',
  artistField: null,
  yearField: 'year',
  seriesField: null,
  groupTitleTemplate: 'Type: {groupKey} ({count} events)',
  noGroupLabel: 'No Type',
  apiEndpoint: '/api/event/reorder',
};

// ---------- Exhibition ----------
export const exhibitionReorderConfig = {
  schemaName: 'exhibition',
  pageTitleKey: 'exhibitionOrderManagement',
  displayFields: ['title', 'type', 'year', 'venue', 'organiser'],
  sortFields: ['year', 'type', 'venue'],
  groupFields: ['type', 'venue'],
  sortTypes: {
    year: 'string',
    type: 'string',
    venue: 'string',
    organiser: 'string',
  },
  titleField: 'title',
  subtitleField: 'subtitle',
  artistField: 'curator',
  yearField: 'year',
  seriesField: null,
  groupTitleTemplate: 'Type: {groupKey} ({count} exhibitions)',
  noGroupLabel: 'No Type',
  apiEndpoint: '/api/exhibition/reorder',
};

// ---------- Fair ----------
export const fairReorderConfig = {
  schemaName: 'fair',
  pageTitleKey: 'fairOrderManagement',
  displayFields: ['title', 'type', 'year', 'venue', 'organiser'],
  sortFields: ['year', 'type', 'venue', 'organiser'],
  groupFields: ['type', 'venue', 'section'],
  sortTypes: {
    year: 'string',
    type: 'string',
    venue: 'string',
    organiser: 'string',
    section: 'string',
  },
  titleField: 'title',
  subtitleField: 'section',
  artistField: 'curator',
  yearField: 'year',
  seriesField: null,
  groupTitleTemplate: 'Type: {groupKey} ({count} fairs)',
  noGroupLabel: 'No Type',
  apiEndpoint: '/api/fair/reorder',
};

// ---------- About ----------
export const aboutReorderConfig = {
  schemaName: 'about',
  pageTitleKey: 'aboutOrderManagement',
  displayFields: ['artist', 'caption', 'language'],
  sortFields: ['language', 'artist'],
  groupFields: ['language'],
  sortTypes: {
    language: 'string',
    artist: 'string',
  },
  titleField: 'caption',
  artistField: 'artist',
  yearField: null,
  seriesField: null,
  groupTitleTemplate: 'Language: {groupKey} ({count} about items)',
  noGroupLabel: 'No Language',
  apiEndpoint: '/api/about/reorder',
};

// ---------- Enquire ----------
export const enquireReorderConfig = {
  schemaName: 'enquire',
  pageTitleKey: 'enquireOrderManagement',
  displayFields: ['name', 'email', 'status', 'createdAt'],
  sortFields: ['status', 'createdAt', 'name'],
  groupFields: ['status'],
  sortTypes: {
    status: 'string',
    createdAt: 'string',
    name: 'string',
  },
  titleField: 'name',
  subtitleField: 'email',
  artistField: null,
  yearField: null,
  seriesField: null,
  statusField: 'status',
  groupTitleTemplate: 'Status: {groupKey} ({count} enquiries)',
  noGroupLabel: 'No Status',
  apiEndpoint: '/api/enquire/reorder',
};

// ---------- Subscribe ----------
export const subscribeReorderConfig = {
  schemaName: 'subscribe',
  pageTitleKey: 'subscribeOrderManagement',
  displayFields: ['name', 'email', 'isActive', 'createdAt'],
  sortFields: ['isActive', 'createdAt', 'name'],
  groupFields: ['isActive'],
  sortTypes: {
    isActive: 'string',
    createdAt: 'string',
    name: 'string',
  },
  titleField: 'name',
  subtitleField: 'email',
  artistField: null,
  yearField: null,
  seriesField: null,
  groupTitleTemplate: 'Active: {groupKey} ({count} subscribers)',
  noGroupLabel: 'No Status',
  apiEndpoint: '/api/subscribe/reorder',
};

// ======================== Bibliography（新增） ========================
export const bibliographyReorderConfig = {
  schemaName: 'bibliography',
  pageTitleKey: 'bibliographyOrderManagement',
  displayFields: ['title', 'subtitle', 'author', 'type', 'year'],
  sortFields: ['year', 'type', 'author', 'title'],
  groupFields: ['type', 'author', 'year'],
  sortTypes: {
    year: 'string',
    type: 'string',
    author: 'string',
    title: 'string',
  },
  titleField: 'title',
  subtitleField: 'subtitle',
  artistField: 'author',      // 映射为作者
  yearField: 'year',
  seriesField: null,          // 无系列
  groupTitleTemplate: 'Type: {groupKey} ({count} bibliographies)',
  noGroupLabel: 'No Type',
  apiEndpoint: '/api/bibliography/reorder',
};

// ======================== Series（新增） ========================
export const seriesReorderConfig = {
  schemaName: 'series',
  pageTitleKey: 'seriesOrderManagement',
  displayFields: ['title', 'artist', 'type', 'medium', 'year'],
  sortFields: ['year', 'type', 'artist', 'title'],
  groupFields: ['type', 'artist', 'year'],
  sortTypes: {
    year: 'string',
    type: 'string',
    artist: 'string',
    title: 'string',
  },
  titleField: 'title',
  subtitleField: 'medium',
  artistField: 'artist',      // 映射为艺术家
  yearField: 'year',
  seriesField: null,          // 无系列
  groupTitleTemplate: 'Type: {groupKey} ({count} series)',
  noGroupLabel: 'No Type',
  apiEndpoint: '/api/series/reorder',
};

// ======================== 辅助函数 ========================

/**
 * 根据 schema 名称获取对应的重排序配置（直接返回完整配置对象）
 * @param {string} schemaName - 模型名称（小写）
 * @returns {object} 配置对象
 */
export const getReorderConfig = (schemaName) => {
  const configs = {
    artwork: artworkReorderConfig,
    video: videoReorderConfig,
    web: webReorderConfig,
    writing: writingReorderConfig,
    image: imageReorderConfig,
    event: eventReorderConfig,
    exhibition: exhibitionReorderConfig,
    fair: fairReorderConfig,
    about: aboutReorderConfig,
    enquire: enquireReorderConfig,
    subscribe: subscribeReorderConfig,
    bibliography: bibliographyReorderConfig,   //  新增映射
    series: seriesReorderConfig,               //  新增映射
  };

  return configs[schemaName] || writingReorderConfig; // 默认回退
};

/**
 * 通用配置创建函数：根据 schema 名称获取基础配置，再用自定义属性覆盖
 * @param {string} schemaName - 模型名称（小写）
 * @param {object} customConfig - 需要覆盖的部分配置
 * @returns {object} 合并后的完整配置
 */
export const createReorderConfig = (schemaName, customConfig = {}) => {
  const baseConfig = getReorderConfig(schemaName);
  return {
    ...baseConfig,
    ...customConfig,
  };
};