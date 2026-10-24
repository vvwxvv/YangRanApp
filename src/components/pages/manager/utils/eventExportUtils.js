import { getMarkValue } from "@/utils/mediaMarks";
/**
 * Event Export Utilities
 * Handles data formatting and export for Event entities
 * Matches Moodsea Event Prisma model fields
 */

/**
 * Formats event data for CSV/Excel export with proper field mapping
 * Based on Moodsea Event Prisma model
 * 
 * @param {Array} events - Array of event objects
 * @param {boolean} isCn - Whether to use Chinese labels
 * @returns {Array} Formatted data ready for export
 */
export function formatEventDataForCSV(events, isCn = false) {
  if (!Array.isArray(events) || events.length === 0) {
    return [];
  }

  // Field mappings matching Moodsea Event Prisma model (all fields)
  const fieldMappings = {
    cover_img_url: isCn ? '封面图片链接' : 'Cover Image URL',
    title: isCn ? '标题' : 'Title',
    subtitle: isCn ? '副标题' : 'Subtitle',
    year: isCn ? '年份' : 'Year',
    date_time: isCn ? '日期时间' : 'Date & Time',
    type: isCn ? '类型' : 'Type',
    host: isCn ? '主办方' : 'Host',
    support: isCn ? '支持单位' : 'Support',
    special_thanks: isCn ? '特别鸣谢' : 'Special Thanks',
    venue: isCn ? '场地' : 'Venue',
    address: isCn ? '地址' : 'Address',
    caption: isCn ? '说明' : 'Caption',
    introduction: isCn ? '介绍' : 'Introduction',
    related_artist: isCn ? '相关艺术家' : 'Related Artists',
    web_url: isCn ? '网页链接' : 'Web URL',
    video_url: isCn ? '视频链接' : 'Video URL',
    mark: isCn ? '标记' : 'Mark',
    order: isCn ? '排序' : 'Order',
    language: isCn ? '语言' : 'Language',
    updatedAt: isCn ? '更新时间' : 'Updated At',
  };

  return events.map(event => {
    const formattedEvent = {};

    // Map each field with proper formatting
    Object.keys(fieldMappings).forEach(key => {
      const label = fieldMappings[key];
      let value = event[key];
      
      // Handle special formatting for specific fields
      switch (key) {
        case 'introduction':
          // Handle String[] array - join with double newlines
          if (Array.isArray(value)) {
            value = value.join('\n\n');
          } else {
            value = '';
          }
          break;
          
        case 'related_artist':
          // Handle String[] array - join with commas
          if (Array.isArray(value)) {
            value = value.join(', ');
          } else {
            value = '';
          }
          break;
          
        case 'updatedAt':
          // Format DateTime field
          if (value) {
            try {
              const date = new Date(value);
              value = date.toISOString().split('T')[0] + ' ' + 
                      date.toTimeString().split(' ')[0];
            } catch (e) {
              value = '';
            }
          } else {
            value = '';
          }
          break;
          
        default:
          // Handle null/undefined values
          value = value !== null && value !== undefined ? value : '';
      }
      
      formattedEvent[label] = value;
    });

    return formattedEvent;
  });
}

/**
 * Creates a comprehensive event export with all available fields
 * @param {Array} events - Array of event objects
 * @param {boolean} isCn - Whether to use Chinese labels
 * @returns {Array} Comprehensive formatted data
 */
export function createComprehensiveEventExport(events, isCn = false) {
  return formatEventDataForCSV(events, isCn);
}

/**
 * Creates a simplified event export with essential fields only
 * Based on Moodsea Event Prisma model essential fields
 * @param {Array} events - Array of event objects
 * @param {boolean} isCn - Whether to use Chinese labels
 * @returns {Array} Simplified formatted data
 */
