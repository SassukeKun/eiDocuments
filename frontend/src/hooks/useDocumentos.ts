import { useState, useCallback } from 'react';
import { DocumentosService, DocumentoQueryParams, DocumentoCreateData, DocumentoUpdateData } from '@/services/documentosService';
import { Documento } from '@/types';
import { useToastContext } from '@/contexts/ToastContext';

export const useDocumentos = () => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useToastContext();

  // Carregar lista de documentos
  const carregar = useCallback(async (params?: DocumentoQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await DocumentosService.listar(params);
      setDocumentos(response.data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar documentos';
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
      const response = await DocumentosService.buscarPorId(id);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar documento';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Criar novo documento (com upload)
  const criar = useCallback(async (data: DocumentoCreateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await DocumentosService.criar(data);
      success('Documento criado com sucesso');
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar documento';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // Atualizar documento
  const atualizar = useCallback(async (id: string, data: DocumentoUpdateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await DocumentosService.atualizar(id, data);
      success('Documento atualizado com sucesso');
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar documento';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // Remover documento
  const remover = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await DocumentosService.remover(id);
      success('Documento removido com sucesso');
      // Atualizar lista local
      setDocumentos(prev => prev.filter(doc => doc._id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover documento';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // Buscar por texto
  const buscarPorTexto = useCallback(async (texto: string, filtros?: Omit<DocumentoQueryParams, 'q'>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await DocumentosService.buscarPorTexto(texto, filtros);
      setDocumentos(response.data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar documentos';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Buscar por departamento
  const buscarPorDepartamento = useCallback(async (departamentoId: string, params?: DocumentoQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await DocumentosService.buscarPorDepartamento(departamentoId, params);
      setDocumentos(response.data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar documentos do departamento';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Buscar por usuário
  const buscarPorUsuario = useCallback(async (usuarioId: string, params?: DocumentoQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await DocumentosService.buscarPorUsuario(usuarioId, params);
      setDocumentos(response.data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar documentos do usuário';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Buscar por categoria
  const buscarPorCategoria = useCallback(async (categoriaId: string, params?: DocumentoQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await DocumentosService.buscarPorCategoria(categoriaId, params);
      setDocumentos(response.data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar documentos da categoria';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Buscar por tipo
  const buscarPorTipo = useCallback(async (tipoId: string, params?: DocumentoQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await DocumentosService.buscarPorTipo(tipoId, params);
      setDocumentos(response.data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar documentos do tipo';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Download de documento
  const baixar = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Passo 1: Buscar o documento para obter o nome do arquivo
      const documento = await DocumentosService.buscarPorId(id);

      if (!documento || !documento.data?.arquivo?.originalName) {
        throw new Error('Informações do arquivo não encontradas.');
      }

      const originalName = documento.data.arquivo.originalName;

      // Passo 2: Fazer a chamada para obter o Blob do arquivo
      const blob = await DocumentosService.baixar(id);

      // Passo 3: Iniciar o download no navegador
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = originalName;
      document.body.appendChild(link);
      link.click();

      // Limpar
      window.URL.revokeObjectURL(url);
      link.remove();

      success('Download iniciado');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao baixar documento';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // Atualizar status
  const atualizarStatus = useCallback(async (id: string, status: 'ativo' | 'arquivado') => {
    try {
      setLoading(true);
      setError(null);
      const response = await DocumentosService.atualizarStatus(id, status);
      success(`Documento ${status === 'ativo' ? 'ativado' : 'arquivado'} com sucesso`);

      // Atualizar lista local
      setDocumentos(prev => prev.map(doc =>
        doc._id === id ? { ...doc, status } : doc
      ));

      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // Buscar por filtros avançados
  const buscarComFiltros = useCallback(async (filtros: DocumentoQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await DocumentosService.listar(filtros);
      setDocumentos(response.data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar documentos';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Estatísticas dos documentos
  const obterEstatisticas = useCallback(async () => {
    try {
      return await DocumentosService.obterEstatisticas();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao obter estatísticas';
      showError(errorMessage);
      return {
        total: 0,
        ativos: 0,
        arquivados: 0,
        porDepartamento: {},
        porTipo: {},
        porCategoria: {}
      };
    }
  }, [showError]);

  // Carregar com paginação (compatível com usePaginatedData)
  const carregarPaginado = useCallback(async (
    page: number, 
    limit: number, 
    search?: string, 
    sort?: { column: string; direction: 'asc' | 'desc' }
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const params: DocumentoQueryParams = {
        page,
        limit,
        ...(search && { q: search }),
        ...(sort && { 
          sortBy: sort.column,
          sortOrder: sort.direction 
        })
      };
      
      const response = await DocumentosService.listar(params);
      
      // O backend retorna: { success: true, data: [...], page, limit, total }
      // Calcular totalPages
      const totalPages = Math.ceil((response.total || 0) / (response.limit || params.limit || 10));
      
      return {
        data: response.data,
        total: response.total || 0,
        page: response.page || 1,
        totalPages
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar documentos paginados';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  return {
    documentos,
    loading,
    error,
    carregar,
    carregarPaginado,
    buscarPorId,
    criar,
    atualizar,
    remover,
    buscarPorTexto,
    buscarPorDepartamento,
    buscarPorUsuario,
    buscarPorCategoria,
    buscarPorTipo,
    baixar,
    atualizarStatus,
    buscarComFiltros,
    obterEstatisticas,
  };
};
