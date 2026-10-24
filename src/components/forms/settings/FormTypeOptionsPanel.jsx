"use client";

/**
 * Type options for ONE form — the per-entity dropdown list used by that form's
 * `type` field.
 *
 * Moved here from Site Meta: a list of artwork types belongs to the artwork
 * form, not to the site's global settings. Stored in the Meta document at
 * `meta.formTypes[formKey]` (same place as before, same shape), so existing
 * values keep working.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from 'antd';
import useSiteMeta from '@/hooks/useSiteMeta';
import { FORM_TYPE_OPTIONS } from '@/utils/siteMetaDefaults';

const T = (isCn, en, cn) => (isCn ? cn : en);

const toClean = (option = {}) => ({
  label_en: String(option.label_en ?? option.value ?? '').trim(),
  label_cn: String(option.label_cn ?? option.label_en ?? option.value ?? '').trim(),
});

const inputStyle = {
  width: '100%',
  border: 0,
  borderBottom: '1px solid rgba(0,0,0,.18)',
  background: 'transparent',
  padding: '5px 0',
  fontSize: 13,
  outline: 'none',
};

export default function FormTypeOptionsPanel({ formKey, isCn }) {
  const { meta, save, saving } = useSiteMeta();
  const [list, setList] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const storedKey = meta?.formTypes?.[formKey];

  useEffect(() => {
    if (!formKey) return;
    const stored = Array.isArray(storedKey) ? storedKey : null;
    const fallback = Array.isArray(FORM_TYPE_OPTIONS?.[formKey]) ? FORM_TYPE_OPTIONS[formKey] : [];
    setList((stored && stored.length ? stored : fallback).map((option) => ({
      label_en: option.label_en ?? option.value ?? '',
      label_cn: option.label_cn ?? '',
    })));
    setDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formKey, storedKey]);

  const update = (index, patch) => {
    setList((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
    setDirty(true);
    setSaved(false);
  };

  const remove = (index) => {
    setList((prev) => prev.filter((_, i) => i !== index));
    setDirty(true);
    setSaved(false);
  };

  const add = () => {
    setList((prev) => [...prev, { label_en: '', label_cn: '' }]);
    setDirty(true);
    setSaved(false);
  };

  const submit = async () => {
    setError(null);
    try {
      const cleaned = list
        .map(toClean)
        .filter((option) => option.label_en || option.label_cn);
      await save({
        ...(meta || {}),
        formTypes: { ...(meta?.formTypes || {}), [formKey]: cleaned },
      });
      setDirty(false);
      setSaved(true);
    } catch (err) {
      setError(err?.message || 'Save failed');
    }
  };

  const hint = useMemo(
    () =>
      T(
        isCn,
        'Values offered by this form’s “type” dropdown. Editing here only affects this form.',
        '这个表单的 type 下拉选项，只影响当前表单。'
      ),
    [isCn]
  );

  if (!formKey) return null;

  return (
    <div>
      <div style={{ fontSize: 11.5, opacity: 0.6, lineHeight: 1.6, marginBottom: 14 }}>{hint}</div>

      {list.length === 0 ? (
        <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 12 }}>
          {T(isCn, 'No options yet.', '还没有选项。')}
        </div>
      ) : null}

      {list.map((option, index) => (
        <div key={index} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 8 }}>
          <input
            style={inputStyle}
            value={option.label_en}
            placeholder="English"
            onChange={(e) =>
              update(index, {
                label_en: e.target.value,
                label_cn: option.label_cn || e.target.value,
              })
            }
          />
          <input
            style={inputStyle}
            value={option.label_cn}
            placeholder="中文"
            onChange={(e) => update(index, { label_cn: e.target.value })}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            aria-label={T(isCn, 'Remove', '删除')}
            style={{
              border: 0,
              background: 'none',
              cursor: 'pointer',
              fontSize: 14,
              lineHeight: 1,
              opacity: 0.45,
              padding: '4px 2px',
            }}
          >
            ×
          </button>
        </div>
      ))}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
        <Button size="small" onClick={add} style={{ fontSize: 12 }}>
          + {T(isCn, 'Add option', '添加选项')}
        </Button>
        <Button
          size="small"
          disabled={!dirty || saving}
          loading={saving}
          onClick={submit}
          style={{
            background: 'var(--background-primary, #fff)',
            border: '1px solid var(--text-primary, #000)',
            fontSize: 12,
          }}
        >
          {T(isCn, 'Save', '保存')}
        </Button>
        {saved && !dirty ? <span style={{ fontSize: 11, color: 'green' }}>{T(isCn, 'Saved', '已保存')}</span> : null}
        {error ? <span style={{ fontSize: 11, color: '#b00020' }}>{error}</span> : null}
      </div>
    </div>
  );
}
