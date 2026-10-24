// FormDateTimePicker.jsx
import React from 'react';
import { DatePicker } from 'antd';
import { Controller } from 'react-hook-form';
import useFont from '@/hooks/useFont';
import { getSystemLabel } from '@/components/labels/system_labels';
import { LanguageContext } from '@/components/contexts/LanguageContext';
import { useContext } from 'react';

const { RangePicker } = DatePicker;

/**
 * Universal date-time picker (AntD) wrapped for React-Hook-Form
 * @param {Object} props
 * @param {string} props.name – field name
 * @param {string} props.label – optional label (i18n key)
 * @param {import('react-hook-form').Control} props.control
 * @param {Object} [props.error]
 * @param {boolean} [props.disabled]
 * @param {Object} [props.colors] – {text,background,border}
 * @param {string} [props.labelFontFamily]
 * @param {Object} [props.inputStyles]
 * @param {Function} [props.onChange] – side callback after value change
 * @param {string} [props.mode] – "date" | "datetime"
 * @param {string} [props.format] – custom format (default: date → YYYY-MM-DD, datetime → YYYY-MM-DD HH:mm:ss)
 * @param {boolean} [props.showTime] – force time picker
 * @param {string} [props.placeholder]
 * @param {Object} [props.pickerProps] – extra AntD props
 */
const FormDateTimePicker = ({
  name,
  label,
  control,
  error,
  disabled,
  colors = {},
  labelFontFamily,
  inputStyles = {},
  onChange: outerOnChange,
  mode = 'datetime',
  format,
  showTime,
  placeholder,
  pickerProps = {},
}) => {
  const { isCn } = useContext(LanguageContext);
  const { style: labelStyle } = useFont();

  const isDatetime = mode === 'datetime' || showTime;
  const defaultFormat = isDatetime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
  const dateFormat = format || defaultFormat;

  const labelNode = label && (
    <label
      style={{
        display: 'block',
        marginBottom: 4,
        color: colors.text || labelStyle?.color || '#000',
        fontFamily: labelFontFamily || labelStyle?.fontFamily,
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      {getSystemLabel(label, isCn)}
    </label>
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ...rest } }) => (
        <div style={{ marginBottom: 16 }}>
          {labelNode}
          <DatePicker
            {...rest}
            style={{
              width: '100%',
              borderRadius: 8,
              backgroundColor: colors.background || '#fff',
              borderColor: colors.border || '#d9d9d9',
              ...inputStyles,
            }}
            value={value}
            format={dateFormat}
            showTime={isDatetime}
            onChange={(date, dateString) => {
              onChange(date);
              outerOnChange?.(date, dateString);
            }}
            disabled={disabled}
            placeholder={placeholder || (isCn ? '选择日期时间' : 'Select date/time')}
            {...pickerProps}
          />
          {error && (
            <div style={{ color: '#ff4d4f', fontSize: 12, marginTop: 4 }}>
              {error.message}
            </div>
          )}
        </div>
      )}
    />
  );
};

export default FormDateTimePicker;