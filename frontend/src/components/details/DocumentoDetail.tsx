"use client";

import React, { useState } from 'react';
import DetailModal from '@/components/ui/DetailModal';
import { Documento, CategoriaDocumento, TipoDocumento, Departamento, Usuario } from '@/types';
import { 
  FileText, 
  Calendar, 
  Building2, 
  User, 
  FolderOpen,
  File,
  Download,
  Tag,
  Clock,
  Send,
  Inbox,
  Home,
  CheckCircle,
  XCircle,
  Archive,
  ExternalLink
} from 'lucide-react';

interface DocumentoDetailProps {
  isOpen: boolean;
  onClose: () => void;
  documento: Documento | null;
  onDownload?: (documento: Documento) => void;
}

const DocumentoDetail: React.FC<DocumentoDetailProps> = ({
  isOpen,
  onClose,
  documento,
  onDownload
}) => {
  const [imageError, setImageError] = useState(false);

  if (!documento) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || isNaN(bytes)) return '0 KB';
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  const getMovementIcon = (tipoMovimento: string) => {
    switch (tipoMovimento) {
      case 'enviado': return <Send className="w-4 h-4" />;
      case 'recebido': return <Inbox className="w-4 h-4" />;
      case 'interno': return <Home className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getMovementColor = (tipoMovimento: string) => {
    switch (tipoMovimento) {
      case 'enviado': return 'bg-green-100 text-green-800';
      case 'recebido': return 'bg-blue-100 text-blue-800';
      case 'interno': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMovementLabel = (tipoMovimento: string) => {
    switch (tipoMovimento) {
      case 'enviado': return 'Enviado';
      case 'recebido': return 'Recebido';
      case 'interno': return 'Interno';
      default: return 'Desconhecido';
    }
  };

  const getEntityName = (entity: string | any): string => {
    if (typeof entity === 'string') {
      return 'Carregando...';
    }
    return entity?.nome || entity?.titulo || 'N/A';
  };

  const getCategoryColor = (categoria: string | CategoriaDocumento) => {
    if (typeof categoria === 'object' && categoria.cor) {
      return categoria.cor;
    }
    return '#6b7280';
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(documento);
    }
  };

  const isImage = documento.arquivo?.format && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(documento.arquivo.format.toLowerCase());

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Documento"
      size="xl"
    >
      <div className="space-y-6">
        {/* Header do Documento */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{documento.titulo}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getMovementColor(documento.tipoMovimento)}`}>
                      {getMovementIcon(documento.tipoMovimento)}
                      <span className="ml-1">{getMovementLabel(documento.tipoMovimento)}</span>
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      documento.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {documento.ativo ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Inativo
                        </>
                      )}
                    </span>
                    {documento.status === 'arquivado' && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                        <Archive className="w-3 h-3 mr-1" />
                        Arquivado
                      </span>
                    )}
                  </div>
                </div>
                {documento.descricao && (
                  <p className="text-gray-600 mb-3">{documento.descricao}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Arquivo */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <File className="w-4 h-4 mr-2" />
            Informações do Arquivo
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <File className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{documento.arquivo?.originalName || 'Nome não disponível'}</p>
                  <p className="text-sm text-gray-500">
                    {documento.arquivo?.format?.toUpperCase() || 'Formato desconhecido'} • {formatFileSize(documento.arquivo?.size || 0)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
            
            {/* Preview da Imagem */}
            {isImage && documento.arquivo?.secureUrl && !imageError && (
              <div className="mt-4">
                <img
                  src={documento.arquivo.secureUrl}
                  alt={documento.titulo}
                  className="max-w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={() => setImageError(true)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Metadados do Documento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Classificação */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Classificação</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Building2 className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Departamento</p>
                  <p className="text-sm text-gray-600">{getEntityName(documento.departamento)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getCategoryColor(documento.categoria) }}
                ></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Categoria</p>
                  <p className="text-sm text-gray-600">{getEntityName(documento.categoria)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <File className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Tipo</p>
                  <p className="text-sm text-gray-600">{getEntityName(documento.tipo)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações Específicas do Movimento */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Detalhes do Movimento</h4>
            <div className="space-y-3">
              {documento.tipoMovimento === 'enviado' && (
                <>
                  {documento.destinatario && (
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <Send className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Destinatário</p>
                        <p className="text-sm text-gray-600">{documento.destinatario}</p>
                      </div>
                    </div>
                  )}
                  {documento.dataEnvio && (
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Data de Envio</p>
                        <p className="text-sm text-gray-600">{formatDate(documento.dataEnvio)}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {documento.tipoMovimento === 'recebido' && (
                <>
                  {documento.remetente && (
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Inbox className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Remetente</p>
                        <p className="text-sm text-gray-600">{documento.remetente}</p>
                      </div>
                    </div>
                  )}
                  {documento.dataRecebimento && (
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Data de Recebimento</p>
                        <p className="text-sm text-gray-600">{formatDate(documento.dataRecebimento)}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {documento.tipoMovimento === 'interno' && documento.responsavel && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Responsável</p>
                    <p className="text-sm text-gray-600">{documento.responsavel}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Criado por</p>
                  <p className="text-sm text-gray-600">{getEntityName(documento.usuario)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {documento.tags && documento.tags.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {documento.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadados do Sistema */}
        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Informações do Sistema
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Data de Criação:</span>
              <span className="ml-2 text-gray-900">{formatDate(documento.dataCriacao)}</span>
            </div>
            <div>
              <span className="text-gray-500">Última Atualização:</span>
              <span className="ml-2 text-gray-900">{formatDate(documento.dataAtualizacao)}</span>
            </div>
          </div>
        </div>
      </div>
    </DetailModal>
  );
};

export default DocumentoDetail;
