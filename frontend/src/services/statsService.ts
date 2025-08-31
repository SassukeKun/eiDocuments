
import { apiGet, ApiResponse } from '@/lib/api';

export interface StatsGlobal {
  resumo: {
    totalDocumentos: number;
    totalDepartamentos: number;
    totalCategorias: number;
    totalTipos: number;
    totalUsuarios: number;
    documentosAtivos: number;
    documentosArquivados: number;
    documentosRecentes: number;
  };
  distribuicoes: {
    porDepartamento: Array<{ nome: string; quantidade: number }>;
    porTipo: Array<{ nome: string; quantidade: number }>;
    porMovimento: Array<{ tipo: string; quantidade: number }>;
  };
  tendencias: {
    crescimentoSemanal: number;
    taxaAtivos: string;
  };
}

export interface DocumentStats {
  totais: {
    total: number;
    ativos: number;
    arquivados: number;
  };
  distribuicoes: {
    porDepartamento: Array<{ departamento: string; quantidade: number }>;
    porCategoria: Array<{ categoria: string; quantidade: number }>;
    porTipo: Array<{ tipo: string; quantidade: number }>;
    porMovimento: Array<{ movimento: string; quantidade: number }>;
  };
  recentes: Array<{
    _id: string;
    titulo: string;
    dataCriacao: string;
    departamento: { nome: string };
    categoria: { nome: string };
    tipo: { nome: string };
  }>;
  tendencias: {
    porMes: Array<{
      _id: { mes: number; ano: number };
      quantidade: number;
    }>;
  };
}

export interface DepartmentStats {
  totais: {
    total: number;
    ativos: number;
    inativos: number;
  };
  distribuicoes: {
    categorias: Array<{ departamento: string; quantidade: number }>;
    usuarios: Array<{ departamento: string; quantidade: number }>;
    documentos: Array<{ departamento: string; quantidade: number }>;
  };
}

export interface SingleDepartmentStats {
  departamento: {
    _id: string;
    nome: string;
    codigo: string;
  };
  documentos: {
    total: number;
    ativos: number;
    arquivados: number;
    porCategoria: Array<{ categoria: string; quantidade: number }>;
    porTipo: Array<{ tipo: string; quantidade: number }>;
    recentes: Array<{
      _id: string;
      titulo: string;
      dataCriacao: string;
      categoria: { nome: string };
      tipo: { nome: string };
      usuario: { nome: string };
    }>;
  };
}

export interface UserStats {
  totais: {
    total: number;
    ativos: number;
    inativos: number;
  };
  distribuicoes: {
    porRole: Array<{ role: string; quantidade: number }>;
    porDepartamento: Array<{ departamento: string; quantidade: number }>;
    atividadeDocumental: Array<{ usuario: string; quantidade: number }>;
  };
  recentes: Array<{
    _id: string;
    nome: string;
    email: string;
    dataCriacao: string;
    departamento: { nome: string };
  }>;
}

export interface CategoryStats {
  totais: {
    total: number;
    ativas: number;
    inativas: number;
  };
  distribuicoes: {
    porDepartamento: Array<{ departamento: string; quantidade: number }>;
    usoPorCategoria: Array<{ categoria: string; quantidade: number }>;
  };
  recentes: Array<{
    _id: string;
    nome: string;
    dataCriacao: string;
    departamento: { nome: string };
  }>;
}

export interface TypeStats {
  totais: {
    total: number;
    ativos: number;
    inativos: number;
  };
  distribuicoes: {
    usoPorTipo: Array<{ tipo: string; quantidade: number }>;
    maisUsados: Array<{ nome: string; quantidade: number }>;
  };
  recentes: Array<{
    _id: string;
    nome: string;
    dataCriacao: string;
  }>;
}

const statsService = {
  // Estatísticas globais para dashboard
  async getGlobalStats(): Promise<GlobalStats> {
    const response = await apiGet<ApiResponse<GlobalStats>>('/stats/global');
    return response.data;
  },

  // Estatísticas de documentos
  async getDocumentStats(): Promise<DocumentStats> {
    const response = await apiGet<ApiResponse<DocumentStats>>('/stats/documentos');
    return response.data;
  },

  // Estatísticas gerais de departamentos
  async getDepartmentStats(): Promise<DepartmentStats> {
    const response = await apiGet<ApiResponse<DepartmentStats>>('/stats/departamentos');
    return response.data;
  },

  // Estatísticas de um departamento específico
  async getSingleDepartmentStats(departmentId: string): Promise<SingleDepartmentStats> {
    const response = await apiGet<ApiResponse<SingleDepartmentStats>>(`/stats/departamentos/${departmentId}`);
    return response.data;
  },

  // Estatísticas do próprio departamento do usuário autenticado
  async getMyDepartmentStats(): Promise<SingleDepartmentStats> {
    const response = await apiGet<ApiResponse<SingleDepartmentStats>>('/stats/meu-departamento');
    return response.data;
  },
  
  // Estatísticas de usuários
  async getUserStats(): Promise<UserStats> {
    const response = await apiGet<ApiResponse<UserStats>>('/stats/usuarios');
    return response.data;
  },

  // Estatísticas de categorias
  async getCategoryStats(): Promise<CategoryStats> {
    const response = await apiGet<ApiResponse<CategoryStats>>('/stats/categorias');
    return response.data;
  },

  // Estatísticas de tipos
  async getTypeStats(): Promise<TypeStats> {
    const response = await apiGet<ApiResponse<TypeStats>>('/stats/tipos');
    return response.data;
  }
};

export default statsService;
