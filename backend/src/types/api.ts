import type { Request } from 'express';

// Tipos para respostas da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Tipos para Auth0
export interface Auth0User {
  sub: string; // Auth0 user ID
  email: string;
  name?: string;
  picture?: string;
  roles?: string[];
  permissions?: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: Auth0User;
}
