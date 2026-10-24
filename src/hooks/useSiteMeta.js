"use client";

/**
 * useSiteMeta — the site's Meta document (title, footer, menus, social, SEO…).
 *
 * Starts from the JSON defaults so first paint is instant and identical to the
 * old behaviour, then swaps in the DB doc from `/api/meta`.
 *
 * @returns {{ meta, loading, error, refetch, save, saving }}
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_SITE_META, mergeSiteMeta } from "@/utils/siteMetaDefaults";
import { beginLoad, endLoad } from "@/utils/pageLoadState";

let cache = null; // module-level cache: one fetch per page load
let inflight = null; // the in-flight request, shared by every mounted consumer

/**
 * One `/api/meta` request per page load, no matter how many components mount.
 *
 * The nav, the footer, the document head, NoDataInfo … all call useSiteMeta, so
 * on a fresh page load several of them mounted in the same tick while `cache`
 * was still empty and each started its OWN fetch (the dev log showed 3–5
 * `/api/meta` round trips per page). Sharing the promise collapses that to one.
 */
function loadSiteMeta() {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    // Counted by the page loading gate: pages that render from the Meta doc
    // must not reveal the shell before it has arrived.
    const token = beginLoad();
    inflight = fetch("/api/meta", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        const doc = json?.data || null;
        if (doc) cache = doc;
        return cache;
      })
      .finally(() => {
        inflight = null;
        endLoad(token);
      });
  }
  return inflight;
}

export default function useSiteMeta() {
  const [meta, setMeta] = useState(() => mergeSiteMeta(DEFAULT_SITE_META, cache));
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const doc = await loadSiteMeta();
      if (doc) setMeta(mergeSiteMeta(DEFAULT_SITE_META, doc));
      setError(null);
    } catch (err) {
      console.log("[useSiteMeta] load failed:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!cache) load();
  }, [load]);

  const save = useCallback(async (patch) => {
    setSaving(true);
    try {
      const res = await fetch("/api/meta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Save failed");
      cache = json.data;
      setMeta(mergeSiteMeta(DEFAULT_SITE_META, json.data));
      return json.data;
    } finally {
      setSaving(false);
    }
  }, []);

  return useMemo(
    () => ({ meta, loading, error, refetch: load, save, saving }),
    [meta, loading, error, load, save, saving]
  );
}

/** Clear the module cache (used after a save from the manager page). */
export const clearSiteMetaCache = () => {
  cache = null;
};
