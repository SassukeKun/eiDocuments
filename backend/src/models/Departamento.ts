import { Schema, model, Document } from 'mongoose';

export interface IDepartamento extends Document {
  nome: string;
  codigo: string;
  descricao?: string;
  ativo: boolean;
  dataCreacao: Date;
  dataAtualizacao: Date;
}

const DepartamentoSchema = new Schema<IDepartamento>({
  nome: {
    type: String,
    required: [true, 'Nome do departamento é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode exceder 100 caracteres']
  },
  codigo: {
    type: String,
    required: [true, 'Código do departamento é obrigatório'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [10, 'Código não pode exceder 10 caracteres']
  },
  descricao: {
    type: String,
    trim: true,
    maxlength: [500, 'Descrição não pode exceder 500 caracteres']
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
DepartamentoSchema.index({ codigo: 1 });
DepartamentoSchema.index({ nome: 1 });
DepartamentoSchema.index({ ativo: 1 });

export const Departamento = model<IDepartamento>('Departamento', DepartamentoSchema);
