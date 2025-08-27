"use client";

import React, { useState, useEffect } from 'react';
import ManageLayout from '@/components/ui/ManageLayout';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { TableColumn, TableAction } from '@/components/ui/DataTable';
import { FileType, Edit, Trash2, Eye, File } from 'lucide-react';
import { TiposService } from '@/services/tiposService';
import { TipoDocumento } from '@/types';
import { useNotification } from '@/hooks/useNotification';

const TiposPage = () => {
  const [tipos, setTipos] = useState<TipoDocumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { success, error } = useNotification();

  useEffect(() => {
    loadTipos();
  }, []);

  const loadTipos = async () => {
    try {
      setLoading(true);
      const response = await TiposService.listar();
      setTipos(response.data || []);
    } catch (err) {
      error('Erro ao carregar tipos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadTipos();
      return;
    }

    try {
      setLoading(true);
      const response = await TiposService.buscarPorTexto(query);
      setTipos(response.data || []);
    } catch (err) {
      error('Erro ao pesquisar tipos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tipo: TipoDocumento) => {
    if (!confirm(`Deseja realmente excluir o tipo "${tipo.nome}"?`)) {
      return;
    }

    try {
      await TiposService.remover(tipo._id);
      success('Tipo excluído com sucesso');
      loadTipos();
    } catch (err) {
      error('Erro ao excluir tipo');
    }
  };

  const getExtensionBadge = (extensoes: string[]) => {
    if (!extensoes || extensoes.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1">
        {extensoes.slice(0, 3).map((ext, index) => (
          <span
            key={index}
            className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
          >
            {ext}
          </span>
        ))}
        {extensoes.length > 3 && (
          <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
            +{extensoes.length - 3}
          </span>
        )}
      </div>
    );
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
      key: 'extensoesPermitidas',
      title: 'Extensões',
      width: 'w-48',
      render: (value) => getExtensionBadge(value),
    },
    {
      key: 'tamanhoMaximo',
      title: 'Tamanho Máximo',
      sortable: true,
      width: 'w-32',
      render: (value) => {
        if (!value) return '-';
        const mb = value / (1024 * 1024);
        return (
          <span className="text-sm text-gray-600">
            {mb < 1 ? `${(value / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`}
          </span>
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

  const actions: TableAction<TipoDocumento>[] = [
    {
      key: 'view',
      label: 'Visualizar',
      icon: <Eye className="w-4 h-4" />,
      onClick: (record) => {
        console.log('Visualizar tipo:', record);
      },
    },
    {
      key: 'edit',
      label: 'Editar',
      icon: <Edit className="w-4 h-4" />,
      onClick: (record) => {
        console.log('Editar tipo:', record);
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
          title="Tipos de Documento"
          subtitle="Gerencie os tipos de documentos permitidos"
          onAdd={() => console.log('Adicionar tipo')}
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
          onSort={(column, direction) => {
            console.log('Ordenar por:', column, direction);
          }}
        />
      </div>
    </ManageLayout>
  );
};

export default TiposPage;
