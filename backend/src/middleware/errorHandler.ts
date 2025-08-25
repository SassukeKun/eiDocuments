import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../types/api.js';
import { AppError, ErrorCodes } from '../types/errors.js';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  // Log do erro para monitoramento
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

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

  // Erros do Mongoose
  if (error.name === 'ValidationError') {
    const response: ApiResponse = {
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Validation failed',
        details: error.message
      }
    };
    
    return res.status(400).json(response);
  }

  if (error.name === 'CastError') {
    const response: ApiResponse = {
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Invalid ID format'
      }
    };
    
    return res.status(400).json(response);
  }

  // Erro genérico
  const response: ApiResponse = {
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal server error'
    }
  };

  return res.status(500).json(response);
};

// Middleware para capturar erros assíncronos
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
