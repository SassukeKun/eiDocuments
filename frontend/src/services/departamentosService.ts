// Service de Departamentos - Implementação completa baseada no FRONTEND_REQUIREMENTS.md

import { 
  apiGet, 
  apiPost, 
  apiPut, 
  apiDelete 
} from '@/lib/api';
import { 
  Departamento, 
  ApiResponse, 
  ApiPaginatedResponse, 
  DepartamentoQueryParams,
  CreateDepartamento,
  UpdateDepartamento
} from '@/types';

export class DepartamentosService {
  // Listar todos os departamentos (com paginação e filtros)
  static async listar(params?: DepartamentoQueryParams): Promise<ApiPaginatedResponse<Departamento>> {
    return apiGet<ApiPaginatedResponse<Departamento>>('/departamentos', params as Record<string, string | number | boolean>);
  }

  // Buscar departamento por ID
  static async buscarPorId(id: string): Promise<ApiResponse<Departamento>> {
    return apiGet<ApiResponse<Departamento>>(`/departamentos/${id}`);
  }

  // Criar novo departamento
  static async criar(departamento: CreateDepartamento): Promise<ApiResponse<Departamento>> {
    return apiPost<ApiResponse<Departamento>>('/departamentos', departamento);
  }

  // Atualizar departamento existente
  static async atualizar(id: string, departamento: UpdateDepartamento): Promise<ApiResponse<Departamento>> {
    return apiPut<ApiResponse<Departamento>>(`/departamentos/${id}`, departamento);
  }

  // Remover departamento
  static async remover(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiDelete<ApiResponse<{ message: string }>>(`/departamentos/${id}`);
  }

  // Buscar departamentos por texto (busca em nome e código)
  static async buscarPorTexto(texto: string, ativo?: boolean): Promise<ApiPaginatedResponse<Departamento>> {
    const params: DepartamentoQueryParams = {
      q: texto,
      ativo,
      limit: 100 // Busca mais resultados para melhor experiência
    };
    return this.listar(params);
  }

  // Listar apenas departamentos ativos
  static async listarAtivos(): Promise<ApiPaginatedResponse<Departamento>> {
    return this.listar({ ativo: true });
  }

  // Verificar se código já existe
  static async verificarCodigoExistente(codigo: string, excluirId?: string): Promise<boolean> {
    try {
      const params: DepartamentoQueryParams = {
        q: codigo,
        limit: 100
      };
      
      const response = await this.listar(params);
      
      // Se estamos editando, excluir o próprio registro da verificação
      if (excluirId) {
        return response.data.some(dept => dept._id !== excluirId && dept.codigo === codigo);
      }
      
      return response.data.some(dept => dept.codigo === codigo);
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      return false;
    }
  }
}
