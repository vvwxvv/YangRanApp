"use client";

/**
 * /manager/form-settings
 *
 * One place to decide what each admin form actually asks for.
 *
 *   sections → shown / hidden, collapsed, order
 *   fields   → shown / hidden, required, "advanced" (behind More details)
 *
 * The form list is discovered automatically: every form registers its own
 * sections/fields the first time it is opened (POST /api/form-settings), so
 * adding a new entity never needs a change here.
 *
 * Settings are site-wide. The per-editor "hide the fields I never fill" layer
 * lives in the form itself (Fields menu) and is stored locally, not here.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState, useContext } from 'react';
import {
  Box,
  Typography,
  Switch,
  Button,
  TextField,
  Divider,
  CircularProgress,
  Chip,
} from '@mui/material';
import { LanguageContext } from '@/components/contexts/LanguageContext';
import {
  loadAllFormSettings,
  saveFormSettings,
} from '@/components/forms/settings/FormSettingsContext';

const T = (isCn, en, cn) => (isCn ? cn : en);

const emptyDraft = () => ({ sections: {}, fields: {}, layout: {} });

function buildDraft(doc) {
  return {
    sections: { ...(doc?.sections || {}) },
    fields: { ...(doc?.fields || {}) },
    layout: { ...(doc?.layout || {}) },
  };
}

function FieldRow({ field, cfg, isCn, onChange, onReset }) {
  const visible = cfg?.visible !== false;
  const required = cfg?.required === true;
  const essential = cfg?.essential === true;
  const touched = cfg && Object.keys(cfg).length > 0;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 76px 76px 76px 28px',
        alignItems: 'center',
        gap: 1,
        py: 0.75,
        borderBottom: '1px solid rgba(0,0,0,.06)',
        opacity: visible ? 1 : 0.45,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 500 }} noWrap>
          {(isCn ? field.label?.cn : field.label?.en) || field.name}
        </Typography>
        <Typography sx={{ fontSize: 10.5, fontFamily: 'monospace', opacity: 0.45 }} noWrap>
          {field.name} · {field.type}
        </Typography>
      </Box>

      <Switch size="small" checked={visible} onChange={(e) => onChange('visible', e.target.checked)} />
      <Switch
        size="small"
        checked={required}
        disabled={!visible}
        onChange={(e) => onChange('required', e.target.checked)}
      />
      <Switch
        size="small"
        checked={essential}
        disabled={!visible}
        onChange={(e) => onChange('essential', e.target.checked)}
      />

      <Button
        size="small"
        onClick={onReset}
        title={T(isCn, 'Reset field', '重置字段')}
        sx={{ minWidth: 0, p: 0, fontSize: 14, opacity: touched ? 0.55 : 0 }}
      >
        ↺
      </Button>
    </Box>
  );
}

export default function FormSettingsPage() {
  const { isCn } = useContext(LanguageContext);
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState({});
  const [activeKey, setActiveKey] = useState(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [query, setQuery] = useState('');
  // Deep link from a form: /manager/form-settings?formKey=artwork
  const [queryKey] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      return new URLSearchParams(window.location.search).get('formKey');
    } catch {
      return null;
    }
  });

  const load = useCallback(async () => {
    setLoading(true);
    const map = await loadAllFormSettings(true);
    setForms(map || {});
    setActiveKey((prev) => prev || Object.keys(map || {}).sort()[0] || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setDraft(buildDraft(forms[activeKey]));
    setDirty(false);
  }, [activeKey, forms]);

  // Preselect the form the caller came from (only once, so it never fights a
  // manual selection afterwards).
  const appliedQueryKey = useRef(false);
  useEffect(() => {
    if (appliedQueryKey.current || !queryKey) return;
    if (forms?.[queryKey]) {
      setActiveKey(queryKey);
      appliedQueryKey.current = true;
    }
  }, [queryKey, forms]);

  const active = forms[activeKey] || null;
  const discovered = active?.discovered?.sections || [];

  const setSection = (key, patch) => {
    setDraft((prev) => {
      const nextFields = { ...prev.fields };
      if (patch.visible === false) {
        // A hidden section can never be filled, so it cannot hold required
        // fields either — otherwise the form becomes impossible to save.
        const section = discovered.find((s) => s.key === key);
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
  };

  const setField = (name, patch) => {
    setDraft((prev) => ({
      ...prev,
      fields: { ...prev.fields, [name]: { ...(prev.fields[name] || {}), ...patch } },
    }));
    setDirty(true);
  };

  const setLayout = (patch) => {
    setDraft((prev) => ({ ...prev, layout: { ...prev.layout, ...patch } }));
    setDirty(true);
  };

  const resetField = (name) => {
    setDraft((prev) => {
      const fields = { ...prev.fields };
      delete fields[name];
      return { ...prev, fields };
    });
    setDirty(true);
  };

  const save = async () => {
    if (!activeKey) return;
    setSaving(true);
    try {
      const doc = await saveFormSettings(activeKey, draft);
      setForms((prev) => ({ ...prev, [activeKey]: doc || prev[activeKey] }));
      setDirty(false);
      setSavedAt(Date.now());
    } catch (error) {
      console.error('[form-settings] save failed:', error);
      alert(error?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = async () => {
    if (!activeKey) return;
    if (!window.confirm(T(isCn, 'Reset this form to code defaults?', '把这个表单重置为代码默认值？'))) return;
    await fetch(`/api/form-settings?formKey=${encodeURIComponent(activeKey)}`, { method: 'DELETE' });
    const map = await loadAllFormSettings(true);
    setForms(map || {});
  };

  const visibleCount = useMemo(() => {
    let total = 0;
    let shown = 0;
    for (const section of discovered) {
      const sectionVisible = draft.sections?.[section.key]?.visible !== false;
      if (section.fields.length === 0) {
        total += 1;
        shown += sectionVisible ? 1 : 0;
        continue;
      }
      for (const field of section.fields) {
        total += 1;
        if (sectionVisible && draft.fields?.[field.name]?.visible !== false) shown += 1;
      }
    }
    return { total, shown };
  }, [discovered, draft]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return discovered;
    return discovered.filter(
      (section) =>
        section.key.toLowerCase().includes(q) ||
        section.fields.some(
          (f) =>
            f.name.toLowerCase().includes(q) ||
            String(f.label?.en || '').toLowerCase().includes(q) ||
            String(f.label?.cn || '').includes(q)
        )
    );
  }, [discovered, query]);

  if (loading) {
    return (
      <Box sx={{ p: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={22} />
      </Box>
    );
  }

  const keys = Object.keys(forms).sort();

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.2 }}>
        {T(isCn, 'Form settings', '表单设置')}
      </Typography>
      <Typography sx={{ fontSize: 12.5, opacity: 0.6, mt: 0.5, mb: 3, maxWidth: 720, lineHeight: 1.6 }}>
        {T(
          isCn,
          'Decide which sections and fields each form asks for. Hiding a field keeps the stored value — it only stops being shown. Required fields are enforced on save. Each editor can additionally hide fields they never use, in the form itself.',
          '决定每个表单需要哪些区块和字段。隐藏字段不会删除已存数据，只是不再显示；必填字段会在保存时校验。每个编辑者还可以在表单里自行隐藏自己用不到的字段。'
        )}
      </Typography>

      {keys.length === 0 ? (
        <Box sx={{ border: '1px solid rgba(0,0,0,.12)', p: 4, textAlign: 'center', fontSize: 13 }}>
          {T(
            isCn,
            'No form has registered itself yet. Open any manager form (e.g. Artwork → New) once and come back.',
            '还没有表单注册自己。先打开任意一个管理表单（例如作品 → 新建）一次，然后回到这里。'
          )}
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '220px 1fr' }, gap: 3 }}>
          {/* form list */}
          <Box>
            {keys.map((key) => {
              const on = key === activeKey;
              const count = forms[key]?.discovered?.sections?.length || 0;
              return (
                <Box
                  key={key}
                  onClick={() => setActiveKey(key)}
                  sx={{
                    cursor: 'pointer',
                    px: 1.5,
                    py: 1.1,
                    mb: 0.5,
                    borderLeft: on ? '2px solid #000' : '2px solid transparent',
                    backgroundColor: on ? 'rgba(0,0,0,.04)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,.03)' },
                  }}
                >
                  <Typography sx={{ fontSize: 13, fontWeight: on ? 600 : 400 }}>{key}</Typography>
                  <Typography sx={{ fontSize: 10.5, opacity: 0.45 }}>
                    {count} {T(isCn, 'sections', '区块')}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* editor */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{activeKey}</Typography>
              <Chip
                size="small"
                label={`${visibleCount.shown}/${visibleCount.total} ${T(isCn, 'shown', '显示')}`}
                sx={{ fontSize: 10.5, height: 20 }}
              />
              <Box sx={{ flex: 1 }} />
              <TextField
                size="small"
                placeholder={T(isCn, 'Filter fields…', '筛选字段…')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ width: 180, '& input': { fontSize: 12.5 } }}
              />
              <Button
                size="small"
                variant="contained"
                disabled={!dirty || saving}
                onClick={save}
                sx={{ fontSize: 12, textTransform: 'none', backgroundColor: '#000', '&:hover': { backgroundColor: '#222' } }}
              >
                {saving ? T(isCn, 'Saving…', '保存中…') : T(isCn, 'Save', '保存')}
              </Button>
              <Button size="small" onClick={resetForm} sx={{ fontSize: 12, textTransform: 'none', color: '#000', opacity: 0.6 }}>
                {T(isCn, 'Reset form', '重置表单')}
              </Button>
            </Box>

            {savedAt && !dirty ? (
              <Typography sx={{ fontSize: 11, color: 'green', mb: 1 }}>
                {T(isCn, 'Saved', '已保存')}
              </Typography>
            ) : null}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 2.5,
                px: 1.5,
                py: 1,
                border: '1px solid rgba(0,0,0,.12)',
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 12.5, fontWeight: 500 }}>
                  {T(isCn, 'Essential first', '先显示核心字段')}
                </Typography>
                <Typography sx={{ fontSize: 10.5, opacity: 0.55 }}>
                  {T(
                    isCn,
                    'Advanced fields are tucked under “More details”. Required fields always stay visible.',
                    '“高级”字段会收进“更多信息”里；必填字段始终显示。'
                  )}
                </Typography>
              </Box>
              <Switch
                size="small"
                checked={draft.layout?.progressive === true}
                onChange={(e) => setLayout({ progressive: e.target.checked })}
              />
            </Box>

            {filtered.length === 0 ? (
              <Typography sx={{ fontSize: 12.5, opacity: 0.5 }}>
                {T(isCn, 'Nothing matches.', '没有匹配项。')}
              </Typography>
            ) : null}

            {filtered.map((section) => {
              const cfg = draft.sections?.[section.key] || {};
              const sectionVisible = cfg.visible !== false;
              const isSpecial = section.fields.length === 0;

              return (
                <Box key={section.key} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      py: 0.5,
                      borderBottom: '1px solid rgba(0,0,0,.55)',
                    }}
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>
                      {section.key}
                    </Typography>
                    <Typography sx={{ fontSize: 10.5, opacity: 0.45 }}>
                      {isSpecial ? section.type : `${section.fields.length} ${T(isCn, 'fields', '字段')}`}
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <Typography sx={{ fontSize: 10.5, opacity: 0.55 }}>
                      {T(isCn, 'Section', '区块')}
                    </Typography>
                    <Switch
                      size="small"
                      checked={sectionVisible}
                      onChange={(e) => setSection(section.key, { visible: e.target.checked })}
                    />
                  </Box>

                  {isSpecial ? (
                    <Typography sx={{ fontSize: 11.5, opacity: 0.5, py: 1 }}>
                      {T(isCn, 'This section has no individual fields.', '该区块没有独立字段。')}
                    </Typography>
                  ) : (
                    <>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 76px 76px 76px 28px',
                          gap: 1,
                          pt: 1,
                          pb: 0.5,
                          fontSize: 10,
                          letterSpacing: 0.5,
                          opacity: 0.4,
                          textTransform: 'uppercase',
                        }}
                      >
                        <span>{T(isCn, 'Field', '字段')}</span>
                        <span>{T(isCn, 'Show', '显示')}</span>
                        <span>{T(isCn, 'Required', '必填')}</span>
                        <span>{T(isCn, 'Core', '核心')}</span>
                        <span />
                      </Box>
                      {section.fields
                        .filter((field) => {
                          const q = query.trim().toLowerCase();
                          if (!q) return true;
                          return (
                            field.name.toLowerCase().includes(q) ||
                            String(field.label?.en || '').toLowerCase().includes(q) ||
                            String(field.label?.cn || '').includes(q)
                          );
                        })
                        .map((field) => (
                          <FieldRow
                            key={field.name}
                            field={field}
                            cfg={draft.fields?.[field.name]}
                            isCn={isCn}
                            onChange={(patchKey, value) => {
                              setField(field.name, { [patchKey]: value });
                              if (patchKey === 'visible' && value === false) {
                                setField(field.name, { visible: false, required: false, essential: false });
                              }
                            }}
                            onReset={() => resetField(field.name)}
                          />
                        ))}
                    </>
                  )}
                </Box>
              );
            })}

            <Divider sx={{ my: 2 }} />
            <Typography sx={{ fontSize: 11, opacity: 0.45, lineHeight: 1.7 }}>
              {T(
                isCn,
                '“Core” fields always stay in view. When “Essential first” is on, non-core fields fold into a “More details” block. Hiding a section hides everything inside it. Values already stored are never deleted.',
                '“核心”字段始终直接显示。开启“先显示核心字段”后，非核心字段会收进“更多信息”。隐藏区块会一起隐藏里面的字段。已保存的数据不会被删除。'
              )}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
