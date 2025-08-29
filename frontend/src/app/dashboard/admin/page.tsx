"use client";

import React, { useState, useMemo } from "react";
import { formatNumber, formatPercent } from "@/lib/formatters";
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
  BarChart3
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

interface SystemStats {
  totalDocuments: number;
  totalDepartments: number;
  totalUsers: number;
  totalCategories: number;
  documentsThisMonth: number;
  documentsLastMonth: number;
  activeUsers: number;
  storageUsed: string;
}

const AdminDashboardPage = () => {
  const { success } = useToastContext();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Dados simulados do sistema completo (ADMIN)
  const systemStats: SystemStats = {
    totalDocuments: 1247,
    totalDepartments: 6,
    totalUsers: 89,
    totalCategories: 24,
    documentsThisMonth: 156,
    documentsLastMonth: 134,
    activeUsers: 67,
    storageUsed: "2.4 GB"
  };

  const departments: Department[] = [
    { id: "rh", name: "Recursos Humanos", color: "bg-blue-500", documentCount: 156, activeUsers: 12, lastActivity: "2 min atrás" },
    { id: "financeiro", name: "Financeiro", color: "bg-green-500", documentCount: 89, activeUsers: 8, lastActivity: "5 min atrás" },
    { id: "ti", name: "Tecnologia da Informação", color: "bg-purple-500", documentCount: 234, activeUsers: 15, lastActivity: "1 min atrás" },
    { id: "marketing", name: "Marketing", color: "bg-pink-500", documentCount: 67, activeUsers: 6, lastActivity: "10 min atrás" },
    { id: "operacoes", name: "Operações", color: "bg-orange-500", documentCount: 123, activeUsers: 11, lastActivity: "3 min atrás" },
    { id: "juridico", name: "Jurídico", color: "bg-red-500", documentCount: 45, activeUsers: 4, lastActivity: "15 min atrás" }
  ];

  const recentDocuments: Document[] = [
    {
      id: "1",
      title: "Política de Recursos Humanos 2024",
      department: "Recursos Humanos",
      type: "PDF",
      size: "2.4 MB",
      uploadedBy: "João Silva",
      uploadDate: "2024-01-15",
      lastModified: "2024-01-20",
      tags: ["política", "rh", "2024"],
      status: "active"
    },
    {
      id: "2",
      title: "Relatório Financeiro Q4 2023",
      department: "Financeiro",
      type: "Excel",
      size: "1.8 MB",
      uploadedBy: "Maria Santos",
      uploadDate: "2024-01-10",
      lastModified: "2024-01-18",
      tags: ["relatório", "financeiro", "Q4"],
      status: "active"
    },
    {
      id: "3",
      title: "Manual de Procedimentos TI",
      department: "Tecnologia da Informação",
      type: "Word",
      size: "3.2 MB",
      uploadedBy: "Carlos Oliveira",
      uploadDate: "2024-01-12",
      lastModified: "2024-01-19",
      tags: ["manual", "procedimentos", "ti"],
      status: "active"
    },
    {
      id: "4",
      title: "Campanha Marketing Q1 2024",
      department: "Marketing",
      type: "PowerPoint",
      size: "5.1 MB",
      uploadedBy: "Ana Costa",
      uploadDate: "2024-01-08",
      lastModified: "2024-01-16",
      tags: ["campanha", "marketing", "Q1"],
      status: "active"
    },
    {
      id: "5",
      title: "Contrato de Fornecedor ABC",
      department: "Jurídico",
      type: "PDF",
      size: "1.5 MB",
      uploadedBy: "Pedro Lima",
      uploadDate: "2024-01-05",
      lastModified: "2024-01-15",
      tags: ["contrato", "fornecedor", "jurídico"],
      status: "active"
    }
  ];

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const documentsGrowth = calculateGrowth(systemStats.documentsThisMonth, systemStats.documentsLastMonth);

  const handleViewDocument = (doc: Document) => {
    success(`Visualizando documento: ${doc.title}`);
  };

  const handleDownloadDocument = (doc: Document) => {
    success(`Download iniciado: ${doc.title}`);
  };

  return (
    <ManageLayout>
      <div>
        {/* Header com Estatísticas Principais */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p className="text-gray-600 mt-1">Visão geral de todo o sistema</p>
            </div>
            <div className="flex items-center space-x-3">
              <ModernButton variant="outline" onClick={() => router.push('/manage/documentos')}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Relatórios
              </ModernButton>
              <ModernButton variant="primary" onClick={() => router.push('/upload')}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Documento
              </ModernButton>
            </div>
          </div>

          {/* Cards de Estatísticas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Documentos</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(systemStats.totalDocuments)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className={`w-4 h-4 mr-1 ${documentsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm font-medium ${documentsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {documentsGrowth >= 0 ? '+' : ''}{formatPercent(documentsGrowth)}% este mês
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <Link href="/manage/departamentos">
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Departamentos</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(systemStats.totalDepartments)}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatNumber(systemStats.activeUsers)} usuários ativos</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/manage/usuarios">
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Usuários Totais</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(systemStats.totalUsers)}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatNumber(systemStats.activeUsers)} ativos hoje</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/manage/categorias">
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Categorias</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(systemStats.totalCategories)}</p>
                    <p className="text-sm text-gray-500 mt-1">{systemStats.storageUsed} utilizados</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Grid de Departamentos com Atividade */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Departamentos - Visão Geral</h2>
            <Link href="/manage/departamentos">
              <ModernButton variant="outline" size="sm">
                Gerenciar Todos
              </ModernButton>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map(dept => (
              <div key={dept.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${dept.color} rounded-lg flex items-center justify-center`}>
                    <Folder className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">{dept.documentCount}</div>
                    <div className="text-xs text-gray-500">documentos</div>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{dept.name}</h3>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    {dept.activeUsers} usuários
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Activity className="w-4 h-4 mr-1" />
                    {dept.lastActivity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documentos Recentes do Sistema */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Atividade Recente do Sistema</h2>
            <Link href="/manage/documentos">
              <ModernButton variant="outline" size="sm">
                Ver Todos os Documentos
              </ModernButton>
            </Link>
          </div>
          <div className="space-y-4">
            {recentDocuments.map(doc => (
              <div key={doc.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-3">
                    <span>{doc.department}</span>
                    <span>•</span>
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>por {doc.uploadedBy}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
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
            ))}
          </div>
        </div>
      </div>
    </ManageLayout>
  );
};

export default AdminDashboardPage;
