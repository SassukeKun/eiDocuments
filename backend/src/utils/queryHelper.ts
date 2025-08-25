import type { Request } from 'express';
import type { QueryParams, PaginationMeta } from '../types/api.js';
import { ValidationError } from '../types/errors.js';

export class QueryHelper {
  static parseQueryParams(req: Request): QueryParams {
    // Se os dados já foram validados pelo middleware, usar eles
    if ((req as any).validatedQuery) {
      return (req as any).validatedQuery;
    }

    // Fallback para o parsing manual (para compatibilidade)
    const {
      page = '1',
      limit = '10',
      search,
      sortBy,
      sortOrder = 'desc',
      ...filters
    } = req.query;

    // Validar e converter página
    const pageNum = parseInt(page as string, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      throw new ValidationError('Page must be a positive number');
    }

    // Validar e converter limite
    const limitNum = parseInt(limit as string, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      throw new ValidationError('Limit must be between 1 and 100');
    }

    // Validar ordem de classificação
    const validSortOrders = ['asc', 'desc'];
    const sortOrderValue = (sortOrder as string).toLowerCase();
    if (!validSortOrders.includes(sortOrderValue)) {
      throw new ValidationError('Sort order must be "asc" or "desc"');
    }

    return {
      page: pageNum,
      limit: limitNum,
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrderValue as 'asc' | 'desc',
      filters: this.parseFilters(filters)
    };
  }

  private static parseFilters(filters: any): Record<string, any> {
    const parsed: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        // Tentar converter datas
        if (key.includes('Date') || key.includes('date')) {
          const dateValue = new Date(value as string);
          if (!isNaN(dateValue.getTime())) {
            parsed[key] = dateValue;
            continue;
          }
        }
        
        // Tentar converter arrays (ex: "tag1,tag2,tag3")
        if (typeof value === 'string' && value.includes(',')) {
          parsed[key] = { $in: value.split(',').map(v => v.trim()) };
          continue;
        }
        
        parsed[key] = value;
      }
    }
    
    return parsed;
  }

  static buildMongooseQuery(queryParams: QueryParams): any {
    const { search, sortBy, sortOrder, filters } = queryParams;
    const query: any = {};

    // Adicionar filtros
    if (filters) {
      Object.assign(query, filters);
    }

    // Adicionar busca textual (se especificado)
    if (search) {
      query.$or = [
        { titulo: { $regex: search, $options: 'i' } },
        { descricao: { $regex: search, $options: 'i' } },
        { numeroProtocolo: { $regex: search, $options: 'i' } },
        { numeroReferencia: { $regex: search, $options: 'i' } }
      ];
    }

    return query;
  }

  static buildMongooseSort(queryParams: QueryParams): any {
    const { sortBy, sortOrder } = queryParams;
    
    if (sortBy) {
      return { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    }
    
    // Ordenação padrão por data de criação (mais recente primeiro)
    return { createdAt: -1 };
  }

  static calculatePagination(
    page: number,
    limit: number,
    total: number
  ): PaginationMeta {
    const totalPages = Math.ceil(total / limit);
    
    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }
}
