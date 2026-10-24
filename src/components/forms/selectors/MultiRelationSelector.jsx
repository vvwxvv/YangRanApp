"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, Plus, X } from "lucide-react";
import { Controller } from "react-hook-form";
import useRelationOptions from "@/hooks/useRelationOptions";
import useFont from '@/hooks/useFont';

/**
 * MultiRelationSelector — reusable cross-entity relation picker for Prisma
 * `String[]` fields (Artwork.related_exhibition, Fair.related_artwork_title,
 * Event.related_artist, Exhibition.related_artist, …).
 *
 * Design: white surfaces only, 1px black hairline borders, no grey fills —
 * selected values are white chips with a (click it to drop that value),
 * dropdown rows underline on hover and show a when picked.
 *
 * Features
 *  - options come from `sources` (see useRelationOptions) — language-matched, de-duped
 *  - click a row to toggle it; selected values render as removable chips above
 *  - optional free-text value (allowCustom) added with Enter / the + button
 *  - closes on outside click or Escape; search filters the list
 *  - binds to a react-hook-form `string[]` field
 *
 * @param {string}   name        RHF field name (array of strings)
 * @param {string}   label       field label
 * @param {object}   control     RHF control
 * @param {object|object[]} sources   relation source config(s) — see useRelationOptions
 * @param {array}    options     optional pre-fetched options (overrides `sources`)
 * @param {string}   placeholder
 * @param {boolean}  disabled
 * @param {boolean}  isCn
 * @param {string}   language    explicit target language for `matchLanguage` sources
 * @param {boolean}  allowCustom allow adding a value that isn't in the list
 * @param {object}   colors      { text, secondaryText, background, border }
 * @param {string}   hint        helper text under the field
 * @param {function} onChange    extra callback (receives the string[] value)
 */
