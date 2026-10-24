// enquireBatchEditUtils.js
// Utilities for Enquire model:
//   id, name, email, message, createdAt, status

import { exportToCSV } from "@/components/pages/manager/utils/batchEditCommonUtils";

// ── normalizeRow ──────────────────────────────────────────────────────────
export function normalizeRow(raw = {}) {
  return {
    id:  raw.id  ?? raw._id ?? `temp_${Date.now()}_${Math.random()}`,
    _id: raw._id ?? raw.id  ?? null,
    isNew: raw.isNew ?? false,

    name:                   raw.name                   ?? "",
    email:                  raw.email                  ?? "",
    message:                raw.message                ?? "",
    status:                 raw.status                 ?? "Pending",
    createdAt:              raw.createdAt              ?? "",
  };
}

// ── getEnquireFieldGroups ─────────────────────────────────────────────────
export const getEnquireFieldGroups = (isCn) => {
  const groupKeyLabels = {
    core:    isCn ? "核心信息" : "Core Info",
    message: isCn ? "留言内容" : "Message",
    system:  isCn ? "系统信息" : "System",
  };

  return {
    core:    ["name", "email"],
    message: ["message"],
    system:  ["status", "createdAt"],
    groupKeyLabels,
  };
};

// ── getEnquireSchemaFields ────────────────────────────────────────────────
export const getEnquireSchemaFields = () => [
  { name: "name",                   labelKey: "name",                 label: "Name" },
  { name: "email",                  labelKey: "email",                label: "Email" },
  { name: "message",                labelKey: "message",              label: "Message" },
  { name: "status",                 labelKey: "status",               label: "Status" },
  { name: "createdAt",              labelKey: "createdAt",            label: "Created At" },
];

// ── getEnquireFieldTypes ──────────────────────────────────────────────────
export const getEnquireFieldTypes = () => ({
  arrayFields:     [],
  multilineFields: ["message"],
});

// ── exportEnquireToCSV ────────────────────────────────────────────────────
export const exportEnquireToCSV = (data, filename) => {
  const headers = [
    "name",
    "email",
    "message",
    "status",
    "createdAt",
  ];
  exportToCSV(data, headers, filename || `enquiry_${new Date().toISOString().slice(0, 10)}.csv`);
};