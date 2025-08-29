"use client";

import React, { useState, useEffect } from 'react';
import ManageLayout from '@/components/ui/ManageLayout';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { TableColumn, TableAction } from '@/components/ui/DataTable';
import FormModal from '@/components/ui/FormModal';
import CategoriaForm from '@/components/forms/CategoriaForm';
import CategoriaDetail from '@/components/details/CategoriaDetail';
import { FolderOpen, Edit, Trash2, Eye } from 'lucide-react';
import { CategoriaDocumento } from '@/types';
import { useCategorias } from '@/hooks/useCategorias';
import { usePaginatedData } from '@/hooks/usePaginatedData';

const CategoriasPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaDocumento | null>(null);
  
  const {
    carregarPaginado,
    remover
  } = useCategorias();

  // Hook de paginação com dados da API
  const {
    data: categorias,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    handleSort,
    paginationProps,
    refetch
  } = usePaginatedData({
    fetchData: carregarPaginado,
    initialItemsPerPage: 10
  });

  useEffect(() => {
    // O usePaginatedData já carrega os dados automaticamente
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
  };

  const handleDelete = async (categoria: CategoriaDocumento) => {
    if (!confirm(`Deseja realmente excluir a categoria "${categoria.nome}"?`)) {
      return;
    }

    try {
      await remover(categoria._id);
      refetch(); // Recarregar lista
    } catch (err) {
      // Erro já tratado pelo hook
      console.error('Erro ao excluir categoria:', err);
    }
  };

  const handleAdd = () => {
    setSelectedCategoria(null);
    setIsFormOpen(true);
  };

  const handleEdit = (categoria: CategoriaDocumento) => {
    setSelectedCategoria(categoria);
    setIsFormOpen(true);
  };

  const handleView = (categoria: CategoriaDocumento) => {
    setSelectedCategoria(categoria);
    setIsDetailOpen(true);
  };

  const handleFormSuccess = () => {
    refetch(); // Recarregar lista após sucesso
    setIsFormOpen(false); // Fechar modal
    setSelectedCategoria(null); // Limpar seleção
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedCategoria(null);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setSelectedCategoria(null);
  };

  const getColorDisplay = (cor?: string) => {
    if (!cor) return { bg: '#6b7280', text: '#fff' }; // gray por padrão
    return {
      bg: cor,
      text: '#fff' // texto branco para contraste
    };
  };

  const columns: TableColumn<CategoriaDocumento>[] = [
    {
      key: 'codigo',
      title: 'Código',
      sortable: true,
      width: 'w-24',
      render: (value) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {value}
        </span>
      ),
    },
    {
      key: 'nome',
      title: 'Nome',
      sortable: true,
      render: (value, record) => {
        const color = getColorDisplay(record.cor);
        return (
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div 
                className="w-3 h-3 rounded-full border border-gray-200"
                style={{ backgroundColor: color.bg }}
              ></div>
            </div>
            <div>
              <div className="font-medium text-gray-900">{value}</div>
              {record.descricao && (
                <div className="text-sm text-gray-500">{record.descricao}</div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'cor',
      title: 'Cor',
      width: 'w-20',
      render: (value) => {
        const color = getColorDisplay(value);
        return (
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: color.bg }}
            ></div>
            <span className="text-xs text-gray-600 font-mono">
              {value || '#6b7280'}
            </span>
          </div>
        );
      },
    },
    {
      key: 'ativo',
      title: 'Status',
      sortable: true,
      width: 'w-20',
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            value
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
    {
      key: 'dataCriacao',
      title: 'Data de Criação',
      sortable: true,
      width: 'w-32',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString('pt-BR')}
        </span>
      ),
    },
  ];

  const actions: TableAction<CategoriaDocumento>[] = [
    {
      key: 'view',
      label: 'Visualizar',
      icon: <Eye className="w-4 h-4" />,
      onClick: handleView,
    },
    {
      key: 'edit',
      label: 'Editar',
      icon: <Edit className="w-4 h-4" />,
      onClick: handleEdit,
    },
    {
      key: 'delete',
      label: 'Excluir',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: handleDelete,
      variant: 'danger',
    },
  ];

  return (
    <ManageLayout>
      <div>
        <PageHeader
          title="Categorias"
          subtitle="Gerencie as categorias de documentos"
          onAdd={handleAdd}
          onSearch={handleSearch}
          onFilter={() => console.log('Filtrar categorias')}
          onExport={() => console.log('Exportar categorias')}
          addButtonText="Nova Categoria"
          searchPlaceholder="Pesquisar categorias..."
        />

        <DataTable
          data={categorias}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="Nenhuma categoria encontrada"
          onSort={handleSort}
          pagination={paginationProps}
        />

        {/* Formulário Modal */}
        <FormModal
          isOpen={isFormOpen}
          onClose={handleFormClose}
          title={selectedCategoria ? 'Editar Categoria' : 'Nova Categoria'}
        >
          <CategoriaForm
            categoria={selectedCategoria}
            onSuccess={handleFormSuccess}
          />
        </FormModal>

        {/* Modal de Detalhes */}
        <CategoriaDetail
          isOpen={isDetailOpen}
          onClose={handleDetailClose}
          categoria={selectedCategoria}
        />
      </div>
    </ManageLayout>
  );
};

export default CategoriasPage;
