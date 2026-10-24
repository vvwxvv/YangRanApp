// artworkBatchEditUtils.js
// Utilities for Artwork model (Prisma) including related_exhibition and tag
// Fields:
//   id, cover_img_url, related_exhibition, artist, title, type, medium,
//   year, size, series, caption, duration, credits, special_thanks, introduction[],
//   venue, country, video_url, web_url, work_value, sold, order, mark, tag[], language, updatedAt

import { exportToCSV } from "@/components/pages/manager/utils/batchEditCommonUtils";
import { normalizeArtworkOrder } from "@/utils/artworkOrder";

// ── normalizeRow ──────────────────────────────────────────────────────────
export function normalizeRow(raw = {}) {
  // Normalize related_exhibition: ensure array
  let relatedGallery = raw.related_exhibition;
  if (Array.isArray(relatedGallery)) {
    // keep as is
  } else if (typeof relatedGallery === "string" && relatedGallery.trim() !== "") {
    // If it's a string, split by common delimiters (; or ,) -> fallback to single item
    relatedGallery = relatedGallery.split(/[;,]\s*/).filter(Boolean);
  } else {
    relatedGallery = [];
  }

  // Normalize tag: ensure array (Prisma String[])
  let tag = raw.tag;
  if (Array.isArray(tag)) {
    // keep as is
  } else if (typeof tag === "string" && tag.trim() !== "") {
    tag = tag.split(/[;,]\s*/).map((t) => t.trim()).filter(Boolean);
  } else {
    tag = [];
  }

  return {
    id:  raw.id  ?? raw._id ?? `temp_${Date.now()}_${Math.random()}`,
    _id: raw._id ?? raw.id  ?? null,
    isNew: raw.isNew ?? false,

    cover_img_url:  raw.cover_img_url  ?? "",
    artist:         raw.artist         ?? "",
    title:          raw.title          ?? "",
    type:           raw.type           ?? "",
    medium:         raw.medium         ?? "",
    year:           raw.year           ?? "",
    size:           raw.size           ?? "",
    series:         raw.series         ?? "",
    caption:        raw.caption        ?? "",
    duration:       raw.duration       ?? "",
    credits:        raw.credits        ?? "",
    special_thanks: raw.special_thanks ?? "",

    introduction: Array.isArray(raw.introduction)
      ? raw.introduction
      : raw.introduction
        ? [raw.introduction]
        : [],

    related_exhibition: relatedGallery,

    video_url:  raw.video_url  ?? "",
    web_url:    raw.web_url    ?? "",
    work_value: raw.work_value ?? "",
    sold:       raw.sold       ?? "",
    // `order` is a JSON object — accept an object, or the three flat CSV
    // columns ("order.artist_page_order" / artist_page_order …).
    order: normalizeArtworkOrder(
      raw.order && typeof raw.order === "object"
        ? raw.order
        : {
            artist_page_order: raw["order.artist_page_order"] ?? raw.artist_page_order,
            exhibition_page_order: raw["order.exhibition_page_order"] ?? raw.exhibition_page_order,
            art_fair_page_order: raw["order.art_fair_page_order"] ?? raw.art_fair_page_order,
          }
    ),
    mark:     raw.mark     ?? null,
    tag,                                            //  Prisma String[]
    language: raw.language ?? "",
  };
}

// ── getArtworkFieldGroups ─────────────────────────────────────────────────
export const getArtworkFieldGroups = (isCn) => {
  const groupKeyLabels = {
    core:           isCn ? "核心信息" : "Core Info",
    content:        isCn ? "内容"     : "Content",
    details:        isCn ? "作品详情" : "Artwork Details",
    links:          isCn ? "链接"     : "Links",
    classification: isCn ? "分类"     : "Classification",
  };

  return {
    core:           ["artist", "title", "cover_img_url"],
    content:        ["introduction", "caption", "credits", "special_thanks"],
    details:        [
      "type", "medium", "year", "size", "series", "duration",
      "work_value", "sold", "related_exhibition"
    ],
    links:          ["video_url", "web_url"],
    classification: [
      "language",
      "tag",                                    //  added
      "order.artist_page_order",
      "order.exhibition_page_order",
      "order.art_fair_page_order",
    ],
    groupKeyLabels,
  };
};

