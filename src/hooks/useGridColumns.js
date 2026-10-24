import { useContext } from "react";
import { DeviceContext } from "@/components/contexts/DeviceContext";

/**
 * Default column layout per breakpoint.
 * Override any breakpoint by passing columnConfig.
 */
const DEFAULT_COLUMNS = {
  mobile: 1,
  tablet: 1,
  middleSize: 2,
  desktop: 3,
};

/**
 * Returns the number of columns for the current device breakpoint.
 * @param {Partial<typeof DEFAULT_COLUMNS>} columnConfig - optional overrides per breakpoint
 * @returns {number}
 */
const useGridColumns = (columnConfig = {}) => {
  const {
    isMobile = false,
    isTablet = false,
    isMiddleSizeDevice = false,
    isDesktop = false,
  } = useContext(DeviceContext);

  const resolved = { ...DEFAULT_COLUMNS, ...columnConfig };

  if (isMobile) return resolved.mobile;
  if (isTablet) return resolved.tablet;
  if (isMiddleSizeDevice) return resolved.middleSize;
  if (isDesktop) return resolved.desktop;

  // SSR / unknown fallback — default to desktop
  return resolved.desktop;
};

export { DEFAULT_COLUMNS };
export default useGridColumns;