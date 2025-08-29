
import { apiGet } from '@/lib/api';

export interface GlobalStats {
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
    return await apiGet<GlobalStats>('/stats/global');
  },

  // Estatísticas de documentos
  async getDocumentStats(): Promise<DocumentStats> {
    return await apiGet<DocumentStats>('/stats/documentos');
  },

  // Estatísticas gerais de departamentos
  async getDepartmentStats(): Promise<DepartmentStats> {
    return await apiGet<DepartmentStats>('/stats/departamentos');
  },

  // Estatísticas de um departamento específico
  async getSingleDepartmentStats(departmentId: string): Promise<SingleDepartmentStats> {
    return await apiGet<SingleDepartmentStats>(`/stats/departamentos/${departmentId}`);
  },

  // Estatísticas do próprio departamento do usuário autenticado
  async getMyDepartmentStats(): Promise<SingleDepartmentStats> {
    return await apiGet<SingleDepartmentStats>('/stats/meu-departamento');
  },
  
  // Estatísticas de usuários
  async getUserStats(): Promise<UserStats> {
    return await apiGet<UserStats>('/stats/usuarios');
  },

  // Estatísticas de categorias
  async getCategoryStats(): Promise<CategoryStats> {
    return await apiGet<CategoryStats>('/stats/categorias');
  },

  // Estatísticas de tipos
  async getTypeStats(): Promise<TypeStats> {
    return await apiGet<TypeStats>('/stats/tipos');
  }
};

export default statsService;
