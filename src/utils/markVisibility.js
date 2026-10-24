/**
 * @file markVisibility.js
 * @description Generic mark-visibility utilities.
 *
 * These functions are schema-agnostic: they work with any record that has
 * a `mark` string field and any mark-config object that matches the
 * `{ key, visible }` shape (same as ARTWORK_MARKS).
 *
 * Usage with artworks:
 *   import { ARTWORK_MARKS } from "@/components/pages/artworks/constants/artworkMarks";
 *   import { buildHiddenMarkSet, isRecordVisible, filterEntriesByMark } from "@/utils/markVisibility";
 *
 *   const HIDDEN = buildHiddenMarkSet(ARTWORK_MARKS);
 *   const visible = isRecordVisible(artwork, HIDDEN);
 *
 * Usage with any other schema (e.g. exhibitions, products):
 *   import { EXHIBITION_MARKS } from "@/components/pages/exhibitions/constants/exhibitionMarks";
 *   const HIDDEN = buildHiddenMarkSet(EXHIBITION_MARKS);
 *   const visible = isRecordVisible(exhibition, HIDDEN);
 */

// ─────────────────────────────────────────────────────────────────────────────
// SET BUILDER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a fast look-up Set of mark keys that should be hidden.
 * Keys are normalised to lower-case so comparisons are case-insensitive.
 *
 * @param {Record<string, { key: string, visible: boolean }>} marksConfig
 * @returns {Set<string>}
 *
 * @example
 * const HIDDEN = buildHiddenMarkSet(ARTWORK_MARKS);
 * // Set { "project only", "archived" }
 */
export function buildHiddenMarkSet(marksConfig) {
    return new Set(
      Object.values(marksConfig)
        .filter((m) => !m.visible)
        .map((m) => m.key.toLowerCase().trim())
    );
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // RECORD VISIBILITY
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Returns true when a record should be visible in public lists.
   *
   * Rules:
   *  - null / undefined record  → hidden (false)
   *  - missing or non-string mark → visible (no mark means no restriction)
   *  - mark in hiddenSet         → hidden (false)
   *  - mark not in hiddenSet     → visible (true)
   *
   * @param {object|null|undefined} record   — any object with an optional `mark` field
   * @param {Set<string>}           hiddenSet — pre-built set from buildHiddenMarkSet()
   * @returns {boolean}
   */
  export function isRecordVisible(record, hiddenSet) {
    if (!record) return false;
    const { mark } = record;
    if (!mark || typeof mark !== "string") return true;
    return !hiddenSet.has(mark.toLowerCase().trim());
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // FLAT LIST FILTER
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Filter a flat array of records, removing any whose mark is in hiddenSet.
   *
   * @template T
   * @param {T[]}         records
   * @param {Set<string>} hiddenSet
   * @returns {T[]}
   */
  export function filterRecordsByMark(records, hiddenSet) {
    return records.filter((r) => isRecordVisible(r, hiddenSet));
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // UNIFIED ENTRY FILTER  (artwork-list specific shape)
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Filter a unified list entry for public visibility.
   *
   * Supports two entry shapes produced by buildUnifiedArtworkEntries:
   *
   *   { type: "group",     group: { meta, items: Artwork[] } }
   *   { type: "standalone", item: Artwork }
   *
   * For groups: filters `group.items` in-place; returns null when no items remain.
   * For standalones: returns null when the artwork itself is hidden.
   *
   * @param {object}      entry
   * @param {Set<string>} hiddenSet
   * @returns {object|null}
   */
  export function filterUnifiedEntry(entry, hiddenSet) {
    if (entry.type === "group") {
      const visibleItems = (entry.group?.items ?? []).filter((item) =>
        isRecordVisible(item, hiddenSet)
      );
      if (visibleItems.length === 0) return null;
      return {
        ...entry,
        group: { ...entry.group, items: visibleItems },
      };
    }
  
    // type === "standalone" (or any other flat-item shape)
    return isRecordVisible(entry.item, hiddenSet) ? entry : null;
  }
  
  /**
   * Filter an array of unified entries, removing hidden items and empty groups.
   *
   * @param {object[]}    entries
   * @param {Set<string>} hiddenSet
   * @returns {object[]}
   */
  export function filterUnifiedEntries(entries, hiddenSet) {
    return entries.reduce((acc, entry) => {
      const filtered = filterUnifiedEntry(entry, hiddenSet);
      if (filtered !== null) acc.push(filtered);
      return acc;
    }, []);
  }