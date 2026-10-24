// @/utils/parseOrder.js
// 0 / "0" / "" / null / undefined → Infinity (no order assigned)
export const parseOrder = (val) => {
  if (val === undefined || val === null || val === "") return Infinity;
  const n = Number(val);
  if (isNaN(n) || n === 0) return Infinity;
  return n;
};