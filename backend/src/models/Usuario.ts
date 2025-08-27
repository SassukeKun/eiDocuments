import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUsuario extends Document {
  nome: string;
  email: string;
  senha: string;
  role: 'admin' | 'user';
  departamentoId?: Schema.Types.ObjectId;
  ativo: boolean;
  ultimoLogin?: Date;
  dataCreacao: Date;
  dataAtualizacao: Date;
  
  // Métodos
  compararSenha(senha: string): Promise<boolean>;
  hashSenha(): Promise<void>;
  toPublicJSON(): any;
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
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  departamentoId: {
    type: Schema.Types.ObjectId,
    ref: 'Departamento',
    required: false
  },
  ativo: {
    type: Boolean,
    default: true
  },
  ultimoLogin: {
    type: Date,
    required: false
  }
}, {
  timestamps: {
    createdAt: 'dataCreacao',
    updatedAt: 'dataAtualizacao'
  }
});

// Middleware para hash da senha antes de salvar
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const saltRounds = 12;
    this.senha = await bcrypt.hash(this.senha, saltRounds);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método para comparar senhas
UsuarioSchema.methods.compararSenha = async function (senha: string): Promise<boolean> {
  return bcrypt.compare(senha, this.senha);
};

// Método para fazer hash da senha
UsuarioSchema.methods.hashSenha = async function (): Promise<void> {
  const saltRounds = 12;
  this.senha = await bcrypt.hash(this.senha, saltRounds);
};

// Método para obter dados públicos do usuário (sem senha)
UsuarioSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.senha;
  return obj;
};

// Índices para melhor performance
UsuarioSchema.index({ email: 1 });
UsuarioSchema.index({ ativo: 1 });

export const Usuario = model<IUsuario>('Usuario', UsuarioSchema);
