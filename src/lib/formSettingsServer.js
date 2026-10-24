/**
 * formSettingsServer.js — per-form field settings, stored in MongoDB.
 *
 * One document per form ("artwork", "event", "exhibition" …):
 *
 *   {
 *     formKey: "artwork",
 *     layout:   { progressive: true, stickySave: true },
 *     sections: { details: { visible: false }, pricing: { order: 3 } },
 *     fields:   { credits: { visible: false }, title: { required: true } },
 *     discovered: { sections: [ … ] }   ← code-declared snapshot, for the UI
 *   }
 *
 * `sections` / `fields` are OBJECTS keyed by name (not arrays) so a single
 * toggle is a `$set` of one key and never rewrites the whole list.
 *
 * Prisma model: `FormSetting` in prisma/schema.prisma. The app talks to Mongo
 * through the driver (like every other route), so no `prisma generate` is
 * needed at runtime — but the model stays the schema source of truth.
 */

import { getDb } from '@/lib/mongodb';

export const FORM_SETTING_COLLECTION = 'FormSetting';

const MAX_LABEL = 120;

const isPlainObject = (v) => Boolean(v) && typeof v === 'object' && !Array.isArray(v);

function cleanLabel(value) {
  if (typeof value === 'string') {
    const s = value.trim().slice(0, MAX_LABEL);
    return s ? { en: s, cn: s } : undefined;
  }
  if (!isPlainObject(value)) return undefined;
  const out = {};
  if (typeof value.en === 'string' && value.en.trim()) out.en = value.en.trim().slice(0, MAX_LABEL);
  if (typeof value.cn === 'string' && value.cn.trim()) out.cn = value.cn.trim().slice(0, MAX_LABEL);
  return Object.keys(out).length ? out : undefined;
}

function cleanBool(v) {
  if (v === true || v === 'true') return true;
  if (v === false || v === 'false') return false;
  return undefined;
}

function cleanOrder(v) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.min(999, n)) : undefined;
}

/** Whitelist the keys a client may write for a field. */
export function cleanFieldSetting(input) {
  if (!isPlainObject(input)) return null;
  const out = {};
  const visible = cleanBool(input.visible);
  const required = cleanBool(input.required);
  const essential = cleanBool(input.essential);
  const order = cleanOrder(input.order);
  const label = cleanLabel(input.label);
  const section = typeof input.section === 'string' && input.section.trim()
    ? input.section.trim().slice(0, 80)
    : undefined;

  if (visible !== undefined) out.visible = visible;
  if (required !== undefined) out.required = required;
  if (essential !== undefined) out.essential = essential;
  if (order !== undefined) out.order = order;
  if (label) out.label = label;
  if (section) out.section = section;
  return Object.keys(out).length ? out : null;
}

export function cleanSectionSetting(input) {
  if (!isPlainObject(input)) return null;
  const out = {};
  const visible = cleanBool(input.visible);
  const collapsed = cleanBool(input.collapsed);
  const order = cleanOrder(input.order);
  const label = cleanLabel(input.label);

  if (visible !== undefined) out.visible = visible;
  if (collapsed !== undefined) out.collapsed = collapsed;
  if (order !== undefined) out.order = order;
  if (label) out.label = label;
  return Object.keys(out).length ? out : null;
}

function cleanMap(input, cleaner) {
  if (!isPlainObject(input)) return undefined;
  const out = {};
  for (const [key, value] of Object.entries(input)) {
    if (!key || key.length > 80) continue;
    const clean = cleaner(value);
    if (clean) out[key] = clean;
  }
  return out;
}