export function createSimplifiedEventExport(events, isCn = false) {
  if (!Array.isArray(events) || events.length === 0) {
    return [];
  }

  // Essential fields from Moodsea Event Prisma model
  const essentialFields = {
    title: isCn ? '标题' : 'Title',
    year: isCn ? '年份' : 'Year',
    subtitle: isCn ? '副标题' : 'Subtitle',
    date_time: isCn ? '日期时间' : 'Date & Time',
    type: isCn ? '类型' : 'Type',
    venue: isCn ? '场地' : 'Venue',
    language: isCn ? '语言' : 'Language',
    updatedAt: isCn ? '更新时间' : 'Updated At',
  };

  return events.map(event => {
    const simplifiedEvent = {};

    Object.keys(essentialFields).forEach(key => {
      const label = essentialFields[key];
      let value = event[key];
      
      switch (key) {
        case 'updatedAt':
          if (value) {
            try {
              const date = new Date(value);
              value = date.toISOString().split('T')[0];
            } catch (e) {
              value = '';
            }
          } else {
            value = '';
          }
          break;
          
        default:
          value = value || '';
      }
      
      simplifiedEvent[label] = value;
    });

    return simplifiedEvent;
  });
}

/**
 * Creates a content-focused export with full text content
 * Based on Moodsea Event Prisma model content fields
 * @param {Array} events - Array of event objects
 * @param {boolean} isCn - Whether to use Chinese labels
 * @returns {Array} Content-focused formatted data
 */
export function createContentFocusedEventExport(events, isCn = false) {
  if (!Array.isArray(events) || events.length === 0) {
    return [];
  }

  // Content-focused fields from Moodsea Event Prisma model
  const contentFields = {
    title: isCn ? '标题' : 'Title',
    caption: isCn ? '说明' : 'Caption',
    introduction: isCn ? '介绍' : 'Introduction',
    language: isCn ? '语言' : 'Language',
  };

  return events.map(event => {
    const contentFocusedEvent = {};

    Object.keys(contentFields).forEach(key => {
      const label = contentFields[key];
      let value = event[key];
      
      switch (key) {
        case 'introduction':
          // Handle String[] array - join with double newlines
          value = Array.isArray(value) ? value.join('\n\n') : '';
          break;
          
        default:
          value = value || '';
      }
      
      contentFocusedEvent[label] = value;
    });

    return contentFocusedEvent;
  });
}

/**
 * Creates a location-focused export with venue and address details
 * Based on Moodsea Event Prisma model location fields
 * @param {Array} events - Array of event objects
 * @param {boolean} isCn - Whether to use Chinese labels
 * @returns {Array} Location-focused formatted data
 */
export function createLocationFocusedEventExport(events, isCn = false) {
  if (!Array.isArray(events) || events.length === 0) {
    return [];
  }

  // Location-focused fields from Moodsea Event Prisma model
  const locationFields = {
    title: isCn ? '标题' : 'Title',
    venue: isCn ? '场地' : 'Venue',
    address: isCn ? '地址' : 'Address',
    year: isCn ? '年份' : 'Year',
    date_time: isCn ? '日期时间' : 'Date & Time',
  };

  return events.map(event => {
    const locationFocusedEvent = {};

    Object.keys(locationFields).forEach(key => {
      const label = locationFields[key];
      const value = event[key] || '';
      locationFocusedEvent[label] = value;
    });

    return locationFocusedEvent;
  });
}

/**
 * Creates a metadata-only export without content arrays
 * Based on Moodsea Event Prisma model metadata fields
 * @param {Array} events - Array of event objects
 * @param {boolean} isCn - Whether to use Chinese labels
 * @returns {Array} Metadata-focused formatted data
 */
