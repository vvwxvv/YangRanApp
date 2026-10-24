import { useState, useCallback } from "react";

const useTableState = (defaultRowsPerPage = 25) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");

  const resetPagination = useCallback(() => {
    setPage(0);
  }, []);

  const handleRequestSort = useCallback((property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    resetPagination();
  }, [orderBy, order, resetPagination]);

  return {
    selectedRows,
    setSelectedRows,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    orderBy,
    order,
    handleRequestSort,
    resetPagination
  };
};

export default useTableState; 