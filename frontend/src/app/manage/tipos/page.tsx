"use client";

import React, { useState, useEffect } from 'react';
import ManageLayout from '@/components/ui/ManageLayout';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { TableColumn, TableAction } from '@/components/ui/DataTable';
import FormModal from '@/components/ui/FormModal';
import TipoForm from '@/components/forms/TipoForm';
import TipoDetail from '@/components/details/TipoDetail';
import { Edit, Trash2, Eye, File } from 'lucide-react';
import { TipoDocumento } from '@/types';
import { useTipos } from '@/hooks/useTipos';
import { usePaginatedData } from '@/hooks/usePaginatedData';

const TiposPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<TipoDocumento | null>(null);
  
  const {
    carregarPaginado,
    remover
  } = useTipos();

  // Hook de paginação com dados da API
  const {
    data: tipos,
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

  const handleDelete = async (tipo: TipoDocumento) => {
    if (!confirm(`Deseja realmente excluir o tipo "${tipo.nome}"?`)) {
      return;
    }

    try {
      await remover(tipo._id);
      refetch(); // Recarregar lista
    } catch (err) {
      // Erro já tratado pelo hook
      console.error('Erro ao excluir tipo:', err);
    }
  };

  const handleAdd = () => {
    setSelectedTipo(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tipo: TipoDocumento) => {
    setSelectedTipo(tipo);
    setIsFormOpen(true);
  };

  const handleView = (tipo: TipoDocumento) => {
    setSelectedTipo(tipo);
    setIsDetailOpen(true);
  };

  const handleFormSuccess = () => {
    refetch(); // Recarregar lista após sucesso
    setIsFormOpen(false); // Fechar modal
    setSelectedTipo(null); // Limpar seleção
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedTipo(null);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setSelectedTipo(null);
  };

  const columns: TableColumn<TipoDocumento>[] = [
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
      render: (value, record) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <File className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            {record.descricao && (
              <div className="text-sm text-gray-500">{record.descricao}</div>
            )}
          </div>
        </div>
      ),
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

  const actions: TableAction<TipoDocumento>[] = [
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
          title="Tipos de Documento"
          subtitle="Gerencie os tipos de documentos permitidos"
          onAdd={handleAdd}
          onSearch={handleSearch}
          onFilter={() => console.log('Filtrar tipos')}
          onExport={() => console.log('Exportar tipos')}
          addButtonText="Novo Tipo"
          searchPlaceholder="Pesquisar tipos..."
        />

        <DataTable
          data={tipos}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="Nenhum tipo encontrado"
          onSort={handleSort}
          pagination={paginationProps}
        />

        {/* Formulário Modal */}
        <FormModal
          isOpen={isFormOpen}
          onClose={handleFormClose}
          title={selectedTipo ? 'Editar Tipo' : 'Novo Tipo'}
        >
          <TipoForm
            tipo={selectedTipo}
            onSuccess={handleFormSuccess}
          />
        </FormModal>

        {/* Modal de Detalhes */}
        <TipoDetail
          isOpen={isDetailOpen}
          onClose={handleDetailClose}
          tipo={selectedTipo}
        />
      </div>
    </ManageLayout>
  );
};

export default TiposPage;
