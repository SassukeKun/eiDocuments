import { useState, useCallback } from 'react';
import { 
  UsuariosService, 
  Usuario, 
  UsuarioCreateData, 
  UsuarioUpdateData, 
  UsuarioQueryParams 
} from '@/services/usuariosService';
import { useNotification } from './useNotification';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useNotification();

  // Carregar lista de usuários
  const carregar = useCallback(async (params?: UsuarioQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await UsuariosService.listar(params);
      setUsuarios(response.data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar usuários';
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
      const response = await UsuariosService.buscarPorId(id);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar usuário';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Criar novo usuário
  const criar = useCallback(async (data: UsuarioCreateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await UsuariosService.criar(data);
      success('Usuário criado com sucesso');
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar usuário';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // Atualizar usuário
  const atualizar = useCallback(async (id: string, data: UsuarioUpdateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await UsuariosService.atualizar(id, data);
      success('Usuário atualizado com sucesso');
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar usuário';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // Remover usuário
  const remover = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await UsuariosService.remover(id);
      success('Usuário removido com sucesso');
      // Atualizar lista local
      setUsuarios(prev => prev.filter(user => user._id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover usuário';
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
      const filtros = ativo !== undefined ? { ativo } : undefined;
      const response = await UsuariosService.buscarPorTexto(texto, filtros);
      setUsuarios(response.data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar usuários';
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
      const response = await UsuariosService.listarAtivos();
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar usuários ativos';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Buscar por role
  const buscarPorRole = useCallback(async (role: 'admin' | 'manager' | 'user', ativo?: boolean) => {
    try {
      setLoading(true);
      setError(null);
      const filtros = ativo !== undefined ? { ativo } : undefined;
      const response = await UsuariosService.buscarPorRole(role, filtros);
      setUsuarios(response.data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar usuários por role';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Obter usuários para select
  const obterParaSelect = useCallback(async () => {
    try {
      return await UsuariosService.obterParaSelect();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao obter usuários para seleção';
      showError(errorMessage);
      return [];
    }
  }, [showError]);

  return {
    usuarios,
    loading,
    error,
    carregar,
    buscarPorId,
    criar,
    atualizar,
    remover,
    buscarPorTexto,
    carregarAtivos,
    buscarPorRole,
    obterParaSelect,
  };
};
