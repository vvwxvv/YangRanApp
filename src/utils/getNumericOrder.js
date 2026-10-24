// utils/getNumericOrder.js
/**
 * Numeric value of a record's per-page order.
 *
 * `order` is a JSON object (e.g. { artist_page_order, exhibition_page_order,
 * art_fair_page_order, rolling_img_order }); legacy rows still store a plain
 * string. Missing / non-numeric values return Infinity so they sort last.
 *
 * @param {object} item
 * @param {string} key  which order key to read (default artist_page_order)
 */
export const getNumericOrder = (item, key = "artist_page_order") => {
  const order = item?.order;
  const value =
    order && typeof order === "object" && !Array.isArray(order)
      ? order[key]
      : order; // legacy string order

  if (value === undefined || value === null || value === "") return Infinity;
  const num = Number(value);
  return isNaN(num) ? Infinity : num;
};
