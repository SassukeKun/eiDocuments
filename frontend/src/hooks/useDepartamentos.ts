import { useState, useCallback } from 'react';
import { DepartamentosService } from '@/services/departamentosService';
import { 
  Departamento, 
  CreateDepartamento, 
  UpdateDepartamento,
  DepartamentoQueryParams,
  ApiPaginatedResponse 
} from '@/types';
import { useToastContext } from '@/contexts/ToastContext';

export const useDepartamentos = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useToastContext();

  // Carregar lista de departamentos
  const carregar = useCallback(async (params?: DepartamentoQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await DepartamentosService.listar(params);
      setDepartamentos(response.data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar departamentos';
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
      const response = await DepartamentosService.buscarPorId(id);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar departamento';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Criar novo departamento
  const criar = useCallback(async (data: CreateDepartamento) => {
    try {
      setLoading(true);
      setError(null);
      const response = await DepartamentosService.criar(data);
      success('Departamento criado com sucesso');
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar departamento';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // Atualizar departamento
  const atualizar = useCallback(async (id: string, data: UpdateDepartamento) => {
    try {
      setLoading(true);
      setError(null);
      const response = await DepartamentosService.atualizar(id, data);
      success('Departamento atualizado com sucesso');
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar departamento';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // Remover departamento
  const remover = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await DepartamentosService.remover(id);
      success('Departamento removido com sucesso');
      // Atualizar lista local
      setDepartamentos(prev => prev.filter(dept => dept._id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover departamento';
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
      const response = await DepartamentosService.buscarPorTexto(texto, ativo);
      setDepartamentos(response.data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar departamentos';
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
      const response = await DepartamentosService.listarAtivos();
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar departamentos ativos';
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
      return await DepartamentosService.obterParaSelect();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao obter departamentos para seleção';
      showError(errorMessage);
      return [];
    }
  }, [showError]);

  // Carregar com paginação (nova função)
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
      const queryParams: DepartamentoQueryParams = {
        page: params?.page || 1,
        limit: params?.limit || 10,
      };

      if (params?.q) {
        queryParams.search = params.q;
      }

      if (params?.sortBy) {
        queryParams.sortBy = params.sortBy;
        queryParams.sortOrder = params.sortOrder || 'asc';
      }

      const response = await DepartamentosService.listar(queryParams);
      
      return {
        data: response.data,
        total: response.total,
        page: response.page,
        totalPages: Math.ceil(response.total / response.limit),
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar departamentos';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    }
  }, [showError]);

  // Verificar se código existe
  const verificarCodigo = useCallback(async (codigo: string, excluirId?: string) => {
    try {
      return await DepartamentosService.verificarCodigoExistente(codigo, excluirId);
    } catch (err) {
      console.error('Erro ao verificar código:', err);
      return false;
    }
  }, []);

  return {
    departamentos,
    loading,
    error,
    carregar,
    carregarPaginado,
    buscarPorId,
    criar,
    atualizar,
    remover,
    buscarPorTexto,
    carregarAtivos,
    obterParaSelect,
    verificarCodigo,
  };
};
