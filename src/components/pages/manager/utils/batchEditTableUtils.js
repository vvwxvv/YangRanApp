import { useMemo } from "react";

export function descendingComparator(a, b, orderBy, columns) {
  const column = columns.find(col => col.field === orderBy);
  const isNumeric = column?.fieldType === "number";
  let aValue = a[orderBy];
  let bValue = b[orderBy];
  if (isNumeric) {
    aValue = parseFloat(aValue) || 0;
    bValue = parseFloat(bValue) || 0;
  } else {
    aValue = String(aValue || "").toLowerCase();
    bValue = String(bValue || "").toLowerCase();
  }
  if (bValue < aValue) return -1;
  if (bValue > aValue) return 1;
  return 0;
}

export function getComparator(order, orderBy, columns) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy, columns)
    : (a, b) => -descendingComparator(a, b, orderBy, columns);
}

export function useProcessedData(data, searchTerm, order, orderBy, columns) {
  return useMemo(() => {
    let filtered = data.filter((item) => {
      if (!searchTerm || !item) return true;
      try {
        const searchLower = searchTerm.toLowerCase();
        return Object.values(item).some(value => 
          value && String(value).toLowerCase().includes(searchLower)
        );
      } catch (err) {
        return true;
      }
    });
    if (orderBy) {
      filtered = [...filtered].sort(getComparator(order, orderBy, columns));
    }
    return filtered;
  }, [data, searchTerm, order, orderBy, columns]);
}

export function usePagination(processedData, page, rowsPerPage) {
  return useMemo(() =>
    processedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    ),
    [processedData, page, rowsPerPage]
  );
} 