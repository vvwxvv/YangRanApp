/**
 * resolveFormSchema — merge the three layers of a form into one renderable
 * schema.
 *
 *   1. CODE      the section file's `XYZ_SCHEMA` (fields, types, defaults)
 *   2. DB        `FormSetting` for this form (site-wide policy: visible /
 *                required / order / label / section move)
 *   3. USER      this editor's local preferences (fields they never fill)
 *
 * Pure function — no React, no fetch, no side effects. Easy to unit test and
 * easy to reuse on the server.
 *
 * @typedef {Object} ResolveInput
 * @property {Array}  schema    code-declared sections
 * @property {Object} [settings] FormSetting doc ({ sections, fields, layout })
 * @property {Object} [prefs]    { hidden: string[] }
 * @property {boolean} [showAll] temporary "show all fields" override
 */

const isObj = (v) => Boolean(v) && typeof v === 'object' && !Array.isArray(v);
const obj = (v) => (isObj(v) ? v : {});
const fieldName = (field) => field?.name || field?.fieldName || '';

export function resolveFormSchema({ schema, settings, prefs, showAll = false } = {}) {
  const list = Array.isArray(schema) ? schema : [];
  const sectionCfg = obj(settings?.sections);
  const fieldCfg = obj(settings?.fields);
  const hiddenPrefs = new Set(
    !showAll && Array.isArray(prefs?.hidden) ? prefs.hidden : []
  );

  const sourceSections = list.map((section, index) => ({
    section,
    key: String(section?.key ?? `section-${index}`),
    index,
    fields: Array.isArray(section?.fields) ? section.fields : [],
  }));

  // ── pass 1: bucket every field into its (possibly reassigned) section ──────
  const buckets = new Map();
  for (const src of sourceSections) {
    src.fields.forEach((field, fIdx) => {
      const name = fieldName(field);
      if (!name) return;
      const target = obj(fieldCfg[name]).section || src.key;
      if (!buckets.has(target)) buckets.set(target, []);
      buckets.get(target).push({ field, order: src.index * 1000 + fIdx });
    });
  }

  const allFields = [];
  const resolvedSections = [];

  for (const src of sourceSections) {
    const cfg = obj(sectionCfg[src.key]);
    const sectionVisible = cfg.visible !== false;
    const entries = buckets.get(src.key) || [];

    const visibleFields = [];
    for (const { field, order } of entries) {
      const name = fieldName(field);
      const fcfg = obj(fieldCfg[name]);
      const required = fcfg.required === true || field.required === true;
      const adminVisible = sectionVisible && fcfg.visible !== false;
      const userHidden = hiddenPrefs.has(name) && !required;
      const essential = fcfg.essential === true || field.essential === true || required;

      const fieldMeta = {
        ...field,
        label: fcfg.label || field.label,
        required,
        essential,
        adminVisible,
        userHidden,
        // internal sort key, stripped before render
        __order: Number.isFinite(fcfg.order) ? fcfg.order : order,
      };

      allFields.push({ ...fieldMeta, sectionKey: src.key });

      if (adminVisible && !userHidden) visibleFields.push(fieldMeta);
    }

    visibleFields.sort((a, b) => a.__order - b.__order);

    // A section with declared fields but nothing visible disappears entirely
    // (an empty tab is worse than no tab). Special sections — array / relation
    // / order / custom — have no `fields`, so they survive on section visibility.
    // Only sections that genuinely render something other than fields
    // (array / relation / order / custom / object-array) survive without
    // `fields`. A section declared as `fields: []` is just empty — drop it
    // instead of rendering an empty tab.
    const isSpecial = Boolean(
      src.section?.type || src.section?.fieldName || src.section?.renderKey
    );
    if (!sectionVisible) continue;
    if (!isSpecial && visibleFields.length === 0) continue;

    resolvedSections.push({
      ...src.section,
      key: src.key,
      label: cfg.label || src.section?.label,
      fields: isSpecial ? undefined : visibleFields.map(stripInternal),
      __order: Number.isFinite(cfg.order) ? cfg.order : src.index,
      collapsed: cfg.collapsed === true,
    });
  }

  resolvedSections.sort((a, b) => a.__order - b.__order);

  const cleanSections = resolvedSections.map(({ __order, ...section }) => section);

  const stats = {
    totalFields: allFields.length,
    visibleFields: allFields.filter((f) => f.adminVisible && !f.userHidden).length,
    hiddenByAdmin: allFields.filter((f) => !f.adminVisible).length,
    hiddenByUser: allFields.filter((f) => f.adminVisible && f.userHidden).length,
    requiredFields: allFields.filter((f) => f.adminVisible && f.required).length,
    sections: cleanSections.length,
  };

  return {
    schema: cleanSections,
    /** Every field, including hidden ones — used by the "Customize" panel. */
    fields: allFields.map(stripInternal),
    layout: obj(settings?.layout),
    stats,
  };
}

function stripInternal({ __order, ...rest }) {
  return rest;
}

/** Names of fields the resolver considers required (for zod / submit checks). */
export function requiredFieldNames(resolved) {
  const fields = resolved?.fields || [];
  return fields.filter((f) => f.adminVisible && f.required).map(fieldName).filter(Boolean);
}

/**
 * Snapshot posted by a mounted form so the settings page can list sections and
 * fields without a hard-coded registry.
 */
export function toDiscoveredSchema(schema, isCn = false) {
  const list = Array.isArray(schema) ? schema : [];
  return list.map((section, index) => {
    const label = section?.label;
    const pick = (value) =>
      isObj(value) ? value.en || value.cn : typeof value === 'string' ? value : '';
    return {
      key: String(section?.key ?? `section-${index}`),
      type: section?.type || 'fields',
      label: {
        en: pick(label) || String(section?.key ?? ''),
        cn: (isObj(label) && label.cn) || pick(label) || String(section?.key ?? ''),
      },
      fields: (Array.isArray(section?.fields) ? section.fields : [])
        .filter((f) => fieldName(f))
        .map((f) => ({
          name: fieldName(f),
          type: f.type || 'text',
          label: {
            en: (isObj(f.label) && f.label.en) || fieldName(f),
            cn: (isObj(f.label) && f.label.cn) || (isObj(f.label) && f.label.en) || fieldName(f),
          },
          required: f.required === true,
        })),
    };
  });
}
