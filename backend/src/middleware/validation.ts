import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '../types/errors.js';
import { 
  documentoSchema, 
  departamentoSchema, 
  tipoDocumentoSchema, 
  categoriaDocumentoSchema,
  queryParamsSchema 
} from '../schemas/validation.js';

// Middleware genérico para validação com Zod
const createValidationMiddleware = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map(err => `${err.path.join('.')}: ${err.message}`);
        throw new ValidationError('Dados inválidos', { errors: messages });
      }
      throw error;
    }
  };
};

// Middleware para validação de query parameters
export const validateQueryParams = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const validatedQuery = queryParamsSchema.parse(req.query);
    // Adicionar os dados validados ao request de forma que não interfira com o tipo
    (req as any).validatedQuery = validatedQuery;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new ValidationError('Parâmetros de consulta inválidos', { errors: messages });
    }
    throw error;
  }
};

// Exports dos middlewares específicos
export const validateDocumento = createValidationMiddleware(documentoSchema);
export const validateDepartamento = createValidationMiddleware(departamentoSchema);
export const validateTipoDocumento = createValidationMiddleware(tipoDocumentoSchema);
export const validateCategoriaDocumento = createValidationMiddleware(categoriaDocumentoSchema);
