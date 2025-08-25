import { Schema, model, Document, Types } from 'mongoose';

export interface ICategoriaDocumento extends Document {
  nome: string;
  codigo: string;
  descricao?: string;
  departamento: Types.ObjectId;
  cor?: string; // Para identificação visual na UI
  icone?: string; // Ícone para representar a categoria
  ativo: boolean;
  dataCreacao: Date;
  dataAtualizacao: Date;
}

const CategoriaDocumentoSchema = new Schema<ICategoriaDocumento>({
  nome: {
    type: String,
    required: [true, 'Nome da categoria é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode exceder 100 caracteres']
  },
  codigo: {
    type: String,
    required: [true, 'Código da categoria é obrigatório'],
    uppercase: true,
    trim: true,
    maxlength: [20, 'Código não pode exceder 20 caracteres']
  },
  descricao: {
    type: String,
    trim: true,
    maxlength: [500, 'Descrição não pode exceder 500 caracteres']
  },
  departamento: {
    type: Schema.Types.ObjectId,
    ref: 'Departamento',
    required: [true, 'Departamento é obrigatório']
  },
  cor: {
    type: String,
    trim: true,
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor deve estar em formato hexadecimal']
  },
  icone: {
    type: String,
    trim: true,
    maxlength: [50, 'Ícone não pode exceder 50 caracteres']
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: {
    createdAt: 'dataCriacao',
    updatedAt: 'dataAtualizacao'
  }
});

// Índice composto para garantir unicidade do código dentro do departamento
CategoriaDocumentoSchema.index({ codigo: 1, departamento: 1 }, { unique: true });
CategoriaDocumentoSchema.index({ nome: 1 });
CategoriaDocumentoSchema.index({ departamento: 1 });
CategoriaDocumentoSchema.index({ ativo: 1 });

export const CategoriaDocumento = model<ICategoriaDocumento>('CategoriaDocumento', CategoriaDocumentoSchema);
