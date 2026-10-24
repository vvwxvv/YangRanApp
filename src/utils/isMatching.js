export const isMatching = (value, target) => {
    if (!value || !target) return false;
    return value.trim().toLowerCase() === target.trim().toLowerCase();
  };