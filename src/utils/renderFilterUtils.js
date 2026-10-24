import React from 'react';
import FilterBarDropdown from '@/components/navs/FilterBarDropdown';
import CircleToggleButton from '@/components/buttons/CircleToggleButton';
import CustomTooltip from '@/components/others/CustomTooltip';

import { getBilingualLabel } from '@/utils/bilingualUtils';
import { sortAlphabetically, sortYearsDescending } from '@/utils/sortUtils';
import {
  createFilterValues,
  generateAlphabetFilterValues,
  generateNumericFilterValues,
  generateYearFilterValues,
  generateCustomFilterValues,
  ALPHABET_FILTER_VALUES
} from '@/utils/filterValueGenerators';
import {
  getFieldNameWithSuffix,
  getStateKey,
  getHandlerKey
} from '@/utils/fieldUtils';

import { chunk } from "lodash";

// ============================================
// SECTION 0: FILTER CONSTANTS  (was ./filterConstants)
// REPLACE these with the exact values from your original filterConstants.js
// ============================================

/**
 * Fields that do NOT use a language suffix (_cn / _en).
 * All other fields are treated as bilingual.
 */
export const NO_SUFFIX_FIELDS = [
  'year',
  'price',
  'edition',
  'status',
  'sold',
  'size',
];

/**
 * Bilingual "All" labels per field, with a `default` fallback.
 * Each entry: { cn, en }
 */
export const ALL_LABELS = {
  type:     { cn: '全部类型',   en: 'All Types' },
  year:     { cn: '全部年份',   en: 'All Years' },
  artist:   { cn: '全部艺术家', en: 'All Artists' },
  category: { cn: '全部分类',   en: 'All Categories' },
  medium:   { cn: '全部媒介',   en: 'All Media' },
  series:   { cn: '全部系列',   en: 'All Series' },
  default:  { cn: '全部',       en: 'All' },
};

/**
 * Maps a field name to its selected-state key.
 * (Re-exported for backward compatibility.)
 */
export const STATE_KEY_MAP = {
  type:     'selectedType',
  year:     'selectedYear',
  artist:   'selectedArtist',
  category: 'selectedCategory',
  medium:   'selectedMedium',
  series:   'selectedSeries',
};

/**
 * Default colors for filter dropdowns.
 */
export const DEFAULT_FILTER_COLORS = {
  bgColor:          'var(--bg-primary, #ffffff)',
  fontColor:        'var(--text-primary, #000000)',
  dropdownBgColor:  'var(--bg-primary, #ffffff)',
  dropdownFontColor:'var(--text-primary, #000000)',
};

// Re-export for backward compatibility
export {
  getBilingualLabel,
  sortAlphabetically,
  sortYearsDescending,
  createFilterValues,
  generateAlphabetFilterValues,
  generateNumericFilterValues,
  generateYearFilterValues,
  generateCustomFilterValues,
  ALPHABET_FILTER_VALUES,
  getFieldNameWithSuffix,
  getStateKey,
  getHandlerKey
};

// ============================================
// SECTION 1: FILTER-SPECIFIC UTILITIES
// ============================================

/**
 * Get bilingual "All" label for a specific field
 * @param {string} field - Field name (type, year, artist, etc.)
 * @returns {string} Bilingual "All" label in format "中文 / English"
 */
export const getLocalizedAllLabel = (field) => {
  const labelConfig = ALL_LABELS[field] || ALL_LABELS.default;
  return `${labelConfig.cn} / ${labelConfig.en}`;
};

/**
 * Get filter colors with defaults
 * @param {object} colors - Custom colors config
 * @returns {object} Merged colors object
 */
const getFilterColors = (colors) => ({
  bgColor: colors?.bgColor || DEFAULT_FILTER_COLORS.bgColor,
  fontColor: colors?.fontColor || DEFAULT_FILTER_COLORS.fontColor,
  dropdownBgColor: colors?.dropdownBgColor || DEFAULT_FILTER_COLORS.dropdownBgColor,
  dropdownFontColor: colors?.dropdownFontColor || DEFAULT_FILTER_COLORS.dropdownFontColor
});

// ============================================
// SECTION 2: FILTER OPTIONS GENERATION
// ============================================

/**
 * Generate options for fields without language suffix
 */
