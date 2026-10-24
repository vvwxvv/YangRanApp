"use client";

import React from "react";
import useGridColumns from "@/hooks/useGridColumns";

/**
 * Maps column count to Tailwind grid class.
 * Extend this map if you need more columns.
 */
const GRID_COL_CLASS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const GAP_CLASS = {
  2: "gap-2",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
};

/**
 * A smart responsive grid that automatically picks column count
 * based on the current device breakpoint via DeviceContext.
 *
 * @param {object}  props
 * @param {React.ReactNode}  props.children
 * @param {object}  [props.columnConfig]    - per-breakpoint column overrides
 * @param {number}  [props.gap=6]           - gap size key (maps to Tailwind gap-*)
 * @param {string}  [props.className]       - extra Tailwind classes
 * @param {object}  [props.style]           - inline styles
 *
 * @example
 * // default layout: mobile=1, tablet=1, middle=2, desktop=3
 * <ResponsiveGrid>...</ResponsiveGrid>
 *
 * @example
 * // custom layout
 * <ResponsiveGrid columnConfig={{ mobile: 1, tablet: 2, middleSize: 3, desktop: 4 }}>
 *   ...
 * </ResponsiveGrid>
 */
const ResponsiveGridLayout = ({
  children,
  columnConfig = {},
  gap = 6,
  className = "",
  style = {},
}) => {
  const columns = useGridColumns(columnConfig);
  const colClass = GRID_COL_CLASS[columns] ?? "grid-cols-1";
  const gapClass = GAP_CLASS[gap] ?? "gap-6";

  return (
    <div
      className={`grid ${colClass} ${gapClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default ResponsiveGridLayout;