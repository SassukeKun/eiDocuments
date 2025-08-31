"use client";

import React from 'react';
import { X, FileText, Calendar, User, Building2, Tag, Download, Edit2 } from 'lucide-react';
import { Documento } from '@/types';

interface DocumentoViewModalProps {
  documento: Documento | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (documento: Documento) => void;
  onDownload: (documento: Documento) => void;
}

const DocumentoViewModal: React.FC<DocumentoViewModalProps> = ({
  documento,
  isOpen,
  onClose,
  onEdit,
  onDownload
}) => {
  if (!isOpen || !documento) return null;

  const formatDate = (dateString: string) => {
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
      <div className="space-y-2">
        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${config.bg} ${config.text}`}>
          {config.label}
        </span>
        {person && (
          <div className="text-sm">
            <div className="text-gray-500 font-medium">{personLabel}</div>
            <div className="text-gray-900">{person}</div>
          </div>
        )}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      'ativo': { bg: 'bg-green-100', text: 'text-green-800', label: 'Ativo' },
      'arquivado': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Arquivado' },
      'rascunho': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Rascunho' }
    };
    
    const config = statusConfig[status] || statusConfig.ativo;
    
    return (
      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{documento.titulo}</h2>
              <p className="text-sm text-gray-500">Visualização do documento</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Descrição */}
              {documento.descricao && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Descrição</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{documento.descricao}</p>
                </div>
              )}

              {/* Categoria e Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Categoria</h3>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full bg-${documento.categoria?.cor || 'gray'}-500`}></div>
                    <span className="text-sm font-medium">{documento.categoria?.nome || 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Tipo</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{documento.tipo?.nome || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Movimento */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Tipo de Movimento</h3>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {getMovementBadge(documento.tipoMovimento, documento)}
                </div>
              </div>

              {/* Tags */}
              {documento.tags && documento.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {documento.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Status</h3>
                {getStatusBadge(documento.status || 'ativo')}
              </div>

              {/* Arquivo */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Arquivo</h3>
                <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                  <div className="text-sm font-medium text-gray-900">
                    {documento.arquivo?.originalName || 'Arquivo não encontrado'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(documento.arquivo?.size || 0)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {documento.arquivo?.tipoMime || 'Tipo não identificado'}
                  </div>
                </div>
              </div>

              {/* Departamento */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Departamento</h3>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{documento.departamento?.nome || 'N/A'}</span>
                </div>
              </div>

              {/* Criado por */}
              {documento.usuario && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Criado por</h3>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{documento.usuario?.nome || 'N/A'}</span>
                  </div>
                </div>
              )}

              {/* Datas */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Data de Criação</h3>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{formatDate(documento.dataCriacao)}</span>
                  </div>
                </div>

                {documento.dataAtualizacao && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Última Atualização</h3>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{formatDate(documento.dataAtualizacao)}</span>
                    </div>
                  </div>
                )}

                {documento.dataEnvio && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Data de Envio</h3>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{formatDate(documento.dataEnvio)}</span>
                    </div>
                  </div>
                )}

                {documento.dataRecebimento && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Data de Recebimento</h3>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{formatDate(documento.dataRecebimento)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={() => onDownload(documento)}
            className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
          <button
            onClick={() => onEdit(documento)}
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentoViewModal;