const MultiRelationSelector = ({
  name,
  label,
  control,
  sources,
  options: optionsProp,
  placeholder,
  disabled = false,
  isCn = false,
  language = "",
  allowCustom = true,
  colors = {},
  hint,
  onChange,
}) => {
  const { inputFontFamily, labelFontFamily } = useFont();

  const sourceList = useMemo(
    () => (Array.isArray(sources) ? sources : sources ? [sources] : []),
    [sources]
  );
  const fetched = useRelationOptions(sourceList, isCn, { language });

  const options = useMemo(() => optionsProp ?? fetched.options, [optionsProp, fetched.options]);
  const loading = optionsProp ? false : fetched.loading;

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customText, setCustomText] = useState("");
  const wrapperRef = useRef(null);

  // Close the dropdown on outside click.
  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filteredOptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return options;
    return options.filter((o) => String(o.label).toLowerCase().includes(term));
  }, [options, searchTerm]);

  // ── style tokens — white surfaces, black hairlines, no grey ─────────────
  const textColor = colors?.text || "#000";
  const secondaryText = colors?.secondaryText || "rgba(0,0,0,.55)";
  const surface = "#fff";
  const border = "1px solid #000";
  const hairline = "1px solid rgba(0,0,0,.12)";
  const radius = "8px";

  const labelFor = useCallback(
    (value) => {
      const opt = options.find((o) => o.value === value || o.label === value);
      return opt ? opt.label : value;
    },
    [options]
  );

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field }) => {
        const value = Array.isArray(field.value) ? field.value : [];
        const setValue = (next) => {
          field.onChange(next);
          onChange?.(next);
        };

        const toggle = (opt) => {
          const v = opt.value ?? opt.label;
          setValue(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
        };

        const remove = (v) => setValue(value.filter((x) => x !== v));

        const addCustom = () => {
          const t = customText.trim();
          if (!t || disabled) return;
          if (!value.includes(t)) setValue([...value, t]);
          setCustomText("");
        };

        return (
          <div
            ref={wrapperRef}
            onTouchEnd={(e) => e.stopPropagation()}
            style={{ marginBottom: "18px", fontFamily: inputFontFamily }}
          >
            <style>{`
              .mrs-row { transition: background .12s ease; }
              .mrs-row:hover .mrs-row-label { text-decoration: underline; text-underline-offset: 2px; }
              .mrs-x { transition: opacity .12s ease; }
              .mrs-x:hover { opacity: .5; }
              .mrs-trigger { transition: border-color .15s ease; }
            `}</style>

            {label && (
              <label
                className="form-label"
                htmlFor={`${name}-relation`}
                style={{
                  color: textColor,
                  fontFamily: labelFontFamily,
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                {label}
              </label>
            )}

            {/* Selected values — white chips, each removable with  */}
            {value.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginBottom: "8px",
                }}
              >
                {value.map((v) => (
                  <span
                    key={v}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: surface,
                      border,
                      borderRadius: "999px",
                      padding: "3px 6px 3px 10px",
                      fontFamily: inputFontFamily,
                      fontSize: "13px",
                      color: textColor,
                      lineHeight: 1.4,
                    }}
                  >
                    {labelFor(v)}
                    <button
                      type="button"
                      className="mrs-x"
                      aria-label={isCn ? `移除 ${labelFor(v)}` : `Remove ${labelFor(v)}`}
                      title={isCn ? "移除" : "Remove"}
                      disabled={disabled}
                      onClick={() => remove(v)}
                      onMouseDown={(e) => e.preventDefault()}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "16px",
                        height: "16px",
                        padding: 0,
                        border: "none",
                        background: "transparent",
                        color: textColor,
                        cursor: disabled ? "not-allowed" : "pointer",
                      }}
                    >
                      <X size={12} strokeWidth={2.2} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Trigger + dropdown */}
            <div style={{ position: "relative" }}>
              <div
                id={`${name}-relation`}
                className="mrs-trigger"
                onClick={() => !disabled && !loading && setIsOpen((o) => !o)}
                style={{
                  backgroundColor: surface,
                  border,
                  borderRadius: radius,
                  minHeight: "38px",
                  padding: "8px 12px",
                  cursor: disabled || loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  fontFamily: inputFontFamily,
                  fontSize: "13px",
                  color: textColor,
                }}
              >
                <input
                  type="text"
                  placeholder={placeholder || (isCn ? "选择…" : "Select…")}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsOpen(true);
                  }}
                  onFocus={() => !disabled && setIsOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsOpen(false);
                      e.currentTarget.blur();
                    }
                  }}
                  disabled={disabled || loading}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    flex: 1,
                    minWidth: 0,
                    fontFamily: inputFontFamily,
                    fontSize: "13px",
                    color: textColor,
                    cursor: disabled || loading ? "not-allowed" : "text",
                  }}
                />
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>

              {isOpen && !loading && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: "4px",
                    backgroundColor: surface,
                    border,
                    borderRadius: radius,
                    zIndex: 50,
                    overflow: "hidden",
                  }}
                >
                  {/* Free-text row (optional) */}
                  {allowCustom && (
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        padding: "8px",
                        borderBottom: hairline,
                      }}
                    >
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustom();
                          }
                          if (e.key === "Escape") setIsOpen(false);
                        }}
                        placeholder={isCn ? "输入自定义值后回车" : "Type a value, then Enter"}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          border: hairline,
                          borderRadius: "6px",
                          padding: "5px 8px",
                          fontFamily: inputFontFamily,
                          fontSize: "13px",
                          color: textColor,
                          outline: "none",
                          background: surface,
                        }}
                      />
                      <button
                        type="button"
                        onClick={addCustom}
                        disabled={disabled}
                        aria-label={isCn ? "添加" : "Add"}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border,
                          borderRadius: "6px",
                          background: surface,
                          color: textColor,
                          cursor: disabled ? "not-allowed" : "pointer",
                          padding: "0 8px",
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}

                  {/* Options */}
                  <div style={{ maxHeight: "240px", overflowY: "auto" }}>
                    {filteredOptions.length === 0 ? (
                      <div
                        style={{
                          padding: "12px",
                          fontSize: "13px",
                          color: secondaryText,
                          fontFamily: inputFontFamily,
                        }}
                      >
                        {isCn ? "暂无选项" : "No options"}
                        {allowCustom ? (isCn ? "，可输入自定义值" : " — type a value above") : ""}
                      </div>
                    ) : (
                      filteredOptions.map((opt) => {
                        const v = opt.value ?? opt.label;
                        const checked = value.includes(v);
                        return (
                          <div
                            key={v}
                            className="mrs-row"
                            role="option"
                            aria-selected={checked}
                            onClick={() => toggle(opt)}
                            style={{
                              padding: "8px 12px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              background: surface,
                              borderBottom: hairline,
                              fontFamily: inputFontFamily,
                              fontSize: "13px",
                              color: textColor,
                              fontWeight: checked ? 600 : 400,
                            }}
                          >
                            <span className="mrs-row-label" style={{ flex: 1 }}>
                              {opt.label}
                            </span>
                            {opt.description ? (
                              <span
                                style={{
                                  color: secondaryText,
                                  fontSize: "12px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {opt.description}
                              </span>
                            ) : null}
                            {checked ? <Check size={14} strokeWidth={2.4} /> : null}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Hint / count */}
            {(hint || value.length > 0) && (
              <div
                style={{
                  fontSize: "12px",
                  color: secondaryText,
                  marginTop: "6px",
                  fontFamily: labelFontFamily,
                }}
              >
                {hint || `${value.length} ${isCn ? "项已选" : "selected"}`}
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default MultiRelationSelector;
