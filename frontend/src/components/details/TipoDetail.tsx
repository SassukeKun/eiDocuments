"use client";

import React, { useState, useEffect } from 'react';
import DetailModal from '@/components/ui/DetailModal';
import { TipoDocumento } from '@/types';
import { 
  File, 
  Calendar, 
  User, 
  Code, 
  FileText, 
  Activity, 
  BarChart3,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface TipoDetailProps {
  isOpen: boolean;
  onClose: () => void;
  tipo: TipoDocumento | null;
}

interface TipoStats {
  totalDocumentos: number;
  documentosAtivos: number;
  documentosArquivados: number;
  ultimoDocumento?: {
    titulo: string;
    data: string;
  };
  departamentos: {
    nome: string;
    quantidade: number;
  }[];
}

const TipoDetail: React.FC<TipoDetailProps> = ({
  isOpen,
  onClose,
  tipo
}) => {
  const [stats, setStats] = useState<TipoStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && tipo) {
      loadStats();
    }
  }, [isOpen, tipo]);

  const loadStats = async () => {
    if (!tipo) return;
    
    setLoading(true);
    try {
      // TODO: Implementar chamada real para API
      // Simulando dados por enquanto
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStats({
        totalDocumentos: Math.floor(Math.random() * 100) + 10,
        documentosAtivos: Math.floor(Math.random() * 80) + 5,
        documentosArquivados: Math.floor(Math.random() * 20),
        ultimoDocumento: {
          titulo: "Relatório Mensal de Vendas",
          data: new Date().toISOString()
        },
        departamentos: [
          { nome: "Recursos Humanos", quantidade: 15 },
          { nome: "Financeiro", quantidade: 23 },
          { nome: "Marketing", quantidade: 8 }
        ]
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!tipo) return null;

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Tipo de Documento"
      size="lg"
    >
      <div className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <File className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{tipo.nome}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  tipo.ativo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {tipo.ativo ? (
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
              </div>
              {tipo.descricao && (
                <p className="text-gray-600 mb-3">{tipo.descricao}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Code className="w-4 h-4" />
                  <span>Código: {tipo.codigo}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Criado em {formatDate(tipo.dataCriacao)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Carregando estatísticas...</span>
          </div>
        ) : stats && (
          <>
            {/* Cards de Estatísticas */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Estatísticas de Uso
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total de Documentos</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.totalDocumentos}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Documentos Ativos</p>
                      <p className="text-2xl font-bold text-green-900">{stats.documentosAtivos}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Arquivados</p>
                      <p className="text-2xl font-bold text-orange-900">{stats.documentosArquivados}</p>
                    </div>
                    <Activity className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Último Documento */}
            {stats.ultimoDocumento && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Atividade Recente
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Último documento criado</p>
                      <p className="text-sm text-gray-600">{stats.ultimoDocumento.titulo}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(stats.ultimoDocumento.data)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Uso por Departamento */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Uso por Departamento
              </h4>
              <div className="space-y-2">
                {stats.departamentos.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{dept.nome}</span>
                    <span className="text-sm text-gray-600">{dept.quantidade} documentos</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Metadados */}
        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Informações do Sistema</h4>
          <div className="text-sm">
            <div>
              <span className="text-gray-500">Última Atualização:</span>
              <span className="ml-2 text-gray-900">{formatDate(tipo.dataAtualizacao)}</span>
            </div>
          </div>
        </div>
      </div>
    </DetailModal>
  );
};

export default TipoDetail;
