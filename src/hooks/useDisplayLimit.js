import { useState, useMemo, useCallback } from 'react';

/**
 * useDisplayLimit
 *
 * @param {Array}   items        — full sorted/filtered list
 * @param {object}  options
 * @param {number}  options.initialCount  — items shown on first render  (default 9)
 * @param {number}  options.step          — items added per "show more"  (default 9)
 * @param {boolean} options.showAll       — bypass pagination entirely   (default false)
 *
 * @returns {{
 *   displayedItems : Array,
 *   hasMore        : boolean,
 *   showMore       : () => void,
 *   reset          : () => void,
 *   displayCount   : number,
 *   totalCount     : number,
 * }}
 */
const useDisplayLimit = (items = [], {
  initialCount = 9,
  step = 9,
  showAll = false,
} = {}) => {
  const [count, setCount] = useState(initialCount);

  const totalCount = items.length;

  const displayedItems = useMemo(() => {
    if (showAll) return items;
    return items.slice(0, count);
  }, [items, count, showAll]);

  const hasMore = !showAll && count < totalCount;

  const showMore = useCallback(() => {
    setCount((prev) => Math.min(prev + step, totalCount));
  }, [step, totalCount]);

  // call this when filters/search change so count resets to initialCount
  const reset = useCallback(() => {
    setCount(initialCount);
  }, [initialCount]);

  return { displayedItems, hasMore, showMore, reset, displayCount: count, totalCount };
};

export default useDisplayLimit;