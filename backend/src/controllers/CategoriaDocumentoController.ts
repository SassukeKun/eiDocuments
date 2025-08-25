import { BaseController } from './BaseController.js';
import { CategoriaDocumento, type ICategoriaDocumento } from '../models/index.js';

export class CategoriaDocumentoController extends BaseController<ICategoriaDocumento> {
  constructor() {
    super(CategoriaDocumento, 'Categoria de Documento');
  }

  protected getPopulateFields(): string[] {
    return ['departamento']; // Popular o departamento relacionado
  }
}
