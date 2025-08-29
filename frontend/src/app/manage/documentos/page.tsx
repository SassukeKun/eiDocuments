"use client";

import React, { useState, useEffect } from 'react';
import ManageLayout from '@/components/ui/ManageLayout';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { TableColumn, TableAction } from '@/components/ui/DataTable';
import DocumentoForm from '@/components/forms/DocumentoForm';
import { FileText, Edit, Trash2, Eye, Download, Building2, FolderOpen } from 'lucide-react';
import { Documento } from '@/types';
import { useDocumentos } from '@/hooks/useDocumentos';

const DocumentosPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDocumento, setSelectedDocumento] = useState<Documento | null>(null);
  
  const {
    documentos,
    loading,
    carregar,
    buscarPorTexto,
    buscarPorId,
    remover,
    baixar
  } = useDocumentos();

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      carregar();
      return;
    }
    buscarPorTexto(query);
  };

  const handleDelete = async (documento: Documento) => {
    if (!confirm(`Deseja realmente excluir o documento "${documento.titulo}"?`)) {
      return;
    }

    try {
      await remover(documento._id);
      carregar(); // Recarregar lista
    } catch (err) {
      // Erro já tratado pelo hook
      console.error('Erro ao excluir documento:', err);
    }
  };

  const handleDownload = async (documento: Documento) => {
    try {
      await baixar(documento._id);
    } catch (err) {
      console.error('Erro ao baixar documento:', err);
    }
  };

  const handleAdd = () => {
    setSelectedDocumento(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (documento: Documento) => {
    try {
      // Buscar documento completo com populate
      const documentoCompleto = await buscarPorId(documento._id);
      setSelectedDocumento(documentoCompleto);
      setIsFormOpen(true);
    } catch (error) {
      console.error('Erro ao buscar documento:', error);
      // Fallback: usar dados da lista
      setSelectedDocumento(documento);
      setIsFormOpen(true);
    }
  };

  const handleFormSuccess = () => {
    carregar(); // Recarregar lista após sucesso
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedDocumento(null);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || isNaN(bytes)) return '0 KB';
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  const columns: TableColumn[] = [
    {
      key: 'titulo',
      title: 'Documento',
      sortable: true,
      render: (value, record) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 truncate">{value}</div>
            {record.descricao && (
              <div className="text-sm text-gray-500 truncate">{record.descricao}</div>
            )}
            <div className="text-xs text-gray-400 mt-1">
              {record.arquivo.originalName} • {formatFileSize(record.arquivo.size)}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'departamento',
      title: 'Departamento',
      sortable: true,
      width: 'w-32',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <div>
            <div className="font-medium text-sm">{value.nome}</div>
            <div className="text-xs text-gray-500">{value.codigo}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'categoria',
      title: 'Categoria',
      width: 'w-28',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full bg-${value.cor}-500`}></div>
          <span className="text-sm">{value.nome}</span>
        </div>
      ),
    },
    {
      key: 'tags',
      title: 'Tags',
      width: 'w-40',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
          {value.length > 2 && (
            <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              +{value.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'tipoMovimento',
      title: 'Movimento/Responsável',
      sortable: false,
      width: 'w-40',
      render: (value, record: any) => {
        const movementConfig: Record<string, { bg: string; text: string; label: string }> = {
          'recebido': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Recebido' },
          'enviado': { bg: 'bg-green-100', text: 'text-green-800', label: 'Enviado' },
          'interno': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Interno' }
        };
        
        const config = movementConfig[value] || movementConfig.interno;
        
        let person = '';
        let personLabel = '';
        
        if (value === 'recebido' && record.remetente) {
          person = record.remetente;
          personLabel = 'De:';
        } else if (value === 'enviado' && record.destinatario) {
          person = record.destinatario;
          personLabel = 'Para:';
        } else if (value === 'interno' && record.responsavel) {
          person = record.responsavel;
          personLabel = 'Resp:';
        }
        
        return (
          <div className="space-y-1">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
              {config.label}
            </span>
            {person && (
              <div className="text-sm">
                <div className="text-xs text-gray-500">{personLabel}</div>
                <div className="text-gray-900 font-medium truncate">{person}</div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'dataCriacao',
      title: 'Data',
      sortable: true,
      width: 'w-24',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString('pt-BR')}
        </span>
      ),
    },
    {
      key: 'ativo',
      title: 'Status',
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
  ];

  const actions: TableAction[] = [
    {
      key: 'download',
      label: 'Download',
      icon: <Download className="w-4 h-4" />,
      onClick: handleDownload,
      variant: 'success',
    },
    {
      key: 'view',
      label: 'Visualizar',
      icon: <Eye className="w-4 h-4" />,
      onClick: (record) => {
        console.log('Visualizar documento:', record);
      },
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
          title="Documentos"
          subtitle="Gerencie todos os documentos do sistema"
          onAdd={handleAdd}
          onSearch={handleSearch}
          onFilter={() => console.log('Filtrar documentos')}
          onExport={() => console.log('Exportar documentos')}
          addButtonText="Novo Documento"
          searchPlaceholder="Pesquisar documentos..."
        />

        <DataTable
          data={documentos}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="Nenhum documento encontrado"
          onSort={(column, direction) => {
            console.log('Ordenar por:', column, direction);
          }}
        />

        <DocumentoForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          documento={selectedDocumento}
        />
      </div>
    </ManageLayout>
  );
};

export default DocumentosPage;
