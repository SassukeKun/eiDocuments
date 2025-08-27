"use client";

import React, { useState, useEffect } from 'react';
import ManageLayout from '@/components/ui/ManageLayout';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { TableColumn, TableAction } from '@/components/ui/DataTable';
import { FolderOpen, Edit, Trash2, Eye, Tag } from 'lucide-react';
import { CategoriasService } from '@/services/categoriasService';
import { CategoriaDocumento } from '@/types';
import { useNotification } from '@/hooks/useNotification';

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState<CategoriaDocumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { success, error } = useNotification();

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const response = await CategoriasService.listar();
      setCategorias(response.data || []);
    } catch (err) {
      error('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadCategorias();
      return;
    }

    try {
      setLoading(true);
      const response = await CategoriasService.buscarPorTexto(query);
      setCategorias(response.data || []);
    } catch (err) {
      error('Erro ao pesquisar categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoria: CategoriaDocumento) => {
    if (!confirm(`Deseja realmente excluir a categoria "${categoria.nome}"?`)) {
      return;
    }

    try {
      await CategoriasService.remover(categoria._id);
      success('Categoria excluída com sucesso');
      loadCategorias();
    } catch (err) {
      error('Erro ao excluir categoria');
    }
  };

  const getColorClass = (cor: string) => {
    const colorMap: Record<string, string> = {
      'blue': 'bg-blue-100 text-blue-800',
      'green': 'bg-green-100 text-green-800',
      'yellow': 'bg-yellow-100 text-yellow-800',
      'red': 'bg-red-100 text-red-800',
      'purple': 'bg-purple-100 text-purple-800',
      'pink': 'bg-pink-100 text-pink-800',
      'indigo': 'bg-indigo-100 text-indigo-800',
      'gray': 'bg-gray-100 text-gray-800',
    };
    return colorMap[cor] || 'bg-gray-100 text-gray-800';
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
      render: (value, record) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className={`w-3 h-3 rounded-full bg-${record.cor || 'gray'}-500`}></div>
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
      key: 'cor',
      title: 'Cor',
      width: 'w-20',
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getColorClass(value)}`}
        >
          <Tag className="w-3 h-3 mr-1" />
          {value}
        </span>
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

  const actions: TableAction<CategoriaDocumento>[] = [
    {
      key: 'view',
      label: 'Visualizar',
      icon: <Eye className="w-4 h-4" />,
      onClick: (record) => {
        console.log('Visualizar categoria:', record);
      },
    },
    {
      key: 'edit',
      label: 'Editar',
      icon: <Edit className="w-4 h-4" />,
      onClick: (record) => {
        console.log('Editar categoria:', record);
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
          title="Categorias"
          subtitle="Gerencie as categorias de documentos"
          onAdd={() => console.log('Adicionar categoria')}
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
          onSort={(column, direction) => {
            console.log('Ordenar por:', column, direction);
          }}
        />
      </div>
    </ManageLayout>
  );
};

export default CategoriasPage;
