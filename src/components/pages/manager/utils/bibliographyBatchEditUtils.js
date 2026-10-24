// bibliographyBatchEditUtils.js
// Utilities for Bibliography model (Prisma)
// Fields:
//   id, related_exhibition, title, subtitle, cover_img_url, author,
//   type, year, date, published_at, pdf_url, web_url, video_url, order, updatedAt

import { exportToCSV } from "@/components/pages/manager/utils/batchEditCommonUtils";

// ── normalizeBibliographyRow ─────────────────────────────────────────────
export function normalizeBibliographyRow(raw = {}) {
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

  return {
    id:  raw.id  ?? raw._id ?? `temp_${Date.now()}_${Math.random()}`,
    _id: raw._id ?? raw.id  ?? null,
    isNew: raw.isNew ?? false,

    title:    raw.title    ?? "",
    subtitle: raw.subtitle ?? "",
    cover_img_url: raw.cover_img_url ?? "",
    author:   raw.author   ?? "",
    type:     raw.type     ?? "",
    year:     raw.year     ?? "",
    date:     raw.date     ?? "",
    published_at: raw.published_at ?? "",

    pdf_url:  raw.pdf_url  ?? "",
    web_url:  raw.web_url  ?? "",
    video_url: raw.video_url ?? "",

    related_exhibition: relatedGallery,

    order:    raw.order    ?? "",
  };
}

// ── getBibliographyFieldGroups ──────────────────────────────────────────
export const getBibliographyFieldGroups = (isCn) => {
  const groupKeyLabels = {
    basic:  isCn ? "基本信息" : "Basic Info",
    media:  isCn ? "媒体链接" : "Media Links",
    relations: isCn ? "关联"   : "Relations",
    meta:   isCn ? "元数据"   : "Metadata",
  };

  return {
    basic:    ["title", "subtitle", "cover_img_url", "author", "type", "year", "date", "published_at"],
    media:    ["pdf_url", "web_url", "video_url"],
    relations: ["related_exhibition"],
    meta:     ["order"],
    groupKeyLabels,
  };
};

// ── getBibliographySchemaFields ─────────────────────────────────────────
export const getBibliographySchemaFields = () => [
  { name: "title",    labelKey: "title",    label: "Title"           },
  { name: "subtitle", labelKey: "subtitle", label: "Subtitle"        },
  { name: "cover_img_url", labelKey: "coverImgUrl", label: "Cover Image URL" },
  { name: "author",   labelKey: "author",   label: "Author"          },
  { name: "type",     labelKey: "type",     label: "Type"            },
  { name: "year",     labelKey: "year",     label: "Year"            },
  { name: "date",     labelKey: "date",     label: "Date"            },
  { name: "published_at", labelKey: "publishedAt", label: "Published At" },
  { name: "pdf_url",  labelKey: "pdfUrl",   label: "PDF URL"         },
  { name: "web_url",  labelKey: "webUrl",   label: "Website URL"     },
  { name: "video_url", labelKey: "videoUrl", label: "Video URL"      },
  { name: "related_exhibition", labelKey: "relatedGallery", label: "Related Gallery/Exhibition" },
  { name: "order",    labelKey: "order",    label: "Order"           },
];

// ── getBibliographyFieldTypes ───────────────────────────────────────────
export const getBibliographyFieldTypes = () => ({
  arrayFields:     ["related_exhibition"],
  multilineFields: ["subtitle", "date", "published_at"], // optional; can adjust
});

// ── exportBibliographyToCSV ──────────────────────────────────────────────
export const exportBibliographyToCSV = (data, filename) => {
  const headers = [
    "title",
    "subtitle",
    "cover_img_url",
    "author",
    "type",
    "year",
    "date",
    "published_at",
    "pdf_url",
    "web_url",
    "video_url",
    "related_exhibition",
    "order",
  ];

  // Convert array field to semicolon‑separated string for CSV readability
  const arrayFields = ["related_exhibition"];
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

  exportToCSV(exportData, headers, filename || `bibliography_${new Date().toISOString().slice(0, 10)}.csv`);
};