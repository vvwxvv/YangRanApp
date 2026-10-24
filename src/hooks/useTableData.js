import { useState, useEffect, useCallback } from "react";

const useTableData = (apiEndpoint, normalizeRow) => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const normalizedData = Array.isArray(result)
        ? result.map(normalizeRow)
        : Array.isArray(result.data)
        ? result.data.map(normalizeRow)
        : [];
      setData(normalizedData);
      setOriginalData(normalizedData);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, normalizeRow]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    setData,
    originalData,
    setOriginalData,
    isLoading,
    error,
    setError,
    refetch: fetchData
  };
};

export default useTableData; 