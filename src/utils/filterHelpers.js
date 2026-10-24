/**
 * filterHelpers.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Small, pure helper utilities shared across the filter module.
 *
 *  • processControls   – filters / enriches the raw controls config
 *  • renderSeparator   – thin vertical divider between control items
 *  • renderCountDisplay – result-count badge
 *  • chunkFields       – splits a flat field list into paginated groups
 *
 * All render helpers return React elements but carry no state.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';
import CustomTooltip from '@/components/others/CustomTooltip';
import { chunk } from 'lodash';

// ─── Controls processing ──────────────────────────────────────────────────────

/**
 * Actions that are stripped from the rendered control bar.
 * (Export-related controls are handled elsewhere in the app.)
 */
const EXCLUDED_ACTIONS = new Set(['toggleExportData', 'exportData']);

/**
 * Transforms raw control configs from `controlPanelConfig.controls` into
 * render-ready objects with their `isActive` state resolved.
 *
 * @param {object[]} controls     Raw control config array (may be empty / undefined)
 * @param {object}   filterState  Current filter state (used for active-state lookups)
 * @returns {object[]}            Filtered and enriched control list
 */
export const processControls = (controls, filterState) => {
  if (!Array.isArray(controls)) return [];

  return controls
    .filter(c => !EXCLUDED_ACTIONS.has(c.action))
    .map(control => {
      switch (control.action) {
        case 'toggleSoldOnly':
          return { ...control, isActive: Boolean(filterState.showSoldOnly) };

        case 'sortByField':
          return {
            ...control,
            isActive: control.sortField != null &&
                      filterState.sortByField === control.sortField,
          };

        default:
          return control;
      }
    });
};

// ─── Render atoms ─────────────────────────────────────────────────────────────

/**
 * Renders a slim vertical divider between control panel items.
 */
export const renderSeparator = () => (
  <div aria-hidden="true" style={{ width: 1, height: 24, background: 'rgba(0,0,0,0.12)' }} />
);

/**
 * Renders a result-count badge with a bilingual tooltip.
 *
 * @param {number} count      Number of currently visible items
 * @param {object} fontStyle  Font style forwarded from the parent panel
 */
export const renderCountDisplay = (count, fontStyle) => (
  <CustomTooltip title="总数 / Total" placement="top">
    <div
      aria-label={`Total: ${count}`}
      style={{ display: 'flex', alignItems: 'baseline', gap: 6, padding: '2px 0' }}
    >
      <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1, ...fontStyle }}>
        {count}
      </span>
      <span
        style={{
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          opacity: 0.38,
        }}
      >
        total
      </span>
    </div>
  </CustomTooltip>
);

// ─── Field chunking ───────────────────────────────────────────────────────────

/**
 * Splits a flat array of field names into groups of 5 for display in
 * column-based UIs (e.g. table column toggles).
 *
 * @param {string[]} fields         All field names for a given group key
 * @param {string}   groupKey       Identifier for the group (e.g. 'basic')
 * @param {object}   groupKeyLabels Map of groupKey → display label
 * @returns {{ key: string, label: string, fields: string[] }[]}
 *
 * @example
 * chunkFields(['a','b','c','d','e','f'], 'basic', { basic: '基本 / Basic' })
 * // → [
 * //     { key: 'basic-0', label: '基本 / Basic',   fields: ['a','b','c','d','e'] },
 * //     { key: 'basic-1', label: '基本 / Basic 1', fields: ['f'] },
 * //   ]
 */
export const chunkFields = (fields, groupKey, groupKeyLabels) =>
  chunk(fields, 5).map((arr, idx) => ({
    key:    `${groupKey}-${idx}`,
    label:  idx === 0
      ? groupKeyLabels[groupKey]
      : `${groupKeyLabels[groupKey]} ${idx + 1}`,
    fields: arr,
  }));

