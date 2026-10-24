"use client";

/**
 * usePageLoad — reusable "this page is still loading" signal.
 *
 * The layout (nav / content / footer) stays hidden behind the global loading
 * screen until every registered request has settled. Any component that knows
 * it is loading can join that gate:
 *
 *   const { isLoading } = useData("/api/artwork");
 *   usePageLoad(isLoading);
 *
 *   // or from a derived flag
 *   usePageLoad(aLoading || bLoading);
 *
 * `LoadingAnimation` already calls it while visible (unless it is the global
 * one rendered by the layout), so pages that simply render that component are
 * covered without extra code.
 *
 * For non-React call sites (a plain async function), `beginLoad()` returns a
 * token that MUST be released with `endLoad(token)` in a `finally`.
 */

import { useEffect } from "react";
import { beginLoad, endLoad, getActiveLoads, subscribeLoad } from "@/utils/pageLoadState";

export default function usePageLoad(isLoading = true) {
  useEffect(() => {
    if (!isLoading) return undefined;
    const token = beginLoad();
    return () => endLoad(token);
  }, [isLoading]);
}

export { beginLoad, endLoad, getActiveLoads, subscribeLoad };
