"use client";

/**
 * FormSettingsProvider — one `/api/form-settings` fetch per page load, shared by
 * every form on it, plus the per-editor preferences that live in localStorage.
 *
 * Three layers, deliberately separate:
 *   code schema   → what the developer declared (always present)
 *   settings      → site-wide policy from the DB (manager UI writes it)
 *   prefs         → THIS editor's "hide the fields I never fill" (local only)
 *
 * The provider is mounted by FormShell / EditFormShell, so every existing form
 * gets settings support without touching its section file.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const PREFS_PREFIX = 'formprefs:v1:';

let allCache = null;
let inflight = null;
let denied = false;

const NOOP = () => {};

/** Form settings are a manager-only feature; public forms stay untouched. */
function isManagerSurface() {
  return typeof window !== 'undefined' && window.location.pathname.startsWith('/manager');
}

const DEFAULT_CONTEXT = {
  formKey: null,
  settings: null,
  prefs: { hidden: [] },
  showAll: false,
  ready: true,
  denied: false,
  enabled: false,
  setShowAll: NOOP,
  setFieldHidden: NOOP,
  resetPrefs: NOOP,
  reload: NOOP,
  updateSettings: async () => null,
};

const FormSettingsContext = createContext(DEFAULT_CONTEXT);

export function loadAllFormSettings(force = false) {
  if (force) {
    allCache = null;
    denied = false;
  }
  if (allCache) return Promise.resolve(allCache);
  if (inflight) return inflight;

  inflight = fetch('/api/form-settings', {
    cache: 'no-store',
    credentials: 'same-origin',
  })
    .then(async (res) => {
      if (res.status === 401 || res.status === 403) {
        denied = true;
        return {};
      }
      const json = await res.json().catch(() => ({}));
      return json?.data && typeof json.data === 'object' ? json.data : {};
    })
    .catch(() => ({}))
    .then((map) => {
      allCache = map;
      return map;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/** Save one form's settings and keep the module cache in sync. */
export async function saveFormSettings(formKey, patch) {
  const res = await fetch('/api/form-settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formKey, ...patch }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
  const doc = json?.data || null;
  if (doc) {
    allCache = { ...(allCache || {}), [formKey]: doc };
  }
  return doc;
}

/** A form reports the schema it just rendered (first open registers it). */
const discoveredSigs = new Set();

export async function discoverFormSchema(formKey, sections) {
  if (!formKey || denied || !isManagerSurface()) return;
  if (!Array.isArray(sections) || sections.length === 0) return;
  const sig = `${formKey}:${JSON.stringify(sections)}`;
  if (discoveredSigs.has(sig)) return;
  discoveredSigs.add(sig);
  try {
    const res = await fetch('/api/form-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formKey, sections }),
    });
    if (res.status === 401 || res.status === 403) denied = true;
    // The form we just registered must show up in the settings page without a
    // hard reload: the cached list predates this document.
    if (res.ok) allCache = null;
  } catch {
    /* discovery is best-effort; never break a form over it */
  }
}

function readPrefs(formKey) {
  if (!formKey || typeof window === 'undefined') return { hidden: [] };
  try {
    const raw = window.localStorage.getItem(PREFS_PREFIX + formKey);
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      hidden: Array.isArray(parsed?.hidden) ? parsed.hidden.filter((x) => typeof x === 'string') : [],
    };
  } catch {
    return { hidden: [] };
  }
}

function writePrefs(formKey, prefs) {
  if (!formKey || typeof window === 'undefined') return;
  try {
    if (!prefs.hidden.length) window.localStorage.removeItem(PREFS_PREFIX + formKey);
    else window.localStorage.setItem(PREFS_PREFIX + formKey, JSON.stringify(prefs));
  } catch {
    /* storage full / disabled — preferences are a nicety */
  }
}

export function FormSettingsProvider({ formKey = null, children }) {
  const [settings, setSettings] = useState(() => (allCache && formKey ? allCache[formKey] || null : null));
  const [prefs, setPrefs] = useState(() => readPrefs(formKey));
  const [showAll, setShowAll] = useState(false);
  const [ready, setReady] = useState(() => !formKey || Boolean(allCache) || denied);
  // Set after mount so SSR and the first client render agree (no hydration
  // mismatch from reading window.location during render).
  const [managerSurface, setManagerSurface] = useState(false);

  useEffect(() => {
    setManagerSurface(isManagerSurface());
  }, []);

  useEffect(() => {
    if (!formKey || !isManagerSurface()) {
      setReady(true);
      return undefined;
    }

    let alive = true;
    setPrefs(readPrefs(formKey));

    loadAllFormSettings().then((map) => {
      if (!alive) return;
      setSettings(map?.[formKey] || null);
      setReady(true);
    });

    return () => {
      alive = false;
    };
  }, [formKey]);

  const setFieldHidden = useCallback(
    (name, hidden) => {
      if (!formKey || !name) return;
      setPrefs((prev) => {
        const set = new Set(prev.hidden);
        if (hidden) set.add(name);
        else set.delete(name);
        const next = { hidden: [...set] };
        writePrefs(formKey, next);
        return next;
      });
    },
    [formKey]
  );

  const resetPrefs = useCallback(() => {
    if (!formKey) return;
    writePrefs(formKey, { hidden: [] });
    setPrefs({ hidden: [] });
    setShowAll(false);
  }, [formKey]);

  const reload = useCallback(() => {
    allCache = null;
    denied = false;
    return loadAllFormSettings().then((map) => setSettings(map?.[formKey] || null));
  }, [formKey]);

  /** Persist site-wide settings for THIS form and refresh the resolved schema. */
  const updateSettings = useCallback(
    async (patch) => {
      if (!formKey) return null;
      const doc = await saveFormSettings(formKey, patch);
      setSettings(doc);
      return doc;
    },
    [formKey]
  );

  const value = useMemo(
    () => ({
      formKey,
      settings,
      prefs,
      showAll,
      ready,
      denied,
      enabled: Boolean(formKey) && managerSurface,
      setShowAll,
      setFieldHidden,
      resetPrefs,
      reload,
      updateSettings,
    }),
    [formKey, settings, prefs, showAll, ready, managerSurface, setFieldHidden, resetPrefs, reload, updateSettings]
  );

  return <FormSettingsContext.Provider value={value}>{children}</FormSettingsContext.Provider>;
}

export function useFormSettings(explicitKey) {
  const ctx = useContext(FormSettingsContext);
  if (!explicitKey || explicitKey === ctx.formKey) return ctx;
  // A component asked for a different form than the nearest provider. This only
  // happens when a form renders outside its shell; keep the (empty) prefs from
  // the default context rather than reading localStorage on every render.
  return {
    ...ctx,
    formKey: explicitKey,
    settings: allCache?.[explicitKey] || null,
  };
}

export default FormSettingsProvider;
