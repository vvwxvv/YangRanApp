"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * useRelationOptions — fetch one or more related collections and produce a
 * merged, language-matched, de-duplicated option list for cross-entity
 * relation selectors (e.g. "Exhibition → related artworks", "→ related artists").
 *
 * This is the shared engine behind the "image → select artwork" pattern and the
 * new Exhibition relation selectors. Add a new linkable schema by passing a new
 * source — nothing else needs to change.
 *
 * @param {Object|Object[]} sources
 *   Each source:
 *   {
 *     endpoint:       'artwork',      // API route name (fetched as /api/<endpoint>)
 *     labelKey:       'title',        // field shown (and used as the value)
 *     valueKey:       'title',        // optional — field used as value (defaults to labelKey)
 *     descriptionKey: 'artist',       // optional — secondary text in the dropdown
 *     labelFn:        (item) => str,  // optional — custom label builder
 *     descriptionFn:  (item) => str,  // optional — custom description builder
 *     languageField:  'language',     // if set, filter items by language
 *     matchLanguage:  true,           // whether to filter by the current language
 *     unique:         true,           // de-duplicate by label (default true)
 *   }
 * @param {boolean} isCn  current language (true = Chinese)
 * @param {object}  [options]
 * @param {string}  [options.language]  explicit target language ("EN"/"CN") — e.g. the
 *   language of the record being edited, which beats the UI language (isCn).
 * @returns {{ options: Array<{value:string,label:string,description:string}>,
 *             loading: boolean, error: any, refetch: Function }}
 */
export default function useRelationOptions(sources, isCn = false, config = {}) {
  const language = config?.language ? String(config.language).trim().toUpperCase() : "";
  // ── normalize + keep latest sources in a ref (avoids re-fetch loops) ──────
  const sourceListRef = useRef([]);
  sourceListRef.current = normalizeSources(sources);

  // Stable signature → only re-fetch when the source definitions actually change.
  const signature = useMemo(
    () =>
      JSON.stringify(
        normalizeSources(sources).map((s) => ({
          endpoint: s?.endpoint,
          labelKey: s?.labelKey,
          valueKey: s?.valueKey,
          descriptionKey: s?.descriptionKey,
        }))
      ),
    [sources]
  );

  const [rawItems, setRawItems] = useState([]); // [{ src, item }]
  const [loading, setLoading] = useState(normalizeSources(sources).length > 0);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const fetchAll = useCallback(async () => {
    const sourceList = sourceListRef.current;

    if (!sourceList.length) {
      setRawItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const results = await Promise.allSettled(
      sourceList.map((src) =>
        fetch(`/api/${src.endpoint}`).then((r) => {
          if (!r.ok) throw new Error(`${src.endpoint}: HTTP ${r.status}`);
          return r.json();
        })
      )
    );

    if (!mountedRef.current) return;

    const merged = [];
    results.forEach((res, idx) => {
      const src = sourceList[idx];
      if (res.status !== "fulfilled") {
        console.log(`[useRelationOptions] ${src.endpoint} failed:`, res.reason);
        return;
      }
      extractItems(res.value).forEach((item) => {
        if (item) merged.push({ src, item });
      });
    });

    setRawItems(merged);
    setLoading(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchAll();
    return () => {
      mountedRef.current = false;
    };
  }, [signature, fetchAll]);

  // ── derive options (language filter + dedupe) without re-fetching ─────────
  const options = useMemo(() => {
    const seen = new Set();
    const out = [];

    rawItems.forEach(({ src, item }, rawIndex) => {
      const langFilter = makeLanguageFilter(src, isCn, language);
      if (langFilter && !langFilter(item)) return;

      const label = String(buildLabel(item, src) ?? "").trim();
      if (!label) return;

      const value = String(
        src?.valueKey ? pick(item, src.valueKey) ?? label : label
      ).trim();
      const description = String(buildDescription(item, src) ?? "").trim();

      const dedupeKey =
        src.unique === false ? `${label.toLowerCase()}:${rawIndex}` : label.toLowerCase();
      if (seen.has(dedupeKey)) return;
      seen.add(dedupeKey);

      out.push({ value, label, description });
    });

    return out;
  }, [rawItems, isCn, language]);

  return { options, loading, error, refetch: fetchAll };
}

/* ────────────────────────────────────────────────────────────────────────────
   helpers (module scope)
──────────────────────────────────────────────────────────────────────────── */

const normalizeSources = (sources) => {
  if (!sources) return [];
  return Array.isArray(sources) ? sources : [sources];
};

const extractItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return [];
};

const makeLanguageFilter = (source, isCn, language) => {
  if (!source?.matchLanguage || !source?.languageField) return null;
  // An explicit target language (the edited record's language) wins over the UI
  // language — an EN artwork shows EN exhibitions even while editing in CN.
  const explicit = String(language || "").trim().toUpperCase();
  const expected = explicit === "EN" || explicit === "CN" ? explicit : isCn ? "CN" : "EN";
  const langField = source.languageField;
  return (item) => {
    const raw = item?.[langField];
    if (raw == null) return true; // items without a language are always shown
    const lang = String(raw).trim().toUpperCase();
    if (lang === "") return true;
    return lang === expected;
  };
};

const pick = (item, key) => (key == null ? undefined : item?.[key]);

const joinPicked = (item, key) => {
  if (key == null) return "";
  if (Array.isArray(key)) {
    return key
      .map((k) => pick(item, k))
      .filter((v) => v != null && v !== "")
      .join(" · ");
  }
  return pick(item, key);
};

const buildLabel = (item, source) => {
  if (typeof source?.labelFn === "function") return source.labelFn(item);
  const fromKey = joinPicked(item, source?.labelKey);
  if (fromKey != null && fromKey !== "") return fromKey;
  return item?.title ?? item?.name ?? item?.artist ?? item?.tag_en ?? item?.tag_cn ?? "";
};

const buildDescription = (item, source) => {
  if (typeof source?.descriptionFn === "function") return source.descriptionFn(item);
  return joinPicked(item, source?.descriptionKey);
};
