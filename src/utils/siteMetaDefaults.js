/**
 * siteMetaDefaults.js
 *
 * The single source of truth for the site's "Meta" document shape.
 *
 * The Meta document lives in the `Meta` collection (one doc) and is editable
 * from the manager (`/manager/meta`). Everything a page needs comes from there
 * via `useSiteMeta()` (client) or `/api/meta` (server).
 *
 * All site-specific seed data lives in JSON:
 *   @/data/site_meta/app_info.json   — identity + SEO defaults
 *   @/data/site_meta/footer.json     — footer copy per language
 *   @/data/site_meta/menus.json      — public + manager navigation
 *   @/data/forms/form_type.json      — entity "type" option lists
 *
 * The Meta document always wins over these seeds (see `mergeSiteMeta`).
 * These JSON files only seed the Meta doc / keep the site sane when the DB is
 * unavailable — edit the JSON to change the shipped defaults.
 */

import app_info from "@/data/site_meta/app_info.json";
import footer from "@/data/site_meta/footer.json";
import menus from "@/data/site_meta/menus.json";
import form_type from "@/data/forms/form_type.json";

/* ── Re-exports (the same names callers already import) ─────────────────── */
export const APP_INFO_DEFAULTS = app_info;
export const FOOTER_DEFAULTS = footer;
export const DEFAULT_MENUS = menus;

/**
 * Entity "type" option lists (seeded from @/data/forms/form_type.json).
 *
 * This mirrors the models in `prisma/schema.prisma` that carry a `type` field.
 * Entities without a list of their own REUSE a sibling list, so there is one
 * source per concept and the manager always has something sensible to show:
 *
 *   exhibition   ← event      (shows & fairs are Events)
 *   series       ← artwork    (a series' mediums are the artwork mediums)
 *   resume       ← about      (CV / education / awards / publications / …)
 *   bibliography ← writing    (essay / article / review / interview / …)
 *
 * There is NO `fair` list: `prisma/schema.prisma` has no Fair model.
 */
const formTypeOptions = {
  ...form_type,
  exhibition: form_type.exhibition || form_type.event,
  series: form_type.series || form_type.artwork,
  resume: form_type.resume || form_type.about,
  bibliography: form_type.bibliography || form_type.writing,
};
delete formTypeOptions.fair;

export const FORM_TYPE_OPTIONS = formTypeOptions;   // ← was `formTypes` (undefined)

/* ── Derived defaults ────────────────────────────────────────────────────── */

/** Default manager menu (meta gets a "Site Meta" entry appended). */
const META_MENU_ENTRY = {
  en: { label: "Site Meta", href: "/manager/meta" },
  cn: { label: "站点信息", href: "/manager/meta" },
};

const FORM_SETTINGS_ENTRY = {
  en: { label: "Form Settings", href: "/manager/form-settings" },
  cn: { label: "表单设置", href: "/manager/form-settings" },
};

const withMetaEntry = (list = [], lang = "en") => [
  ...list.filter(
    (item) =>
      item?.href !== "/manager/meta" && item?.href !== "/manager/form-settings"
  ),
  FORM_SETTINGS_ENTRY[lang],
  META_MENU_ENTRY[lang],
];

/** The Meta document defaults — the DB doc is merged over these. */
export const DEFAULT_SITE_META = {
  // ── Footer ──────────────────────────────────────────────────────────────
  app_footer_en: FOOTER_DEFAULTS.en.companyName,
  app_footer_cn: FOOTER_DEFAULTS.cn.companyName,
  app_footer_start_year: FOOTER_DEFAULTS.en.startYear ?? null,
  app_footer_rights_en: FOOTER_DEFAULTS.en.rightsText,
  app_footer_rights_cn: FOOTER_DEFAULTS.cn.rightsText,

  // ── Menus (public + manager) ────────────────────────────────────────────
  menu: {
    mainMenu: {
      en: DEFAULT_MENUS.mainMenu?.en || [],
      cn: DEFAULT_MENUS.mainMenu?.cn || [],
    },
    managerMenu: {
      en: withMetaEntry(DEFAULT_MENUS.managerMenu?.en || [], "en"),
      cn: withMetaEntry(DEFAULT_MENUS.managerMenu?.cn || [], "cn"),
    },
  },

  // ── SEO / head tags (all editable in /manager/meta) ────────────────────
  seo: {
    title: APP_INFO_DEFAULTS.title,
    description: APP_INFO_DEFAULTS.description,
    keywords: APP_INFO_DEFAULTS.keywords,
    og_image: APP_INFO_DEFAULTS.og_image,
    icon: APP_INFO_DEFAULTS.icon,
    manifest: APP_INFO_DEFAULTS.manifest,
    canonical: APP_INFO_DEFAULTS.canonical,
    author: APP_INFO_DEFAULTS.author,
  },

  // ── Form "type" options (managed in /manager/meta) ───────────────────────
  // Seeded from @/data/forms/form_type.json (see FORM_TYPE_OPTIONS for the
  // per-entity lists and the sibling-list reuse). The Meta doc stores whatever
  // this holds; the manager renders the labels.
  formTypes: FORM_TYPE_OPTIONS,
};

/** Fresh (deep) copy of the Meta defaults — safe for callers to mutate. */
export const getDefaultSiteMeta = () => JSON.parse(JSON.stringify(DEFAULT_SITE_META));

export default DEFAULT_SITE_META;

/** Deep-ish merge used to layer a DB doc over the defaults. */
export function mergeSiteMeta(base, override) {
  if (!override || typeof override !== "object") return base;
  const out = { ...base };
  Object.keys(override).forEach((key) => {
    const value = override[key];
    if (value === undefined || value === null) return;
    out[key] =
      value && typeof value === "object" && !Array.isArray(value) && base?.[key] && !Array.isArray(base[key])
        ? mergeSiteMeta(base[key], value)
        : value;
  });
  return out;
}