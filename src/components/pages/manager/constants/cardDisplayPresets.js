/**
 * Card Display Presets
 * Reusable image/media sizing configurations for ManagerCard
 * 
 * Usage in any schemaConfig:
 *   import { ORIGINAL_SIZE_PRESET, FIXED_SIZE_PRESET, createCustomPreset } from './cardDisplayPresets';
 * 
 *   uiConfig: {
 *     ...ORIGINAL_SIZE_PRESET,   // or ...FIXED_SIZE_PRESET
 *   }
 */

// ── Original Size ──────────────────────────────────────────────
// Image renders at natural resolution (like SeriesCard)
// No fixed min-height, image dictates card size
export const ORIGINAL_SIZE_PRESET = {
  useOriginalSize: true,
  objectFit: "contain",
  maxHeight: 900,
  minHeight: 0,
  customHeight: null,
  customWidth: null,
};

// ── Fixed Size (Default) ───────────────────────────────────────
// Image is cropped to fill a fixed container
// Card has min-height constraint
export const FIXED_SIZE_PRESET = {
  useOriginalSize: false,
  objectFit: "cover",
  maxHeight: 800,
  minHeight: 0,
  customHeight: null,
  customWidth: null,
};

// ── Thumbnail ──────────────────────────────────────────────────
// Small fixed-size preview, good for dense list/grid views
export const THUMBNAIL_PRESET = {
  useOriginalSize: false,
  objectFit: "cover",
  maxHeight: 300,
  minHeight: 200,
  customHeight: 250,
  customWidth: null,
};

// ── Factory: create a custom preset with defaults ──────────────
/**
 * Create a custom image sizing preset
 * @param {Object} overrides - Override any default values
 * @returns {Object} Complete image sizing config
 * 
 * @example
 *   createCustomPreset({ maxHeight: 600, objectFit: "cover" })
 */
export const createCustomPreset = (overrides = {}) => ({
  ...ORIGINAL_SIZE_PRESET,
  ...overrides,
});