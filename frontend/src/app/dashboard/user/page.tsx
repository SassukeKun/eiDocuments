"use client";

import React, { useState } from "react";
import { formatPercent } from "@/lib/formatters";
import { 
  FileText, 
  Folder,  
  Download, 
  Eye, 
  Plus,
  Building2,
  Users,
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

  // TODO: Obter dados reais do departamento do usuário logado
  const userDepartment = "Recursos Humanos"; // Simular departamento do usuário
  
  // Dados simulados do DEPARTAMENTO apenas (USER)
  const departmentStats: DepartmentStats = {
    totalDocuments: 156,      // Apenas do departamento
    myDocuments: 23,          // Documentos criados pelo usuário
    documentsThisMonth: 18,   // Documentos do departamento este mês
    documentsLastMonth: 15,   // Documentos do departamento mês passado
    teamMembers: 12,          // Membros do departamento
    categoriesUsed: 8,        // Categorias usadas no departamento
    storageUsed: "340 MB",    // Storage usado pelo departamento
    lastActivity: "2 min atrás"
  };

  const recentDepartmentDocuments: DepartmentDocument[] = [
    {
      id: "1",
      title: "Política de Recursos Humanos 2024",
      type: "PDF",
      size: "2.4 MB",
      uploadedBy: "João Silva",
      uploadDate: "2024-01-15",
      tags: ["política", "rh", "2024"],
      status: "active"
    },
    {
      id: "2",
      title: "Manual de Contratação",
      type: "Word",
      size: "1.8 MB",
      uploadedBy: "Maria Santos",
      uploadDate: "2024-01-12",
      tags: ["manual", "contratação"],
      status: "active"
    },
    {
      id: "3",
      title: "Formulário de Avaliação",
      type: "Excel",
      size: "890 KB",
      uploadedBy: "Carlos Oliveira",
      uploadDate: "2024-01-10",
      tags: ["avaliação", "formulário"],
      status: "active"
    },
    {
      id: "4",
      title: "Código de Conduta",
      type: "PDF",
      size: "1.2 MB",
      uploadedBy: "Ana Costa",
      uploadDate: "2024-01-08",
      tags: ["conduta", "política"],
      status: "active"
    }
  ];

  const quickActions: QuickAction[] = [
    {
      title: "Upload de Documento",
      description: "Adicionar novo documento ao departamento",
      icon: <Upload className="w-5 h-5" />,
      href: "/upload",
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

  const documentsGrowth = calculateGrowth(departmentStats.documentsThisMonth, departmentStats.documentsLastMonth);

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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meu Dashboard</h1>
              <p className="text-gray-600 mt-1">Departamento: <span className="font-medium">{userDepartment}</span></p>
            </div>
            <div className="flex items-center space-x-3">
              <ModernButton variant="outline" onClick={() => router.push('/user/buscar')}>
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </ModernButton>
              <ModernButton variant="primary" onClick={() => router.push('/upload')}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Documento
              </ModernButton>
            </div>
          </div>

          {/* Cards de Estatísticas do Departamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/user/documentos">
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Documentos do Departamento</p>
                    <p className="text-2xl font-bold text-gray-900">{departmentStats.totalDocuments}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className={`w-4 h-4 mr-1 ${documentsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={`text-sm font-medium ${documentsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {documentsGrowth >= 0 ? '+' : ''}{formatPercent(documentsGrowth)}% este mês
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/user/meus-documentos">
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Meus Documentos</p>
                    <p className="text-2xl font-bold text-gray-900">{departmentStats.myDocuments}</p>
                    <p className="text-sm text-gray-500 mt-1">Criados por você</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </Link>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Equipe do Departamento</p>
                  <p className="text-2xl font-bold text-gray-900">{departmentStats.teamMembers}</p>
                  <p className="text-sm text-gray-500 mt-1">Membros ativos</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Armazenamento</p>
                  <p className="text-2xl font-bold text-gray-900">{departmentStats.storageUsed}</p>
                  <p className="text-sm text-gray-500 mt-1">{departmentStats.categoriesUsed} categorias usadas</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Folder className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Documentos Recentes do Departamento */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Atividade Recente - {userDepartment}</h2>
              <p className="text-sm text-gray-600">Últimos documentos adicionados ao seu departamento</p>
            </div>
            <Link href="/user/documentos">
              <ModernButton variant="outline" size="sm">
                Ver Todos
              </ModernButton>
            </Link>
          </div>
          <div className="space-y-4">
            {recentDepartmentDocuments.map(doc => (
              <div key={doc.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-3">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>por {doc.uploadedBy}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    {doc.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded mr-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-400 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewDocument(doc)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadDocument(doc)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo de Atividade */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <Activity className="w-4 h-4 mr-2" />
                <span>Última atividade: {departmentStats.lastActivity}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{departmentStats.documentsThisMonth} documentos este mês</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboardPage;
