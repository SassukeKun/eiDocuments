import { apiGet } from '@/lib/api';

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

export interface StatsDepartamento {
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
      categoria: { nome: string };
      tipo: { nome: string };
      usuario: { nome: string };
      dataCriacao: string;
    }>;
  };
}

export interface StatsDocumentos {
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
    departamento: { nome: string };
    categoria: { nome: string };
    tipo: { nome: string };
    dataCriacao: string;
  }>;
  tendencias: {
    porMes: Array<{
      _id: { mes: number; ano: number };
      quantidade: number;
    }>;
  };
}

export class StatsService {
  /**
   * Obter estatísticas globais (dashboard admin)
   */
  static async getGlobalStats(): Promise<StatsGlobal> {
    console.log('📊 Carregando estatísticas globais...');
    const response = await apiGet<StatsGlobal>('/stats/global');
    console.log('📊 Estatísticas globais carregadas:', response);
    return response;
  }

  /**
   * Obter estatísticas do departamento do usuário logado
   */
  static async getMyDepartmentStats(): Promise<StatsDepartamento> {
    console.log('📊 Carregando estatísticas do meu departamento...');
    const response = await apiGet<StatsDepartamento>('/stats/meu-departamento');
    console.log('📊 Estatísticas do departamento carregadas:', response);
    return response;
  }

  /**
   * Obter estatísticas de documentos
   */
  static async getDocumentStats(): Promise<StatsDocumentos> {
    console.log('📊 Carregando estatísticas de documentos...');
    const response = await apiGet<StatsDocumentos>('/stats/documentos');
    console.log('📊 Estatísticas de documentos carregadas:', response);
    return response;
  }

  /**
   * Obter estatísticas de um departamento específico
   */
  static async getSingleDepartmentStats(departmentId: string): Promise<StatsDepartamento> {
    console.log('📊 Carregando estatísticas do departamento:', departmentId);
    const response = await apiGet<StatsDepartamento>(`/stats/departamentos/${departmentId}`);
    console.log('📊 Estatísticas do departamento carregadas:', response);
    return response;
  }

  /**
   * Obter estatísticas de usuários
   */
  static async getUserStats(): Promise<any> {
    console.log('📊 Carregando estatísticas de usuários...');
    const response = await apiGet<any>('/stats/usuarios');
    console.log('📊 Estatísticas de usuários carregadas:', response);
    return response;
  }

  /**
   * Obter estatísticas de categorias
   */
  static async getCategoryStats(): Promise<any> {
    console.log('📊 Carregando estatísticas de categorias...');
    const response = await apiGet<any>('/stats/categorias');
    console.log('📊 Estatísticas de categorias carregadas:', response);
    return response;
  }

  /**
   * Obter estatísticas de tipos
   */
  static async getTypeStats(): Promise<any> {
    console.log('📊 Carregando estatísticas de tipos...');
    const response = await apiGet<any>('/stats/tipos');
    console.log('📊 Estatísticas de tipos carregadas:', response);
    return response;
  }
}

export default StatsService;