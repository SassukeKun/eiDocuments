"use client";

import React, { useState, useMemo } from "react";
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
  SortDesc
} from "lucide-react";
import ModernButton from "@/components/ui/ModernButton";
import ModernInput from "@/components/ui/ModernInput";
import { useNotification } from "@/hooks/useNotification";
import { useRouter } from "next/navigation";

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
}

const DashboardPage = () => {
  const { success } = useNotification();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Dados simulados
  const departments: Department[] = [
    { id: "rh", name: "Recursos Humanos", color: "bg-blue-500", documentCount: 156 },
    { id: "financeiro", name: "Financeiro", color: "bg-green-500", documentCount: 89 },
    { id: "ti", name: "Tecnologia da Informação", color: "bg-purple-500", documentCount: 234 },
    { id: "marketing", name: "Marketing", color: "bg-pink-500", documentCount: 67 },
    { id: "operacoes", name: "Operações", color: "bg-orange-500", documentCount: 123 },
    { id: "juridico", name: "Jurídico", color: "bg-red-500", documentCount: 45 }
  ];

  const documentTypes = [
    "PDF", "Word", "Excel", "PowerPoint", "Imagem", "Texto", "Outros"
  ];

  const documents: Document[] = [
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
    },
    {
      id: "6",
      title: "Procedimentos Operacionais",
      department: "Operações",
      type: "Word",
      size: "2.8 MB",
      uploadedBy: "Lucia Ferreira",
      uploadDate: "2024-01-14",
      lastModified: "2024-01-17",
      tags: ["procedimentos", "operacionais"],
      status: "active"
    }
  ];

  // Filtros e busca
  const filteredDocuments = useMemo(() => {
    const filtered = documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDepartment = selectedDepartment === "all" || doc.department === departments.find(d => d.id === selectedDepartment)?.name;
      const matchesType = selectedType === "all" || doc.type === selectedType;
      const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus;
      
      return matchesSearch && matchesDepartment && matchesType && matchesStatus;
    });

    // Ordenação
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.uploadDate);
          bValue = new Date(b.uploadDate);
          break;
        case 'name':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'size':
          aValue = parseFloat(a.size.replace(' MB', ''));
          bValue = parseFloat(b.size.replace(' MB', ''));
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  }, [searchTerm, selectedDepartment, selectedType, selectedStatus, sortBy, sortOrder]);



  const handleViewDocument = (doc: Document) => {
    success(`Visualizando documento: ${doc.title}`);
  };

  const handleDownloadDocument = (doc: Document) => {
    success(`Download iniciado: ${doc.title}`);
  };

  const handleSort = (field: 'date' | 'name' | 'size') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'archived': return 'Arquivado';
      case 'pending': return 'Pendente';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">eiDocuments</h1>
                <p className="text-sm text-gray-600">Gestão de Documentos Corporativos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ModernButton
                variant="primary"
                onClick={() => router.push('/upload')}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Documento</span>
              </ModernButton>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros e Busca */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-2">
              <ModernInput
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="h-5 w-5 text-gray-400" />}
              />
            </div>
            
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Departamentos</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.documentCount})
                </option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Tipos</option>
              {documentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativo</option>
                <option value="archived">Arquivado</option>
                <option value="pending">Pendente</option>
              </select>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSort('date')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    sortBy === 'date' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>Data</span>
                  {sortBy === 'date' && (
                    sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                  )}
                </button>
                
                <button
                  onClick={() => handleSort('name')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    sortBy === 'name' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>Nome</span>
                  {sortBy === 'name' && (
                    sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                  )}
                </button>
                
                <button
                  onClick={() => handleSort('size')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    sortBy === 'size' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>Tamanho</span>
                  {sortBy === 'size' && (
                    sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
                    </div>
        </div>

        {/* Estatísticas dos Departamentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {departments.map(dept => (
            <div
              key={dept.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedDepartment(dept.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${dept.color} rounded-lg flex items-center justify-center`}>
                  <Folder className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{dept.documentCount}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{dept.name}</h3>
              <p className="text-sm text-gray-600">documentos</p>
            </div>
          ))}
        </div>

        {/* Lista de Documentos */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Documentos ({filteredDocuments.length})
            </h2>
          </div>

          {viewMode === 'grid' ? (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map(doc => (
                <div key={doc.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
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
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{doc.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Folder className="h-4 w-4 mr-2" />
                      {doc.department}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {doc.type} • {doc.size}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Por {doc.uploadedBy}</span>
                    <span>{new Date(doc.uploadDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  <div className="mt-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {getStatusText(doc.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tamanho
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upload
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map(doc => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                            <div className="text-sm text-gray-500">Por {doc.uploadedBy}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doc.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doc.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doc.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {getStatusText(doc.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDocument(doc)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadDocument(doc)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum documento encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tente ajustar os filtros ou adicionar novos documentos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
