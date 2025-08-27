// Tipos baseados no FRONTEND_REQUIREMENTS.md

export interface Departamento {
  _id: string;
  nome: string;
  codigo: string;
  descricao?: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface CategoriaDocumento {
  _id: string;
  nome: string;
  codigo: string;
  descricao?: string;
  departamento: string; // ID do departamento
  cor?: string;         // Código hexadecimal (#RRGGBB)
  icone?: string;       // Nome do ícone
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface TipoDocumento {
  _id: string;
  nome: string;
  codigo: string;
  descricao?: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface Documento {
  _id: string;
  titulo: string;
  descricao?: string;
  categoria: string;     // ID da categoria
  tipo: string;          // ID do tipo
  departamento: string;  // ID do departamento
  usuario: string;       // ID do usuário
  tipoMovimento: 'enviado' | 'recebido' | 'interno';
  remetente?: string;    // Para documentos recebidos
  destinatario?: string; // Para documentos enviados
  dataEnvio?: string;    // Para documentos enviados
  dataRecebimento?: string; // Para documentos recebidos
  arquivo: {
    cloudinaryId: string;
    url: string;
    secureUrl: string;
    originalName: string;
    format: string;
    size: number;
  };
  status: 'ativo' | 'arquivado';
  tags: string[];
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

// Tipos para as respostas da API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiPaginatedResponse<T> {
  success: boolean;
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  details?: Record<string, unknown>;
}

// Tipos para filtros e queries
export interface BaseQueryParams {
  page?: number;
  limit?: number;
}

export interface DepartamentoQueryParams extends BaseQueryParams {
  q?: string;
  ativo?: boolean;
}

export interface CategoriaQueryParams extends BaseQueryParams {
  q?: string;
  ativo?: boolean;
  departamento?: string;
}

export interface DocumentoQueryParams extends BaseQueryParams {
  q?: string;
  ativo?: boolean;
  departamento?: string;
  categoria?: string;
  tipo?: string;
  tipoMovimento?: string;
  status?: string;
}
