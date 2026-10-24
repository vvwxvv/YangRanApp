// ============================================
// (mono-lingual — single-language fields + a `language` field)
// ============================================

/**
 * Fields that don't have language suffix (_cn, _en)
 * LianPu is mono-lingual: nearly all content fields are stored as plain
 * field names. A field listed here makes filter option generation read
 * `item[field]` directly instead of `item[field_cn]` / `item[field_en]`.
 *
 * Exceptions (kept OUT of this list on purpose):
 *  - `tag`     → Image/Video/Web store tag_en/tag_cn  → bilingual generation
 *  - `caption` → Image/Video/Web store caption_en/caption_cn → bilingual generation
 */
export const NO_SUFFIX_FIELDS = [
  // Artwork / Event / About / Exhibition / Fair / Writing / etc.
  'artist',
  'title',
  'subtitle',          // added (Event, Exhibition, Fair, Writing, Bibliography)
  'type',
  'medium',
  'year',
  'size',
  'series',
  'duration',
  'credits',
  'special_thanks',
  'video_url',
  'web_url',
  'work_value',
  'sold',
  'host',
  'support',
  'venue',
  'address',
  'tag_source',
  'mark',
  'order',
  'language',
  'cover_img_url',
  'img_url',
  'portrait_image_url',
  'updatedAt',
  'createdAt',
  // Additional single-language fields found in models
  'date_time',         // Event
  'date_start',        // Exhibition, Fair
  'date_end',          // Exhibition, Fair
  'opening_date',      // Exhibition, Fair
  'vip_preview_date',  // Fair
  'booth',             // Fair
  'section',           // Fair
  'curator',           // Exhibition, Fair
  'organiser',         // Exhibition, Fair
  'participating_artists', // Exhibition, Fair
  'description',       // Exhibition
  'status',            // Exhibition, Fair, Writing, Enquire
  'author',            // Writing, Bibliography, About? (About has artist)
  'summary',           // Writing
  'keywords',          // Writing
  'category',          // Writing
  'artistName',       // ArtistContact
  'openingTime',       // ArtistContact
  'email',             // ArtistContact, Enquire, Subscribe
  'phone',             // ArtistContact, Enquire
  'pdf_url',           // Bibliography, About
  'published_at',      // Bibliography
  'date',              // Bibliography
  'start_date',        // Resume
  'end_date',          // Resume
  'related_artist',  // Event / Exhibition / Bibliography (string array fields)
  'related_artwork_title',   // Event / Exhibition / Fair
];

/**
 * Bilingual labels for "All" option in filters
 * Keyed by the fields used in manager control panels (filterFields).
 */
export const ALL_LABELS = {
  artist:  { cn: '全部艺术家', en: 'All Artists' },
  title:   { cn: '全部标题',   en: 'All Titles' },
  subtitle: { cn: '全部副标题', en: 'All Subtitles' },
  type:    { cn: '全部类型',   en: 'All Types' },
  medium:  { cn: '全部媒介',   en: 'All Media' },
  year:    { cn: '全部年份',   en: 'All Years' },
  size:    { cn: '全部尺寸',   en: 'All Sizes' },
  series:  { cn: '全部系列',   en: 'All Series' },
  caption: { cn: '全部说明',   en: 'All Captions' },   // 注意：虽然不在NO_SUFFIX中，但作为过滤器可能单独处理
  tag:     { cn: '全部标签',   en: 'All Tags' },
  tag_source: { cn: '全部标签来源', en: 'All Tag Sources' },
  venue:   { cn: '全部场馆',   en: 'All Venues' },
  address: { cn: '全部地址',   en: 'All Addresses' },
  host:    { cn: '全部主办方', en: 'All Hosts' },
  support: { cn: '全部支持方', en: 'All Supporters' },
  mark:    { cn: '全部标记',   en: 'All Marks' },
  date_time: { cn: '全部日期时间', en: 'All Date Times' },
  date_start: { cn: '全部开始日期', en: 'All Start Dates' },
  date_end: { cn: '全部结束日期', en: 'All End Dates' },
  opening_date: { cn: '全部开幕日期', en: 'All Opening Dates' },
  booth: { cn: '全部展位', en: 'All Booths' },
  section: { cn: '全部板块', en: 'All Sections' },
  curator: { cn: '全部策展人', en: 'All Curators' },
  organiser: { cn: '全部组织者', en: 'All Organisers' },
  participating_artists: { cn: '全部参展艺术家', en: 'All Participating Artists' },
  description: { cn: '全部描述', en: 'All Descriptions' },
  status: { cn: '全部状态', en: 'All Statuses' },
  author: { cn: '全部作者', en: 'All Authors' },
  summary: { cn: '全部摘要', en: 'All Summaries' },
  keywords: { cn: '全部关键词', en: 'All Keywords' },
  category: { cn: '全部类别', en: 'All Categories' },
  artistName: { cn: '全部艺术家姓名', en: 'All Artist Names' },
  openingTime: { cn: '全部开放时间', en: 'All Opening Times' },
  email: { cn: '全部邮箱', en: 'All Emails' },
  phone: { cn: '全部电话', en: 'All Phones' },
  pdf_url: { cn: '全部PDF链接', en: 'All PDF URLs' },
  published_at: { cn: '全部出版时间', en: 'All Published At' },
  date: { cn: '全部日期', en: 'All Dates' },
  start_date: { cn: '全部开始日期', en: 'All Start Dates' },
  end_date: { cn: '全部结束日期', en: 'All End Dates' },

  // Default fallback
  default: { cn: '全部', en: 'All' }
};

