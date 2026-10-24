/* app/manager/shared/schemaFormConfig.js  (no imports, no cycle) */

/* ----------  thin wrappers that EditFormShell expects ---------- */
const setValue    = (form, field, value) => form.setValue(field, value, { shouldDirty: true });
const getValue    = (form, field) => form.getValues(field);
const clearErrors = (form, field) => form.clearErrors(field);
const reset       = (form, defaults) => form.reset(defaults || {});

/* ----------  universal factory ---------- */
export function makeSchemaConfig(schemaName = 'about') {
  const base = '/api/' + schemaName;
  const upload = '/uploads/' + schemaName + '/';

  return {
    api: {
      endpoints: {
        create: base,
        update: (id) => `${base}/${id}`,
      },
      methods: { create: 'POST', update: 'PUT' },
      headers: { 'Content-Type': 'application/json' },
    },

    settings: {
      upload: {
        maxFileSize: 10 * 1024 * 1024,
        acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        uploadPath: upload,
      },
    },

    /* ---- helpers required by FormShell ---- */
    setValue,
    getValue,
    reset,
    clearErrors,
  };
}
