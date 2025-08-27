"use client";

import React, { useState, useEffect } from 'react';
import ManageLayout from '@/components/ui/ManageLayout';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { TableColumn, TableAction } from '@/components/ui/DataTable';
import { FileText, Edit, Trash2, Eye, Download, Building2, FolderOpen } from 'lucide-react';
import { useNotification } from '@/hooks/useNotification';

// Dados de exemplo - substituir por service real quando estiver pronto
const mockDocuments = [
  {
    _id: '1',
    titulo: 'Relatório Anual 2024',
    descricao: 'Relatório completo das atividades do ano',
    arquivo: {
      nomeOriginal: 'relatorio-2024.pdf',
      tamanho: 2048576,
      tipo: 'application/pdf',
    },
    departamento: { nome: 'Administração', codigo: 'ADM' },
    categoria: { nome: 'Relatórios', cor: 'blue' },
    tipo: { nome: 'PDF', codigo: 'PDF' },
    criadoPor: { nome: 'João Silva' },
    dataCriacao: new Date().toISOString(),
    ativo: true,
    tags: ['relatório', 'anual', '2024'],
  },
  {
    _id: '2',
    titulo: 'Manual de Procedimentos',
    descricao: 'Manual interno de procedimentos operacionais',
    arquivo: {
      nomeOriginal: 'manual-procedimentos.docx',
      tamanho: 1048576,
      tipo: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    departamento: { nome: 'Recursos Humanos', codigo: 'RH' },
    categoria: { nome: 'Manuais', cor: 'green' },
    tipo: { nome: 'Word', codigo: 'DOCX' },
    criadoPor: { nome: 'Maria Santos' },
    dataCriacao: new Date(Date.now() - 86400000).toISOString(),
    ativo: true,
    tags: ['manual', 'procedimentos'],
  },
];

const DocumentosPage = () => {
  const [documentos, setDocumentos] = useState(mockDocuments);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { success, error } = useNotification();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setDocumentos(mockDocuments);
      return;
    }

    const filtered = mockDocuments.filter(doc =>
      doc.titulo.toLowerCase().includes(query.toLowerCase()) ||
      doc.descricao?.toLowerCase().includes(query.toLowerCase()) ||
      doc.departamento.nome.toLowerCase().includes(query.toLowerCase())
    );
    setDocumentos(filtered);
  };

  const handleDelete = async (documento: any) => {
    if (!confirm(`Deseja realmente excluir o documento "${documento.titulo}"?`)) {
      return;
    }

    try {
      // Implementar service de exclusão
      success('Documento excluído com sucesso');
      setDocumentos(prev => prev.filter(d => d._id !== documento._id));
    } catch (err) {
      error('Erro ao excluir documento');
    }
  };

  const handleDownload = (documento: any) => {
    // Implementar download do documento
    success(`Download de "${documento.titulo}" iniciado`);
  };

  const formatFileSize = (bytes: number) => {
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
              {record.arquivo.nomeOriginal} • {formatFileSize(record.arquivo.tamanho)}
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
      key: 'criadoPor',
      title: 'Criado por',
      sortable: true,
      width: 'w-28',
      render: (value) => (
        <span className="text-sm text-gray-600">{value.nome}</span>
      ),
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
      onClick: (record) => {
        console.log('Editar documento:', record);
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
          title="Documentos"
          subtitle="Gerencie todos os documentos do sistema"
          onAdd={() => console.log('Adicionar documento')}
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
      </div>
    </ManageLayout>
  );
};

export default DocumentosPage;
