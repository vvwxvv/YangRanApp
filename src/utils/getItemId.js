/**
 * Get the ID from an item (supports both _id and id fields)
 * @param {Object} item - Item object
 * @returns {string|null} - Item ID or null
 */
const getItemId = (item) => {
  return item?._id || item?.id || null;
};

export default getItemId;