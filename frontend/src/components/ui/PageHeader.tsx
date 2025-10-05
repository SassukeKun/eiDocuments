"use client";

import React from 'react';
import ModernButton from './ModernButton';
import { Plus, Search, Filter } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onAdd?: () => void;
  onSearch?: (query: string) => void;
  onFilter?: () => void;
  addButtonText?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showFilter?: boolean;
  showAdd?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onAdd,
  onSearch,
  onFilter,
  addButtonText = "Adicionar",
  searchPlaceholder = "Pesquisar...",
  showSearch = true,
  showFilter = true,
  showAdd = true,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          {showSearch && onSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
          )}

          {/* Filter Button */}
          {showFilter && onFilter && (
            <ModernButton
              variant="outline"
              onClick={onFilter}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </ModernButton>
          )}

          {/* Add Button */}
          {showAdd && onAdd && (
            <ModernButton
              onClick={onAdd}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{addButtonText}</span>
            </ModernButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
