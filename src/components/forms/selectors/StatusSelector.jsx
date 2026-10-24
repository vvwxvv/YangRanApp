"use client";
import React, { useMemo, useCallback, useId } from 'react';
import { Select } from 'antd';
import { Controller } from 'react-hook-form';
import useFont from '@/hooks/useFont';

const { Option } = Select;

// ─── Constants ────────────────────────────────────────────────────────────────
const EMPTY_VALUE = '';

// ─── State definitions per entity type ───────────────────────────────────────
// Extend these arrays to add more states per entity.
const STATE_MAP = {
  event: [
    { value: 'draft',     label_en: 'Draft',     label_cn: '草稿'   },
    { value: 'upcoming',  label_en: 'Upcoming',  label_cn: '即将举行' },
    { value: 'ongoing',   label_en: 'Ongoing',   label_cn: '进行中'  },
    { value: 'ended',     label_en: 'Ended',     label_cn: '已结束'  },
    { value: 'cancelled', label_en: 'Cancelled', label_cn: '已取消'  },
    { value: 'archived',  label_en: 'Archived',  label_cn: '已归档'  },
  ],
  exhibition: [
    { value: 'draft',     label_en: 'Draft',     label_cn: '草稿'   },
    { value: 'upcoming',  label_en: 'Upcoming',  label_cn: '即将开幕' },
    { value: 'open',      label_en: 'Open',      label_cn: '展览中'  },
    { value: 'closed',    label_en: 'Closed',    label_cn: '已闭幕'  },
    { value: 'travelling',label_en: 'Travelling',label_cn: '巡回中'  },
    { value: 'archived',  label_en: 'Archived',  label_cn: '已归档'  },
  ],
};

