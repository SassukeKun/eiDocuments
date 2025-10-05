"use client";

import React, { useState, useEffect } from 'react';
import DetailModal from '@/components/ui/DetailModal';
import { Usuario, Departamento } from '@/types';
import { 
  User, 
  Calendar, 
  Building2, 
  Shield, 
  FileText, 
  Activity, 
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Upload,
  Download,
  Eye
} from 'lucide-react';

interface UsuarioDetailProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario | null;
}

interface UsuarioStats {
  totalDocumentos: number;
  documentosEnviados: number;
  documentosRecebidos: number;
  documentosInternos: number;
  ultimoDocumento?: {
    titulo: string;
    tipo: string;
    data: string;
  };
  atividadeRecente: {
    acao: string;
    documento: string;
    data: string;
  }[];
  estatisticasMensais: {
    mes: string;
    documentos: number;
  }[];
}

const UsuarioDetail: React.FC<UsuarioDetailProps> = ({
  isOpen,
  onClose,
  usuario
}) => {
  const [stats, setStats] = useState<UsuarioStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && usuario) {
      loadStats();
    }
  }, [isOpen, usuario]);

  const loadStats = async () => {
    if (!usuario) return;
    
    setLoading(true);
    try {
      // TODO: Implementar chamada real para API
      // Simulando dados por enquanto
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const totalEnviados = Math.floor(Math.random() * 30) + 5;
      const totalRecebidos = Math.floor(Math.random() * 25) + 3;
      const totalInternos = Math.floor(Math.random() * 20) + 2;
      
      setStats({
        totalDocumentos: totalEnviados + totalRecebidos + totalInternos,
        documentosEnviados: totalEnviados,
        documentosRecebidos: totalRecebidos,
        documentosInternos: totalInternos,
        ultimoDocumento: {
          titulo: "Relatório de Atividades Q1",
          tipo: "Relatório",
          data: new Date().toISOString()
        },
        atividadeRecente: [
          { acao: "Criou documento", documento: "Contrato de Serviços", data: "2024-01-20" },
          { acao: "Visualizou documento", documento: "Política de Segurança", data: "2024-01-19" },
          { acao: "Baixou documento", documento: "Manual do Usuário", data: "2024-01-18" },
          { acao: "Editou documento", documento: "Relatório Mensal", data: "2024-01-17" }
        ],
        estatisticasMensais: [
          { mes: "Jan", documentos: 12 },
          { mes: "Fev", documentos: 8 },
          { mes: "Mar", documentos: 15 },
          { mes: "Abr", documentos: 10 }
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

  const getDepartmentName = (departamento: string | Departamento): string => {
    if (typeof departamento === 'string') {
      return 'Carregando...'; // TODO: Buscar nome do departamento
    }
    return departamento.nome;
  };

  const getRoleBadge = (role: 'admin' | 'editor' | 'user') => {
    const roleConfig: Record<'admin' | 'editor' | 'user', { bg: string; text: string; label: string }> = {
      'admin': { bg: 'bg-red-100', text: 'text-red-800', label: 'Administrador' },
      'editor': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Editor (Gerente)' },
      'user': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Usuário' }
    };
    
    const config = roleConfig[role] || roleConfig.user;
    return (
      <span 
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getActionIcon = (acao: string) => {
    if (acao.includes('Criou')) return <Upload className="w-3 h-3" />;
    if (acao.includes('Baixou')) return <Download className="w-3 h-3" />;
    if (acao.includes('Visualizou')) return <Eye className="w-3 h-3" />;
    return <Activity className="w-3 h-3" />;
  };

  if (!usuario) return null;

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Usuário"
      size="xl"
    >
      <div className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{usuario.nome}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  usuario.ativo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {usuario.ativo ? (
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
              
              <div className="space-y-2">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>@{usuario.username}</span>
                  </div>
                  {usuario.apelido && (
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>"{usuario.apelido}"</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-4 h-4" />
                    <span>Departamento: {getDepartmentName(usuario.departamento)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Membro desde {formatDate(usuario.dataCriacao)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 mr-2">Função:</span>
                  {getRoleBadge(usuario.role)}
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
                Atividade do Usuário
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                      <p className="text-sm font-medium text-green-600">Enviados</p>
                      <p className="text-2xl font-bold text-green-900">{stats.documentosEnviados}</p>
                    </div>
                    <Upload className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Recebidos</p>
                      <p className="text-2xl font-bold text-orange-900">{stats.documentosRecebidos}</p>
                    </div>
                    <Download className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Internos</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.documentosInternos}</p>
                    </div>
                    <Activity className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Atividade Recente */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Atividade Recente
                </h4>
                <div className="space-y-2">
                  {stats.atividadeRecente.slice(0, 4).map((atividade, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        {getActionIcon(atividade.acao)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{atividade.acao}</p>
                        <p className="text-xs text-gray-500">{atividade.documento}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(atividade.data).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estatísticas Mensais */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Atividade Mensal
                </h4>
                <div className="space-y-2">
                  {stats.estatisticasMensais.map((mes, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">{mes.mes} 2024</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(mes.documentos / 15) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{mes.documentos}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Último Documento */}
            {stats.ultimoDocumento && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Último Documento Criado
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{stats.ultimoDocumento.titulo}</p>
                      <p className="text-sm text-gray-600">{stats.ultimoDocumento.tipo}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(stats.ultimoDocumento.data)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Metadados */}
        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Informações do Sistema</h4>
          <div className="text-sm">
            <div>
              <span className="text-gray-500">Última Atualização:</span>
              <span className="ml-2 text-gray-900">{formatDate(usuario.dataAtualizacao)}</span>
            </div>
          </div>
        </div>
      </div>
    </DetailModal>
  );
};

export default UsuarioDetail;
