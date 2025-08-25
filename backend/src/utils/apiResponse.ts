import type { Response } from 'express';
import type { ApiResponse, PaginationMeta } from '../types/api.js';
import { AppError } from '../types/errors.js';

export class ApiResponseHelper {
  static success<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = 200,
    pagination?: PaginationMeta
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
      pagination
    };

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    error: AppError | Error,
    statusCode?: number
  ): Response {
    if (error instanceof AppError) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      };
      
      return res.status(error.statusCode).json(response);
    }

    // Erro genérico
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error'
      }
    };

    return res.status(statusCode || 500).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): Response {
    const totalPages = Math.ceil(total / limit);
    
    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };

    return this.success(res, data, message, 200, pagination);
  }
}
