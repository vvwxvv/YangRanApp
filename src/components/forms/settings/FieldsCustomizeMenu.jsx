"use client";

/**
 * Form settings, in the form itself.
 *
 * Two layers, intentionally on separate tabs so they never get confused:
 *
 *   Everyone   → site-wide policy (Show / Required per field + section).
 *                Writes to /api/form-settings (FormSetting in Mongo).
 *   Only me    → this editor's local preferences (hide fields I never fill),
 *                stored in localStorage.
 *
 * The trigger sits right above the tabs next to the field count, so there is
 * nothing to go looking for in the manager nav.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Drawer, Tabs, Switch, Checkbox, Button, ConfigProvider } from 'antd';
import { useFormSettings } from '@/components/forms/settings/FormSettingsContext';
import FormTypeOptionsPanel from '@/components/forms/settings/FormTypeOptionsPanel';

const T = (isCn, en, cn) => (isCn ? cn : en);

const labelOf = (label, fallback, isCn) => {
  if (typeof label === 'string') return label;
  if (label && typeof label === 'object') {
    return (isCn ? label.cn || label.en : label.en || label.cn) || fallback;
  }
  return fallback;
};

export default function FieldsCustomizeMenu({ codeSections = [], fields = [], stats, isCn }) {
  const {
    formKey,
    settings,
    prefs,
    showAll,
    setShowAll,
    setFieldHidden,
    resetPrefs,
    updateSettings,
  } = useFormSettings();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('types');
  const [draft, setDraft] = useState({ sections: {}, fields: {} });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Seed the draft every time the drawer opens (and after a save lands), so
  // "Cancel" really cancels. `saved` is intentionally NOT reset here — it is
  // the confirmation shown right after save().
  useEffect(() => {
    if (!open) return;
    setDraft({
      sections: { ...(settings?.sections || {}) },
      fields: { ...(settings?.fields || {}) },
    });
    setDirty(false);
  }, [open, settings]);

  const setFieldCfg = (name, patch) => {
    setDraft((prev) => ({
      ...prev,
      fields: { ...prev.fields, [name]: { ...(prev.fields[name] || {}), ...patch } },
    }));
    setDirty(true);
    setSaved(false);
  };

  const setSectionCfg = (key, patch) => {
    setDraft((prev) => {
      const nextFields = { ...prev.fields };
      if (patch.visible === false) {
        // A hidden section can never be filled — drop its required flags too,
        // otherwise the form becomes impossible to save.
        const section = codeSections.find((s) => s.key === key);
        for (const field of section?.fields || []) {
          if (nextFields[field.name]?.required) {
            nextFields[field.name] = { ...nextFields[field.name], required: false };
          }
        }
      }
      return {
        ...prev,
        sections: { ...prev.sections, [key]: { ...(prev.sections[key] || {}), ...patch } },
        fields: nextFields,
      };
    });
    setDirty(true);
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateSettings(draft);
      setDirty(false);
      setSaved(true);
    } catch (error) {
      console.error('[form settings] save failed:', error);
      // eslint-disable-next-line no-alert
      alert(error?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const groups = useMemo(
    () =>
      (codeSections || [])
        .map((section) => ({
          key: String(section.key ?? ''),
          label: labelOf(section.label, String(section.key ?? ''), isCn),
          type: section.type || 'fields',
          fields: (section.fields || []).filter((f) => f?.name),
        }))
        .filter((section) => section.fields.length > 0),
    [codeSections, isCn]
  );

  const personalFields = useMemo(
    () => (fields || []).filter((f) => f.adminVisible !== false),
    [fields]
  );

  const everyoneTab = (
    <div>
      <div style={{ fontSize: 11.5, opacity: 0.6, lineHeight: 1.6, marginBottom: 14 }}>
        {T(
          isCn,
          'Controls whether a field is shown and whether it must be filled. Hiding keeps stored values; Required is checked on submit.',
          '控制字段是否显示、是否必填。隐藏不会删除已存数据，只是不再显示；必填会在保存时校验。'
        )}
      </div>

      {groups.length === 0 ? (
        <div style={{ fontSize: 12, opacity: 0.5 }}>
          {T(isCn, 'This form is still loading its fields.', '表单字段还没加载出来。')}
        </div>
      ) : null}

      {groups.map((section) => {
        const cfg = draft.sections?.[section.key] || {};
        const sectionVisible = cfg.visible !== false;
        return (
          <div key={section.key} style={{ marginBottom: 18 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                borderBottom: '1px solid rgba(0,0,0,.55)',
                paddingBottom: 4,
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>
                {section.label}
              </span>
              <span style={{ flex: 1 }} />
              <span style={{ fontSize: 10, opacity: 0.45 }}>{T(isCn, 'section', '区块')}</span>
              <Switch
                size="small"
                checked={sectionVisible}
                onChange={(checked) => setSectionCfg(section.key, { visible: checked })}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 58px 66px',
                gap: 6,
                fontSize: 9.5,
                letterSpacing: 0.4,
                textTransform: 'uppercase',
                opacity: 0.4,
                paddingBottom: 3,
              }}
            >
              <span>{T(isCn, 'Field', '字段')}</span>
              <span>{T(isCn, 'Show', '显示')}</span>
              <span>{T(isCn, 'Required', '必填')}</span>
            </div>

            {section.fields.map((field) => {
              const fcfg = draft.fields?.[field.name] || {};
              const visible = sectionVisible && fcfg.visible !== false;
              return (
                <div
                  key={field.name}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 58px 66px',
                    gap: 6,
                    alignItems: 'center',
                    padding: '2px 0',
                    opacity: visible ? 1 : 0.45,
                  }}
                >
                  <span style={{ fontSize: 12.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {labelOf(field.label, field.name, isCn)}
                  </span>
                  <Switch
                    size="small"
                    checked={visible}
                    disabled={!sectionVisible}
                    onChange={(checked) => setFieldCfg(field.name, { visible: checked })}
                  />
                  <Switch
                    size="small"
                    checked={fcfg.required === true}
                    disabled={!visible}
                    onChange={(checked) => setFieldCfg(field.name, { required: checked })}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );

  const mineTab = (
    <div>
      <div style={{ fontSize: 11.5, opacity: 0.6, lineHeight: 1.6, marginBottom: 14 }}>
        {T(
          isCn,
          'Hide fields you do not fill, to keep the form short. Hidden values are kept; required fields stay visible.',
          '隐藏不填的字段，让表单更简洁。隐藏不会删除已填内容；必填字段保持显示。'
        )}
      </div>

      {personalFields.length === 0 ? (
        <div style={{ fontSize: 12, opacity: 0.5 }}>
          {T(isCn, 'No fields to customise.', '没有可自定义的字段。')}
        </div>
      ) : null}

      {personalFields.map((field) => (
        <div key={field.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' }}>
          <Checkbox
            checked={!field.userHidden}
            disabled={field.required}
            onChange={(e) => setFieldHidden(field.name, !e.target.checked)}
          />
          <span style={{ fontSize: 13, flex: 1 }}>
            {labelOf(field.label, field.name, isCn)}
            {field.required ? (
              <span style={{ opacity: 0.45, marginLeft: 6, fontSize: 10.5 }}>
                {T(isCn, 'required', '必填')}
              </span>
            ) : null}
          </span>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 14, paddingTop: 12, marginTop: 8, borderTop: '1px solid rgba(0,0,0,.08)' }}>
        <Button size="small" type="link" style={{ padding: 0 }} onClick={() => setShowAll(!showAll)}>
          {showAll ? T(isCn, 'Restore hidden', '恢复隐藏') : T(isCn, 'Show all', '显示全部')}
        </Button>
        <Button size="small" type="link" style={{ padding: 0 }} onClick={resetPrefs}>
          {T(isCn, 'Reset hidden', '重置隐藏')}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Plain button, not an antd Button: the app's globals.css repaints
          button colours with !important, and this needs to stay pure black. */}
      <button type="button" className="fs-trigger" onClick={() => setOpen(true)}>
        {T(isCn, 'Form settings', '表单设置')}
        <span className="fs-trigger-line" aria-hidden="true" />
      </button>

      <style>{`
        .fs-trigger {
          position: relative;
          display: inline-block;
          padding: 7px 4px;
          margin: -3px -4px;
          min-height: 30px;
          box-sizing: border-box;
          background: none !important;
          border: 0;
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          line-height: 1.2;
          color: var(--text-primary, #000) !important;
        }
        .fs-trigger-line {
          position: absolute;
          left: 0;
          bottom: 0;
          height: 1px;
          width: 100%;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .fs-trigger:hover .fs-trigger-line,
        .fs-trigger:focus-visible .fs-trigger-line { transform: scaleX(1); }
      `}</style>

      <ConfigProvider
        wave={{ disabled: true }}
        theme={{
          token: { colorPrimary: '#000000', colorText: '#000000' },
          components: { Tabs: { inkBarColor: '#000000', itemColor: '#8a8a8a', itemSelectedColor: '#000000' } },
        }}
      >
      <Drawer
        title={
          <span style={{ fontSize: 14 }}>
            {T(isCn, 'Form settings', '表单设置')}
            {formKey ? <span style={{ opacity: 0.45 }}> · {formKey}</span> : null}
          </span>
        }
        placement="right"
        width={420}
        zIndex={3000}
        mask={false}
        rootStyle={{ maxWidth: '100vw', background: 'transparent' }}
        open={open}
        onClose={() => setOpen(false)}
        styles={{ body: { paddingTop: 8 } }}
      >
        <Tabs
          activeKey={tab}
          onChange={setTab}
          size="small"
          items={[
            {
              key: 'types',
              label: T(isCn, 'Type options', '类型选项'),
              children: <FormTypeOptionsPanel formKey={formKey} isCn={isCn} />,
            },
            { key: 'everyone', label: T(isCn, 'Show & required', '显示与必填'), children: everyoneTab },
            { key: 'mine', label: T(isCn, 'Hide', '隐藏'), children: mineTab },
          ]}
        />

        {tab === 'everyone' ? (
          <div
            style={{
              position: 'sticky',
              bottom: 0,
              paddingTop: 10,
              marginTop: 6,
              background: '#fff',
              borderTop: '1px solid rgba(0,0,0,.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Button
              size="small"
              disabled={!dirty || saving}
              loading={saving}
              onClick={save}
              style={{
                // The app's globals.css forces button text to the theme colour
                // with !important, so a dark button would hide its own label.
                background: 'var(--background-primary, #fff)',
                border: '1px solid var(--text-primary, #000)',
                fontSize: 12,
              }}
            >
              {T(isCn, 'Save', '保存')}
            </Button>
            {saved && !dirty ? (
              <span style={{ fontSize: 11, color: 'green' }}>{T(isCn, 'Saved', '已保存')}</span>
            ) : null}
            {dirty ? (
              <span style={{ fontSize: 11, opacity: 0.5 }}>{T(isCn, 'Unsaved', '未保存')}</span>
            ) : null}
            <span style={{ flex: 1 }} />
            <a href="/manager/form-settings" style={{ fontSize: 11, opacity: 0.45, textDecoration: 'underline' }}>
              {T(isCn, 'All forms', '全部表单')}
            </a>
          </div>
        ) : null}
      </Drawer>
      </ConfigProvider>
    </>
  );
}
