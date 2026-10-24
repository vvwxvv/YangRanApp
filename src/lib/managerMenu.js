import { getMenu, toSections, toLeaves } from "@/lib/menu";

const STANDALONE = { en: "GENERAL", cn: "通用" };

// Pages that are not backed by an API collection — no record count for them.
const NON_MODEL_HREFS = new Set(["/manager/form-settings"]);

/**
 * Manager-only exclusions.
 *
 * `enquire` is the public submission inbox (a form, not content the manager
 * authors) and `subscribe` is the newsletter list. Neither belongs in the
 * authoring menu — they are read-only mail, and mixing them in with artwork /
 * exhibitions made the menu look bigger than the job.
 */
const MANAGER_HIDDEN_KEYS = new Set(["enquire", "subscribe", "/manager/enquire"]);

const visibleInManager = (items = []) =>
  items.filter((item) => {
    const href = String(item?.href || "");
    const key = href.split("/").filter(Boolean).pop() || "";
    return !MANAGER_HIDDEN_KEYS.has(key) && !MANAGER_HIDDEN_KEYS.has(href);
  });

// language stays out of the leaf fetch — keys/models are identical, so pin to "en"
export const getManagerSections = (isCn, source) => {
  const sections = toSections(getMenu("managerMenu", isCn, source), STANDALONE[isCn ? "cn" : "en"]);
  return sections
    .map((section) => ({ ...section, items: visibleInManager(section.items) }))
    .filter((section) => section.items.length > 0);
};

export const getManagerModels = (source) =>
  toLeaves(getMenu("managerMenu", false, source))
    .filter((leaf) => !NON_MODEL_HREFS.has(leaf.href))
    .filter((leaf) => visibleInManager([leaf]).length > 0);
