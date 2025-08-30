"use client";

import React, { useState, useMemo } from "react";
import { formatNumber, formatPercent } from "@/lib/formatters";
import { useGlobalStats, useDashboardStats } from "@/hooks/useStats";
import { 
  Search, 
  FileText, 
  Folder,  
  Download, 
  Eye, 
  MoreVertical,
  Plus,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Building2,
  Users,
  FolderOpen,
  TrendingUp,
  Activity,
  BarChart3,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import ModernButton from "@/components/ui/ModernButton";
import { useToastContext } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ManageLayout from "@/components/ui/ManageLayout";

interface Document {
  id: string;
  title: string;
  department: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  lastModified: string;
  tags: string[];
  status: 'active' | 'archived' | 'pending';
}

interface Department {
  id: string;
  name: string;
  color: string;
  documentCount: number;
  activeUsers: number;
  lastActivity: string;
}

const AdminDashboardPage = () => {
  const { success } = useToastContext();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Integração com API de estatísticas
  const { 
    global: globalStats, 
    documents: documentStats, 
    departments: departmentStats,
    loading, 
    error, 
    refetchAll 
  } = useDashboardStats();

  // Dados mock mantidos para compatibilidade dos departamentos
  const departments: Department[] = [
    { id: "rh", name: "Recursos Humanos", color: "bg-blue-500", documentCount: 156, activeUsers: 12, lastActivity: "2 min atrás" },
    { id: "financeiro", name: "Financeiro", color: "bg-green-500", documentCount: 89, activeUsers: 8, lastActivity: "5 min atrás" },
    { id: "ti", name: "Tecnologia da Informação", color: "bg-purple-500", documentCount: 234, activeUsers: 15, lastActivity: "1 min atrás" },
    { id: "marketing", name: "Marketing", color: "bg-pink-500", documentCount: 67, activeUsers: 6, lastActivity: "10 min atrás" },
    { id: "operacoes", name: "Operações", color: "bg-orange-500", documentCount: 123, activeUsers: 11, lastActivity: "3 min atrás" },
    { id: "juridico", name: "Jurídico", color: "bg-red-500", documentCount: 45, activeUsers: 4, lastActivity: "15 min atrás" }
  ];

  const documents: Document[] = [
    { id: "1", title: "Manual do Funcionário 2024", department: "RH", type: "PDF", size: "2.4 MB", uploadedBy: "Maria Silva", uploadDate: "2024-03-15", lastModified: "2024-03-15", tags: ["manual", "funcionário", "2024"], status: "active" },
    { id: "2", title: "Relatório Financeiro Q1", department: "Financeiro", type: "Excel", size: "1.8 MB", uploadedBy: "João Santos", uploadDate: "2024-03-10", lastModified: "2024-03-12", tags: ["relatório", "financeiro", "Q1"], status: "active" },
    { id: "3", title: "Política de Segurança TI", department: "TI", type: "PDF", size: "956 KB", uploadedBy: "Ana Costa", uploadDate: "2024-03-08", lastModified: "2024-03-08", tags: ["política", "segurança", "TI"], status: "active" },
    { id: "4", title: "Campanha Marketing Digital", department: "Marketing", type: "PowerPoint", size: "5.2 MB", uploadedBy: "Pedro Lima", uploadDate: "2024-03-05", lastModified: "2024-03-07", tags: ["campanha", "marketing", "digital"], status: "pending" },
    { id: "5", title: "Procedimento Operacional Padrão", department: "Operações", type: "Word", size: "1.1 MB", uploadedBy: "Carla Rocha", uploadDate: "2024-03-01", lastModified: "2024-03-03", tags: ["procedimento", "operações", "padrão"], status: "active" },
  ];

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Calculamos crescimento baseado nos dados da API
  const crescimentoSemanal = globalStats?.data?.tendencias?.crescimentoSemanal || 0;
  const documentsGrowth = crescimentoSemanal > 0 
    ? calculateGrowth(crescimentoSemanal, crescimentoSemanal * 0.8)
    : 0;

  const handleViewDocument = (doc: Document) => {
    success(`Visualizando documento: ${doc.title}`);
  };

  const handleDownloadDocument = (doc: Document) => {
    success(`Download iniciado: ${doc.title}`);
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDepartment = selectedDepartment === "all" || 
                               doc.department.toLowerCase() === selectedDepartment.toLowerCase();
      return matchesSearch && matchesDepartment;
    });
  }, [documents, searchTerm, selectedDepartment]);

  const filteredDepartments = useMemo(() => {
    return departments.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  return (
    <ManageLayout>
      <div>
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Carregando estatísticas...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="w-5 h-5 text-red-500 mr-2">⚠️</div>
              <div>
                <h3 className="text-red-800 font-medium">Erro ao carregar estatísticas</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content - só renderiza se não está loading e não há error */}
        {!loading && !error && (
          <>
        {/* Header com Título e Botão de Atualizar */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p className="text-gray-600 mt-1">Visão geral do sistema e estatísticas</p>
            </div>
            <div className="flex space-x-2">
              <ModernButton
                onClick={refetchAll}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </ModernButton>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>Erro ao carregar estatísticas: {error}</span>
            </div>
          </div>
        )}

        {/* Cards de Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total de Documentos */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Documentos</p>
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                ) : error ? (
                  <p className="text-2xl font-bold text-red-500">--</p>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(globalStats?.data?.resumo?.totalDocumentos || 0)}
                  </p>
                )}
                <div className="flex items-center mt-1">
                  <TrendingUp className={`w-4 h-4 mr-1 ${documentsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-sm font-medium ${documentsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {documentsGrowth >= 0 ? '+' : ''}{formatPercent(documentsGrowth)}% recente
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Departamentos */}
          <Link href="/manage/departamentos">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Departamentos</p>
                  {loading ? (
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                  ) : error ? (
                    <p className="text-2xl font-bold text-red-500">--</p>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(globalStats?.data?.resumo?.totalDepartamentos || 0)}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {formatNumber(globalStats?.data?.resumo?.totalUsuarios || 0)} usuários ativos
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </Link>

          {/* Usuários */}
          <Link href="/manage/usuarios">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários</p>
                  {loading ? (
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                  ) : error ? (
                    <p className="text-2xl font-bold text-red-500">--</p>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(globalStats?.data?.resumo?.totalUsuarios || 0)}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Sistema ativo</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </Link>

          {/* Categorias */}
          <Link href="/manage/categorias">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categorias</p>
                  {loading ? (
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                  ) : error ? (
                    <p className="text-2xl font-bold text-red-500">--</p>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(globalStats?.data?.resumo?.totalCategorias || 0)}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {formatNumber(globalStats?.data?.resumo?.totalTipos || 0)} tipos disponíveis
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Seção de Atividade Recente e Distribuição */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Atividade Recente */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    {formatNumber(globalStats?.data?.tendencias?.crescimentoSemanal || 0)} novos documentos esta semana
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    Taxa de documentos ativos: {globalStats?.data?.tendencias?.taxaAtivos || '0'}%
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Sistema funcionando normalmente</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Resumo Rápido</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Documentos Ativos</span>
                  <span className="text-sm font-medium text-green-600">
                    {formatNumber(globalStats?.data?.resumo?.documentosAtivos || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Documentos Arquivados</span>
                  <span className="text-sm font-medium text-gray-600">
                    {formatNumber(globalStats?.data?.resumo?.documentosArquivados || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Crescimento Semanal</span>
                  <span className="text-sm font-medium text-blue-600">
                    +{formatNumber(globalStats?.data?.tendencias?.crescimentoSemanal || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taxa de Atividade</span>
                  <span className="text-sm font-medium text-purple-600">
                    {globalStats?.data?.tendencias?.taxaAtivos || '0'}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Departamentos (mantida como estava) */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Departamentos</h3>
                <p className="text-sm text-gray-600">Gerencie departamentos e suas atividades</p>
              </div>
              <Link href="/manage/departamentos">
                <ModernButton className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Novo Departamento</span>
                </ModernButton>
              </Link>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDepartments.map(dept => (
                <div key={dept.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-4 h-4 ${dept.color} rounded-full`}></div>
                    <span className="text-xs text-gray-500">{dept.lastActivity}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">{dept.name}</h4>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{dept.documentCount} docs</span>
                    <span>{dept.activeUsers} usuários</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </ManageLayout>
  );
};

export default AdminDashboardPage;
