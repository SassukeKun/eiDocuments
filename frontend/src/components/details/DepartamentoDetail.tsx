"use client";

import React, { useState, useEffect } from 'react';
import DetailModal from '@/components/ui/DetailModal';
import { Departamento } from '@/types';
import { 
  Building2, 
  Calendar, 
  Users, 
  Code, 
  FileText, 
  Activity, 
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  FolderOpen,
  User
} from 'lucide-react';

interface DepartamentoDetailProps {
  isOpen: boolean;
  onClose: () => void;
  departamento: Departamento | null;
}

interface DepartamentoStats {
  totalUsuarios: number;
  usuariosAtivos: number;
  totalDocumentos: number;
  documentosRecentes: number;
  totalCategorias: number;
  ultimaAtividade?: {
    tipo: 'documento' | 'usuario';
    descricao: string;
    data: string;
    usuario: string;
  };
  usuarios: {
    nome: string;
    role: string;
    ultimaAtividade: string;
  }[];
  categorias: {
    nome: string;
    documentos: number;
    cor: string;
  }[];
}

const DepartamentoDetail: React.FC<DepartamentoDetailProps> = ({
  isOpen,
  onClose,
  departamento
}) => {
  const [stats, setStats] = useState<DepartamentoStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && departamento) {
      loadStats();
    }
  }, [isOpen, departamento]);

  const loadStats = async () => {
    if (!departamento) return;
    
    setLoading(true);
    try {
      // TODO: Implementar chamada real para API
      // Simulando dados por enquanto
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStats({
        totalUsuarios: Math.floor(Math.random() * 50) + 10,
        usuariosAtivos: Math.floor(Math.random() * 40) + 8,
        totalDocumentos: Math.floor(Math.random() * 200) + 50,
        documentosRecentes: Math.floor(Math.random() * 20) + 5,
        totalCategorias: Math.floor(Math.random() * 15) + 3,
        ultimaAtividade: {
          tipo: 'documento',
          descricao: 'Novo relatório financeiro adicionado',
          data: new Date().toISOString(),
          usuario: 'Maria Santos'
        },
        usuarios: [
          { nome: "João Silva", role: "admin", ultimaAtividade: "2024-01-20" },
          { nome: "Maria Santos", role: "editor", ultimaAtividade: "2024-01-19" },
          { nome: "Carlos Oliveira", role: "user", ultimaAtividade: "2024-01-18" },
          { nome: "Ana Costa", role: "editor", ultimaAtividade: "2024-01-17" }
        ],
        categorias: [
          { nome: "Relatórios", documentos: 45, cor: "#3b82f6" },
          { nome: "Contratos", documentos: 23, cor: "#10b981" },
          { nome: "Políticas", documentos: 12, cor: "#f59e0b" }
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

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { bg: string; text: string; label: string }> = {
      'admin': { bg: 'bg-red-100', text: 'text-red-800', label: 'Admin' },
      'editor': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Editor' },
      'user': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Usuário' }
    };
    
    const config = roleConfig[role] || roleConfig.user;
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (!departamento) return null;

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Departamento"
      size="xl"
    >
      <div className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{departamento.nome}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  departamento.ativo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {departamento.ativo ? (
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
              {departamento.descricao && (
                <p className="text-gray-600 mb-3">{departamento.descricao}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Code className="w-4 h-4" />
                  <span>Código: {departamento.codigo}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Criado em {formatDate(departamento.dataCriacao)}</span>
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
                Visão Geral
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total de Usuários</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.totalUsuarios}</p>
                      <p className="text-xs text-blue-600">{stats.usuariosAtivos} ativos</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Total de Documentos</p>
                      <p className="text-2xl font-bold text-green-900">{stats.totalDocumentos}</p>
                      <p className="text-xs text-green-600">{stats.documentosRecentes} recentes</p>
                    </div>
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Categorias</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.totalCategorias}</p>
                      <p className="text-xs text-purple-600">tipos de documento</p>
                    </div>
                    <FolderOpen className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usuários do Departamento */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Usuários do Departamento
                </h4>
                <div className="space-y-2">
                  {stats.usuarios.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.nome}</p>
                          <p className="text-xs text-gray-500">
                            Última atividade: {new Date(user.ultimaAtividade).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      {getRoleBadge(user.role)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Categorias do Departamento */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Categorias de Documentos
                </h4>
                <div className="space-y-2">
                  {stats.categorias.map((categoria, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: categoria.cor }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">{categoria.nome}</span>
                      </div>
                      <span className="text-sm text-gray-600">{categoria.documentos} docs</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Última Atividade */}
            {stats.ultimaAtividade && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Atividade Recente
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      {stats.ultimaAtividade.tipo === 'documento' ? (
                        <FileText className="w-4 h-4 text-green-600" />
                      ) : (
                        <User className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{stats.ultimaAtividade.descricao}</p>
                      <p className="text-xs text-gray-500">
                        por {stats.ultimaAtividade.usuario} • {formatDate(stats.ultimaAtividade.data)}
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
              <span className="ml-2 text-gray-900">{formatDate(departamento.dataAtualizacao)}</span>
            </div>
          </div>
        </div>
      </div>
    </DetailModal>
  );
};

export default DepartamentoDetail;
