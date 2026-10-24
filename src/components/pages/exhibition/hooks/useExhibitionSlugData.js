"use client";

import { useState, useEffect } from "react";

// same improved slug generator
const generateSlug = (text) => {
  if (!text) return "";
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_-]/gu, "");
};

export default function useExhibitionSlugData(slugParam, isCn) {
  const [exhibition, setExhibition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // handle string | string[]
    const rawSlug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
    const slug = rawSlug ? decodeURIComponent(rawSlug) : "";

    let cancelled = false;

    if (!slug) {
      setLoading(false);
      setError("No slug provided");
      return () => {
        cancelled = true;
      };
    }

    // Loading starts synchronously (before the await) so a superseded run can
    // never flip `loading` off and flash "not found" for a frame.
    setLoading(true);
    setError(null);

    const fetchExhibition = async () => {
      try {
        const response = await fetch("/api/exhibition", { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        const list = Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];

        // optional language filter (only if exhibition.language exists)
        const targetLang = isCn ? "CN" : "EN";

        const found = list.find((item) => {
          if (!item) return false;

          const lang = (item.language || "").toUpperCase();
          if (lang && lang !== targetLang) return false;

 // match by id
          if (item._id === slug || item.id === slug) return true;

 // match by stored slug (if you have one)
          if (item.slug && item.slug === slug) return true;

 // match by generated title slug
          const titleSlug = generateSlug(item.title);
          if (titleSlug && titleSlug === slug) return true;

          return false;
        });

        if (cancelled) return; // a newer run superseded this one

        if (found) {
          setExhibition(found);
        } else {
          setExhibition(null);
          setError("Exhibition not found");
        }
      } catch (err) {
        if (cancelled) return;
        setExhibition(null);
        setError(err?.message || "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchExhibition();

    return () => {
      cancelled = true;
    };
  }, [slugParam, isCn]);

  return { exhibition, loading, error };
}