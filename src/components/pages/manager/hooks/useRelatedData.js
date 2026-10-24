import { useCallback } from "react";
import useData          from "@/hooks/useData";
import { sortByBilingualTitle }   from "@/utils/sortByBilingualTitle";

/**
 * Fetches and sorts two related data sources.
 * Pass any two configs — artworks+events, artworks+projects, etc.
 *
 * @param {object} configA  — e.g. artworkConfig
 * @param {object} configB  — e.g. eventConfig | projectConfig
 */
export const useRelatedData = (configA, configB) => {
  const {
    data: dataA = [],
    isLoading: loadingA,
    error: errorA,
    refetch: refetchA,
  } = useData(configA?.api?.endpoints?.list);

  const {
    data: dataB = [],
    isLoading: loadingB,
    error: errorB,
    refetch: refetchB,
  } = useData(configB?.api?.endpoints?.list);

  const handleRetry = useCallback(() => {
    refetchA();
    refetchB();
  }, [refetchA, refetchB]);

  return {
    sortedA:    sortByBilingualTitle(dataA),
    sortedB:    sortByBilingualTitle(dataB),
    isLoading:  loadingA || loadingB,
    error:      errorA   || errorB,
    handleRetry,
  };
};