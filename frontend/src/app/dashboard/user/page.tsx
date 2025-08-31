"use client";

import React, { useState, useEffect } from "react";
import { formatPercent } from "@/lib/formatters";
import { useAuth } from "@/hooks/useAuth";
import StatsService, { StatsDepartamento } from "@/services/statsService";
import { 
  FileText, 
  Folder,  
  Download, 
  Eye, 
  Plus,
  Building2,
  Users,
  User,
  Calendar,
  TrendingUp,
  Activity,
  Search,
  Upload,
  BarChart3,
  Clock
} from "lucide-react";
import ModernButton from "@/components/ui/ModernButton";
import UserLayout from "@/components/ui/UserLayout";
import StatsCard from "@/components/ui/StatsCard";
import QuickActionCard from "@/components/ui/QuickActionCard";
import { useToastContext } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DepartmentDocument {
  id: string;
  title: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  tags: string[];
  status: 'active' | 'archived' | 'pending';
}

interface DepartmentStats {
  totalDocuments: number;
  myDocuments: number;
  documentsThisMonth: number;
  documentsLastMonth: number;
  teamMembers: number;
  categoriesUsed: number;
  storageUsed: string;
  lastActivity: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const UserDashboardPage = () => {
  const { success } = useToastContext();
  const router = useRouter();
  const { user } = useAuth();
  
  const [stats, setStats] = useState<StatsDepartamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar estatísticas reais do departamento
  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Carregando estatísticas do departamento...');
        
        const departmentStats = await StatsService.getMyDepartmentStats();
        setStats(departmentStats);
        console.log('✅ Estatísticas carregadas:', departmentStats);
      } catch (err) {
        console.error('❌ Erro ao carregar estatísticas:', err);
        setError('Erro ao carregar estatísticas do departamento');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  // Dados de fallback enquanto carrega
  const userDepartment = stats?.departamento?.nome || user?.departamento?.nome || "Departamento";
  
  // Calcular documentos do usuário (simulado por enquanto)
  const myDocuments = 0; // TODO: Implementar contagem de documentos do usuário

  // Documentos recentes do departamento (dados reais)
  const recentDepartmentDocuments = stats?.documentos?.recentes?.map(doc => ({
    id: doc._id,
    title: doc.titulo,
    type: "Documento",
    size: "N/A",
    uploadedBy: doc.usuario?.nome || "Usuário desconhecido",
    uploadDate: doc.dataCriacao,
    tags: [],
    status: "active" as const
  })) || [];

  const quickActions: QuickAction[] = [
    {
      title: "Upload de Documento",
      description: "Adicionar novo documento ao departamento",
      icon: <Upload className="w-5 h-5" />,
      href: "/user/upload",
      color: "bg-blue-500"
    },
    {
      title: "Buscar Documentos",
      description: "Pesquisar em todos os documentos",
      icon: <Search className="w-5 h-5" />,
      href: "/user/buscar",
      color: "bg-green-500"
    },
    {
      title: "Meus Documentos",
      description: "Ver documentos que você criou",
      icon: <FileText className="w-5 h-5" />,
      href: "/user/meus-documentos",
      color: "bg-purple-500"
    },
    {
      title: "Documentos do Departamento",
      description: "Ver todos os documentos do seu departamento",
      icon: <Building2 className="w-5 h-5" />,
      href: "/user/documentos",
      color: "bg-orange-500"
    }
  ];

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Simular crescimento por enquanto (TODO: implementar lógica real)
  const documentsGrowth = 15; // Simulado

  // Loading e Error states
  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando estatísticas...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </UserLayout>
    );
  }

  const handleViewDocument = (doc: DepartmentDocument) => {
    success(`Visualizando documento: ${doc.title}`);
  };

  const handleDownloadDocument = (doc: DepartmentDocument) => {
    success(`Download iniciado: ${doc.title}`);
  };

  return (
    <UserLayout>
      <div>
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600">Bem-vindo de volta!</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{userDepartment}</span> • Dados atualizados em tempo real
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ModernButton variant="outline" onClick={() => router.push('/user/buscar')}>
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </ModernButton>
              <ModernButton variant="primary" onClick={() => router.push('/user/upload')}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Documento
              </ModernButton>
            </div>
          </div>

          {/* Cards de Estatísticas do Departamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Documentos do Departamento"
              value={stats?.documentos?.total || 0}
              subtitle="Total no departamento"
              icon={Building2}
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
              trend={{
                value: documentsGrowth,
                label: "este mês",
                isPositive: documentsGrowth >= 0
              }}
              href="/user/documentos"
              loading={loading}
            />

            <StatsCard
              title="Meus Documentos"
              value={myDocuments}
              subtitle="Criados por você"
              icon={FileText}
              iconColor="text-green-600"
              iconBg="bg-green-100"
              href="/user/meus-documentos"
              loading={loading}
            />

            <StatsCard
              title="Documentos Ativos"
              value={stats?.documentos?.ativos || 0}
              subtitle="No departamento"
              icon={Activity}
              iconColor="text-purple-600"
              iconBg="bg-purple-100"
              loading={loading}
            />

            <StatsCard
              title="Documentos Arquivados"
              value={stats?.documentos?.arquivados || 0}
              subtitle={`${stats?.documentos?.porCategoria?.length || 0} categorias usadas`}
              icon={Folder}
              iconColor="text-orange-600"
              iconBg="bg-orange-100"
              loading={loading}
            />
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                title={action.title}
                description={action.description}
                icon={action.icon}
                color={action.color}
                href={action.href}
              />
            ))}
          </div>
        </div>

        {/* Documentos Recentes do Departamento */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Atividade Recente</h2>
              <p className="text-gray-600 mt-1">Últimos documentos adicionados ao {userDepartment}</p>
            </div>
            <Link href="/user/documentos">
              <ModernButton variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Ver Todos
              </ModernButton>
            </Link>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-6 rounded-xl border border-gray-100 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : recentDepartmentDocuments.length > 0 ? (
            <div className="space-y-3">
              {recentDepartmentDocuments.map(doc => (
                <div key={doc.id} className="flex items-center space-x-4 p-6 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {doc.title}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 space-x-3 mt-1">
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {doc.uploadedBy}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleViewDocument(doc)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadDocument(doc)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum documento encontrado</h3>
              <p className="text-gray-500 mb-6">Seu departamento ainda não possui documentos recentes.</p>
              <Link href="/user/upload">
                <ModernButton variant="primary">
                  <Upload className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Documento
                </ModernButton>
              </Link>
            </div>
          )}
        </div>

        {/* Resumo de Atividade */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{userDepartment}</p>
                <p className="text-gray-500">Seu departamento</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{stats?.documentos?.total || 0}</p>
                <p className="text-gray-500">Documentos total</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{stats?.documentos?.ativos || 0}</p>
                <p className="text-gray-500">Documentos ativos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboardPage;