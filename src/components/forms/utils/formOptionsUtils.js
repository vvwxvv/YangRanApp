import { FORM_TYPE_OPTIONS as formTypesData } from '@/utils/siteMetaDefaults';

/**
 * Field-level option lists for the manager forms (language, boolean, per-entity
 * filter / sort / form options).
 *
 * These used to live in `src/data/form_options.json`; they are inlined here so
 * there is one module to import and no loose data file to keep in sync.
 * Site settings (title, footer, menus, SEO, form *types*) live in the Meta
 * document — see `@/utils/siteMetaDefaults`.
 */
export const FORM_FIELD_OPTIONS = {
    "artwork": {
      "filterOptions": {
        "type": [
          {
            "id": "artwork_painting",
            "value": "painting",
            "label_en": "Painting",
            "label_cn": "绘画"
          },
          {
            "id": "artwork_sculpture",
            "value": "sculpture",
            "label_en": "Sculpture",
            "label_cn": "雕塑"
          },
          {
            "id": "artwork_installation",
            "value": "installation",
            "label_en": "Installation",
            "label_cn": "装置"
          },
          {
            "id": "artwork_photography",
            "value": "photography",
            "label_en": "Photography",
            "label_cn": "摄影"
          },
          {
            "id": "artwork_video",
            "value": "video",
            "label_en": "Video",
            "label_cn": "录像"
          },
          {
            "id": "artwork_moving_images",
            "value": "moving_images",
            "label_en": "Moving Images",
            "label_cn": "影像"
          },
          {
            "id": "artwork_drawing",
            "value": "drawing",
            "label_en": "Drawing",
            "label_cn": "素描"
          },
          {
            "id": "artwork_printmaking",
            "value": "printmaking",
            "label_en": "Printmaking",
            "label_cn": "版画"
          },
          {
            "id": "artwork_mixed_media",
            "value": "mixed_media",
            "label_en": "Mixed Media",
            "label_cn": "综合材料"
          },
          {
            "id": "artwork_other",
            "value": "other",
            "label_en": "Other",
            "label_cn": "其他"
          }
        ],
        "year": [],
        "series": [],
        "artist": [],
        "medium": []
      },
      "formOptions": {
        "sold": [
          {
            "id": "sold_yes",
            "value": true,
            "label_en": "Yes",
            "label_cn": "是"
          },
          {
            "id": "sold_no",
            "value": false,
            "label_en": "No",
            "label_cn": "否"
          }
        ],
        "work_value": [],
        "duration": [],
        "size": []
      },
      "sortOptions": {
        "title": {
          "id": "sort_title",
          "label_en": "Sort by Title",
          "label_cn": "按标题排序",
          "defaultOrder": "asc"
        },
        "year": {
          "id": "sort_year",
          "label_en": "Sort by Year",
          "label_cn": "按年份排序",
          "defaultOrder": "desc"
        },
        "artist": {
          "id": "sort_artist",
          "label_en": "Sort by Artist",
          "label_cn": "按艺术家排序",
          "defaultOrder": "asc"
        },
        "type": {
          "id": "sort_type",
          "label_en": "Sort by Type",
          "label_cn": "按类型排序",
          "defaultOrder": "asc"
        },
        "order": {
          "id": "sort_order",
          "label_en": "Sort by Order",
          "label_cn": "按顺序排序",
          "defaultOrder": "asc"
        }
      }
    },
    "image": {
      "filterOptions": {
        "type": [
          {
            "id": "image_artist_portrait",
            "value": "artist_portrait",
            "label_en": "Artist Portrait",
            "label_cn": "艺术家肖像"
          },
          {
            "id": "image_photography",
            "value": "photography",
            "label_en": "Photography",
            "label_cn": "摄影作品"
          },
          {
            "id": "image_artwork_image",
            "value": "artwork_image",
            "label_en": "Artwork Image",
            "label_cn": "作品图片"
          },
          {
            "id": "image_artwork_detail",
            "value": "artwork_detail",
            "label_en": "Artwork Detail Image",
            "label_cn": "作品局部图片"
          },
          {
            "id": "image_exhibition_view",
            "value": "exhibition_view",
            "label_en": "Exhibition View",
            "label_cn": "展览现场"
          },
          {
            "id": "image_poster",
            "value": "poster",
            "label_en": "Poster Image",
            "label_cn": "海报图片"
          },
          {
            "id": "image_sketch",
            "value": "sketch",
            "label_en": "Sketch",
            "label_cn": "草图"
          },
          {
            "id": "image_performance",
            "value": "performance",
            "label_en": "Performance",
            "label_cn": "表演现场"
          },
          {
            "id": "image_concept",
            "value": "concept",
            "label_en": "Concept",
            "label_cn": "概念图"
          }
        ]
      },
      "formOptions": {
        "tag_source": [
          {
            "id": "tag_artist",
            "value": "artist",
            "label_en": "Artist",
            "label_cn": "艺术家"
          },
          {
            "id": "tag_artwork",
            "value": "artwork",
            "label_en": "Artwork",
            "label_cn": "作品"
          },
          {
            "id": "tag_exhibition",
            "value": "exhibition",
            "label_en": "Exhibition",
            "label_cn": "展览"
          },
          {
            "id": "tag_other",
            "value": "other",
            "label_en": "Other",
            "label_cn": "其他"
          }
        ]
      }
    },
    "video": {
      "filterOptions": {
        "type": [
          {
            "id": "video_documentary",
            "value": "documentary",
            "label_en": "Documentary",
            "label_cn": "纪录片"
          },
          {
            "id": "video_short_film",
            "value": "short_film",
            "label_en": "Short Film",
            "label_cn": "短片"
          },
          {
            "id": "video_feature_film",
            "value": "feature_film",
            "label_en": "Feature Film",
            "label_cn": "故事片"
          },
          {
            "id": "video_animation",
            "value": "animation",
            "label_en": "Animation",
            "label_cn": "动画"
          },
          {
            "id": "video_experimental",
            "value": "experimental",
            "label_en": "Experimental",
            "label_cn": "实验"
          },
          {
            "id": "video_performance",
            "value": "performance",
            "label_en": "Performance",
            "label_cn": "表演"
          },
          {
            "id": "video_installation",
            "value": "installation",
            "label_en": "Installation",
            "label_cn": "装置"
          },
          {
            "id": "video_other",
            "value": "other",
            "label_en": "Other",
            "label_cn": "其他"
          }
        ]
      }
    },
    "event": {
      "filterOptions": {
        "type": [
          {
            "id": "event_group_exhibition",
            "value": "group_exhibition",
            "label_en": "Group Exhibition",
            "label_cn": "群展"
          },
          {
            "id": "event_solo_exhibition",
            "value": "solo_exhibition",
            "label_en": "Solo Exhibition",
            "label_cn": "个展"
          },
          {
            "id": "event_art_fair",
            "value": "art_fair",
            "label_en": "Art Fair",
            "label_cn": "艺博会"
          },
          {
            "id": "event_project",
            "value": "project",
            "label_en": "Project",
            "label_cn": "项目"
          },
          {
            "id": "event_performance",
            "value": "performance",
            "label_en": "Performance",
            "label_cn": "表演"
          },
          {
            "id": "event_artist_talk",
            "value": "artist_talk",
            "label_en": "Artist Talk",
            "label_cn": "艺术家讲座"
          },
          {
            "id": "event_screening",
            "value": "screening",
            "label_en": "Screening",
            "label_cn": "放映"
          },
          {
            "id": "event_workshop",
            "value": "workshop",
            "label_en": "Workshop",
            "label_cn": "工作坊"
          },
          {
            "id": "event_artist_residency",
            "value": "artist_residency",
            "label_en": "Artist Residency",
            "label_cn": "驻地"
          }
        ],
        "year": [],
        "country": [],
        "city": []
      }
    },
    "about": {
      "filterOptions": {
        "type": [
          {
            "id": "about_biography",
            "value": "biography",
            "label_en": "Artist Biography",
            "label_cn": "艺术家简介"
          },
          {
            "id": "about_statement",
            "value": "statement",
            "label_en": "Artist Statement",
            "label_cn": "艺术家陈述"
          },
          {
            "id": "about_cv",
            "value": "cv",
            "label_en": "CV/Resume",
            "label_cn": "简历"
          },
          {
            "id": "about_exhibition_history",
            "value": "exhibition_history",
            "label_en": "Exhibition History",
            "label_cn": "展览经历"
          },
          {
            "id": "about_awards",
            "value": "awards",
            "label_en": "Awards & Recognition",
            "label_cn": "奖项与认可"
          },
          {
            "id": "about_publications",
            "value": "publications",
            "label_en": "Publications",
            "label_cn": "出版物"
          },
          {
            "id": "about_collections",
            "value": "collections",
            "label_en": "Collections",
            "label_cn": "收藏"
          },
          {
            "id": "about_education",
            "value": "education",
            "label_en": "Education",
            "label_cn": "教育背景"
          },
          {
            "id": "about_other",
            "value": "other",
            "label_en": "Other",
            "label_cn": "其他"
          }
        ]
      }
    },
    "common": {
      "language": [
        {
          "id": "lang_en",
          "value": "EN",
          "label_en": "English",
          "label_cn": "英文"
        },
        {
          "id": "lang_cn",
          "value": "CN",
          "label_en": "Chinese",
          "label_cn": "中文"
        }
      ],
      "mark": [
        {
          "id": "mark_slider",
          "value": "Slider",
          "label_en": "Slider",
          "label_cn": "轮播"
        },
        {
          "id": "mark_private",
          "value": "Private",
          "label_en": "Private",
          "label_cn": "私密"
        },
        {
          "id": "mark_feature",
          "value": "Feature",
          "label_en": "Feature",
          "label_cn": "精选"
        },
        {
          "id": "mark_none",
          "value": "",
          "label_en": "None",
          "label_cn": "无"
        }
      ],
      "boolean": [
        {
          "id": "bool_yes",
          "value": true,
          "label_en": "Yes",
          "label_cn": "是"
        },
        {
          "id": "bool_no",
          "value": false,
          "label_en": "No",
          "label_cn": "否"
        }
      ],
      "publishStatus": [
        {
          "id": "status_draft",
          "value": "draft",
          "label_en": "Draft",
          "label_cn": "草稿"
        },
        {
          "id": "status_published",
          "value": "published",
          "label_en": "Published",
          "label_cn": "已发布"
        },
        {
          "id": "status_archived",
          "value": "archived",
          "label_en": "Archived",
          "label_cn": "已归档"
        }
      ]
    }
  };

