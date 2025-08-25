import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../types/api.js';
import mongoose from 'mongoose';
import { BaseController } from './BaseController.js';
import { Documento, type IDocumento } from '../models/index.js';
import { ApiResponseHelper } from '../utils/apiResponse.js';
import { QueryHelper } from '../utils/queryHelper.js';
import { ValidationError, NotFoundError } from '../types/errors.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export class DocumentoController extends BaseController<IDocumento> {
  constructor() {
    super(Documento, 'Documento');
  }

  protected getPopulateFields(): string[] {
    return [
      'departamento',
      'tipoDocumento',
      'categoriaDocumento',
      'criadoPor',
      'atualizadoPor'
    ];
  }

  // Método customizado para buscar documentos por departamento
  public getByDepartamento = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { departamentoId } = req.params;
    const queryParams = QueryHelper.parseQueryParams(req);
    
    const mongoQuery = {
      departamento: departamentoId,
      ...QueryHelper.buildMongooseQuery(queryParams)
    };
    
    const skip = (queryParams.page! - 1) * queryParams.limit!;
    
    const [documents, total] = await Promise.all([
      this.model
        .find(mongoQuery)
        .sort(QueryHelper.buildMongooseSort(queryParams))
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
      `Documentos do departamento encontrados`
    );
  });

  // Método para buscar documentos por tipo
  public getByTipo = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { tipoId } = req.params;
    const queryParams = QueryHelper.parseQueryParams(req);
    
    const mongoQuery = {
      tipoDocumento: tipoId,
      ...QueryHelper.buildMongooseQuery(queryParams)
    };
    
    const skip = (queryParams.page! - 1) * queryParams.limit!;
    
    const [documents, total] = await Promise.all([
      this.model
        .find(mongoQuery)
        .sort(QueryHelper.buildMongooseSort(queryParams))
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
      `Documentos do tipo encontrados`
    );
  });

  // Sobrescrever validação para incluir validações específicas de documento
  protected validateRequest(req: Request): void {
    const { titulo, departamento, tipoDocumento } = req.body;
    
    if (!titulo || titulo.trim() === '') {
      throw new ValidationError('Título é obrigatório');
    }
    
    if (!departamento) {
      throw new ValidationError('Departamento é obrigatório');
    }
    
    if (!tipoDocumento) {
      throw new ValidationError('Tipo de documento é obrigatório');
    }
  }

  // Método customizado para upload de arquivo
  public uploadFile = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const { id } = req.params;
    
    if (!req.file) {
      throw new ValidationError('Arquivo é obrigatório');
    }

    const documento = await this.model.findById(id);
    if (!documento) {
      throw new NotFoundError('Documento');
    }

    // Aqui você integraria com o Cloudinary
    // Por agora, vamos simular o upload
    const fileInfo = {
      cloudinaryId: `documento_${id}_${Date.now()}`,
      url: `https://cloudinary.com/sample/${req.file.filename}`,
      secureUrl: `https://cloudinary.com/sample/${req.file.filename}`,
      originalName: req.file.originalname,
      format: req.file.mimetype.split('/')[1],
      size: req.file.size,
      uploadedAt: new Date()
    };

    documento.arquivo = fileInfo;
    if (req.user?.sub) {
      documento.atualizadoPor = new mongoose.Types.ObjectId(req.user.sub);
    }
    documento.updatedAt = new Date();
    
    await documento.save();
    await documento.populate(this.getPopulateFields());

    return ApiResponseHelper.success(
      res,
      documento,
      'Arquivo enviado com sucesso'
    );
  });
}
