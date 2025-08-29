"use client";

import React, { useState, useEffect } from 'react';
import UserLayout from '@/components/ui/UserLayout';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { TableColumn, TableAction } from '@/components/ui/DataTable';
import { FileText, Eye, Download, Building2, FolderOpen, Tag, Calendar, User } from 'lucide-react';
import { Documento } from '@/types';
import { useDocumentos } from '@/hooks/useDocumentos';

const DocumentosDepartamentoPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    documentos,
    loading,
    carregar,
    buscarPorTexto,
    buscarPorDepartamento,
    baixar
  } = useDocumentos();

  useEffect(() => {
    // TODO: Obter departamento do usuário logado e filtrar documentos
    // Por enquanto, carrega todos os documentos
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

  const handleDownload = async (documento: Documento) => {
    try {
      await baixar(documento._id);
    } catch (err) {
      console.error('Erro ao baixar documento:', err);
    }
  };

  const handleView = (documento: Documento) => {
    // TODO: Implementar visualização de documento
    console.log('Visualizar documento:', documento);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || isNaN(bytes)) return '0 KB';
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getMovementBadge = (tipoMovimento: string, record: any) => {
    const movementConfig: Record<string, { bg: string; text: string; label: string }> = {
      'recebido': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Recebido' },
      'enviado': { bg: 'bg-green-100', text: 'text-green-800', label: 'Enviado' },
      'interno': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Interno' }
    };
    
    const config = movementConfig[tipoMovimento] || movementConfig.interno;
    
    let person = '';
    let personLabel = '';
    
    if (tipoMovimento === 'recebido' && record.remetente) {
      person = record.remetente;
      personLabel = 'De:';
    } else if (tipoMovimento === 'enviado' && record.destinatario) {
      person = record.destinatario;
      personLabel = 'Para:';
    } else if (tipoMovimento === 'interno' && record.responsavel) {
      person = record.responsavel;
      personLabel = 'Responsável:';
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
  };

  const columns: TableColumn[] = [
    {
      key: 'titulo',
      title: 'Documento',
      sortable: true,
      render: (value, record: any) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 truncate">{value}</div>
            {record.descricao && (
              <div className="text-sm text-gray-500 truncate">{record.descricao}</div>
            )}
            <div className="text-xs text-gray-400 mt-1 flex items-center space-x-2">
              <span>{record.arquivo?.nomeOriginal || 'Arquivo não encontrado'}</span>
              <span>•</span>
              <span>{formatFileSize(record.arquivo?.tamanho || 0)}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'categoria',
      title: 'Categoria',
      width: 'w-32',
      render: (value: any) => (
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full bg-${value?.cor || 'gray'}-500`}></div>
          <span className="text-sm font-medium">{value?.nome || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'tipoMovimento',
      title: 'Tipo/Responsável',
      sortable: false,
      width: 'w-40',
      render: (value, record: any) => getMovementBadge(value, record),
    },
    {
      key: 'tags',
      title: 'Tags',
      width: 'w-32',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value?.slice(0, 2).map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          )) || []}
          {value?.length > 2 && (
            <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              +{value.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'dataCriacao',
      title: 'Data',
      sortable: true,
      width: 'w-24',
      render: (value) => (
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(value)}</span>
        </div>
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
      variant: 'primary',
    },
    {
      key: 'view',
      label: 'Visualizar',
      icon: <Eye className="w-4 h-4" />,
      onClick: handleView,
    },
  ];

  return (
    <UserLayout>
      <div>
        <PageHeader
          title="Documentos do Departamento"
          subtitle="Acesse e visualize documentos do seu departamento"
          onSearch={handleSearch}
          onFilter={() => console.log('Filtrar documentos')}
          searchPlaceholder="Pesquisar documentos..."
          showAddButton={false}
          showExportButton={false}
        />

        <DataTable
          data={documentos}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="Nenhum documento encontrado no seu departamento"
          onSort={(column, direction) => {
            console.log('Ordenar por:', column, direction);
          }}
        />
      </div>
    </UserLayout>
  );
};

export default DocumentosDepartamentoPage;
