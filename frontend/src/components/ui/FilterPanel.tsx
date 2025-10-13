"use client";

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import ModernButton from './ModernButton';

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface FilterField {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text';
  options?: FilterOption[];
  placeholder?: string;
  disabled?: boolean;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  fields: FilterField[];
  onApply: (filters: Record<string, any>) => void;
  onClear: () => void;
  initialValues?: Record<string, any>;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  fields,
  onApply,
  onClear,
  initialValues = {}
}) => {
  const [filters, setFilters] = useState<Record<string, any>>(initialValues);

  useEffect(() => {
    if (isOpen) {
      setFilters(initialValues);
    }
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const handleChange = (fieldId: string, value: any) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [fieldId]: value
      };
      
      // Se o departamento mudou (e não está vazio), limpar categoria
      if (fieldId === 'departamento') {
        if (value) {
          // Departamento selecionado - limpar categoria para forçar nova seleção
          delete newFilters.categoria;
        } else {
          // Departamento limpo - também limpar categoria
          delete newFilters.categoria;
        }
      }
      
      return newFilters;
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClearAll = () => {
    setFilters({});
    onClear();
    onClose();
  };

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'select':
        return (
          <select
            value={filters[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            disabled={field.disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">{field.placeholder || 'Selecione...'}</option>
            {field.options?.map(opt => (
              <option key={opt.id} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        const selectedValues = filters[field.id] || [];
        return (
          <div className="space-y-2">
            {field.options?.map(opt => (
              <label key={opt.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, opt.value]
                      : selectedValues.filter((v: string) => v !== opt.value);
                    handleChange(field.id, newValues);
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={filters[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      case 'daterange':
        return (
          <div className="space-y-2">
            <input
              type="date"
              value={filters[`${field.id}_start`] || ''}
              onChange={(e) => handleChange(`${field.id}_start`, e.target.value)}
              placeholder="Data inicial"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="date"
              value={filters[`${field.id}_end`] || ''}
              onChange={(e) => handleChange(`${field.id}_end`, e.target.value)}
              placeholder="Data final"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );

      case 'text':
        return (
          <input
            type="text"
            value={filters[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Backdrop semi-transparente apenas para dispositivos móveis */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity sm:hidden"
        onClick={onClose}
      />

      {/* Panel com animação de slide */}
      <div className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
              <p className="text-sm text-gray-500 mt-0.5">Refine sua busca</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm"
              aria-label="Fechar filtros"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {fields.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>Nenhum filtro disponível</p>
              </div>
            ) : (
              fields.map(field => (
                <div key={field.id} className="animate-fadeIn">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  {renderField(field)}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 space-y-3 bg-gray-50">
            <ModernButton
              onClick={handleApply}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Aplicar Filtros</span>
            </ModernButton>
            <ModernButton
              variant="outline"
              onClick={handleClearAll}
              className="w-full"
            >
              Limpar Filtros
            </ModernButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