const formOptionsData = FORM_FIELD_OPTIONS;
const webTypes = formTypesData.web || [];
const languageOptions = formOptionsData.common?.language || [];
const publishStatusOptions = formOptionsData.common?.publishStatus || [];

// Export functions and constants
export const getFormTypes = (entityType) => formTypesData[entityType] || [];
export const getFormFieldOptions = (entityType, field, language = 'en') => {
  const opts =
    formOptionsData[entityType]?.formOptions?.[field] ||
    formOptionsData[entityType]?.filterOptions?.[field] ||
    formOptionsData.common?.[field] ||
    [];
  return opts.map(o => ({
    id: o.id,
    value: o.value,
    label: language === 'cn' ? o.label_cn : o.label_en
  }));
};
export const getTypeOptions = (entityType, language = 'en') => {
  const types = getFormTypes(entityType);
  return types.map(t => ({
    id: t.id,
    value: t.value,
    label: (language === 'cn' && t.label_cn) ? t.label_cn : (t.label_en || t.label || t.value)
  }));
};
export const getBooleanOptions = (language = 'en') =>
  (formOptionsData.common?.boolean || []).map(o => ({
    id: o.id,
    value: o.value,
    label: language === 'cn' ? o.label_cn : o.label_en
  }));

export const getLanguageOptions = (language = 'en') => {
  return languageOptions.map((o, idx) => ({
    id: o.id ?? idx + 1,
    value: o.value,
    label: language === 'cn' ? o.label_cn : o.label_en
  }));
};

