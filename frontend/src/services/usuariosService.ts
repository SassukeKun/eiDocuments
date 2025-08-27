// Service de Usuários - Implementação completa

import { 
  apiGet, 
  apiPost, 
  apiPut, 
  apiDelete 
} from '@/lib/api';
import { 
  ApiResponse, 
  ApiPaginatedResponse 
} from '@/types';

export interface Usuario {
  _id: string;
  nome: string;
  email: string;
  departamento: string;
  role: 'admin' | 'manager' | 'user';
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
  ultimoLogin?: string;
}

export interface UsuarioQueryParams {
  q?: string;
  departamento?: string;
  role?: 'admin' | 'manager' | 'user';
  ativo?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UsuarioCreateData {
  nome: string;
  email: string;
  senha: string;
  departamento: string;
  role: 'admin' | 'manager' | 'user';
  ativo?: boolean;
}

export interface UsuarioUpdateData {
  nome?: string;
  email?: string;
  departamento?: string;
  role?: 'admin' | 'manager' | 'user';
  ativo?: boolean;
  senha?: string;
}

export class UsuariosService {
  // Listar todos os usuários (com paginação e filtros)
  static async listar(params?: UsuarioQueryParams): Promise<ApiPaginatedResponse<Usuario>> {
    return apiGet<ApiPaginatedResponse<Usuario>>('/usuarios', params as Record<string, string | number | boolean>);
  }

  // Buscar usuário por ID
  static async buscarPorId(id: string): Promise<ApiResponse<Usuario>> {
    return apiGet<ApiResponse<Usuario>>(`/usuarios/${id}`);
  }

  // Criar novo usuário
  static async criar(usuario: UsuarioCreateData): Promise<ApiResponse<Usuario>> {
    return apiPost<ApiResponse<Usuario>>('/usuarios', usuario);
  }

  // Atualizar usuário existente
  static async atualizar(id: string, usuario: UsuarioUpdateData): Promise<ApiResponse<Usuario>> {
    return apiPut<ApiResponse<Usuario>>(`/usuarios/${id}`, usuario);
  }

  // Remover usuário
  static async remover(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiDelete<ApiResponse<{ message: string }>>(`/usuarios/${id}`);
  }

  // Buscar usuários por texto (busca em nome e email)
  static async buscarPorTexto(texto: string, filtros?: Partial<UsuarioQueryParams>): Promise<ApiPaginatedResponse<Usuario>> {
    const params: UsuarioQueryParams = {
      q: texto,
      limit: 100,
      ...filtros
    };
    return this.listar(params);
  }

  // Buscar usuários por departamento
  static async buscarPorDepartamento(departamentoId: string, params?: UsuarioQueryParams): Promise<ApiPaginatedResponse<Usuario>> {
    return this.listar({
      ...params,
      departamento: departamentoId
    });
  }

  // Buscar usuários por role
  static async buscarPorRole(role: 'admin' | 'manager' | 'user', params?: UsuarioQueryParams): Promise<ApiPaginatedResponse<Usuario>> {
    return this.listar({
      ...params,
      role
    });
  }

  // Alterar senha do usuário
  static async alterarSenha(id: string, senhaAtual: string, novaSenha: string): Promise<ApiResponse<{ message: string }>> {
    return apiPut<ApiResponse<{ message: string }>>(`/usuarios/${id}/senha`, {
      senhaAtual,
      novaSenha
    });
  }

  // Obter perfil do usuário atual
  static async obterPerfil(): Promise<ApiResponse<Usuario>> {
    return apiGet<ApiResponse<Usuario>>('/usuarios/perfil');
  }

  // Atualizar perfil do usuário atual
  static async atualizarPerfil(dados: Partial<UsuarioUpdateData>): Promise<ApiResponse<Usuario>> {
    return apiPut<ApiResponse<Usuario>>('/usuarios/perfil', dados as Record<string, unknown>);
  }

  // Listar apenas usuários ativos
  static async listarAtivos(): Promise<ApiResponse<Usuario[]>> {
    const response = await this.listar({ ativo: true, limit: 1000 });
    return {
      success: response.success,
      data: response.data
    };
  }

  // Obter usuários para seleção (id + nome)
  static async obterParaSelect(): Promise<{ value: string; label: string }[]> {
    try {
      const response = await this.listarAtivos();
      return response.data.map(usuario => ({
        value: usuario._id,
        label: usuario.nome
      }));
    } catch (error) {
      console.error('Erro ao obter usuários para seleção:', error);
      return [];
    }
  }
}
