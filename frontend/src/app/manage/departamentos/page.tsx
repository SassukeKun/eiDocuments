"use client";

import React, { useState, useEffect } from 'react';
import ManageLayout from '@/components/ui/ManageLayout';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { TableColumn, TableAction } from '@/components/ui/DataTable';
import { Building2, Edit, Trash2, Eye } from 'lucide-react';
import { DepartamentosService } from '@/services/departamentosService';
import { Departamento } from '@/types';
import { useNotification } from '@/hooks/useNotification';

const DepartamentosPage = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { success, error } = useNotification();

  useEffect(() => {
    loadDepartamentos();
  }, []);

  const loadDepartamentos = async () => {
    try {
      setLoading(true);
      const response = await DepartamentosService.listar();
      setDepartamentos(response.data || []);
    } catch (err) {
      error('Erro ao carregar departamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadDepartamentos();
      return;
    }

    try {
      setLoading(true);
      const response = await DepartamentosService.buscarPorTexto(query);
      setDepartamentos(response.data || []);
    } catch (err) {
      error('Erro ao pesquisar departamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (departamento: Departamento) => {
    if (!confirm(`Deseja realmente excluir o departamento "${departamento.nome}"?`)) {
      return;
    }

    try {
      await DepartamentosService.remover(departamento._id);
      success('Departamento excluído com sucesso');
      loadDepartamentos();
    } catch (err) {
      error('Erro ao excluir departamento');
    }
  };

  const columns: TableColumn<Departamento>[] = [
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
            <Building2 className="w-5 h-5 text-gray-400" />
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

  const actions: TableAction<Departamento>[] = [
    {
      key: 'view',
      label: 'Visualizar',
      icon: <Eye className="w-4 h-4" />,
      onClick: (record) => {
        console.log('Visualizar departamento:', record);
      },
    },
    {
      key: 'edit',
      label: 'Editar',
      icon: <Edit className="w-4 h-4" />,
      onClick: (record) => {
        console.log('Editar departamento:', record);
      },
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
          title="Departamentos"
          subtitle="Gerencie os departamentos da organização"
          onAdd={() => console.log('Adicionar departamento')}
          onSearch={handleSearch}
          onFilter={() => console.log('Filtrar departamentos')}
          onExport={() => console.log('Exportar departamentos')}
          addButtonText="Novo Departamento"
          searchPlaceholder="Pesquisar departamentos..."
        />

        <DataTable
          data={departamentos}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="Nenhum departamento encontrado"
          onSort={(column, direction) => {
            console.log('Ordenar por:', column, direction);
          }}
        />
      </div>
    </ManageLayout>
  );
};

export default DepartamentosPage;