// ── getArtworkSchemaFields ────────────────────────────────────────────────
export const getArtworkSchemaFields = () => [
  { name: "cover_img_url",  labelKey: "coverImageUrl",  label: "Cover Image URL"  },
  { name: "artist",         labelKey: "artist",         label: "Artist"           },
  { name: "title",          labelKey: "title",          label: "Title"            },
  { name: "type",           labelKey: "type",           label: "Type"             },
  { name: "medium",         labelKey: "medium",         label: "Medium"           },
  { name: "year",           labelKey: "year",           label: "Year"             },
  { name: "size",           labelKey: "size",           label: "Size"             },
  { name: "series",         labelKey: "series",         label: "Series"           },
  { name: "caption",        labelKey: "caption",        label: "Caption"          },
  { name: "duration",       labelKey: "duration",       label: "Duration"         },
  { name: "credits",        labelKey: "credits",        label: "Credits"          },
  { name: "special_thanks", labelKey: "specialThanks",  label: "Special Thanks"   },
  { name: "introduction",   labelKey: "introduction",   label: "Introduction"     },
  { name: "related_exhibition", labelKey: "relatedGallery", label: "Related Gallery/Exhibition" },
  { name: "video_url",      labelKey: "videoUrl",       label: "Video URL"        },
  { name: "web_url",        labelKey: "webUrl",         label: "Web URL"          },
  { name: "work_value",     labelKey: "workValue",      label: "Work Value"       },
  { name: "sold",           labelKey: "sold",           label: "Sold"             },
  { name: "tag",            labelKey: "tag",            label: "Tag"              }, //  added
  { name: "order.artist_page_order",     labelKey: "order.artist_page_order",     label: "Artist Page Order" },
  { name: "order.exhibition_page_order", labelKey: "order.exhibition_page_order", label: "Exhibition Page Order" },
  { name: "order.art_fair_page_order",   labelKey: "order.art_fair_page_order",   label: "Art Fair Page Order" },
  { name: "language",       labelKey: "language",       label: "Language"         },
];

// ── getArtworkFieldTypes ──────────────────────────────────────────────────
export const getArtworkFieldTypes = () => ({
  arrayFields:     ["introduction", "related_exhibition", "tag"],   //  added tag
  multilineFields: ["caption", "credits", "special_thanks"],
});

// ── exportArtworkToCSV ────────────────────────────────────────────────────
export const exportArtworkToCSV = (data, filename) => {
  const headers = [
    "cover_img_url",
    "artist",
    "title",
    "type",
    "medium",
    "year",
    "size",
    "series",
    "caption",
    "duration",
    "credits",
    "special_thanks",
    "introduction",
    "related_exhibition",
    "video_url",
    "web_url",
    "work_value",
    "sold",
    "tag",                          //  added
    "order.artist_page_order",
    "order.exhibition_page_order",
    "order.art_fair_page_order",
    "language",
  ];

  // Convert array fields to semicolon‑separated strings for CSV readability
  const arrayFields = ["introduction", "related_exhibition", "tag"];   //  added tag
  const exportData = data.map((item) => {
    const record = { ...item };
    for (const field of arrayFields) {
      if (Array.isArray(record[field])) {
        record[field] = record[field].join("; ");
      } else if (record[field] && typeof record[field] !== "string") {
        record[field] = String(record[field]);
      }
    }
    // Flatten the JSON `order` into the three flat columns.
    const o = normalizeArtworkOrder(item?.order);
    record["order.artist_page_order"] = o.artist_page_order;
    record["order.exhibition_page_order"] = o.exhibition_page_order;
    record["order.art_fair_page_order"] = o.art_fair_page_order;
    delete record.order;
    return record;
  });

  exportToCSV(exportData, headers, filename || `artwork_${new Date().toISOString().slice(0, 10)}.csv`);
};