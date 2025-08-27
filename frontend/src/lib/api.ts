// Configuração base da API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Tipos base para respostas da API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiPaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  details?: any;
}

// Função base para requisições
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Se o body é FormData, não definir Content-Type (deixar o browser definir)
  if (options.body instanceof FormData) {
    delete (config.headers as Record<string, string>)['Content-Type'];
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        success: false,
        message: `HTTP ${response.status}: ${response.statusText}`
      }));
      
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Funções específicas para cada método HTTP
export async function apiGet<T>(
  endpoint: string, 
  params?: Record<string, string | number | boolean>
): Promise<T> {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }
  
  const queryString = searchParams.toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  
  return apiRequest<T>(url, {
    method: 'GET',
  });
}

export async function apiPost<T>(
  endpoint: string, 
  data: any
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
}

export async function apiPut<T>(
  endpoint: string, 
  data: any
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
}

export async function apiDelete<T>(
  endpoint: string
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
  });
}

export async function apiPatch<T>(
  endpoint: string, 
  data: any
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
}
