"use client";
import React from 'react';
import { Select } from 'antd';
import { Controller } from "react-hook-form";
import useFont from '@/hooks/useFont';

// The stored value is the short code (EN / CN) — the label shows both so the
// dropdown reads clearly in either UI language.
export const languageOptions = [
  { value: 'EN', label_en: 'English (EN)', label_cn: '英文 (EN)' },
  { value: 'CN', label_en: 'Chinese (CN)', label_cn: '中文 (CN)' }
];

const { Option } = Select;

const LanguageSelector = ({ 
  form,
  value, 
  onChange, 
  disabled, 
  getLabel, 
  onFieldChange,
  colors,
  isCn = false,
  name = "language",
  // `compact` = single-line label + dropdown, used in a form header row
  // (e.g. next to “Form settings”) instead of a full-width stacked field.
  compact = false,
  // Compact mode can drop the “语言 |” label entirely (header row usage).
  showLabel = true,
  ...registerProps 
}) => {
  const { style: labelFontStyle, inputFontFamily, labelFontFamily } = useFont();
  
  // Use the existing languageOptions array and map to proper format
  const filteredLanguageOptions = languageOptions.map(option => ({
    value: option.value,
    label: isCn ? option.label_cn : option.label_en
  })).filter(option => 
    option.value && option.value.trim() !== ''
  );

  // With react-hook-form
  if (form) {
    return (
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <>
          {compact ? (
            <style>{`
              .lang-compact .ant-select-selector { padding-inline: 8px !important; }
              .lang-compact .ant-select-selection-item { text-align: center; }
            `}</style>
          ) : null}
          <div 
            style={{
              marginBottom: compact ? 0 : '16px',
              ...(compact
                ? { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }
                : null),
            }}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {showLabel !== false && (
            <div
              style={{
                marginBottom: compact ? 0 : '8px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <label 
                className="form-label" 
                style={{ 
                  color: colors?.text || '#2c2c2c',
                  fontFamily: labelFontFamily,
                  fontSize: '14px',
                  fontWeight: 500,
                  minWidth: '0px',
                  whiteSpace: 'nowrap',
                }}
              >
                {getLabel ? getLabel('language') : (isCn ? '语言' : 'Language')}
              </label>
              <span style={{ 
                color: colors?.text || '#2c2c2c',
                fontFamily: labelFontFamily,
                fontSize: '14px',
                marginLeft: compact ? '6px' : '8px'
              }}>
                |
              </span>
            </div>
            )}
            <Select
              {...field}
              id={name}
              size={compact ? 'small' : 'middle'}
              className={compact ? 'lang-compact' : undefined}
              suffixIcon={compact ? null : undefined}
              placeholder={getLabel ? getLabel('languagePlaceholder') : (isCn ? '选择语言' : 'Select language...')}
              disabled={disabled}
              showSearch
              allowClear
              style={{
                width: compact ? 104 : '100%',
                textAlign: compact ? 'center' : undefined,
                cursor: compact ? 'pointer' : undefined,
                height: compact ? 28 : undefined,
                fontSize: compact ? 12 : undefined,
                paddingInline: 0,
                fontFamily: inputFontFamily,
                color: colors?.text || '#2c2c2c',
                backgroundColor: colors?.background || '#fff',
                borderColor: colors?.border || '#d9d9d9',
                borderRadius: '8px',
              }}
              getPopupContainer={(trigger) => trigger.parentElement}
              listHeight={256}
              virtual={true}
              onChange={(value) => {
                field.onChange(value || "");
                onFieldChange && onFieldChange('language');
              }}
              onTouchEnd={(e) => e.stopPropagation()}
              value={field.value || ""}
              popupRender={(menu) => (
                <div onTouchEnd={(e) => e.stopPropagation()}>
                  {menu}
                </div>
              )}
            >
              <Option 
                key="placeholder"
                value="" 
                style={{
                  color: colors?.text || '#2c2c2c',
                  backgroundColor: colors?.background || '#fff',
                  fontFamily: inputFontFamily,
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                }}
              >
                <em>{isCn ? '选择语言' : 'Select language'}</em>
              </Option>
              {filteredLanguageOptions.map((option) => (
                <Option 
                  key={option.value} 
                  value={option.value} 
                  style={{
                    color: colors?.text || '#2c2c2c',
                    backgroundColor: colors?.background || '#fff',
                    fontFamily: inputFontFamily,
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                  }}
                >
                  {option.label}
                </Option>
              ))}
            </Select>
            {form.formState.errors?.[name] && (
              <div 
                style={{ 
                  color: '#d32f2f', 
                  fontSize: '12px', 
                  marginTop: '4px',
                  fontFamily: labelFontFamily
                }}
              >
                {form.formState.errors[name].message}
              </div>
            )}
          </div>
          </>
        )}
      />
    );
  }

  // Without react-hook-form
  const handleChange = (val) => {
    const stringValue = val || "";
    onChange?.(stringValue);
    registerProps.onChange?.(stringValue);
    onFieldChange?.('language');
  };

  return (
    <div 
      style={{ marginBottom: '16px' }}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
        <label 
          className="form-label" 
          style={{ 
            color: colors?.text || '#2c2c2c',
            fontFamily: labelFontFamily,
            fontSize: '14px',
            fontWeight: 500,
            minWidth: '0px'
          }}
        >
          {getLabel ? getLabel('language') : (isCn ? '语言' : 'Language')}
        </label>
        <span style={{ 
          color: colors?.text || '#2c2c2c',
          fontFamily: labelFontFamily,
          fontSize: '14px',
          marginLeft: '8px'
        }}>
          |
        </span>
      </div>
      <Select
        id={name}
        value={value || ""}
        placeholder={getLabel ? getLabel('languagePlaceholder') : (isCn ? '选择语言' : 'Select language...')}
        disabled={disabled}
        showSearch
        allowClear
        style={{
          width: '100%',
          fontFamily: inputFontFamily,
          color: colors?.text || '#2c2c2c',
          backgroundColor: colors?.background || '#fff',
          borderColor: colors?.border || '#d9d9d9',
          borderRadius: '8px',
        }}
        getPopupContainer={(trigger) => trigger.parentElement}
        listHeight={256}
        virtual={true}
        onChange={handleChange}
        onTouchEnd={(e) => e.stopPropagation()}
        popupRender={(menu) => (
          <div onTouchEnd={(e) => e.stopPropagation()}>
            {menu}
          </div>
        )}
        {...registerProps}
      >
        <Option 
          key="placeholder"
          value="" 
          style={{
            color: colors?.text || '#2c2c2c',
            backgroundColor: colors?.background || '#fff',
            fontFamily: inputFontFamily,
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
          }}
        >
          <em>{isCn ? '选择语言' : 'Select language'}</em>
        </Option>
        {filteredLanguageOptions.map((option) => (
          <Option 
            key={option.value} 
            value={option.value} 
            style={{
              color: colors?.text || '#2c2c2c',
              backgroundColor: colors?.background || '#fff',
              fontFamily: inputFontFamily,
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
            }}
          >
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default LanguageSelector;