// Fallback: generic states used when entityType is not recognised
const DEFAULT_STATES = [
  { value: 'draft',     label_en: 'Draft',     label_cn: '草稿'  },
  { value: 'published', label_en: 'Published', label_cn: '已发布' },
  { value: 'archived',  label_en: 'Archived',  label_cn: '已归档' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const resolveLabel = (getLabel, key, isCn, fallbackEn, fallbackCn) => {
  if (getLabel) return getLabel(key, isCn);
  return isCn ? fallbackCn : fallbackEn;
};

const getStatesForEntity = (entityType, isCn) => {
  const key    = (entityType || '').toLowerCase();
  const source = STATE_MAP[key] ?? DEFAULT_STATES;
  return source.map((s) => ({
    value: s.value,
    label: isCn ? s.label_cn : s.label_en,
  }));
};

const optionStyle = (colors, inputFontFamily) => ({
  color:           colors?.text       || '#2c2c2c',
  backgroundColor: colors?.background || '#fff',
  fontFamily:      inputFontFamily,
  minHeight:       '44px',
  display:         'flex',
  alignItems:      'center',
  padding:         '12px 16px',
});

// ─── Sub-components ───────────────────────────────────────────────────────────
const FieldLabel = ({ htmlFor, label, colors, labelFontFamily }) => (
  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
    <label
      htmlFor={htmlFor}
      className="form-label"
      style={{
        color:      colors?.text || '#2c2c2c',
        fontFamily: labelFontFamily,
        fontSize:   '14px',
        fontWeight: 500,
      }}
    >
      {label}
    </label>
    <span
      aria-hidden="true"
      style={{ color: colors?.text || '#2c2c2c', fontFamily: labelFontFamily, fontSize: '14px' }}
    >
      |
    </span>
  </div>
);

const ErrorMessage = ({ error, labelFontFamily }) =>
  error ? (
    <div
      role="alert"
      style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px', fontFamily: labelFontFamily }}
    >
      {error.message}
    </div>
  ) : null;

// ─── StateSelector ────────────────────────────────────────────────────────────
const StateSelector = ({
  form,
  entityType,          // 'event' | 'exhibition' — drives which state list is shown
  value,
  onChange,
  disabled,
  getLabel,            // optional (key, isCn) => string override for labels
  schemaName,          // fallback for entityType when entityType is not supplied
  onFieldChange,
  colors,
  isCn = false,
  name = 'status',     // RHF field name — matches the Prisma field
  ...registerProps
}) => {
  const { inputFontFamily, labelFontFamily } = useFont();
  const autoId  = useId();
  const fieldId = `state-selector-${autoId}`;

  const entityTypeToUse = entityType || schemaName || 'event';

  // ── Build deduplicated option list ────────────────────────────────────────
  const stateOptions = useMemo(() => {
    const raw  = getStatesForEntity(entityTypeToUse, isCn);
    const seen = new Set();
    return raw.filter((opt) => {
      if (!opt.value?.trim()) return false;
      if (seen.has(opt.value)) return false;
      seen.add(opt.value);
      return true;
    });
  }, [entityTypeToUse, isCn]);

  const fieldLabel  = resolveLabel(getLabel, 'state',            isCn, 'Status',           '状态');
  const placeholder = resolveLabel(getLabel, 'statePlaceholder', isCn, 'Select status...', '选择状态');

  const selectStyle = useMemo(() => ({
    width:           '100%',
    fontFamily:      inputFontFamily,
    color:           colors?.text       || '#2c2c2c',
    backgroundColor: colors?.background || '#fff',
    borderColor:     colors?.border     || '#d9d9d9',
    borderRadius:    '8px',
  }), [inputFontFamily, colors]);

  const sharedSelectProps = {
    id:               fieldId,
    placeholder,
    disabled,
    showSearch:       true,
    allowClear:       true,
    style:            selectStyle,
    getPopupContainer: (trigger) => trigger.parentElement,
    listHeight:       256,
    virtual:          true,
    onTouchEnd:       (e) => e.stopPropagation(),
    popupRender:      (menu) => (
      <div onTouchEnd={(e) => e.stopPropagation()}>{menu}</div>
    ),
  };

  const renderedOptions = useMemo(() => {
    const style = optionStyle(colors, inputFontFamily);
    return [
      <Option key="__placeholder__" value={EMPTY_VALUE} style={style}>
        <em>{isCn ? '选择状态' : 'Select status'}</em>
      </Option>,
      ...stateOptions.map((opt) => (
        <Option key={opt.value} value={opt.value} style={style}>
          {opt.label}
        </Option>
      )),
    ];
  }, [stateOptions, colors, inputFontFamily, isCn]);

  const makeChangeHandler = useCallback(
    (fieldOnChange) => (val) => {
      fieldOnChange?.(val ?? EMPTY_VALUE);
      onFieldChange?.('status');
    },
    [onFieldChange]
  );

  const Wrapper = ({ children, error }) => (
    <div style={{ marginBottom: '16px' }} onTouchEnd={(e) => e.stopPropagation()}>
      <FieldLabel
        htmlFor={fieldId}
        label={fieldLabel}
        colors={colors}
        labelFontFamily={labelFontFamily}
      />
      {children}
      <ErrorMessage error={error} labelFontFamily={labelFontFamily} />
    </div>
  );

  // ── With react-hook-form ──────────────────────────────────────────────────
  if (form) {
    return (
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState }) => (
          <Wrapper error={fieldState.error}>
            <Select
              {...sharedSelectProps}
              {...field}
              value={field.value || EMPTY_VALUE}
              onChange={makeChangeHandler(field.onChange)}
            >
              {renderedOptions}
            </Select>
          </Wrapper>
        )}
      />
    );
  }

  // ── Without react-hook-form ───────────────────────────────────────────────
  return (
    <Wrapper>
      <Select
        {...sharedSelectProps}
        {...registerProps}
        value={value || EMPTY_VALUE}
        onChange={makeChangeHandler(onChange)}
      >
        {renderedOptions}
      </Select>
    </Wrapper>
  );
};

export default StateSelector;