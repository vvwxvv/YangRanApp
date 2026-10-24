/**
 * filterHandlers.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Factory functions that generate event handlers for filter dropdowns.
 *
 * Three strategies are offered:
 *  1. Independent   – each filter operates entirely on its own state.
 *  2. WithReset     – selecting a non-ALL value clears sibling filters.
 *  3. WithExplicitReset – same as WithReset but with a clearer, inlined loop
 *                         (useful when set of setters is known up front).
 *
 * Handler naming convention
 *   setter key       → handler key
 *   setSelectedYear  → handleYear
 *   setSelectedType  → handleType
 *
 * Dependencies: fieldUtils, filterUtils
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { getHandlerKey } from '@/utils/fieldUtils';
import { resetOtherFilters } from '@/utils/filterUtils';

// ─── Naming helper ────────────────────────────────────────────────────────────

/**
 * Converts a setter key like `setSelectedArtist` → field `artist` → `handleArtist`.
 */
const toFieldName = (setterKey) => setterKey.replace('setSelected', '').toLowerCase();

// ─── Factory: Independent ─────────────────────────────────────────────────────

/**
 * Creates handlers where every filter is fully independent.
 * Selecting a value in one filter does NOT affect the others.
 *
 * @param {Record<string, Function>} setters       Map of setter functions
 * @param {object}                   _filterValues  Unused; kept for API consistency
 * @returns {Record<string, Function>}              Handler map keyed by handleXxx
 */
export const createFilterHandlersIndependent = (setters, _filterValues) =>
  Object.fromEntries(
    Object.entries(setters).map(([key, setter]) => [
      getHandlerKey(toFieldName(key)),
      (value) => setter(value),
    ])
  );

// ─── Factory: With Reset ──────────────────────────────────────────────────────

/**
 * Creates handlers where selecting a non-ALL value resets sibling filters.
 * Also ensures `handleCategoryChangeWithReset` exists when a category setter
 * is present, for backwards compatibility with legacy call-sites.
 *
 * @param {Record<string, Function>} setters
 * @param {object}                   filterValues  Must contain `.ALL`
 * @returns {Record<string, Function>}
 */
export const createFilterHandlersWithReset = (setters, filterValues) => {
  const handlers = Object.fromEntries(
    Object.entries(setters).map(([key, setter]) => [
      getHandlerKey(toFieldName(key)),
      (value) => {
        setter(value);
        if (value != null && value !== filterValues.ALL) {
          resetOtherFilters(key, setters, filterValues);
        }
      },
    ])
  );

  // Backward-compat alias consumed by legacy components
  if (!handlers.handleCategoryChangeWithReset && setters.setSelectedCategory) {
    handlers.handleCategoryChangeWithReset = (value) => {
      setters.setSelectedCategory(value);
      if (value != null && value !== filterValues.ALL) {
        resetOtherFilters('setSelectedCategory', setters, filterValues);
      }
    };
  }

  return handlers;
};

// ─── Factory: With Explicit Reset ────────────────────────────────────────────

/**
 * Identical behaviour to `createFilterHandlersWithReset` but uses an explicit
 * inner loop instead of the shared `resetOtherFilters` helper.
 *
 * Prefer this variant when you want to inline the reset logic for easier
 * debugging or when `resetOtherFilters` is not available.
 *
 * @param {Record<string, Function>} setters
 * @param {object}                   filterValues  Must contain `.ALL`
 * @returns {Record<string, Function>}
 */
export const createFilterHandlersWithExplicitReset = (setters, filterValues) => {
  const setterEntries = Object.entries(setters);

  return Object.fromEntries(
    setterEntries.map(([key, setter]) => [
      getHandlerKey(toFieldName(key)),
      (value) => {
        setter(value);
        if (value != null && value !== filterValues.ALL) {
          setterEntries.forEach(([otherKey, otherSetter]) => {
            if (otherKey !== key) otherSetter(filterValues.ALL);
          });
        }
      },
    ])
  );
};