// Category option lists. Schema-specific forms may override these, but the
// shared helpers still need a local fallback so `getCategoryOptions()` never
// references an undefined binding at runtime.
const writingCategories = [
  { value: 'article', label_en: 'Article', label_cn: '文章' },
  { value: 'essay', label_en: 'Essay', label_cn: '随笔' },
  { value: 'blog', label_en: 'Blog', label_cn: '博客' },
  { value: 'review', label_en: 'Review', label_cn: '评论' },
  { value: 'tutorial', label_en: 'Tutorial', label_cn: '教程' },
  { value: 'news', label_en: 'News', label_cn: '新闻' },
  { value: 'other', label_en: 'Other', label_cn: '其他' },
];

export const getCategoryOptions = (entityType, lang = 'EN') => {
  const list = { writing: writingCategories }[entityType] || [];
  const useCn = lang.toUpperCase() === 'CN';
  return list.map(c => ({ value: c.value, label: useCn ? c.label_cn : c.label_en }));
};

export const getPublishStatusOptions = (lang = 'EN') => {
  const useCn = lang.toUpperCase() === 'CN';
  return publishStatusOptions.map(s => ({ value: s.value, label: useCn ? s.label_cn : s.label_en }));
};

// Updated getFormTypeByValue function
export const getFormTypeByValue = (value) => {
  // Ensure formTypesData is loaded and contains the "type" schema
  const allTypes = Object.values(formTypesData).flat(); // Flatten all types from the JSON
  const matchedType = allTypes.find((type) => type.value === value);

  // Return the label if found, otherwise return a default message
  return matchedType ? matchedType.label_en : 'Unknown Form Type';
};

// Export constants
export { languageOptions, webTypes };

// Default export
export default {
  getFormTypes,
  getFormFieldOptions,
  getTypeOptions,
  getBooleanOptions,
  getLanguageOptions,
  getCategoryOptions,
  getPublishStatusOptions,
  languageOptions,
  webTypes,
  getFormTypeByValue, // Add this to the export
};