/**
 * Mapping from field names to state variable names
 * (stateKeyMap used by getStateKey — falls back to `selected<Field>` when absent)
 */
export const STATE_KEY_MAP = {
  'artist':      'selectedArtist',
  'title':       'selectedTitle',
  'subtitle':    'selectedSubtitle',
  'type':        'selectedType',
  'medium':      'selectedMedium',
  'year':        'selectedYear',
  'size':        'selectedSize',
  'series':      'selectedSeries',
  'caption':     'selectedCaption',
  'tag':         'selectedTag',
  'tag_source':  'selectedTagSource',
  'venue':       'selectedVenue',
  'address':     'selectedAddress',
  'host':        'selectedHost',
  'support':     'selectedSupport',
  'mark':        'selectedMark',
  'date_time':   'selectedDateTime',
  'date_start':  'selectedDateStart',
  'date_end':    'selectedDateEnd',
  'opening_date': 'selectedOpeningDate',
  'booth':       'selectedBooth',
  'section':     'selectedSection',
  'curator':     'selectedCurator',
  'organiser':   'selectedOrganiser',
  'participating_artists': 'selectedParticipatingArtists',
  'description': 'selectedDescription',
  'status':      'selectedStatus',
  'author':      'selectedAuthor',
  'summary':     'selectedSummary',
  'keywords':    'selectedKeywords',
  'category':    'selectedCategory',
  'artistName': 'selectedartistName',
  'openingTime': 'selectedOpeningTime',
  'email':       'selectedEmail',
  'phone':       'selectedPhone',
  'pdf_url':     'selectedPdfUrl',
  'published_at':'selectedPublishedAt',
  'date':        'selectedDate',
  'start_date':  'selectedStartDate',
  'end_date':    'selectedEndDate',
};

/**
 * Default colors for filter controls
 */
export const DEFAULT_FILTER_COLORS = {
  active:   '#d32f2f',
  inactive: 'var(--text-primary, #000000)',
};

/**
 * Helper function to check if a field has no suffix
 * @param {string} model - Model name (kept for API compatibility)
 * @param {string} field - Field name
 * @returns {boolean} - Whether field has no suffix
 */
export const hasNoSuffix = (model, field) => {
  return NO_SUFFIX_FIELDS.includes(field);
};

/**
 * Fields that are arrays (String[]) — LianPu Prisma schema
 * Updated to match all models exactly.
 */
export const ARRAY_FIELDS = {
  artwork:      ['introduction', 'related_exhibition'],
  event:        ['introduction', 'related_artist'],
  about:        ['introductions'],
  image:        [],
  subscribe:    [],
  video:        [],
  web:          [],
  writing:      ['paragraphs'],
  bibliography: ['related_exhibition'],
  series:       ['introduction'],
  resume:       ['introduction'],
  enquire:      [],
  exhibition:   ['introduction', 'press_release', 'related_artwork_title', 'related_artist'],
  fair:         ['press_release', 'related_artwork_title', 'related_artist'],
  ArtistContact: ['address'],   // socialMedia is Json, not array
  users:        [],
};

/**
 * Helper function to check if a field is an array field
 * @param {string} model - Model name
 * @param {string} field - Field name
 * @returns {boolean} - Whether field is an array
 */
export const isArrayField = (model, field) => {
  return ARRAY_FIELDS[model?.toLowerCase()]?.includes(field) || false;
};