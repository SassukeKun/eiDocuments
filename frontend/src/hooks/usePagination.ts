"use client";

import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  initialItemsPerPage?: number;
  initialPage?: number;
}

interface UsePaginationReturn<T> {
  // Dados paginados
  paginatedData: T[];
  
  // Estado atual
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  
  // Controles
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setItemsPerPage: (items: number) => void;
  
  // Props prontas para o DataTable
  paginationProps: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
  };
}

export const usePagination = <T,>({
  data,
  initialItemsPerPage = 10,
  initialPage = 1,
}: UsePaginationProps<T>): UsePaginationReturn<T> => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Garantir que a página atual é válida
  const validCurrentPage = Math.min(currentPage, totalPages) || 1;

  const paginatedData = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, validCurrentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const nextPage = () => {
    if (validCurrentPage < totalPages) {
      setCurrentPage(validCurrentPage + 1);
    }
  };

  const prevPage = () => {
    if (validCurrentPage > 1) {
      setCurrentPage(validCurrentPage - 1);
    }
  };

  const setItemsPerPage = (items: number) => {
    setItemsPerPageState(items);
    // Recalcular página atual para manter posição aproximada
    const currentItemIndex = (validCurrentPage - 1) * itemsPerPage;
    const newPage = Math.floor(currentItemIndex / items) + 1;
    setCurrentPage(Math.max(1, newPage));
  };

  const paginationProps = {
    currentPage: validCurrentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange: goToPage,
    onItemsPerPageChange: setItemsPerPage,
  };

  return {
    paginatedData,
    currentPage: validCurrentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
    nextPage,
    prevPage,
    setItemsPerPage,
    paginationProps,
  };
};
