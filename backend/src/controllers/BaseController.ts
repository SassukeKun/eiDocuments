import type { Request, Response, NextFunction } from 'express';
import type { Document, Model } from 'mongoose';
import type { AuthenticatedRequest, QueryParams } from '../types/api.js';
import { ApiResponseHelper } from '../utils/apiResponse.js';
import { QueryHelper } from '../utils/queryHelper.js';
import { NotFoundError, ValidationError } from '../types/errors.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export abstract class BaseController<T extends Document> {
  protected model: Model<T>;
  protected resourceName: string;

  constructor(model: Model<T>, resourceName: string) {
    this.model = model;
    this.resourceName = resourceName;
  }

  // GET /resources - Lista paginada com filtros e busca
  public getAll = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const queryParams = QueryHelper.parseQueryParams(req);
    
    const mongoQuery = QueryHelper.buildMongooseQuery(queryParams);
    const sortOptions = QueryHelper.buildMongooseSort(queryParams);
    
    const skip = (queryParams.page! - 1) * queryParams.limit!;
    
    // Buscar documentos e total
    const [documents, total] = await Promise.all([
      this.model
        .find(mongoQuery)
        .sort(sortOptions)
        .skip(skip)
        .limit(queryParams.limit!)
        .populate(this.getPopulateFields()),
      this.model.countDocuments(mongoQuery)
    ]);

    return ApiResponseHelper.paginated(
      res,
      documents,
      queryParams.page!,
      queryParams.limit!,
      total,
      `${this.resourceName} retrieved successfully`
    );
  });

  // GET /resources/:id - Buscar por ID
  public getById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    
    const document = await this.model
      .findById(id)
      .populate(this.getPopulateFields());
    
    if (!document) {
      throw new NotFoundError(this.resourceName);
    }

    return ApiResponseHelper.success(
      res,
      document,
      `${this.resourceName} found successfully`
    );
  });

  // POST /resources - Criar novo
  public create = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    // Adicionar informações do usuário se necessário
    if (req.user && 'criadoPor' in req.body === false) {
      req.body.criadoPor = req.user.sub;
    }

    const document = new this.model(req.body);
    await document.save();
    
    // Popular campos após salvamento
    await document.populate(this.getPopulateFields());

    return ApiResponseHelper.success(
      res,
      document,
      `${this.resourceName} created successfully`,
      201
    );
  });

  // PUT /resources/:id - Atualizar
  public update = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    
    const document = await this.model
      .findByIdAndUpdate(id, req.body, { 
        new: true, 
        runValidators: true 
      })
      .populate(this.getPopulateFields());
    
    if (!document) {
      throw new NotFoundError(this.resourceName);
    }

    return ApiResponseHelper.success(
      res,
      document,
      `${this.resourceName} updated successfully`
    );
  });

  // DELETE /resources/:id - Deletar
  public delete = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    
    const document = await this.model.findByIdAndDelete(id);
    
    if (!document) {
      throw new NotFoundError(this.resourceName);
    }

    return ApiResponseHelper.success(
      res,
      null,
      `${this.resourceName} deleted successfully`
    );
  });

  // Método abstrato para definir campos a popular
  protected abstract getPopulateFields(): string | string[];

  // Método para validações customizadas (pode ser sobrescrito)
  protected validateRequest(req: Request): void {
    // Implementação padrão vazia - pode ser sobrescrita
  }
}
