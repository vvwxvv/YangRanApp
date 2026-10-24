// resumeBatchEditUtils.js
// Utilities for Resume model (Prisma)
// Fields:
//   id, artist, year, start_date, end_date, type, description,
//   introduction, mark, language, updatedAt

import { exportToCSV } from "@/components/pages/manager/utils/batchEditCommonUtils";

// ── normalizeResumeRow ─────────────────────────────────────────────
export function normalizeResumeRow(raw = {}) {
  // Normalize introduction: ensure array
  let introduction = raw.introduction;
  if (Array.isArray(introduction)) {
    // keep as is
  } else if (typeof introduction === "string" && introduction.trim() !== "") {
    // If it's a string, split by common delimiters (; or ,) -> fallback to single item
    introduction = introduction.split(/[;,]\s*/).filter(Boolean);
  } else {
    introduction = [];
  }

  return {
    id:  raw.id  ?? raw._id ?? `temp_${Date.now()}_${Math.random()}`,
    _id: raw._id ?? raw.id  ?? null,
    isNew: raw.isNew ?? false,

    artist:     raw.artist     ?? "",
    year:       raw.year       ?? "",
    start_date: raw.start_date ?? "",
    end_date:   raw.end_date   ?? "",
    type:       raw.type       ?? "",
    description: raw.description ?? "",

    introduction,
  };
}

// ── getResumeFieldGroups ──────────────────────────────────────────
export const getResumeFieldGroups = (isCn) => {
  const groupKeyLabels = {
    basic:  isCn ? "基本信息" : "Basic Info",
    dates:  isCn ? "日期"     : "Dates",
    content: isCn ? "内容"   : "Content",
    introduction: isCn ? "引言" : "Introduction",
  };

  return {
    basic:    ["artist", "type", "year"],
    dates:    ["start_date", "end_date"],
    content:  ["description"],
    introduction: ["introduction"],
    groupKeyLabels,
  };
};

// ── getResumeSchemaFields ─────────────────────────────────────────
export const getResumeSchemaFields = () => [
  { name: "artist",     labelKey: "artist",     label: "Artist"      },
  { name: "year",       labelKey: "year",       label: "Year"        },
  { name: "start_date", labelKey: "startDate",  label: "Start Date"  },
  { name: "end_date",   labelKey: "endDate",    label: "End Date"    },
  { name: "type",       labelKey: "type",       label: "Type"        },
  { name: "description", labelKey: "description", label: "Description" },
  { name: "introduction", labelKey: "introduction", label: "Introduction" },
];

// ── getResumeFieldTypes ───────────────────────────────────────────
export const getResumeFieldTypes = () => ({
  arrayFields:     ["introduction"],
  multilineFields: ["description"], // optional; can adjust
});

// ── exportResumeToCSV ──────────────────────────────────────────────
export const exportResumeToCSV = (data, filename) => {
  const headers = [
    "artist",
    "year",
    "start_date",
    "end_date",
    "type",
    "description",
    "introduction",
  ];

  // Convert array field to semicolon‑separated string for CSV readability
  const arrayFields = ["introduction"];
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

  exportToCSV(exportData, headers, filename || `resume_${new Date().toISOString().slice(0, 10)}.csv`);
};
