import React, { useMemo } from 'react';
import { Select } from 'antd';
import { Controller } from "react-hook-form";
import useFont from '@/hooks/useFont';

const { Option } = Select;

/**
 * maxOrder  : highest number that should appear in the list  (default 100)
 * options   : (optional) if you want to supply the list yourself
 *             – if omitted we build 1…maxOrder for you
 */
const OrderSelector = ({
  label,
  form,
  disabled,
  getLabel,
  onFieldChange,
  colors,
  labelFontFamily,
  maxOrder = 100,
  options: userOptions,
  name = "order",
  isCn = false,
}) => {
  const { style: labelFontStyle, inputFontFamily, labelFontFamily: fontFamily } = useFont();
  
  /* --------------------------------------------------
   * build 1…maxOrder if caller did not give us options
   * -------------------------------------------------- */
  const builtOptions = useMemo(() => {
    if (userOptions?.length) return userOptions;
    return Array.from({ length: maxOrder }, (_, i) => ({
      label: String(i + 1),
      value: String(i + 1),
    }));
  }, [userOptions, maxOrder]);

  // With react-hook-form
  if (form) {
    return (
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <div 
            style={{ marginBottom: '16px' }}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
              <label 
                className="form-label" 
                style={{ 
                  color: colors?.text || '#2c2c2c',
                  fontFamily: labelFontFamily || fontFamily,
                  fontSize: '14px',
                  fontWeight: 500,
                  minWidth: '0px'
                }}
              >
                {label}
              </label>
              <span style={{ 
                color: colors?.text || '#2c2c2c',
                fontFamily: labelFontFamily || fontFamily,
                fontSize: '14px',
                marginLeft: '8px'
              }}>
                |
              </span>
            </div>
            <Select
              {...field}
              id={name}
              placeholder={getLabel ? getLabel('orderPlaceholder', isCn) : (isCn ? '选择排序' : 'Select order...')}
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
              onChange={(value) => {
                field.onChange(value || "");
                onFieldChange && onFieldChange('order');
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
                <em>{isCn ? '选择排序' : 'Select order'}</em>
              </Option>
              {builtOptions.map((option) => (
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
                  fontFamily: labelFontFamily || fontFamily
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

  // Without react-hook-form (fallback)
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
            fontFamily: labelFontFamily || fontFamily,
            fontSize: '14px',
            fontWeight: 500,
            minWidth: '0px'
          }}
        >
          {label}
        </label>
        <span style={{ 
          color: colors?.text || '#2c2c2c',
          fontFamily: labelFontFamily || fontFamily,
          fontSize: '14px',
          marginLeft: '8px'
        }}>
          |
        </span>
      </div>
      <Select
        id={name}
        placeholder={getLabel ? getLabel('orderPlaceholder', isCn) : (isCn ? '选择排序' : 'Select order...')}
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
        onTouchEnd={(e) => e.stopPropagation()}
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
          <em>{isCn ? '选择排序' : 'Select order'}</em>
        </Option>
        {builtOptions.map((option) => (
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

export default OrderSelector;