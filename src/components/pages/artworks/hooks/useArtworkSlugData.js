"use client";

import { useState, useEffect, useRef } from "react";

const generateSlug = (text) => {
  if (!text) return "";
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_-]/gu, "");
};

// Separator/punctuation-insensitive key. Different pages build artwork slugs
// slightly differently ("Wang Xin #1" → "wangxin1" vs "wang_xin_1"), so we
// also compare the "loose" forms (letters + numbers only) and let any of them
// resolve to the same artwork instead of showing "Artwork not found".
const looseSlug = (text) =>
  String(text ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");

export default function useArtworkSlugData(slugParam, isCn) {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // True ONLY after a fetch that actually completed and found nothing. Never
  // set while a request is in flight, so callers can't flash "not found"
  // during loading.
  const [notFound, setNotFound] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    const rawSlug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
    const slug = rawSlug ? decodeURIComponent(rawSlug) : "";

    // Cancel any in-flight request from a previous run. `cancelled` makes sure
    // the OLD run can never touch state (that stale run used to clear
    // `loading` and briefly surface "not found").
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    let cancelled = false;

    if (!slug) {
      setLoading(false);
      setNotFound(false);
      setError("No slug provided");
      return () => {
        cancelled = true;
        controller.abort();
      };
    }

    // Loading starts synchronously, BEFORE the await, so the very first render
    // after a slug/language change is already "loading" (never "not found").
    setLoading(true);
    setNotFound(false);
    setError(null);

    const fetchArtwork = async () => {
      try {
        const response = await fetch("/api/artwork", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        const list = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
          ? result
          : [];

        // Match by slug — only filter by language if the item has a language set
        const targetLang = isCn ? "CN" : "EN";
        const looseTarget = looseSlug(slug);

        const found = list.find((item) => {
          if (!item) return false;
          // Skip items that have a different language set (but keep items without any language)
          const lang = (item.language || "").toUpperCase();
          if (lang && lang !== targetLang) return false;
          // Match by _id or id (direct ID match)
          if (item._id === slug || item.id === slug) return true;
          // Match by title slug (exact, then separator-insensitive)
          const titleSlug = generateSlug(item.title);
          if (titleSlug && titleSlug === slug) return true;
          if (looseTarget && looseSlug(item.title) === looseTarget) return true;
          if (looseTarget && item._id && looseSlug(item._id) === looseTarget) return true;
          return false;
        });

        // A newer run superseded this one — leave its state alone.
        if (cancelled) return;

        if (found) {
          setArtwork(found);
          setNotFound(false);
        } else {
          setArtwork(null);
          setNotFound(true);
        }
      } catch (err) {
        if (cancelled || err.name === "AbortError") return;
        setArtwork(null);
        setNotFound(false);
        setError(err?.message || "Unknown error");
      } finally {
        // Only the CURRENT run may end the loading state.
        if (!cancelled) setLoading(false);
      }
    };

    fetchArtwork();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [slugParam, isCn]);

  return { artwork, loading, error, notFound };
}
