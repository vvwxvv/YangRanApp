"use client";

import React from 'react';
import FilterBarDropdown from '@/components/navs/FilterBarDropdown';
import { COMPONENT_STYLES } from '@/hooks/useIndexConstants';
import useBackgroundColor from '@/hooks/useBackgroundColor';

/**
 * Generic Filter Bar Component
 * Renders multiple independent filter dropdowns using FilterBarDropdown.
 * Each filter handles its own throttling internally via useAsyncAction.
 */
const IndexFilterBar = ({ 
  filters, 
  filterConfigs, 
  onFilterChange, 
  isCn,
  throttleMs = 800, // 可选的节流时间，传递给每个下拉
}) => {
  // Background color hook
  const { getBackgroundStyle } = useBackgroundColor('transparent', {
    useCustomColor: true
  });

  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg shadow-sm"
      style={getBackgroundStyle('overlay')}
    >
      <div className="flex items-center w-full gap-2">
        {filterConfigs.map((config) => (
          <div key={config.key} className="flex-1">
            <FilterBarDropdown
              label=""
              options={config.options}
              value={filters[config.key] || (config.options[0]?.value || 'all')}
              onChange={(value) => onFilterChange(config.key, value, config.resetOthers)}
              mode="dropdown"
              fullWidth={true}
              bgColor="#ffffff"
              fontColor="#000000"
              dropdownBgColor="#ffffff"
              dropdownFontColor="#000000"
              highlightSelected={true}
              renderOption={(opt, selected) => opt.label} // opt 应为 { value, label }
              throttleMs={throttleMs} // 传递节流时间
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndexFilterBar;