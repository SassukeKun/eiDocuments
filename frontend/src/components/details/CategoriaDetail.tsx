"use client";

import React, { useState, useEffect } from 'react';
import statsService from '@/services/statsService';
import DetailModal from '@/components/ui/DetailModal';
import { CategoriaDocumento, Departamento } from '@/types';
import { 
  FolderOpen, 
  Calendar, 
  Building2, 
  Code, 
  FileText, 
  Activity, 
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Palette,
  Users
} from 'lucide-react';

interface CategoriaDetailProps {
  isOpen: boolean;
  onClose: () => void;
  categoria: CategoriaDocumento | null;
}

interface CategoriaStats {
  totalDocumentos: number;
  documentosAtivos: number;
  documentosArquivados: number;
  ultimoDocumento?: {
    titulo: string;
    data: string;
    usuario: string;
  };
  usuarios: {
    nome: string;
    quantidade: number;
  }[];
  documentosRecentes: {
    titulo: string;
    data: string;
    tipo: string;
  }[];
}

const CategoriaDetail: React.FC<CategoriaDetailProps> = ({
  isOpen,
  onClose,
  categoria
}) => {
  const [stats, setStats] = useState<CategoriaStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && categoria) {
      loadStats();
    }
  }, [isOpen, categoria]);

  const loadStats = async () => {
    if (!categoria) return;
    setLoading(true);
    try {
      // Chamada real para API de estatísticas de categoria
      const apiStats = await statsService.getCategoryStats();
      // Encontrar dados da categoria específica
      const uso = (apiStats.distribuicoes?.usoPorCategoria || []).find(cat => cat.categoria === categoria.nome);
      // Recentes e usuários são simulados pois não há endpoint dedicado
      setStats({
        totalDocumentos: uso?.quantidade || 0,
        documentosAtivos: 0, // Não disponível
        documentosArquivados: 0, // Não disponível
        ultimoDocumento: undefined, // Não disponível
        usuarios: [], // Não disponível
        documentosRecentes: [] // Não disponível
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

  const getDepartmentName = (departamento: string | Departamento): string => {
    if (typeof departamento === 'string') {
      return 'Carregando...'; // TODO: Buscar nome do departamento
    }
    return departamento.nome;
  };

  const getColorDisplay = (cor?: string) => {
    if (!cor) return { bg: '#6b7280', text: '#fff' };
    return { bg: cor, text: '#fff' };
  };

  if (!categoria) return null;

  const colorStyle = getColorDisplay(categoria.cor);

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes da Categoria"
      size="xl"
    >
      <div className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colorStyle.bg }}
            >
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{categoria.nome}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  categoria.ativo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {categoria.ativo ? (
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
              {categoria.descricao && (
                <p className="text-gray-600 mb-3">{categoria.descricao}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Code className="w-4 h-4" />
                  <span>Código: {categoria.codigo}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Building2 className="w-4 h-4" />
                  <span>Departamento: {getDepartmentName(categoria.departamento)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Palette className="w-4 h-4" />
                  <span>Cor: {categoria.cor || '#6b7280'}</span>
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: colorStyle.bg }}
                  ></div>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Criado em {formatDate(categoria.dataCriacao)}</span>
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
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Estatísticas de Uso
            </h4>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total de Documentos</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalDocumentos}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        )}

        {/* Metadados */}
        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Informações do Sistema</h4>
          <div className="text-sm">
            <div>
              <span className="text-gray-500">Última Atualização:</span>
              <span className="ml-2 text-gray-900">{formatDate(categoria.dataAtualizacao)}</span>
            </div>
          </div>
        </div>
      </div>
    </DetailModal>
  );
};

export default CategoriaDetail;
