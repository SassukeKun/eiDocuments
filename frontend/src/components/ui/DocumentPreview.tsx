"use client";

import React, { useState } from 'react';
import { X, Download, ExternalLink, AlertCircle } from 'lucide-react';

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  fileName: string;
  fileType: string;
  onDownload?: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  isOpen,
  onClose,
  documentUrl,
  fileName,
  fileType,
  onDownload
}) => {
  const [loadError, setLoadError] = useState(false);

  if (!isOpen) return null;

  const getPreviewComponent = () => {
    const lowerFileType = fileType.toLowerCase();

    // Para PDFs - usar visualização direta do browser
    if (lowerFileType === 'pdf') {
      return (
        <iframe
          src={`${documentUrl}#toolbar=1&navpanes=1&scrollbar=1`}
          width="100%"
          height="100%"
          title={fileName}
          className="border-0"
          onError={() => setLoadError(true)}
        />
      );
    }

    // Para documentos Office (usando Google Docs Viewer)
    if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp'].includes(lowerFileType)) {
      const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(documentUrl)}&embedded=true`;
      
      return (
        <iframe
          src={googleViewerUrl}
          width="100%"
          height="100%"
          title={fileName}
          className="border-0"
          onError={() => setLoadError(true)}
        />
      );
    }

    // Para imagens
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(lowerFileType)) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50 p-4">
          <img 
            src={documentUrl} 
            alt={fileName}
            className="max-w-full max-h-full object-contain shadow-lg"
            onError={() => setLoadError(true)}
          />
        </div>
      );
    }

    // Para arquivos de texto plano
    if (['txt', 'csv', 'json', 'xml', 'html', 'css', 'js', 'ts', 'md'].includes(lowerFileType)) {
      return (
        <div className="h-full bg-white">
          <iframe
            src={documentUrl}
            width="100%"
            height="100%"
            title={fileName}
            className="border-0"
            onError={() => setLoadError(true)}
          />
        </div>
      );
    }

    // Para vídeos
    if (['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(lowerFileType)) {
      return (
        <div className="flex items-center justify-center h-full bg-black">
          <video 
            controls 
            className="max-w-full max-h-full"
            onError={() => setLoadError(true)}
          >
            <source src={documentUrl} type={`video/${lowerFileType}`} />
            Seu navegador não suporta reprodução de vídeo.
          </video>
        </div>
      );
    }

    // Para áudios
    if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(lowerFileType)) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center">
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <audio 
              controls 
              className="w-full max-w-md"
              onError={() => setLoadError(true)}
            >
              <source src={documentUrl} type={`audio/${lowerFileType}`} />
              Seu navegador não suporta reprodução de áudio.
            </audio>
          </div>
        </div>
      );
    }

    // Para tipos não suportados
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center p-8">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Preview não disponível
          </h3>
          <p className="text-gray-500 mb-4">
            Não é possível visualizar arquivos do tipo .{fileType} no navegador
          </p>
          <div className="space-y-2">
            <button 
              onClick={onDownload}
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Baixar Arquivo
            </button>
            <button 
              onClick={() => window.open(documentUrl, '_blank')}
              className="block w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 inline mr-2" />
              Abrir em Nova Aba
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loadError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Erro ao carregar preview
            </h3>
            <p className="text-gray-500 mb-4">
              Não foi possível carregar a visualização do arquivo
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Fechar
              </button>
              <button 
                onClick={onDownload}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Baixar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[90vh] m-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-medium text-gray-900 truncate">
              {fileName}
            </h2>
            <p className="text-sm text-gray-500">
              Arquivo {fileType.toUpperCase()}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {onDownload && (
              <button
                onClick={onDownload}
                className="flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
            )}
            <button
              onClick={() => window.open(documentUrl, '_blank')}
              className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Abrir Original
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {getPreviewComponent()}
        </div>
      </div>
    </div>
  );
};