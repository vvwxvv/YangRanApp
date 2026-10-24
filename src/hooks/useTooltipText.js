import { useMemo } from 'react';

const DEFAULT_SEPARATOR = ' – ';

/**
 * Builds a tooltip string from an object's fields.
 *
 * @param {Object}   item       - The data object
 * @param {string[]} fields     - Field names to pick, in order
 * @param {string}   separator  - Glue between parts
 * @returns {string}
 *
 * @example
 * const text = useTooltipText(artwork, ['title', 'type', 'medium', 'size', 'year']);
 */
const useTooltipText = (item, fields = [], separator = DEFAULT_SEPARATOR) =>
  useMemo(() => {
    if (!item || !fields.length) return '';
    return fields.map((f) => item[f]).filter(Boolean).join(separator);
  }, [item, fields, separator]);

export default useTooltipText;