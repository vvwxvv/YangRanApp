/**
 * filterUtils.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Utility functions for filter operations
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Resolve filter colors from config
 * @param {object} colors - Color configuration
 * @returns {object} Resolved colors
 */
export const resolveFilterColors = (colors) => {
  if (!colors) return {};
  return {
    bgColor: colors.bgColor,
    fontColor: colors.fontColor,
    dropdownBgColor: colors.dropdownBgColor,
    dropdownFontColor: colors.dropdownFontColor,
    ...colors
  };
};

/**
 * Reset all other filters except the current one
 * @param {string} currentField - The current filter field setter key (e.g., 'setSelectedYear')
 * @param {object} setters - Map of all setter functions
 * @param {object} filterValues - Filter values object containing ALL sentinel
 */
export const resetOtherFilters = (currentField, setters, filterValues) => {
  Object.keys(setters).forEach(key => {
    if (key !== currentField && typeof setters[key] === 'function') {
      setters[key](filterValues.ALL);
    }
  });
};

/**
 * Determine if a filter should be shown
 * @param {object} filterConfig - Filter configuration
 * @param {Array} data - Data to filter
 * @param {Function} generateOptions - Option generator function
 * @param {boolean} isArtistweb - Whether in artistweb context
 * @returns {boolean}
 */
export const shouldShowFilter = (filterConfig, data, generateOptions, isArtistweb = false) => {
  if (!filterConfig || !data || !Array.isArray(data)) {
    return false;
  }

  // Hide artist-related filters in artist-website context.
  const artistFilterFields = new Set([
    'artist',
    'artist_name',
    'related_artist',
    'related_artists',
    'participating_artists',
  ]);
  const filterField = filterConfig.field || filterConfig.key;
  if (isArtistweb && artistFilterFields.has(filterField)) {
    return false;
  }

  // Hide filter if explicitly disabled
  if (filterConfig.hidden) {
    return false;
  }

  // Generate options to check if there are any values
  const options = generateOptions(filterConfig, data, { ALL: 'all' });
  
  // Show filter if there are options beyond the "All" option
  const minOptions = filterConfig.minOptions || 1;
  return options && options.length > minOptions;
};

/**
 * Process controls to set their active state
 * @param {Array} controls - Control configurations
 * @param {object} filterState - Current filter state
 * @returns {Array} Processed controls with isActive flags
 */
export const processControls = (controls, filterState) => {
  if (!controls || !Array.isArray(controls)) {
    return [];
  }

  const excludedActions = ['toggleExportData', 'exportData'];

  return controls
    .filter(control => !excludedActions.includes(control.action))
    .map(control => {
      // Set isActive based on action type
      if (control.action === 'toggleSoldOnly') {
        return { ...control, isActive: filterState.showSoldOnly || false };
      }
      if (control.action === 'sortByField' && control.sortField) {
        return { 
          ...control, 
          isActive: filterState.sortByField === control.sortField || false
        };
      }
      return { ...control, isActive: control.isActive || false };
    });
};

/**
 * Debug function to log current filter states
 * @param {object} filterState - Current filter state
 * @param {object} filterValues - Filter values containing ALL sentinel
 */
export const debugFilterStates = (filterState, filterValues) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Current filter states:');
    Object.keys(filterState).forEach(key => {
      if (key.startsWith('selected')) {
        const isAll = filterState[key] === filterValues.ALL;
        console.log(`  ${key}: ${filterState[key]} (${isAll ? 'ALL' : 'SELECTED'})`);
      }
    });
  }
};