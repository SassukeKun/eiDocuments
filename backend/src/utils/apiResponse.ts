import type { Response } from 'express';

export class ApiResponse {
  static success<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = 200
  ): Response {
    const response = {
      success: true,
      data,
      message
    };

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    code?: string
  ): Response {
    const response = {
      success: false,
      error: {
        code: code || 'ERROR',
        message
      }
    };

    return res.status(statusCode).json(response);
  }

  // Métodos que retornam o objeto da resposta (para uso com res.json())
  static successData<T>(data?: T, message?: string) {
    return {
      success: true,
      data,
      message
    };
  }

  static errorData(message: string, code?: string) {
    return {
      success: false,
      error: {
        code: code || 'ERROR',
        message
      }
    };
  }
}

// Alias para compatibilidade com código existente
export const ApiResponseHelper = ApiResponse;
