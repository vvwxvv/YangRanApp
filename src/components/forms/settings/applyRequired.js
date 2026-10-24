import { z } from 'zod';

/**
 * Apply admin-declared "required" flags on top of an existing zod schema.
 *
 * The entity schemas keep every field `.optional()` (they must accept legacy
 * rows). When a manager marks `title` required in the form settings we layer a
 * `superRefine` on top instead of rewriting the schema — no field type is
 * touched, and a required array/union behaves the same as a text field.
 *
 * @param {import('zod').ZodTypeAny} schema
 * @param {string[]} names
 */
export function applyRequired(schema, names = []) {
  if (!schema || !Array.isArray(names) || names.length === 0) return schema;
  if (typeof schema.superRefine !== 'function') return schema;

  return schema.superRefine((values, ctx) => {
    for (const name of names) {
      const value = values?.[name];
      const empty =
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0);

      if (empty) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [name],
          message: 'This field is required',
        });
      }
    }
  });
}

/**
 * Which settings-declared required fields actually exist in this zod schema?
 * (A field can be hidden from one form but named the same in another.)
 */
export function requiredFieldsFromSettings(schema, settings) {
  const shape = schema?.shape;
  const fields = settings?.fields;
  if (!shape || !fields || typeof fields !== 'object') return [];

  return Object.entries(fields)
    .filter(
      ([name, cfg]) =>
        cfg?.required === true &&
        cfg?.visible !== false &&
        Object.prototype.hasOwnProperty.call(shape, name)
    )
    .map(([name]) => name);
}