const generateSimpleFieldOptions = (field, data, sortFunction) => {
  const values = Array.from(new Set(
    data.map(item => item?.[field]).filter(Boolean)
  ));

  const sortedValues = sortFunction ? [...values].sort(sortFunction) : values;

  return sortedValues.map(value => ({
    value: value,
    label: String(value)
  }));
};

/**
 * Generate options for fields with language suffix (_cn, _en)
 */
const generateBilingualFieldOptions = (field, data, sortFunction) => {
  const fieldCn = `${field}_cn`;
  const fieldEn = `${field}_en`;
  const valueMap = new Map();

  data.forEach(item => {
    const cnValue = item?.[fieldCn];
    const enValue = item?.[fieldEn];

    if (cnValue || enValue) {
      const key = cnValue || enValue;
      if (!valueMap.has(key)) {
        valueMap.set(key, { cn: cnValue || '', en: enValue || '' });
      }
    }
  });

  let entries = Array.from(valueMap.entries());
  if (sortFunction) {
    entries = entries.sort((a, b) => sortFunction(a[0], b[0]));
  }

  return entries.map(([key, values]) => ({
    value: key,
    valueCn: values.cn,
    valueEn: values.en,
    label: values.cn && values.en ? `${values.cn} / ${values.en}` : (values.cn || values.en)
  }));
};

/**
 * Generate filter options based on configuration
 */
export const generateFilterOptions = (filterConfig, data, filterValues) => {
  const { field, sortFunction } = filterConfig;

  const allOption = {
    value: filterValues.ALL,
    label: getLocalizedAllLabel(field)
  };

  const isSimpleField = NO_SUFFIX_FIELDS.includes(field);
  const options = isSimpleField
    ? generateSimpleFieldOptions(field, data, sortFunction)
    : generateBilingualFieldOptions(field, data, sortFunction);

  return [allOption, ...options];
};

// ============================================
// SECTION 3: FILTER VISIBILITY & VALIDATION
// ============================================

/**
 * Check if a filter should be shown
 */
export const shouldShowFilter = (filterConfig, data, generateFilterOptions, isArtistweb = false) => {
  const { field, minOptions = 1 } = filterConfig;

  if (field === 'artist' && isArtistweb) {
    return false;
  }

  const actualField = getFieldNameWithSuffix(field);
  const hasField = data.some(item => item?.[actualField]);
  const options = generateFilterOptions(filterConfig, data, { ALL: 'all' });

  return hasField && options.length > minOptions;
};

// ============================================
// SECTION 4: FILTER STATE MANAGEMENT
// ============================================

/**
 * Reset all other filters except the current one
 */
export const resetOtherFilters = (currentField, setters, filterValues) => {
  Object.keys(setters).forEach(key => {
    if (key !== currentField && typeof setters[key] === 'function') {
      setters[key](filterValues.ALL);
    }
  });
};

/**
 * Debug function to log current filter states
 */
export const debugFilterStates = (filterState, filterValues) => {
  console.log('Current filter states:');
  Object.keys(filterState).forEach(key => {
    if (key.startsWith('selected')) {
      const isAll = filterState[key] === filterValues.ALL;
      console.log(`  ${key}: ${filterState[key]} (${isAll ? 'ALL' : 'SELECTED'})`);
    }
  });
};

// ============================================
// SECTION 5: FILTER HANDLER FACTORIES
// ============================================

/**
 * Create filter handlers that work independently
 */
export const createFilterHandlersIndependent = (setters, filterValues) => {
  const handlers = {};

  Object.keys(setters).forEach(key => {
    const fieldName = key.replace('setSelected', '').toLowerCase();
    const handlerName = getHandlerKey(fieldName);

    handlers[handlerName] = (value) => {
      setters[key](value);
    };
  });

  return handlers;
};

/**
 * Create filter handlers that reset other filters
 */
export const createFilterHandlersWithReset = (setters, filterValues) => {
  const handlers = {};

  Object.keys(setters).forEach(key => {
    const fieldName = key.replace('setSelected', '').toLowerCase();
    const handlerName = getHandlerKey(fieldName);

    handlers[handlerName] = (value) => {
      setters[key](value);
      if (value && value !== filterValues.ALL) {
        resetOtherFilters(key, setters, filterValues);
      }
    };
  });

  if (!handlers.handleCategoryChangeWithReset && setters.setSelectedCategory) {
    handlers.handleCategoryChangeWithReset = (value) => {
      setters.setSelectedCategory(value);
      if (value && value !== filterValues.ALL) {
        resetOtherFilters('setSelectedCategory', setters, filterValues);
      }
    };
  }

  return handlers;
};

