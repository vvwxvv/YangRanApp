import { classifyUploadError } from "@/utils/errorClassifier";

/**
 * Classifies a raw upload error and writes it into React Hook Form state.
 * Returns the classified result so the caller can display it however needed.
 *
 * @param {unknown}  err    - Raw error from upload handler
 * @param {object}   form   - RHF form instance
 * @param {string}   field  - Field name to attach the error to
 * @param {boolean}  isCn   - Language toggle
 * @returns {{ title: string, detail: string, type: string, status?: number }}
 */
export function applyUploadErrorToForm(err, form, field, isCn) {
  const classified = classifyUploadError(err);

  const title  = isCn ? classified.title_cn  : classified.title_en;
  const detail = isCn ? classified.detail_cn : classified.detail_en;

  form.setError(field, {
    type:    "manual",
    message: `${title}: ${detail}`,
  });

  return { title, detail, type: classified.type, status: classified.status };
}