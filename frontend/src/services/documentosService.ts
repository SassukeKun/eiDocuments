// Service de Documentos - Implementação completa baseada no FRONTEND_REQUIREMENTS.md

import { 
  apiGet, 
  apiPost, 
  apiPut, 
  apiDelete,
  ApiResponse,
  ApiPaginatedResponse
} from '@/lib/api';
import { 
  Documento
} from '@/types';

export interface DocumentoQueryParams {
  q?: string;
  departamento?: string;
  categoria?: string;
  tipo?: string;
  tipoMovimento?: 'enviado' | 'recebido' | 'interno';
  dataInicio?: string;
  dataFim?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DocumentoCreateData {
  titulo: string;
  descricao?: string;
  categoria: string;
  tipo: string;
  departamento: string;
  usuario?: string;
  tipoMovimento: 'enviado' | 'recebido' | 'interno';
  remetente?: string;
  destinatario?: string;
  responsavel?: string;
  dataEnvio?: string;
  dataRecebimento?: string;
  tags?: string[];
  arquivo: File;
}

export interface DocumentoUpdateData {
  titulo?: string;
  descricao?: string;
  categoria?: string;
  tipo?: string;
  departamento?: string;
  tipoMovimento?: 'enviado' | 'recebido' | 'interno';
  remetente?: string;
  destinatario?: string;
  dataEnvio?: string;
  dataRecebimento?: string;
  tags?: string[];
  ativo?: boolean;
}

export class DocumentosService {
  // Listar todos os documentos (com paginação e filtros)
  static async listar(params?: DocumentoQueryParams): Promise<ApiPaginatedResponse<Documento>> {
    return apiGet<ApiPaginatedResponse<Documento>>('/documentos', params as Record<string, string | number | boolean>);
  }

  // Buscar documento por ID
  static async buscarPorId(id: string): Promise<ApiResponse<Documento>> {
    return apiGet<ApiResponse<Documento>>(`/documentos/${id}`);
  }

  // Criar novo documento
  static async criar(documento: DocumentoCreateData): Promise<ApiResponse<Documento>> {
    console.log('🏗️ DocumentosService.criar chamado com:', documento);
    console.log('👤 Responsável recebido:', documento.responsavel);
    
    const formData = new FormData();
    
    // Adicionar dados do documento
    formData.append('titulo', documento.titulo);
    if (documento.descricao) formData.append('descricao', documento.descricao);
    formData.append('categoria', documento.categoria);
    formData.append('tipo', documento.tipo);
    formData.append('departamento', documento.departamento);
    if (documento.usuario) formData.append('usuario', documento.usuario);
    formData.append('tipoMovimento', documento.tipoMovimento);
    if (documento.remetente) formData.append('remetente', documento.remetente);
    if (documento.destinatario) formData.append('destinatario', documento.destinatario);
    if (documento.responsavel) formData.append('responsavel', documento.responsavel);
    if (documento.dataEnvio) formData.append('dataEnvio', documento.dataEnvio);
    if (documento.dataRecebimento) formData.append('dataRecebimento', documento.dataRecebimento);
    if (documento.tags) formData.append('tags', JSON.stringify(documento.tags));
    
    // Adicionar arquivo
    formData.append('arquivo', documento.arquivo);

    return apiPost<ApiResponse<Documento>>('/documentos', formData);
  }

  // Atualizar documento existente (sem arquivo)
  static async atualizar(id: string, documento: DocumentoUpdateData): Promise<ApiResponse<Documento>> {
    return apiPut<ApiResponse<Documento>>(`/documentos/${id}`, documento as Record<string, unknown>);
  }

  // Remover documento
  static async remover(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiDelete<ApiResponse<{ message: string }>>(`/documentos/${id}`);
  }

  // Buscar documentos por texto (busca em título e descrição)
  static async buscarPorTexto(texto: string, filtros?: Partial<DocumentoQueryParams>): Promise<ApiPaginatedResponse<Documento>> {
    const params: DocumentoQueryParams = {
      q: texto,
      limit: 100,
      ...filtros
    };
    return this.listar(params);
  }

  // Buscar documentos por departamento usando endpoint específico
  static async buscarPorDepartamento(departamentoId: string, params?: DocumentoQueryParams): Promise<ApiPaginatedResponse<Documento>> {
    return apiGet<ApiPaginatedResponse<Documento>>(`/documentos/departamento/${departamentoId}`, params as Record<string, string | number | boolean>);
  }

  // Buscar documentos por categoria
  static async buscarPorCategoria(categoriaId: string, params?: DocumentoQueryParams): Promise<ApiPaginatedResponse<Documento>> {
    return this.listar({
      ...params,
      categoria: categoriaId
    });
  }

  // Buscar documentos por tipo
  static async buscarPorTipo(tipoId: string, params?: DocumentoQueryParams): Promise<ApiPaginatedResponse<Documento>> {
    return this.listar({
      ...params,
      tipo: tipoId
    });
  }

  // Buscar documentos por usuário usando endpoint específico
  static async buscarPorUsuario(usuarioId: string, params?: DocumentoQueryParams): Promise<ApiPaginatedResponse<Documento>> {
    return apiGet<ApiPaginatedResponse<Documento>>(`/documentos/usuario/${usuarioId}`, params as Record<string, string | number | boolean>);
  }

  // Download de documento
  static async download(id: string): Promise<Blob> {
    // Opção 1: Usar endpoint do backend (atual - pode ter problemas de proxy)
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'}/documentos/${id}/download`,
    //   { credentials: 'include' }
    // );
    
    // Opção 2 (MELHOR): Buscar a URL direta do Cloudinary e baixar de lá
    const documentoResponse = await this.buscarPorId(id);
    const secureUrl = documentoResponse.data?.arquivo?.secureUrl;
    
    if (!secureUrl) {
      throw new Error('URL do arquivo não encontrada');
    }
    
    // Baixar diretamente do Cloudinary (sem passar pelo backend)
    const response = await fetch(secureUrl);
    
    if (!response.ok) {
      throw new Error(`Erro no download: ${response.status}`);
    }
    
    return response.blob();
  }

  // Obter estatísticas de documentos
  static async obterEstatisticas(): Promise<ApiResponse<{
    total: number;
    porDepartamento: { departamento: string; quantidade: number }[];
    porCategoria: { categoria: string; quantidade: number }[];
    porTipo: { tipo: string; quantidade: number }[];
    recentes: Documento[];
  }>> {
    return apiGet<ApiResponse<any>>('/documentos/estatisticas');
  }

  // Buscar documento por ID (alias para compatibilidade com hooks)
  static async buscar(id: string): Promise<ApiResponse<Documento>> {
    return this.buscarPorId(id);
  }

  // Baixar documento (alias para compatibilidade com hooks)
  static async baixar(id: string): Promise<Blob> {
    return this.download(id);
  }

  // Atualizar status do documento
  static async atualizarStatus(id: string, status: string): Promise<ApiResponse<Documento>> {
    return apiPut<ApiResponse<Documento>>(`/documentos/${id}/status`, { status });
  }
}
