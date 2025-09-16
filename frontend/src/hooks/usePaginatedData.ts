"use client";

import { useState, useCallback, useEffect } from 'react';

interface UsePaginatedDataProps<T> {
  fetchData: (page: number, limit: number, search?: string, sort?: { column: string; direction: 'asc' | 'desc' }) => Promise<{
    data: T[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  initialItemsPerPage?: number;
}

interface UsePaginatedDataReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  
  // Paginação
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  
  // Busca
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Ordenação
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  
  // Ações
  refetch: () => Promise<void>;
  goToPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  handleSort: (column: string, direction: 'asc' | 'desc') => void;
  
  // Props para DataTable
  paginationProps: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
  };
}

export const usePaginatedData = <T,>({
  fetchData,
  initialItemsPerPage = 10,
}: UsePaginatedDataProps<T>): UsePaginatedDataReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const sort = sortColumn ? { column: sortColumn, direction: sortDirection } : undefined;
      const result = await fetchData(currentPage, itemsPerPage, searchQuery || undefined, sort);
      
      setData(result.data);
      setTotalPages(result.totalPages);
      setTotalItems(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery, sortColumn, sortDirection, fetchData]);

  // Carregar dados quando dependências mudam
  useEffect(() => {
    loadData();
  }, [loadData]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const setItemsPerPage = (items: number) => {
    setItemsPerPageState(items);
    setCurrentPage(1); // Voltar para primeira página
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Voltar para primeira página ao buscar
  };

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
    setCurrentPage(1); // Voltar para primeira página ao ordenar
  };

  const paginationProps = {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange: goToPage,
    onItemsPerPageChange: setItemsPerPage,
  };

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    searchQuery,
    setSearchQuery: handleSearch,
    sortColumn,
    sortDirection,
    refetch: loadData,
    goToPage,
    setItemsPerPage,
    handleSort,
    paginationProps,
  };
};
