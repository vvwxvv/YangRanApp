import { FILTER_VALUES} from '../constants/artworkManagerConstants';

/**
 * Creates filter-related event handlers
 * @param {Function} setFilters - State setter function for filters
 * @param {Object} config - Configuration object
 * @param {Array} config.resetFilters - Array of filter keys to reset when changing filters
 * @param {string} config.allValue - Value to use for "all" filter option
 * @returns {Object} Object containing filter handlers
 */
export function createFilterHandlers(setFilters, config = {}) {
  const {
    resetFilters = ['selectedTab', 'selectedYear', 'selectedSeries', 'selectedArtist'],
    allValue = FILTER_VALUES?.ALL || 'all'
  } = config;

  const handleFilterChange = (filterType, value) => {
    try {
      const newValue = String(value || allValue);

      setFilters(prev => {
        const resetFilterState = {};
        resetFilters.forEach(filterKey => {
          resetFilterState[filterKey] = allValue;
        });

        return {
          ...prev,
          ...resetFilterState,
          [filterType]: newValue,
        };
      });
    } catch (error) {
      console.log('Filter change failed:', error);
    }
  };

  const handleSearchChange = (value) => {
    try {
      setFilters(prev => ({
        ...prev,
        searchTerm: String(value || '').trim(),
      }));
    } catch (error) {
      console.log('Search change failed:', error);
    }
  };

  const handleToggleSoldOnly = () => {
    try {
      console.log(' [ActionHandlers] Toggle sold only called');
      setFilters(prev => {
        const newState = {
          ...prev,
          showSoldOnly: !prev.showSoldOnly,
        };
        console.log(' [ActionHandlers] New filter state:', newState);
        return newState;
      });
    } catch (error) {
      console.log('Toggle sold only failed:', error);
    }
  };

  const handleClearFilters = () => {
    try {
      const clearFilterState = {};
      resetFilters.forEach(filterKey => {
        clearFilterState[filterKey] = allValue;
      });
      
      setFilters({
        ...clearFilterState,
        searchTerm: '',
        showSoldOnly: false,
      });
    } catch (error) {
      console.log('Clear filters failed:', error);
    }
  };

  return {
    handleFilterChange,
    handleSearchChange,
    handleToggleSoldOnly,
    handleClearFilters,
  };
}
