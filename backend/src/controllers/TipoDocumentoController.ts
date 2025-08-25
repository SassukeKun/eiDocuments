import { BaseController } from './BaseController.js';
import { TipoDocumento, type ITipoDocumento } from '../models/index.js';

export class TipoDocumentoController extends BaseController<ITipoDocumento> {
  constructor() {
    super(TipoDocumento, 'Tipo de Documento');
  }

  protected getPopulateFields(): string[] {
    return []; // TipoDocumento não tem referências para popular
  }
}