export function createMetadataEventExport(events, isCn = false) {
  if (!Array.isArray(events) || events.length === 0) {
    return [];
  }

  // Metadata fields from Moodsea Event Prisma model (excludes arrays)
  const metadataFields = {
    cover_img_url: isCn ? '封面图片链接' : 'Cover Image URL',
    title: isCn ? '标题' : 'Title',
    subtitle: isCn ? '副标题' : 'Subtitle',
    year: isCn ? '年份' : 'Year',
    date_time: isCn ? '日期时间' : 'Date & Time',
    type: isCn ? '类型' : 'Type',
    host: isCn ? '主办方' : 'Host',
    support: isCn ? '支持单位' : 'Support',
    special_thanks: isCn ? '特别鸣谢' : 'Special Thanks',
    venue: isCn ? '场地' : 'Venue',
    address: isCn ? '地址' : 'Address',
    caption: isCn ? '说明' : 'Caption',
    web_url: isCn ? '网页链接' : 'Web URL',
    video_url: isCn ? '视频链接' : 'Video URL',
    mark: isCn ? '标记' : 'Mark',
    order: isCn ? '排序' : 'Order',
    language: isCn ? '语言' : 'Language',
    updatedAt: isCn ? '更新时间' : 'Updated At',
  };

  return events.map(event => {
    const metadataEvent = {};

    Object.keys(metadataFields).forEach(key => {
      const label = metadataFields[key];
      let value = event[key];
      
      switch (key) {
        case 'updatedAt':
          if (value) {
            try {
              const date = new Date(value);
              value = date.toISOString().split('T')[0] + ' ' + 
                      date.toTimeString().split(' ')[0];
            } catch (e) {
              value = '';
            }
          } else {
            value = '';
          }
          break;
          
        default:
          value = value || '';
      }
      
      metadataEvent[label] = value;
    });

    return metadataEvent;
  });
}

/**
 * Creates an event export grouped by year
 * Based on Moodsea Event Prisma model year field
 * @param {Array} events - Array of event objects
 * @param {boolean} isCn - Whether to use Chinese labels
 * @returns {Array} Formatted data grouped by year
 */
export function createGroupedByYearEventExport(events, isCn = false) {
  if (!Array.isArray(events) || events.length === 0) {
    return [];
  }

  // Group events by year
  const groupedEvents = events.reduce((acc, event) => {
    const year = event.year || (isCn ? '未知年份' : 'Unknown Year');
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(event);
    return acc;
  }, {});

  // Format grouped data
  const formattedData = [];
  Object.keys(groupedEvents).sort().reverse().forEach(year => {
    // Add year header
    formattedData.push({
      [isCn ? '年份' : 'Year']: year,
      [isCn ? '数量' : 'Count']: groupedEvents[year].length.toString()
    });

    // Add events for this year
    groupedEvents[year].forEach(event => {
      formattedData.push({
        [isCn ? '标题' : 'Title']: event.title || '',
        [isCn ? '副标题' : 'Subtitle']: event.subtitle || '',
        [isCn ? '日期时间' : 'Date & Time']: event.date_time || '',
        [isCn ? '场地' : 'Venue']: event.venue || '',
        [isCn ? '类型' : 'Type']: event.type || ''
      });
    });

    // Add empty row for separation
    formattedData.push({});
  });

  return formattedData;
}

/**
 * Creates an event export grouped by type
 * Based on Moodsea Event Prisma model type field
 * @param {Array} events - Array of event objects
 * @param {boolean} isCn - Whether to use Chinese labels
 * @returns {Array} Formatted data grouped by type
 */
export function createGroupedByTypeEventExport(events, isCn = false) {
  if (!Array.isArray(events) || events.length === 0) {
    return [];
  }

  // Group events by type
  const groupedEvents = events.reduce((acc, event) => {
    const type = event.type || (isCn ? '未分类' : 'Uncategorized');
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(event);
    return acc;
  }, {});

  // Format grouped data
  const formattedData = [];
  Object.keys(groupedEvents).sort().forEach(type => {
    // Add type header
    formattedData.push({
      [isCn ? '类型' : 'Type']: type,
      [isCn ? '数量' : 'Count']: groupedEvents[type].length.toString()
    });

    // Add events for this type
    groupedEvents[type].forEach(event => {
      formattedData.push({
        [isCn ? '标题' : 'Title']: event.title || '',
        [isCn ? '年份' : 'Year']: event.year || '',
        [isCn ? '日期时间' : 'Date & Time']: event.date_time || '',
        [isCn ? '场地' : 'Venue']: event.venue || ''
      });
    });

    // Add empty row for separation
    formattedData.push({});
  });

  return formattedData;
}

/**
 * Creates an event export grouped by host
 * Based on Moodsea Event Prisma model host field
 * @param {Array} events - Array of event objects
 * @param {boolean} isCn - Whether to use Chinese labels
 * @returns {Array} Formatted data grouped by host
 */
