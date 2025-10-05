import { useState, useCallback } from 'react';
import { TiposService } from '@/services/tiposService';
import { 
  TipoDocumento, 
  CreateTipoDocumento, 
  UpdateTipoDocumento,
  TipoQueryParams 
} from '@/types';
import { useToastContext } from '@/contexts/ToastContext';

export const useTipos = () => {
  const [tipos, setTipos] = useState<TipoDocumento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useToastContext();

  // Carregar lista de tipos
  const carregar = useCallback(async (params?: TipoQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await TiposService.listar(params);
      setTipos(response.data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar tipos';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Buscar por ID
  const buscarPorId = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await TiposService.buscarPorId(id);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar tipo';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Criar novo tipo
  const criar = useCallback(async (data: CreateTipoDocumento) => {
    try {
      setLoading(true);
      setError(null);
      // Garantir que ativo tenha valor padrão true se não fornecido
      const tipoData = {
        ...data,
        ativo: data.ativo ?? true
      };
      const response = await TiposService.criar(tipoData);
      success('Tipo criado com sucesso');
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar tipo';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // Atualizar tipo
  const atualizar = useCallback(async (id: string, data: UpdateTipoDocumento) => {
    try {
      setLoading(true);
      setError(null);
      const response = await TiposService.atualizar(id, data);
      success('Tipo atualizado com sucesso');
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar tipo';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // Remover tipo
  const remover = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await TiposService.remover(id);
      success('Tipo removido com sucesso');
      // Atualizar lista local
      setTipos(prev => prev.filter(tipo => tipo._id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover tipo';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // Buscar por texto
  const buscarPorTexto = useCallback(async (texto: string, ativo?: boolean) => {
    try {
      setLoading(true);
      setError(null);
      const response = await TiposService.buscarPorTexto(texto, ativo);
      setTipos(response.data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar tipos';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Carregar apenas ativos (para selects)
  const carregarAtivos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await TiposService.listarAtivos();
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar tipos ativos';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Obter para select
  const obterParaSelect = useCallback(async () => {
    try {
      return await TiposService.obterParaSelect();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao obter tipos para seleção';
      showError(errorMessage);
      return [];
    }
  }, [showError]);

  // Verificar se código existe
  const verificarCodigo = useCallback(async (codigo: string, excluirId?: string) => {
    try {
      return await TiposService.verificarCodigoExistente(codigo, excluirId);
    } catch (err) {
      console.error('Erro ao verificar código:', err);
      return false;
    }
  }, []);

  // Carregar com paginação
  const carregarPaginado = useCallback(async (
    params?: {
      page?: number;
      limit?: number;
      q?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ) => {
    try {
      const queryParams: TipoQueryParams = {
        page: params?.page || 1,
        limit: params?.limit || 10,
      };

      if (params?.q) {
        queryParams.q = params.q;
      }

      if (params?.sortBy) {
        queryParams.sortBy = params.sortBy;
        queryParams.sortOrder = params.sortOrder || 'asc';
      }

      const response = await TiposService.listar(queryParams);
      
      return {
        data: response.data,
        total: response.total,
        page: response.page,
        totalPages: Math.ceil(response.total / response.limit),
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar tipos';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    }
  }, [showError]);

  // Carregar tipos por departamento (para editores)
  const carregarPorDepartamento = useCallback(async (
    departamentoId: string,
    params?: {
      page?: number;
      limit?: number;
      q?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ) => {
    try {
      const queryParams: TipoQueryParams = {
        page: params?.page || 1,
        limit: params?.limit || 10,
      };

      if (params?.q) {
        queryParams.q = params.q;
      }

      if (params?.sortBy) {
        queryParams.sortBy = params.sortBy;
        queryParams.sortOrder = params.sortOrder || 'asc';
      }

      const response = await TiposService.listarPorDepartamento(departamentoId, queryParams);
      
      return {
        data: response.data,
        total: response.total,
        page: response.page,
        totalPages: Math.ceil(response.total / response.limit),
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar tipos';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    }
  }, [showError]);

  return {
    tipos,
    loading,
    error,
    carregar,
    buscarPorId,
    criar,
    atualizar,
    remover,
    buscarPorTexto,
    carregarAtivos,
    obterParaSelect,
    verificarCodigo,
    carregarPaginado,
    carregarPorDepartamento,
  };
};
