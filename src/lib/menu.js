import { DEFAULT_MENUS } from "@/utils/siteMetaDefaults";

/* ─── canonical node ──────────────────────────────────────────────────────────
   Every menu, regardless of source shape, normalizes to:
   { key, label, href, model, external, children: [ …same ] }
──────────────────────────────────────────────────────────────────────────────*/

const EXTERNAL_RE = /^(mailto:|tel:|https?:)/i;

function isExternal(href = "") {
  return EXTERNAL_RE.test(href);
}

// "/manager/architect_project" -> "architect_project"; external links kept whole
function keyFromHref(href = "") {
  if (isExternal(href)) return href;
  return href.split("/").filter(Boolean).pop() || href;
}

// One raw JSON item -> one canonical node (recurses into `dropdown` or `menu`)
function normalizeNode(raw) {
  const kids = raw.dropdown ?? raw.menu ?? raw.children ?? [];
  const key  = keyFromHref(raw.href);
  return {
    key,
    label:    raw.label,
    href:     raw.href ?? null,
    model:    raw.model ?? key,      // API model; override in JSON when it differs from key
    external: isExternal(raw.href),
    children: Array.isArray(kids) ? kids.map(normalizeNode) : [],
  };
}

/**
 * Entries that always exist in the manager menu, even when the menu was saved
 * from the Site Meta editor before they were introduced. They are merged at
 * read time so a stored menu can never hide a built-in settings page.
 */
const SYSTEM_MANAGER_ENTRIES = {
  en: [{ label: "Form Settings", href: "/manager/form-settings" }],
  cn: [{ label: "表单设置", href: "/manager/form-settings" }],
};

export function withSystemManagerEntries(list = [], lang = "en") {
  if (!Array.isArray(list) || list.length === 0) return list;
  const have = new Set(list.map((item) => item?.href).filter(Boolean));
  const missing = (SYSTEM_MANAGER_ENTRIES[lang] || SYSTEM_MANAGER_ENTRIES.en).filter(
    (item) => !have.has(item.href)
  );
  if (!missing.length) return list;

  // Sit next to "Site Meta" (the last item) rather than at the very end.
  const out = [...list];
  const at = Math.max(0, out.length - 1);
  out.splice(at, 0, ...missing);
  return out;
}

/**
 * Canonical tree for a named menu block in language.
 *
 * @param {string} name      e.g. "mainMenu" | "managerMenu"
 * @param {boolean} isCn
 * @param {object} [source]  optional menu object from the Meta document
 *                           (`meta.menu`); falls back to the built-in defaults.
 * @returns {Array} array of canonical nodes
 */
export function getMenu(name, isCn, source) {
  const menu = source || DEFAULT_MENUS;
  const lang = isCn ? "cn" : "en";
  const base = menu?.[name]?.[lang] ?? [];
  const raw = name === "managerMenu" ? withSystemManagerEntries(base, lang) : base;
  return raw.map(normalizeNode);
}

/* ─── shapes ──────────────────────────────────────────────────────────────────
   Each takes the canonical tree and returns what a specific UI wants.
   Add a new consumer? Add a shape here — nothing else changes.
──────────────────────────────────────────────────────────────────────────────*/

/** Dot-nav popovers: [{ id, label, menu:[{label, href}] }]
 *  A leaf (no children) becomes a single self-link so every dot has a menu. */
export function toDots(nodes) {
  return nodes.map((n) => ({
    id: n.key,
    label: n.label,
    menu: n.children.length
      ? n.children.map((c) => ({ label: c.label, href: c.href }))
      : [{ label: n.label, href: n.href }],
  }));
}

/** Dropdown nav bar: [{ label, href, dropdown?:[{label, href}] }] */
export function toNav(nodes) {
  return nodes.map((n) => ({
    label: n.label,
    href: n.href,
    ...(n.children.length
      ? { dropdown: n.children.map((c) => ({ label: c.label, href: c.href })) }
      : {}),
    }));

}

/** Manager sections: [{ key, label, items:[{key, label, href, model}] }].
 *  Parents with children -> a section. Leaf top-level items -> grouped under
 *  a synthetic section using `standaloneLabel`. */
export function toSections(nodes, standaloneLabel = "GENERAL") {
  const sections = [];
  const loose = [];

  const asItem = (n) => ({ key: n.key, label: n.label, href: n.href, model: n.model });

  nodes.forEach((n) => {
    if (n.children.length) {
      sections.push({ key: n.key, label: n.label, items: n.children.map(asItem) });
    } else {
      loose.push(asItem(n));
    }
  });

  if (loose.length) {
    sections.unshift({ key: "__general__", label: standaloneLabel, items: loose });
  }
  return sections;
}

/** Flat list of every leaf (deepest nodes) — for data fetching / counts.
 *  [{ key, label, href, model }] */
export function toLeaves(nodes) {
  return nodes.flatMap((n) =>
    n.children.length ? toLeaves(n.children) : [{ key: n.key, label: n.label, href: n.href, model: n.model }]
  );
}