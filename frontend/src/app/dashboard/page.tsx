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
  SortDesc,
  Building2,
  Users,
  FolderOpen
} from "lucide-react";
import ModernButton from "@/components/ui/ModernButton";
import ModernInput from "@/components/ui/ModernInput";
import ManageLayout from "@/components/ui/ManageLayout";
import { useNotification } from "@/hooks/useNotification";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <ManageLayout>
      <div>
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Documentos</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </div>

          <Link href="/manage/departamentos">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Departamentos</p>
                  <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/manage/categorias">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Categorias</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/manage/usuarios">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Usuários</p>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Departamentos Grid */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Departamentos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map(dept => (
              <Link key={dept.id} href={`/manage/departamentos?filter=${dept.id}`}>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 ${dept.color} rounded-lg flex items-center justify-center`}>
                      <Folder className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">{dept.documentCount}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{dept.name}</h3>
                  <p className="text-sm text-gray-600">documentos</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Documentos Recentes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Documentos Recentes</h2>
            <Link href="/manage/documentos">
              <ModernButton variant="outline" className="text-sm">
                Ver Todos
              </ModernButton>
            </Link>
          </div>
          <div className="space-y-4">
            {documents.slice(0, 5).map(doc => (
              <div key={doc.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                  <p className="text-sm text-gray-500">{doc.department} • {doc.type}</p>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewDocument(doc)}
                    className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadDocument(doc)}
                    className="p-1 text-gray-600 hover:text-green-600 transition-colors"
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

export default DashboardPage;