/**
 * Create filter handlers with explicit reset logic
 */
export const createFilterHandlersWithExplicitReset = (setters, filterValues) => {
  const handlers = {};
  const setterKeys = Object.keys(setters);

  setterKeys.forEach(key => {
    const fieldName = key.replace('setSelected', '').toLowerCase();
    const handlerName = getHandlerKey(fieldName);

    handlers[handlerName] = (value) => {
      setters[key](value);
      if (value && value !== filterValues.ALL) {
        setterKeys.forEach(otherKey => {
          if (otherKey !== key) {
            setters[otherKey](filterValues.ALL);
          }
        });
      }
    };
  });

  return handlers;
};

// ============================================
// SECTION 6: RENDER COMPONENTS
// ============================================

/**
 * Create fallback onChange handler for filters
 */
const createFallbackOnChange = (field, filterHandlers, filterValues) => {
  const stateKey = getStateKey(field);
  const setterKey = `set${stateKey.replace('selected', '')}`;

  return (value) => {
    console.warn(`Filter handler not found for ${field}, using fallback`);

    if (filterHandlers[setterKey]) {
      filterHandlers[setterKey](value);
      if (value && value !== filterValues.ALL) {
        const otherSetters = {};
        Object.keys(filterHandlers).forEach(key => {
          if (key.startsWith('set') && key !== setterKey) {
            otherSetters[key] = filterHandlers[key];
          }
        });
        resetOtherFilters(setterKey, otherSetters, filterValues);
      }
    } else {
      console.log(`No setter found for ${field}. Available:`, Object.keys(filterHandlers));
    }
  };
};

/**
 * Render a single filter dropdown component
 */
export const renderFilter = (
  filterConfig,
  filterState,
  filterHandlers,
  shouldShowFilter,
  generateFilterOptions,
  filterValues
) => {
  const { field, label, colors } = filterConfig;

  if (!filterHandlers || typeof filterHandlers !== 'object') {
    console.log('[renderFilter] filterHandlers is invalid:', filterHandlers);
    return null;
  }

  const dataForOptions = filterState.originalData || filterState.filteredData;

  if (!shouldShowFilter(filterConfig, dataForOptions, generateFilterOptions)) {
    return null;
  }

  const options = generateFilterOptions(filterConfig, dataForOptions, filterValues);
  const stateKey = getStateKey(field);
  const value = filterState[stateKey] || filterValues.ALL;

  const handlerKey = getHandlerKey(field);
  const onChange = filterHandlers[handlerKey] ||
    createFallbackOnChange(field, filterHandlers, filterValues);

  return (
    <FilterBarDropdown
      key={field}
      label={getBilingualLabel(label)}
      options={options}
      value={value}
      onChange={onChange}
      mode="dropdown"
      fullWidth={true}
      {...getFilterColors(colors)}
      theme="auto"
      highlightSelected={true}
      renderOption={(opt) => opt.label}
      dropdownFontSize="12px"
      dropdownPadding="2px"
    />
  );
};

/**
 * Render a control component (toggle or button)
 */
export const renderControl = (controlConfig, controlHandlers, fontStyle) => {
  const {
    type,
    label,
    icon,
    action,
    isActive = false,
    tooltip,
    activeColor = "red",
    inactiveColor = "var(--text-primary, #000000)"
  } = controlConfig;

  const handleAction = () => {
    if (controlHandlers[action] && typeof controlHandlers[action] === 'function') {
      controlHandlers[action]();
    } else {
      console.warn(`[renderControl] No handler found for action: ${action}`);
      console.log('Available handlers:', Object.keys(controlHandlers || {}));
    }
  };

  const tooltipText = getBilingualLabel(tooltip);
  const buttonLabel = getBilingualLabel(label);

  const wrapWithTooltip = (content) => (
    <CustomTooltip key={action} title={tooltipText} placement="top">
      {content}
    </CustomTooltip>
  );

  switch (type) {
    case 'toggle':
      // If icon is provided, use icon-based toggle instead of circle
      if (icon) {
        return wrapWithTooltip(
          <button
            onClick={handleAction}
            className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            style={{ 
              ...fontStyle, 
              color: isActive ? activeColor : inactiveColor,
              transition: 'color 0.2s ease'
            }}
          >
            {icon}
            <span className="text-xs">{buttonLabel}</span>
          </button>
        );
      }
      // Fallback to circle toggle for toggles without icon
      return wrapWithTooltip(
        <CircleToggleButton
          isActive={isActive}
          onToggle={handleAction}
          fieldName={action}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
          diameter={16}
          style={fontStyle}
        />
      );

    case 'button':
      return wrapWithTooltip(
        <button
          onClick={handleAction}
          className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          style={{ ...fontStyle, color: 'var(--text-primary, #000000)' }}
        >
          {icon}
          <span>{buttonLabel}</span>
        </button>
      );

    default:
      return null;
  }
};

