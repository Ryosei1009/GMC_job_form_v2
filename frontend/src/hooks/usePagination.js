import { useState, useMemo } from 'react';

const usePagination = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  // データが配列でない場合の安全な処理
  const safeData = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return safeData.slice(startIndex, endIndex);
  }, [safeData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(safeData.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    paginatedData,
    handlePageChange,
    resetPagination,
    totalItems: safeData.length,
    itemsPerPage
  };
};

export default usePagination;