function cleanLayout(input) {
  if (!isPlainObject(input)) return undefined;
  const out = {};
  for (const key of ['progressive', 'stickySave', 'showCompleteness']) {
    const v = cleanBool(input[key]);
    if (v !== undefined) out[key] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

/** Snapshot of the code-declared schema: only the parts the settings UI needs. */
export function cleanDiscoveredSchema(input) {
  if (!isPlainObject(input)) return null;
  const sections = Array.isArray(input.sections) ? input.sections : [];
  const out = sections.slice(0, 40).map((section, sIdx) => {
    const fields = Array.isArray(section?.fields) ? section.fields : [];
    return {
      key: String(section?.key ?? `section-${sIdx}`).slice(0, 80),
      type: section?.type ? String(section.type).slice(0, 40) : 'fields',
      label: cleanLabel(section?.label) || { en: String(section?.key ?? ''), cn: String(section?.key ?? '') },
      fields: fields.slice(0, 200).map((field, fIdx) => ({
        name: String(field?.name ?? field?.fieldName ?? `field-${fIdx}`).slice(0, 80),
        type: field?.type ? String(field.type).slice(0, 40) : 'text',
        label: cleanLabel(field?.label) || {
          en: String(field?.name ?? ''),
          cn: String(field?.name ?? ''),
        },
        required: field?.required === true,
      })),
    };
  });
  return { sections: out, scannedAt: new Date() };
}

async function collection() {
  const db = await getDb(process.env.MONGODB_DB || process.env.MONGODB_DB_NAME);
  return db.collection(FORM_SETTING_COLLECTION);
}

const stripId = (doc) => {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest;
};

/** All forms, keyed by formKey. Never throws: the UI falls back to defaults. */
export async function listFormSettings() {
  try {
    const col = await collection();
    const docs = await col.find({}).limit(100).toArray();
    const map = {};
    for (const doc of docs) {
      if (doc?.formKey) map[doc.formKey] = stripId(doc);
    }
    return map;
  } catch (error) {
    console.error('[formSettingsServer] list failed:', error?.message || error);
    return {};
  }
}

export async function getFormSetting(formKey) {
  if (!formKey) return null;
  try {
    const col = await collection();
    return stripId(await col.findOne({ formKey }));
  } catch (error) {
    console.error('[formSettingsServer] get failed:', error?.message || error);
    return null;
  }
}

/** Upsert `patch` for one form and return the stored document. */
export async function saveFormSetting(formKey, patch = {}) {
  const key = String(formKey || '').trim().slice(0, 80);
  if (!key) throw new Error('formKey is required');

  const set = { updatedAt: new Date() };
  const layout = cleanLayout(patch.layout);
  const sections = cleanMap(patch.sections, cleanSectionSetting);
  const fields = cleanMap(patch.fields, cleanFieldSetting);

  if (layout) set.layout = layout;
  if (sections) set.sections = sections;
  if (fields) set.fields = fields;

  const col = await collection();
  await col.updateOne({ formKey: key }, { $set: set, $setOnInsert: { formKey: key } }, { upsert: true });
  return stripId(await col.findOne({ formKey: key }));
}

/**
 * Store the schema snapshot the form reported about itself. This is how the
 * settings page knows every form's sections/fields without a hard-coded
 * registry — a form "registers" itself the first time it is opened.
 */
export async function saveDiscoveredSchema(formKey, discovered) {
  const key = String(formKey || '').trim().slice(0, 80);
  if (!key) throw new Error('formKey is required');
  const snapshot = cleanDiscoveredSchema(discovered);
  if (!snapshot) throw new Error('sections are required');

  const col = await collection();
  await col.updateOne(
    { formKey: key },
    { $set: { discovered: snapshot, updatedAt: new Date() }, $setOnInsert: { formKey: key } },
    { upsert: true }
  );
  return stripId(await col.findOne({ formKey: key }));
}

/** Forget every setting for one form (back to code defaults). */
export async function resetFormSetting(formKey) {
  const key = String(formKey || '').trim().slice(0, 80);
  if (!key) throw new Error('formKey is required');
  const col = await collection();
  await col.deleteOne({ formKey: key });
  return { formKey: key, deleted: true };
}