// ============================================
// SECTION 7: MAIN RENDER FUNCTION
// ============================================

const processControls = (controls, filterState) => {
  // Handle case where controls is undefined or not an array
  if (!controls || !Array.isArray(controls)) {
    return [];
  }

  const excludedActions = ['toggleExportData', 'exportData'];

  return controls
    .filter(control => !excludedActions.includes(control.action))
    .map(control => {
      // Set isActive based on action type
      if (control.action === 'toggleSoldOnly') {
        return { ...control, isActive: filterState.showSoldOnly };
      }
      if (control.action === 'sortByField' && control.sortField) {
        // Check if currently sorting by this specific field
        return { 
          ...control, 
          isActive: filterState.sortByField === control.sortField || false
        };
      }
      return control;
    });
};

const renderSeparator = () => (
  <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />
);

const renderCountDisplay = (count, fontStyle) => (
  <CustomTooltip title="总数 / Total" placement="top">
    <div className="text-center px-3 py-2 rounded-lg">
      <div className="text-lg font-bold" style={fontStyle}>
        {count}
      </div>
    </div>
  </CustomTooltip>
);

/**
 * Main render filters function - renders complete filter panel
 */
export const renderFilters = ({
  controlPanelConfig,
  filterState,
  filterHandlers,
  controlHandlers,
  isMobile,
  fontStyle,
  filterValues,
  isArtistweb = false
}) => {
  if (!filterHandlers || typeof filterHandlers !== 'object') {
    console.log('[renderFilters] filterHandlers is invalid:', filterHandlers);
    return <div>Error: Filter handlers not available</div>;
  }

  if (!controlPanelConfig) {
    console.log('[renderFilters] controlPanelConfig is missing');
    return <div>Error: Control panel configuration not available</div>;
  }

  const dataSource = filterState.originalData || filterState.filteredData;
  
  // Safely get controls with fallback to empty array
  const controls = processControls(controlPanelConfig.controls || [], filterState);
  
  const filteredCount = Array.isArray(filterState.filteredData)
    ? filterState.filteredData.length
    : 0;

  const boundGenerateFilterOptions = (filterConfig) =>
    generateFilterOptions(filterConfig, dataSource, filterValues);

  const boundShouldShowFilter = (filterConfig) =>
    shouldShowFilter(filterConfig, dataSource, boundGenerateFilterOptions, isArtistweb);

  const boundRenderFilter = (filterConfig) =>
    renderFilter(
      filterConfig,
      filterState,
      filterHandlers,
      boundShouldShowFilter,
      boundGenerateFilterOptions,
      filterValues
    );

  const boundRenderControl = (controlConfig) =>
    renderControl(controlConfig, controlHandlers, fontStyle);

  // Get filters with fallback to empty array
  const filters = controlPanelConfig.filters || [];

  return (
    <div
      className={`bg-white dark:bg-black rounded-lg shadow-sm border-none p-2 mb-4 ${isMobile ? 'hidden' : ''}`}
      style={fontStyle}
    >
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full">
        <div className="flex flex-col sm:flex-row flex-1 gap-2 w-full">
          {filters.map(boundRenderFilter)}
        </div>

        <div className="flex items-center gap-4">
          {renderCountDisplay(filteredCount, fontStyle)}
          {controls.length > 0 && renderSeparator()}
          {controls.map((control, index) => (
            <React.Fragment key={control.action}>
              {boundRenderControl(control)}
              {index < controls.length - 1 && renderSeparator()}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export const chunkFields = (fields, groupKey, groupKeyLabels) => {
  return chunk(fields, 5).map((arr, idx) => ({
    key: `${groupKey}-${idx}`,
    label: idx === 0 ? groupKeyLabels[groupKey] : `${groupKeyLabels[groupKey]} ${idx + 1}`,
    fields: arr,
  }));
};