"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * SmartColumnsLayout
 * ─────────────────────────────────────────────────────────────────────────────
 * A reusable, self-measuring responsive grid. It looks at ITS OWN container
 * width (not the viewport), fits as many `minItemWidth` cards as possible, and
 * caps the result at `maxColumns`.
 *
 * Why container width: the same layout works full-bleed on a page, inside a
 * sidebar, or in a modal — no assumptions about page padding.
 *
 * Usage:
 *
 *   <SmartColumnsLayout maxColumns={4} minItemWidth={320}>
 *     {items.map((item) => <Card key={item.id} {...item} />)}
 *   </SmartColumnsLayout>
 *
 * Tuning:
 *   maxColumns    → hard cap (desktop ceiling)
 *   minItemWidth  → the width a card should keep before dropping a column
 *   columnGap / rowGap → grid gaps in px
 *
 * This is a standalone layout. The home artwork grid keeps its own tuning and
 * does not depend on it.
 */

export const SMART_COLUMNS_DEFAULTS = Object.freeze({
  maxColumns: 4,
  minItemWidth: 320,
  columnGap: 20,
  rowGap: 34,
});

/**
 * Pure column calculation — exported so pages/skeletons can share the logic.
 *
 * @param {Object} options
 * @param {number} options.width        container content width (px)
 * @param {number} [options.maxColumns]
 * @param {number} [options.minItemWidth]
 * @param {number} [options.columnGap]
 * @returns {number} columns (always >= 1)
 */
export function computeSmartColumns({
  width,
  maxColumns = SMART_COLUMNS_DEFAULTS.maxColumns,
  minItemWidth = SMART_COLUMNS_DEFAULTS.minItemWidth,
  columnGap = SMART_COLUMNS_DEFAULTS.columnGap,
}) {
  const safeWidth = Number(width) || 0;
  const safeMax = Math.max(1, Math.floor(Number(maxColumns) || 1));
  const safeMin = Math.max(1, Number(minItemWidth) || 1);
  const safeGap = Math.max(0, Number(columnGap) || 0);

  if (safeWidth <= 0) return 1;

  // A row of N cards uses (N - 1) gaps: width >= N*min + (N-1)*gap
  // → N <= (width + gap) / (min + gap)
  const fit = Math.floor((safeWidth + safeGap) / (safeMin + safeGap));
  return Math.max(1, Math.min(safeMax, fit || 1));
}

export default function SmartColumnsLayout({
  children,
  maxColumns = SMART_COLUMNS_DEFAULTS.maxColumns,
  minItemWidth = SMART_COLUMNS_DEFAULTS.minItemWidth,
  columnGap = SMART_COLUMNS_DEFAULTS.columnGap,
  rowGap = SMART_COLUMNS_DEFAULTS.rowGap,
  as: Tag = "div",
  className,
  style,
  ...rest
}) {
  const containerRef = useRef(null);
  // Desktop-first initial value avoids a 1-column flash on first paint.
  const [columns, setColumns] = useState(() => Math.max(1, maxColumns));

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const measure = (width) => {
      const next = computeSmartColumns({
        width,
        maxColumns,
        minItemWidth,
        columnGap,
      });
      setColumns((prev) => (prev === next ? prev : next));
    };

    measure(node.getBoundingClientRect().width);

    if (typeof ResizeObserver === "undefined") {
      const onResize = () => measure(node.getBoundingClientRect().width);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) measure(entry.contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [maxColumns, minItemWidth, columnGap]);

  return (
    <Tag
      ref={containerRef}
      className={className}
      data-columns={columns}
      {...rest}
      style={{
        ...style,
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        columnGap,
        rowGap,
      }}
    >
      {children}
    </Tag>
  );
}
