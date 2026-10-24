/**
 * Returns true if two strings are considered the same,
 * ignoring leading/trailing whitespace and case differences.
 * Also treats null/undefined/empty as equal to each other.
 */
export const isSameText = (a, b) => {
    const normalize = (str) => (str ?? '').trim().toLowerCase();
    return normalize(a) === normalize(b);
  };