import { Schema, model, Document } from 'mongoose';

export interface ITipoDocumento extends Document {
  nome: string;
  codigo: string;
  descricao?: string;
  cor?: string; // Para identificação visual na UI
  icone?: string; // Ícone para representar o tipo
  ativo: boolean;
  dataCreacao: Date;
  dataAtualizacao: Date;
}

const TipoDocumentoSchema = new Schema<ITipoDocumento>({
  nome: {
    type: String,
    required: [true, 'Nome do tipo de documento é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode exceder 100 caracteres']
  },
  codigo: {
    type: String,
    required: [true, 'Código do tipo de documento é obrigatório'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [20, 'Código não pode exceder 20 caracteres']
  },
  descricao: {
    type: String,
    trim: true,
    maxlength: [500, 'Descrição não pode exceder 500 caracteres']
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

// Índices para melhor performance
TipoDocumentoSchema.index({ codigo: 1 });
TipoDocumentoSchema.index({ nome: 1 });
TipoDocumentoSchema.index({ ativo: 1 });

export const TipoDocumento = model<ITipoDocumento>('TipoDocumento', TipoDocumentoSchema);
