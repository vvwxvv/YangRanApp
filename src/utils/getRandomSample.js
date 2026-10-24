// utils/getRandomSample.js

/**
 * Get a random sample of n items from an array.
 * @param {Array} arr - The array to sample from.
 * @param {number} n - The number of items to sample.
 * @returns {Array}
 */
export function getRandomSample(arr, n) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
} 