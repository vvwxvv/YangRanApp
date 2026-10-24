// Factory for generating batch edit columns for any schema
// Usage: makeBatchEditColumns(schemaFields, getLabel, getOptions)

export function makeBatchEditColumns({ schemaFields, getLabel, getOptions }) {
    return schemaFields.map(field => ({
      field: field.name,
      // Prefer the schema's own (human) label; only fall back to the system
      // label lookup — which resolves CN/EN by key — then to the raw name.
      label: field.label || (getLabel ? getLabel(field.name) : field.name),
      labelKey: field.labelKey,
      width: field.width || 150,
      type: field.type || undefined,
      // Always set options if present in field or from getOptions
      options: field.options !== undefined ? field.options : (getOptions ? getOptions(field.name) : undefined),
      fieldType: field.fieldType || undefined,
    }));
  }
  
  export default makeBatchEditColumns; 