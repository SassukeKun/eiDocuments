import { useState, useCallback } from 'react';
import { CategoriasService } from '@/services/categoriasService';
import { 
  CategoriaDocumento, 
  CreateCategoriaDocumento, 
  UpdateCategoriaDocumento,
  CategoriaQueryParams 
} from '@/types';
import { useToastContext } from '@/contexts/ToastContext';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<CategoriaDocumento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useToastContext();

  // Carregar lista de categorias
  const carregar = useCallback(async (params?: CategoriaQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await CategoriasService.listar(params);
      setCategorias(response.data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar categorias';
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
      const response = await CategoriasService.buscarPorId(id);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar categoria';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Criar nova categoria
  const criar = useCallback(async (data: CreateCategoriaDocumento) => {
    try {
      setLoading(true);
      setError(null);
      const response = await CategoriasService.criar(data);
      success('Categoria criada com sucesso');
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar categoria';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // Atualizar categoria
  const atualizar = useCallback(async (id: string, data: UpdateCategoriaDocumento) => {
    try {
      setLoading(true);
      setError(null);
      const response = await CategoriasService.atualizar(id, data);
      success('Categoria atualizada com sucesso');
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar categoria';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // Remover categoria
  const remover = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await CategoriasService.remover(id);
      success('Categoria removida com sucesso');
      // Atualizar lista local
      setCategorias(prev => prev.filter(cat => cat._id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover categoria';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // Buscar por texto
  const buscarPorTexto = useCallback(async (texto: string, departamentoId?: string, ativo?: boolean) => {
    try {
      setLoading(true);
      setError(null);
      const response = await CategoriasService.buscarPorTexto(texto, departamentoId, ativo);
      setCategorias(response.data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar categorias';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Carregar apenas ativas (para selects)
  const carregarAtivas = useCallback(async (departamentoId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await CategoriasService.listarAtivas(departamentoId);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar categorias ativas';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Carregar por departamento
  const carregarPorDepartamento = useCallback(async (departamentoId: string, ativo?: boolean) => {
    try {
      setLoading(true);
      setError(null);
      const response = await CategoriasService.listarPorDepartamento(departamentoId, ativo);
      setCategorias(response.data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar categorias do departamento';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Obter para select
  const obterParaSelect = useCallback(async (departamentoId?: string) => {
    try {
      return await CategoriasService.obterParaSelect(departamentoId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao obter categorias para seleção';
      showError(errorMessage);
      return [];
    }
  }, [showError]);

  // Verificar se código existe
  const verificarCodigo = useCallback(async (codigo: string, departamentoId: string, excluirId?: string) => {
    try {
      return await CategoriasService.verificarCodigoExistente(codigo, departamentoId, excluirId);
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
      departamento?: string;
    }
  ) => {
    try {
      const queryParams: CategoriaQueryParams = {
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

      if (params?.departamento) {
        queryParams.departamento = params.departamento;
      }

      const response = await CategoriasService.listar(queryParams);
      
      return {
        data: response.data,
        total: response.total,
        page: response.page,
        totalPages: Math.ceil(response.total / response.limit),
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar categorias';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    }
  }, [showError]);

  return {
    categorias,
    loading,
    error,
    carregar,
    buscarPorId,
    criar,
    atualizar,
    remover,
    buscarPorTexto,
    carregarAtivas,
    carregarPorDepartamento,
    obterParaSelect,
    verificarCodigo,
    carregarPaginado,
  };
};