export function createGroupedByHostEventExport(events, isCn = false) {
  if (!Array.isArray(events) || events.length === 0) {
    return [];
  }

  // Group events by host
  const groupedEvents = events.reduce((acc, event) => {
    const host = event.host || (isCn ? '未知主办方' : 'Unknown Host');
    if (!acc[host]) {
      acc[host] = [];
    }
    acc[host].push(event);
    return acc;
  }, {});

  // Format grouped data
  const formattedData = [];
  Object.keys(groupedEvents).sort().forEach(host => {
    // Add host header
    formattedData.push({
      [isCn ? '主办方' : 'Host']: host,
      [isCn ? '数量' : 'Count']: groupedEvents[host].length.toString()
    });

    // Add events for this host
    groupedEvents[host].forEach(event => {
      formattedData.push({
        [isCn ? '标题' : 'Title']: event.title || '',
        [isCn ? '年份' : 'Year']: event.year || '',
        [isCn ? '场地' : 'Venue']: event.venue || '',
        [isCn ? '类型' : 'Type']: event.type || ''
      });
    });

    // Add empty row for separation
    formattedData.push({});
  });

  return formattedData;
}

/**
 * Get Event statistics for export
 * Based on Moodsea Event Prisma model fields
 * @param {Array} events - Array of event objects
 * @param {boolean} isCn - Whether to use Chinese labels
 * @returns {Object} Statistics object
 */
export function getEventStatistics(events, isCn = false) {
  if (!Array.isArray(events) || events.length === 0) {
    return {};
  }

  const stats = {
    total: events.length,
    byYear: {},
    byType: {},
    byVenue: {},
    byHost: {},
    byLanguage: {},
    withCoverImage: events.filter(e => e.cover_img_url).length,
    withCaption: events.filter(e => e.caption).length,
    withIntroduction: events.filter(e => e.introduction && e.introduction.length > 0).length,
    withRelatedArtist: events.filter(e => e.related_artist && e.related_artist.length > 0).length,
    withMark: events.filter(e => e.mark).length,
    withWebUrl: events.filter(e => e.web_url).length,
    withVideoUrl: events.filter(e => e.video_url).length,
  };

  // Count by year
  events.forEach(event => {
    const year = event.year || (isCn ? '未知年份' : 'Unknown Year');
    stats.byYear[year] = (stats.byYear[year] || 0) + 1;
  });

  // Count by type
  events.forEach(event => {
    const type = event.type || (isCn ? '未分类' : 'Uncategorized');
    stats.byType[type] = (stats.byType[type] || 0) + 1;
  });

  // Count by venue
  events.forEach(event => {
    const venue = event.venue || (isCn ? '未知场地' : 'Unknown Venue');
    stats.byVenue[venue] = (stats.byVenue[venue] || 0) + 1;
  });

  // Count by host
  events.forEach(event => {
    const host = event.host || (isCn ? '未知主办方' : 'Unknown Host');
    stats.byHost[host] = (stats.byHost[host] || 0) + 1;
  });

  // Count by language
  events.forEach(event => {
    const language = event.language || (isCn ? '未知语言' : 'Unknown Language');
    stats.byLanguage[language] = (stats.byLanguage[language] || 0) + 1;
  });

  return stats;
}

/**
 * Create a statistics export
 * Based on Moodsea Event Prisma model
 * @param {Array} events - Array of event objects
 * @param {boolean} isCn - Whether to use Chinese labels
 * @returns {Array} Statistics formatted for export
 */
