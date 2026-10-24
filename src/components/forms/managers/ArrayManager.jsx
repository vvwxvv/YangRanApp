"use client";
import React, { useContext, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import useFont from '@/hooks/useFont';
import { LanguageContext } from '@/components/contexts/LanguageContext';
import { Controller, useWatch } from 'react-hook-form';

// CSS Styles Constants (保持不变)
const STYLES = {
  container: { paddingTop: '16px' },
  fieldRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    alignItems: 'flex-start',
    marginBottom: '4px',
  },
  fieldRowWrapper: { marginBottom: '12px' },
  textField: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontSize: '14px',
    outline: 'none',
  },
  textFieldError: { borderColor: '#d32f2f' },
  errorText: {
    fontSize: '12px',
    color: '#d32f2f',
    marginTop: '4px',
    marginLeft: '2px',
  },
  removeButton: {
    marginTop: '2px',
    backgroundColor: 'rgba(211, 47, 47, 0.05)',
    border: 'none',
    borderRadius: '4px',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#d32f2f',
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 24px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "transparent",
  },
};

const CONSTANTS = {
  iconSizes: { plus: 14, trash: 14 },
};

/**
 * ArrayManager – 管理纯字符串数组字段（如 address）
 * 仅支持逐条添加/删除，无 JSON 批量导入。
 */
const ArrayManager = ({
  fields = [],
  append,
  remove,
  register,
  control,
  errors = {},
  getLabel,
  isSubmitting = false,
  fieldName = 'descriptions',
  itemLabel = 'Item',
  addButtonLabel = 'Add Item',
  removeButtonLabel = 'Remove',
  rows = 3,
  multiline = true,
  isCn: isCnProp,
  onChange,
}) => {
  const context = useContext(LanguageContext);
  const isCn = typeof isCnProp === 'boolean' ? isCnProp : context?.isCn;
  const { style: fontStyle, inputFontFamily } = useFont();

  const liveValue = useWatch({ control, name: fieldName, disabled: !control }) || [];

  if (!append || !remove || !register) return null;

  const handleAddItem = () => { if (!isSubmitting) append(''); };
  const handleRemoveItem = (index) => { if (!isSubmitting && fields.length > 0) remove(index); };
  const getFieldError = (index) => errors?.[fieldName]?.[index];
  const getItemLabel = (key) => {
    if (getLabel) return getLabel(key);
    const fallbackLabels = {
      descriptions: { item: 'Description', add: 'Add Description', remove: 'Remove' },
      paragraphs: { item: 'Paragraph', add: 'Add Paragraph', remove: 'Remove' },
      tags: { item: 'Tag', add: 'Add Tag', remove: 'Remove' },
      introduction: { item: 'Introduction', add: 'Add Introduction', remove: 'Remove' },
      address: { item: 'Address', add: 'Add Address', remove: 'Remove' },
    };
    return fallbackLabels[fieldName]?.[key] || itemLabel;
  };

  const inputStyleBase = {
    ...STYLES.textField,
    fontFamily: inputFontFamily,
  };

  return (
    <div style={STYLES.container}>
      {fields.map((field, index) => {
        const fieldError = getFieldError(index);
        const errorMessage = fieldError?.message || '';
        const InputTag = multiline ? 'textarea' : 'input';

        return (
          <div key={field.id} style={STYLES.fieldRowWrapper}>
            <div style={STYLES.fieldRow}>
              {control ? (
                <Controller
                  name={`${fieldName}.${index}`}
                  control={control}
                  defaultValue={field.value || ''}
                  render={({ field: controllerField }) => (
                    <InputTag
                      {...controllerField}
                      id={`${fieldName}-${index}`}
                      type={multiline ? undefined : 'text'}
                      rows={multiline ? rows : undefined}
                      disabled={isSubmitting}
                      style={{
                        ...inputStyleBase,
                        ...(errorMessage ? STYLES.textFieldError : {}),
                        resize: multiline ? 'vertical' : undefined,
                        minHeight: multiline ? `${rows * 20}px` : undefined,
                      }}
                      onChange={(e) => {
                        controllerField.onChange(e);
                        if (onChange) onChange(index, e.target.value);
                      }}
                      placeholder={getItemLabel('item')}
                    />
                  )}
                />
              ) : (
                <InputTag
                  id={`${fieldName}-${index}`}
                  type={multiline ? undefined : 'text'}
                  {...register(`${fieldName}.${index}`, {
                    onChange: (e) => { if (onChange) onChange(index, e.target.value); },
                  })}
                  rows={multiline ? rows : undefined}
                  disabled={isSubmitting}
                  style={{
                    ...inputStyleBase,
                    ...(errorMessage ? STYLES.textFieldError : {}),
                    resize: multiline ? 'vertical' : undefined,
                    minHeight: multiline ? `${rows * 20}px` : undefined,
                  }}
                  placeholder={getItemLabel('item')}
                />
              )}
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                disabled={isSubmitting}
                aria-label={`${getItemLabel('remove')} ${index + 1}`}
                style={STYLES.removeButton}
              >
                <Trash2 size={CONSTANTS.iconSizes.trash} />
              </button>
            </div>
            {errorMessage && <div style={STYLES.errorText}>{errorMessage}</div>}
          </div>
        );
      })}
      <button type="button" onClick={handleAddItem} disabled={isSubmitting} style={STYLES.addButton}>
        <Plus size={14} />
        <span style={{ marginLeft: '4px' }}>{getItemLabel('add')}</span>
      </button>
      {errors?.[fieldName]?.message && (
        <div style={STYLES.errorText}>{errors[fieldName].message}</div>
      )}
    </div>
  );
};

export default ArrayManager;