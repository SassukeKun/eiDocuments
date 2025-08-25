import { Schema, model, Document } from 'mongoose';

export interface IUsuario extends Document {
  nome: string;
  email: string;
  senha: string;
  ativo: boolean;
  dataCreacao: Date;
  dataAtualizacao: Date;
}

const UsuarioSchema = new Schema<IUsuario>({
  nome: {
    type: String,
    required: [true, 'Nome do usuário é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode exceder 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email do usuário é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email deve ter um formato válido']
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres']
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: {
    createdAt: 'dataCreacao',
    updatedAt: 'dataAtualizacao'
  }
});

// Índices para melhor performance
UsuarioSchema.index({ email: 1 });
UsuarioSchema.index({ ativo: 1 });

export const Usuario = model<IUsuario>('Usuario', UsuarioSchema);
