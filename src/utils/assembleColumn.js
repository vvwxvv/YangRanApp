import React from "react";

/**
 * createBlockRegistry
 *
 * Wraps a plain map of { id: renderFn } into a registry object.
 * Centralises the pattern so every page that uses the column system
 * produces registries in a consistent shape.
 *
 * @param {Record<string, (ctx: object) => React.ReactNode>} map
 * @returns {Record<string, (ctx: object) => React.ReactNode>}
 *
 * Usage:
 *   const BLOCK_REGISTRY = createBlockRegistry({
 *     portrait: (ctx) => <PortraitBlock {...ctx} />,
 *     bio:      (ctx) => <AboutBioBlock {...ctx} />,
 *   });
 */
export const createBlockRegistry = (map) => ({ ...map });

/**
 * assembleColumn
 *
 * Reads a COLUMN_CONFIG array, filters to the requested side, sorts by
 * `order`, renders each block via the registry, and returns an array of
 * keyed React.Fragments. Null / undefined renders are silently dropped.
 *
 * @param {string} side          - "left" | "right" (or any string key you use)
 * @param {object} context       - Prop bag forwarded to every block renderer
 * @param {Array<{ id: string, column: string, order: number }>} columnConfig
 * @param {Record<string, (ctx: object) => React.ReactNode>} blockRegistry
 * @returns {React.ReactNode[]}
 *
 * Usage:
 *   const leftBlocks = assembleColumn("left", blockContext, COLUMN_CONFIG, BLOCK_REGISTRY);
 */
export const assembleColumn = (side, context, columnConfig, blockRegistry) =>
  columnConfig
    .filter((entry) => entry.column === side)
    .sort((a, b) => a.order - b.order)
    .map(({ id }) => {
      const renderer = blockRegistry[id];
      if (!renderer) return null;
      const node = renderer(context);
      if (!node) return null;
      return <React.Fragment key={id}>{node}</React.Fragment>;
    })
    .filter(Boolean);