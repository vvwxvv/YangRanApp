"use client";

/**
 * useFormTypeOptions — the "type" dropdown options for one entity.
 *
 * Reads `Meta.formTypes[entity]` (managed in /manager/meta) and maps the stored
 * entries to the `{ value, label }` shape the form selectors expect.
 *
 * An option is stored as its labels only (`{ label_en, label_cn }`) — the label
 * IS the value, so there is no duplicate value field. Legacy rows that still
 * carry `{ value, label_en, label_cn }` keep working: the value falls back to
 * `label_en`, then to the old `value`.
 *
 * Falls back to the caller-supplied list when the Meta doc has nothing for that
 * entity (e.g. before it is saved).
 *
 * @param {string} entity   "artwork" | "exhibition" | "event" | …
 * @param {Array}  fallback [{ value, label }] used when Meta has no entries
 * @returns {Array<{ value:string, label:string }>}
 */

import { useContext, useMemo } from "react";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import useSiteMeta from "@/hooks/useSiteMeta";

const toOption = (entry, isCn) => {
  if (entry === null || entry === undefined) return null;
  if (typeof entry === "string") {
    const v = entry.trim();
    return v ? { value: v, label: v } : null;
  }
  // The label IS the value: prefer the labels, then any legacy `value`.
  const labelEn = String(entry.label_en ?? entry.label ?? "").trim();
  const labelCn = String(entry.label_cn ?? "").trim();
  const legacy = String(entry.value ?? "").trim();
  const value = labelEn || legacy || labelCn;
  if (!value) return null;
  const label = (isCn ? labelCn : labelEn) || labelEn || labelCn || value;
  return { value, label };
};

export default function useFormTypeOptions(entity, fallback = []) {
  const { isCn } = useContext(LanguageContext);
  const { meta } = useSiteMeta();

  return useMemo(() => {
    const stored = meta?.formTypes?.[entity];
    const source =
      Array.isArray(stored) && stored.length ? stored : Array.isArray(fallback) ? fallback : [];
    return source.map((entry) => toOption(entry, isCn)).filter(Boolean);
  }, [meta, entity, fallback, isCn]);
}
