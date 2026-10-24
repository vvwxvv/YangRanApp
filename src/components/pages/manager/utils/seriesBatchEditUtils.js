// seriesBatchEditUtils.js
// Utilities for Series model (Prisma)
// Fields:
//   id, cover_img_url, artist, title, type, medium, year, caption,
//   credits, special_thanks, introduction[], order, mark, tag[], language, updatedAt

import { exportToCSV } from "@/components/pages/manager/utils/batchEditCommonUtils";

// Small helper: coerce string / array → array
const toArray = (v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    return v.split(/[;,]\s*/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

// ── normalizeSeriesRow ─────────────────────────────────────────────
export function normalizeSeriesRow(raw = {}) {
  return {
    id:  raw.id  ?? raw._id ?? `temp_${Date.now()}_${Math.random()}`,
    _id: raw._id ?? raw.id  ?? null,
    isNew: raw.isNew ?? false,

    cover_img_url: raw.cover_img_url ?? "",
    artist:   raw.artist   ?? "",
    title:    raw.title    ?? "",
    type:     raw.type     ?? "",
    medium:   raw.medium   ?? "",
    year:     raw.year     ?? "",
    caption:  raw.caption  ?? "",
    credits:  raw.credits  ?? "",
    special_thanks: raw.special_thanks ?? "",

    introduction: toArray(raw.introduction),

    order:    raw.order    ?? "",
    mark:     raw.mark     ?? "",        //  Prisma String?
    tag:      toArray(raw.tag),          //  Prisma String[]
    language: raw.language ?? "",        //  (was missing)
    updatedAt: raw.updatedAt ?? "",      //  (was missing)
  };
}

// ── getSeriesFieldGroups ──────────────────────────────────────────
export const getSeriesFieldGroups = (isCn) => {
  const groupKeyLabels = {
    basic:  isCn ? "基本信息" : "Basic Info",
    content: isCn ? "内容"   : "Content",
    credits: isCn ? "鸣谢"   : "Credits",
    introduction: isCn ? "引言" : "Introduction",
    meta:   isCn ? "元数据"   : "Metadata",
  };

  return {
    basic:    ["artist", "title", "type", "medium", "year"],
    content:  ["caption"],
    credits:  ["credits", "special_thanks"],
    introduction: ["introduction"],
    meta:     ["order", "mark", "tag", "language"],   //  tag (+ mark/language) added
    groupKeyLabels,
  };
};

// ── getSeriesSchemaFields ─────────────────────────────────────────
export const getSeriesSchemaFields = () => [
  { name: "cover_img_url", labelKey: "coverImgUrl", label: "Cover Image URL" },
  { name: "artist",   labelKey: "artist",   label: "Artist"          },
  { name: "title",    labelKey: "title",    label: "Title"           },
  { name: "type",     labelKey: "type",     label: "Type"            },
  { name: "medium",   labelKey: "medium",   label: "Medium"          },
  { name: "year",     labelKey: "year",     label: "Year"            },
  { name: "caption",  labelKey: "caption",  label: "Caption"         },
  { name: "credits",  labelKey: "credits",  label: "Credits"         },
  { name: "special_thanks", labelKey: "specialThanks", label: "Special Thanks" },
  { name: "introduction", labelKey: "introduction", label: "Introduction" },
  { name: "order",    labelKey: "order",    label: "Order"           },
  { name: "mark",     labelKey: "mark",     label: "Mark"            },   //  added
  { name: "tag",      labelKey: "tag",      label: "Tag"             },   //  added
  { name: "language", labelKey: "language", label: "Language"        },   //  added
];

// ── getSeriesFieldTypes ───────────────────────────────────────────
export const getSeriesFieldTypes = () => ({
  arrayFields:     ["introduction", "tag"],   //  tag added
  multilineFields: ["caption", "credits", "special_thanks"],
});

// ── exportSeriesToCSV ──────────────────────────────────────────────
export const exportSeriesToCSV = (data, filename) => {
  const headers = [
    "cover_img_url",
    "artist",
    "title",
    "type",
    "medium",
    "year",
    "caption",
    "credits",
    "special_thanks",
    "introduction",
    "order",
    "mark",        //  added
    "tag",         //  added
    "language",    //  added
  ];

  // Convert array fields to semicolon‑separated strings for CSV readability
  const arrayFields = ["introduction", "tag"];   //  tag added
  const exportData = data.map((item) => {
    const record = { ...item };
    for (const field of arrayFields) {
      if (Array.isArray(record[field])) {
        record[field] = record[field].join("; ");
      } else if (record[field] && typeof record[field] !== "string") {
        record[field] = String(record[field]);
      }
    }
    return record;
  });

  exportToCSV(exportData, headers, filename || `series_${new Date().toISOString().slice(0, 10)}.csv`);
};