import React from 'react';
import { Select } from 'antd';
import { Controller } from 'react-hook-form';
import useFont from '@/hooks/useFont';

const { Option } = Select;

/**
 * 通用枚举选择器
 * @param {Object} props
 * @param {string} props.name          字段名（form 用）
 * @param {Array<{label:string,value:string}>} props.options 下拉选项
 * @param {import('react-hook-form').Control} [props.control]  有则走 RHF，无则受控
 * @param {string|number} [props.value]   受控值（control 不存在时生效）
 * @param {Function} [props.onChange]     受控回调
 * @param {Function} [props.getLabel]     翻译函数
 * @param {boolean} [props.disabled]
 * @param {string} [props.language='en']
 * @param {Object} [props.colors]         {text,background,border}
 * @param {Function} [props.onFieldChange] 选中后额外回调
 * @param {Object} [props.registerProps]  其余 antd Select 属性
 */
const ItemSelector = ({
  name,
  options = [],
  control,
  value,
  onChange,
  getLabel,
  disabled,
  language = 'en',
  colors,
  onFieldChange,
  ...registerProps
}) => {
  const { style: labelFontStyle, labelFontFamily } = useFont();

  // 统一样式
  const selectStyle = {
    width: '100%',
    fontFamily: labelFontStyle?.fontFamily || labelFontFamily,
    color: colors?.text || '#000',
    backgroundColor: colors?.background || '#fff',
    borderColor: colors?.border || '#ccc',
    borderRadius: '8px',
  };

  const labelNode = (
    <label
      className="form-label"
      style={{
        color: colors?.text || '#000',
        fontFamily: labelFontFamily,
        fontSize: '14px',
        fontWeight: 500,
      }}
    >
      {getLabel ? getLabel(name) : name}
    </label>
  );

  // 如果传了 control → 走 React-Hook-Form
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div style={{ marginBottom: 16 }} onTouchEnd={(e) => e.stopPropagation()}>
            {labelNode}
            <Select
              {...field}
              id={name}
              placeholder={getLabel ? getLabel(name) : name}
              disabled={disabled}
              showSearch
              allowClear
              style={selectStyle}
              onChange={(v) => {
                field.onChange(v);
                onFieldChange?.(name);
              }}
              popupRender={(menu) => (
                <div onTouchEnd={(e) => e.stopPropagation()}>{menu}</div>
              )}
              value={field.value ?? ''}
            >
              {options.map((o) => (
                <Option key={o.value} value={o.value}>
                  {o.label}
                </Option>
              ))}
            </Select>
          </div>
        )}
      />
    );
  }

  // 受控/非受控模式
  const handleChange = (v) => {
    onChange?.(v);
    registerProps.onChange?.(v);
    onFieldChange?.(name);
  };

  return (
    <div style={{ marginBottom: 16 }} onTouchEnd={(e) => e.stopPropagation()}>
      {labelNode}
      <Select
        {...registerProps}
        id={name}
        value={value ?? ''}
        placeholder={getLabel ? getLabel(name) : name}
        disabled={disabled}
        showSearch
        allowClear
        style={selectStyle}
        onChange={handleChange}
        popupRender={(menu) => (
          <div onTouchEnd={(e) => e.stopPropagation()}>{menu}</div>
        )}
      >
        {options.map((o) => (
          <Option key={o.value} value={o.value}>
            {o.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default ItemSelector;