// Universal value-to-label mapping utility
// Usage: getOptionLabel({ value, options, labelKey, valueKey, fallback })

export function getOptionLabel({
  value,
  options = [],
  labelKey = 'label',
  valueKey = 'value',
  fallback = value
}) {
  if (!options || !Array.isArray(options)) return fallback;
  const found = options.find(opt => opt[valueKey] === value || opt[labelKey] === value);
  return found ? found[labelKey] : fallback;
} 