import React from 'react';
import { Select } from 'antd';
import { Controller } from "react-hook-form";
import useFont from '@/hooks/useFont';

const { Option } = Select;

/**
 * YearSelector — simple, single-value year dropdown (1980 → current year).
 *
 * Single select: picking another year replaces the current one directly.
 * (It used to run in antd `tags` mode, which turned the value into a chip you
 * had to remove with the before choosing again.)
 *
 * @param {string}  name              RHF field name (default "year")
 * @param {object}  form              react-hook-form instance
 * @param {string}  value             value when used outside RHF
 * @param {function} onChange         change handler when used outside RHF
 * @param {boolean} disabled
 * @param {function} getLabel         label lookup (receives "year")
 * @param {object}  colors            { text, background, border }
 * @param {number}  startYear         1980
 * @param {number}  endYear           current year
 * @param {string}  placeholder
 * @param {boolean} isCn
 * @param {boolean} allowCustomInput  true → keep accepting a typed year (combobox);
 *                                    false (default) → only list years
 * @param {boolean} allowClear show the small to unset an existing year
 */
const YearSelector = ({
  form,
  name = 'year',
  value,
  onChange,
  disabled,
  getLabel,
  onFieldChange,
  colors,
  // Year range used by every form: 1980 → current year.
  startYear = 1980,
  endYear = new Date().getFullYear(),
  placeholder,
  isCn = false,
  allowCustomInput = false,
  allowClear = true,
  ...registerProps
}) => {
  const { inputFontFamily, labelFontFamily } = useFont();

  // Newest first: 2026, 2025, … 1980
  const yearOptions = React.useMemo(() => {
    const years = [];
    for (let year = endYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
  }, [startYear, endYear]);

  const labelText = getLabel ? getLabel('year', isCn) : (isCn ? '年份' : 'Year');
  const placeholderText =
    placeholder ||
    (getLabel ? getLabel('yearPlaceholder', isCn) : null) ||
    (isCn ? '选择年份' : 'Select year');

  const toValue = (raw) => {
    const v = raw === undefined || raw === null ? '' : String(raw).trim();
    return v === '' ? undefined : v;
  };

  const commonProps = {
    showSearch: true,
    allowClear,
    // Single-value dropdown: choosing a year replaces the previous one.
    mode: allowCustomInput ? 'combobox' : undefined,
    style: { width: '100%', fontFamily: inputFontFamily },
    styles: { popup: { root: { fontFamily: inputFontFamily } } },
    filterOption: (input, option) =>
      String(option?.value || '').toLowerCase().includes(input.toLowerCase()),
    popupRender: (menu) => (
      <div onTouchEnd={(e) => e.stopPropagation()}>{menu}</div>
    ),
  };

  const renderOptions = () =>
    yearOptions.map((year) => (
      <Option
        key={year}
        value={String(year)}
        style={{
          color: colors?.text || '#2c2c2c',
          backgroundColor: colors?.background || '#fff',
          fontFamily: inputFontFamily,
        }}
      >
        {year}
      </Option>
    ));

  if (form) {
    return (
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <div style={{ marginBottom: '16px' }} onTouchEnd={(e) => e.stopPropagation()}>
            <label
              className="form-label"
              style={{
                color: colors?.text || '#2c2c2c',
                fontFamily: labelFontFamily,
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                display: 'block',
              }}
            >
              {labelText}
            </label>
            <Select
              id={name}
              {...commonProps}
              disabled={disabled}
              placeholder={placeholderText}
              value={toValue(field.value)}
              onChange={(val) => {
                field.onChange(val === undefined || val === null ? '' : String(val));
                onFieldChange && onFieldChange('year');
              }}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              {renderOptions()}
            </Select>
            {form.formState.errors?.[name] && (
              <div
                style={{
                  color: '#d32f2f',
                  fontSize: '12px',
                  marginTop: '4px',
                  fontFamily: labelFontFamily,
                }}
              >
                {form.formState.errors[name].message}
              </div>
            )}
          </div>
        )}
      />
    );
  }

  const handleChange = (val) => {
    const stringValue = val === undefined || val === null ? '' : String(val);
    onChange?.(stringValue);
    registerProps.onChange?.(stringValue);
    onFieldChange?.('year');
  };

  return (
    <div style={{ marginBottom: '16px' }} onTouchEnd={(e) => e.stopPropagation()}>
      <label
        className="form-label"
        style={{
          color: colors?.text || '#2c2c2c',
          fontFamily: labelFontFamily,
          fontSize: '14px',
          fontWeight: 500,
          marginBottom: '8px',
          display: 'block',
        }}
      >
        {labelText}
      </label>
      <Select
        id={name}
        {...commonProps}
        value={toValue(value)}
        disabled={disabled}
        placeholder={placeholderText}
        onChange={handleChange}
        onTouchEnd={(e) => e.stopPropagation()}
        {...registerProps}
      >
        {renderOptions()}
      </Select>
    </div>
  );
};

export default YearSelector;
