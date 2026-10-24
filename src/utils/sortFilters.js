import React, { useCallback } from 'react';
import FilterPanel from '@/components/pages/manager/control_panel/FilterPanel';
import { 
  sortAlphabetically, 
  sortYearsDescending, 
  createFieldSorter 
} from '@/utils/sortUtils';

// Filter default values - used locally in this component
const FILTER_VALUES = {
  ALL: 'all',
  NONE: 'none',
  SOLD: 'sold',
  AVAILABLE: 'available',
  NO_SERIES: 'no_series',
  HAS_SERIES: 'has_series',
  ALL_YEARS: 'all_years',
  ALL_TYPES: 'all_types',
  ALL_ARTISTS: 'all_artists',
};

const STYLES = {
  FILTER_CONTAINER: {
    padding: "16px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};

// Export sort utilities for use by parent components
export const sortUtilities = {
  sortAlphabetically,
  sortYearsDescending,
  createFieldSorter,
};

export default function SortFilters({
  CONTROL_PANEL_CONFIG,
  filteredAndSearchedData,
  showSoldOnly,
  selectedSeries,
  selectedType,
  selectedYear,
  selectedArtist,
  filterHandlers,
  originalSetters,
  handleToggleSoldOnly,
  handleSortByTitle,
  isCn,
  isMobile,
  fontStyle,
  isArtistweb,
}) {
  const renderFilters = useCallback(() => {
    const controlHandlers = {
      toggleSoldOnly: handleToggleSoldOnly,
      sortByTitle: handleSortByTitle,
    };

    const filterState = {
      filteredData: filteredAndSearchedData,
      showSoldOnly,
      selectedSeries,
      selectedType,
      selectedYear,
      selectedArtist,
    };

    return (
      <div style={STYLES.FILTER_CONTAINER}>
        <FilterPanel
          controlPanelConfig={CONTROL_PANEL_CONFIG}
          filterState={filterState}
          filterHandlers={filterHandlers}
          originalSetters={originalSetters}
          controlHandlers={controlHandlers}
          isCn={isCn}
          isMobile={isMobile}
          fontStyle={fontStyle}
          filterValues={FILTER_VALUES}
          sortUtilities={sortUtilities}
          isArtistweb={isArtistweb}
        />
      </div>
    );
  }, [
    CONTROL_PANEL_CONFIG,
    filteredAndSearchedData,
    showSoldOnly,
    selectedSeries,
    selectedType,
    selectedYear,
    selectedArtist,
    filterHandlers,
    originalSetters,
    handleToggleSoldOnly,
    handleSortByTitle,
    isCn,
    isMobile,
    fontStyle,
    isArtistweb,
  ]);

  return renderFilters();
}