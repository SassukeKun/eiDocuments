// Configuração da API baseada no FRONTEND_REQUIREMENTS.md

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

// Função para construir URLs com query parameters
export function buildApiUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}

// Função para fazer requisições HTTP com tratamento de erro padrão
export async function apiRequest<T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

          if (!response.ok) {
        // Tentar obter mais detalhes sobre o erro
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorDetails = '';
        
        try {
          const errorText = await response.text();
          if (errorText) {
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.message || errorData.error || errorText;
              // Capturar detalhes específicos de validação
              if (errorData.details) {
                if (typeof errorData.details === 'object') {
                  errorDetails = Object.entries(errorData.details)
                    .map(([field, message]) => `${field}: ${message}`)
                    .join(', ');
                } else {
                  errorDetails = String(errorData.details);
                }
              }
            } catch {
              errorMessage = `${errorMessage}: ${errorText}`;
            }
          }
        } catch {
          // Se não conseguir ler o erro, usar status padrão
        }
        
        // Incluir detalhes de validação se disponíveis
        if (errorDetails) {
          errorMessage = `${errorMessage} - ${errorDetails}`;
        }
        
        throw new Error(errorMessage);
      }

    // Verificar se a resposta tem conteúdo
    const text = await response.text();
    
    if (!text) {
      // Resposta vazia - considerar como sucesso para DELETE
      if (options.method === 'DELETE') {
        return { success: true, data: { message: 'Item removido com sucesso' } } as T;
      }
      throw new Error('Resposta vazia da API');
    }
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Erro ao fazer parse da resposta:', text);
      throw new Error('Resposta inválida da API');
    }
    
    // Verificar se a resposta segue o padrão esperado
    if (data.success === false) {
      throw new Error(data.message || 'Erro na API');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Função para fazer requisições GET
export async function apiGet<T>(
  endpoint: string, 
  params?: Record<string, string | number | boolean>
): Promise<T> {
  const url = buildApiUrl(endpoint, params);
  return apiRequest<T>(url);
}

// Função para fazer requisições POST
export async function apiPost<T>(
  endpoint: string, 
  data: Record<string, unknown>
): Promise<T> {
  const url = buildApiUrl(endpoint);
  return apiRequest<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Função para fazer requisições PUT
export async function apiPut<T>(
  endpoint: string, 
  data: Record<string, unknown>
): Promise<T> {
  const url = buildApiUrl(endpoint);
  return apiRequest<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Função para fazer requisições DELETE
export async function apiDelete<T>(
  endpoint: string
): Promise<T> {
  const url = buildApiUrl(endpoint);
  return apiRequest<T>(url, {
    method: 'DELETE',
  });
}
