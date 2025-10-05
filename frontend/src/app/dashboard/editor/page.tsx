"use client";

import React, { useState, useMemo } from "react";
import { formatNumber, formatPercent } from "@/lib/formatters";
import { useMyDepartmentStats } from "@/hooks/useStats";
import { useAuth } from "@/hooks/useAuth";
import { 
  FileText, 
  Folder,  
  Users,
  Building2,
  TrendingUp,
  Activity,
  BarChart3,
  RefreshCw,
  AlertCircle,
  FolderOpen,
  File
} from "lucide-react";
import { useToastContext } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ManageLayout from "@/components/ui/ManageLayout";

interface Document {
  id: string;
  title: string;
  category: string;
  type: string;
  uploadedBy: string;
  uploadDate: string;
}

const EditorDashboardPage = () => {
  const { success } = useToastContext();
  const router = useRouter();
  const { user } = useAuth();
  
  // Estatísticas do departamento do editor
  const { 
    data: stats, 
    loading, 
    error, 
    refetch 
  } = useMyDepartmentStats();

  // Documentos recentes do departamento
  const recentDocuments: Document[] = useMemo(() => {
    if (!stats?.documentos?.recentes) return [];
    return stats.documentos.recentes.map((doc: any) => ({
      id: doc._id,
      title: doc.titulo || "Documento",
      category: doc.categoria?.nome || "-",
      type: doc.tipo?.nome || "-",
      uploadedBy: doc.usuario?.nome || "-",
      uploadDate: doc.dataCriacao || "-",
    }));
  }, [stats]);

  const departmentName = stats?.departamento?.nome || user?.departamento?.nome || "Meu Departamento";

  return (
    <ManageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard - {departmentName}
            </h1>
            <p className="text-gray-600 mt-1">
              Visão geral do departamento
            </p>
          </div>
          
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Erro ao carregar estatísticas</h3>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Documentos */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Documentos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? "-" : formatNumber(stats?.documentos?.total || 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Documentos Ativos */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documentos Ativos</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {loading ? "-" : formatNumber(stats?.documentos?.ativos || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Documentos Arquivados */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Arquivados</p>
                <p className="text-3xl font-bold text-gray-600 mt-2">
                  {loading ? "-" : formatNumber(stats?.documentos?.arquivados || 0)}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Folder className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          {/* Categorias */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categorias</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {loading ? "-" : formatNumber(stats?.documentos?.porCategoria?.length || 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FolderOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Documentos por Categoria */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Documentos por Categoria
            </h3>
            
            {loading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : stats?.documentos?.porCategoria && stats.documentos.porCategoria.length > 0 ? (
              <div className="space-y-3">
                {stats.documentos.porCategoria.map((item: any, idx: number) => {
                  const percentage = ((item.quantidade / (stats.documentos?.total || 1)) * 100).toFixed(1);
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];
                  const color = colors[idx % colors.length];
                  
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.categoria || 'Sem categoria'}</span>
                        <span className="text-sm text-gray-600">{item.quantidade} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
            )}
          </div>

          {/* Documentos por Tipo */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <File className="w-5 h-5 mr-2 text-purple-600" />
              Documentos por Tipo
            </h3>
            
            {loading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : stats?.documentos?.porTipo && stats.documentos.porTipo.length > 0 ? (
              <div className="space-y-3">
                {stats.documentos.porTipo.slice(0, 5).map((item: any, idx: number) => {
                  const percentage = ((item.quantidade / (stats.documentos?.total || 1)) * 100).toFixed(1);
                  const colors = ['bg-indigo-500', 'bg-cyan-500', 'bg-teal-500', 'bg-orange-500', 'bg-red-500'];
                  const color = colors[idx % colors.length];
                  
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.tipo || 'Sem tipo'}</span>
                        <span className="text-sm text-gray-600">{item.quantidade} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
            )}
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Documentos Recentes
            </h3>
            <Link 
              href="/manage/documentos"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todos →
            </Link>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : recentDocuments.length > 0 ? (
            <div className="space-y-3">
              {recentDocuments.slice(0, 5).map((doc) => (
                <div 
                  key={doc.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.title}</p>
                      <p className="text-sm text-gray-600">
                        {doc.category} • {doc.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{doc.uploadedBy}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum documento recente</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/manage/documentos"
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <FileText className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">Gerenciar Documentos</h3>
            <p className="text-sm text-gray-600">Visualizar e editar documentos do departamento</p>
          </Link>

          <Link
            href="/manage/categorias"
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-purple-500 hover:shadow-md transition-all group"
          >
            <FolderOpen className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">Categorias</h3>
            <p className="text-sm text-gray-600">Gerenciar categorias do departamento</p>
          </Link>

          <Link
            href="/manage/tipos"
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-green-500 hover:shadow-md transition-all group"
          >
            <File className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">Tipos de Documento</h3>
            <p className="text-sm text-gray-600">Gerenciar tipos de documentos</p>
          </Link>
        </div>
      </div>
    </ManageLayout>
  );
};

export default EditorDashboardPage;