export function createEventStatisticsExport(events, isCn = false) {
  const stats = getEventStatistics(events, isCn);

  if (!stats.total) {
    return [];
  }

  const formattedStats = [
    {
      [isCn ? '统计项' : 'Metric']: isCn ? '总数' : 'Total',
      [isCn ? '数值' : 'Value']: stats.total.toString()
    },
    {
      [isCn ? '统计项' : 'Metric']: isCn ? '包含封面图片' : 'With Cover Image',
      [isCn ? '数值' : 'Value']: stats.withCoverImage.toString()
    },
    {
      [isCn ? '统计项' : 'Metric']: isCn ? '包含说明' : 'With Caption',
      [isCn ? '数值' : 'Value']: stats.withCaption.toString()
    },
    {
      [isCn ? '统计项' : 'Metric']: isCn ? '包含介绍' : 'With Introduction',
      [isCn ? '数值' : 'Value']: stats.withIntroduction.toString()
    },
    {
      [isCn ? '统计项' : 'Metric']: isCn ? '包含相关艺术家' : 'With Related Artist',
      [isCn ? '数值' : 'Value']: stats.withRelatedArtist.toString()
    },
    {
      [isCn ? '统计项' : 'Metric']: isCn ? '包含标记' : 'With Mark',
      [isCn ? '数值' : 'Value']: stats.withMark.toString()
    },
    {
      [isCn ? '统计项' : 'Metric']: isCn ? '包含网页链接' : 'With Web URL',
      [isCn ? '数值' : 'Value']: stats.withWebUrl.toString()
    },
    {
      [isCn ? '统计项' : 'Metric']: isCn ? '包含视频链接' : 'With Video URL',
      [isCn ? '数值' : 'Value']: stats.withVideoUrl.toString()
    },
    {}
  ];

  // Add year breakdown
  formattedStats.push({
    [isCn ? '统计项' : 'Metric']: isCn ? '年份分布' : 'Year Distribution',
    [isCn ? '数值' : 'Value']: ''
  });

  Object.keys(stats.byYear).sort().reverse().forEach(year => {
    formattedStats.push({
      [isCn ? '统计项' : 'Metric']: `  ${year}`,
      [isCn ? '数值' : 'Value']: stats.byYear[year].toString()
    });
  });

  formattedStats.push({});

  // Add type breakdown
  formattedStats.push({
    [isCn ? '统计项' : 'Metric']: isCn ? '类型分布' : 'Type Distribution',
    [isCn ? '数值' : 'Value']: ''
  });

  Object.keys(stats.byType).sort().forEach(type => {
    formattedStats.push({
      [isCn ? '统计项' : 'Metric']: `  ${type}`,
      [isCn ? '数值' : 'Value']: stats.byType[type].toString()
    });
  });

  formattedStats.push({});

  // Add host breakdown
  formattedStats.push({
    [isCn ? '统计项' : 'Metric']: isCn ? '主办方分布' : 'Host Distribution',
    [isCn ? '数值' : 'Value']: ''
  });

  Object.keys(stats.byHost).sort().forEach(host => {
    formattedStats.push({
      [isCn ? '统计项' : 'Metric']: `  ${host}`,
      [isCn ? '数值' : 'Value']: stats.byHost[host].toString()
    });
  });

  return formattedStats;
}

/**
 * Normalizes a row for Event data (matches Moodsea Prisma model)
 * @param {Object} row - Raw event data row
 * @returns {Object} Normalized event object
 */
export const normalizeRow = (row) => {
  let mongoId = row._id?.$oid || row._id || row.id;
  if (mongoId && typeof mongoId === "object") {
    mongoId = mongoId.$oid || JSON.stringify(mongoId);
  }

  return {
    id: mongoId ? String(mongoId) : `temp_${Date.now()}_${Math.random()}`,
    _id: mongoId,
    cover_img_url: row.cover_img_url || "",
    title: row.title || "",
    subtitle: row.subtitle || "",
    year: row.year || "",
    date_time: row.date_time || "",
    type: row.type || "",
    host: row.host || "",
    support: row.support || "",
    special_thanks: row.special_thanks || "",
    venue: row.venue || "",
    address: row.address || "",
    caption: row.caption || "",
    introduction: Array.isArray(row.introduction) ? row.introduction : (row.introduction ? [row.introduction] : []),
    related_artist: Array.isArray(row.related_artist) ? row.related_artist : (row.related_artist ? [row.related_artist] : []),
    web_url: row.web_url || "",
    video_url: row.video_url || "",
    mark: getMarkValue(row) || "",
    order: row.order || "",
    language: row.language || "",
    updatedAt: row.updatedAt || new Date().toISOString(),
    isNew: row.isNew || false,
  };
};
