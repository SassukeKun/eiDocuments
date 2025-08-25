import { BaseController } from './BaseController.js';
import { Departamento, type IDepartamento } from '../models/index.js';

export class DepartamentoController extends BaseController<IDepartamento> {
  constructor() {
    super(Departamento, 'Departamento');
  }

  protected getPopulateFields(): string[] {
    return []; // Departamento não tem referências para popular por enquanto
  }
}
