export const normalizeEntity = (entity, fieldsWithDefaults = {}) => ({
    ...entity,
    ...Object.entries(fieldsWithDefaults).reduce((acc, [field, defaultValue]) => ({
      ...acc,
      [field]: entity[field] ?? entity[`_${field}`] ?? defaultValue,
    }), {}),
  });
  
