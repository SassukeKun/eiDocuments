// Service de Categorias - Implementação completa baseada no FRONTEND_REQUIREMENTS.md

import { 
  apiGet, 
  apiPost, 
  apiPut, 
  apiDelete 
} from '../api';
import { 
  CategoriaDocumento, 
  ApiResponse, 
  ApiPaginatedResponse, 
  CategoriaQueryParams 
} from '@/types';

export class CategoriasService {
  // Listar todas as categorias (com paginação e filtros)
  static async listar(params?: CategoriaQueryParams): Promise<ApiPaginatedResponse<CategoriaDocumento>> {
    return apiGet<ApiPaginatedResponse<CategoriaDocumento>>('/categorias', params as Record<string, string | number | boolean>);
  }

  // Buscar categoria por ID
  static async buscarPorId(id: string): Promise<ApiResponse<CategoriaDocumento>> {
    return apiGet<ApiResponse<CategoriaDocumento>>(`/categorias/${id}`);
  }

  // Criar nova categoria
  static async criar(categoria: Omit<CategoriaDocumento, '_id' | 'dataCriacao' | 'dataAtualizacao'>): Promise<ApiResponse<CategoriaDocumento>> {
    return apiPost<ApiResponse<CategoriaDocumento>>('/categorias', categoria);
  }

  // Atualizar categoria existente
  static async atualizar(id: string, categoria: Partial<Omit<CategoriaDocumento, '_id' | 'dataCriacao' | 'dataAtualizacao'>>): Promise<ApiResponse<CategoriaDocumento>> {
    return apiPut<ApiResponse<CategoriaDocumento>>(`/categorias/${id}`, categoria);
  }

  // Remover categoria
  static async remover(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiDelete<ApiResponse<{ message: string }>>(`/categorias/${id}`);
  }

  // Buscar categorias por departamento
  static async listarPorDepartamento(departamentoId: string, ativo?: boolean): Promise<ApiPaginatedResponse<CategoriaDocumento>> {
    const params: CategoriaQueryParams = {
      departamento: departamentoId,
      ativo,
      limit: 100
    };
    return this.listar(params);
  }

  // Buscar categorias por texto (busca em nome e código)
  static async buscarPorTexto(texto: string, departamentoId?: string, ativo?: boolean): Promise<ApiPaginatedResponse<CategoriaDocumento>> {
    const params: CategoriaQueryParams = {
      q: texto,
      departamento: departamentoId,
      ativo,
      limit: 100
    };
    return this.listar(params);
  }

  // Listar apenas categorias ativas
  static async listarAtivas(departamentoId?: string): Promise<ApiPaginatedResponse<CategoriaDocumento>> {
    const params: CategoriaQueryParams = {
      ativo: true,
      departamento: departamentoId
    };
    return this.listar(params);
  }

  // Verificar se código já existe no departamento
  static async verificarCodigoExistente(codigo: string, departamentoId: string, excluirId?: string): Promise<boolean> {
    try {
      const params: CategoriaQueryParams = {
        q: codigo,
        departamento: departamentoId,
        limit: 100
      };
      
      const response = await this.listar(params);
      
      // Se estamos editando, excluir o próprio registro da verificação
      if (excluirId) {
        return response.data.some(cat => cat._id !== excluirId && cat.codigo === codigo);
      }
      
      return response.data.some(cat => cat.codigo === codigo);
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      return false;
    }
  }

  // Obter categorias para select/dropdown
  static async obterParaSelect(departamentoId?: string): Promise<{ value: string; label: string; cor?: string }[]> {
    try {
      const response = await this.listarAtivas(departamentoId);
      return response.data.map(categoria => ({
        value: categoria._id,
        label: categoria.nome,
        cor: categoria.cor
      }));
    } catch (error) {
      console.error('Erro ao obter categorias para select:', error);
      return [];
    }
  }
}
