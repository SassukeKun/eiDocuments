import mongoose, { Document, Schema } from 'mongoose';

// Interface para o documento
export interface IDocumento extends Document {
  titulo: string;
  descricao?: string;
  departamento: mongoose.Types.ObjectId;
  tipoDocumento: mongoose.Types.ObjectId;
  categoriaDocumento: mongoose.Types.ObjectId;
  
  // Datas importantes
  dataRecebimento?: Date;
  dataEnvio?: Date;
  dataCriacao: Date;
  dataVencimento?: Date;
  
  // Status do documento
  status: 'rascunho' | 'pendente' | 'aprovado' | 'rejeitado' | 'arquivado';
  
  // Informações do arquivo no Cloudinary
  arquivo: {
    cloudinaryId: string;        // ID único no Cloudinary
    url: string;                 // URL pública do documento
    secureUrl: string;           // URL segura (HTTPS)
    originalName: string;        // Nome original do arquivo
    format: string;              // Formato do arquivo (pdf, doc, etc.)
    size: number;                // Tamanho em bytes
    uploadedAt: Date;            // Data do upload
  };
  
  // Metadados adicionais
  numeroProtocolo?: string;      // Número de protocolo interno
  numeroReferencia?: string;     // Número de referência externa
  assunto?: string;              // Assunto principal do documento
  remetente?: string;            // Quem enviou (se recebido)
  destinatario?: string;         // Para quem foi enviado (se enviado)
  
  // Tags para facilitar busca
  tags: string[];
  
  // Informações de controle
  criadoPor: mongoose.Types.ObjectId;  // Usuário que criou o registro
  atualizadoPor?: mongoose.Types.ObjectId;  // Último usuário que atualizou
  versao: number;                // Controle de versão
  
  // Timestamps automáticos
  createdAt: Date;
  updatedAt: Date;
}

// Schema do Mongoose
const documentoSchema = new Schema<IDocumento>({
  titulo: {
    type: String,
    required: [true, 'O título é obrigatório'],
    trim: true,
    maxLength: [200, 'O título não pode ter mais de 200 caracteres']
  },
  
  descricao: {
    type: String,
    trim: true,
    maxLength: [1000, 'A descrição não pode ter mais de 1000 caracteres']
  },
  
  departamento: {
    type: Schema.Types.ObjectId,
    ref: 'Departamento',
    required: [true, 'O departamento é obrigatório']
  },
  
  tipoDocumento: {
    type: Schema.Types.ObjectId,
    ref: 'TipoDocumento',
    required: [true, 'O tipo de documento é obrigatório']
  },
  
  categoriaDocumento: {
    type: Schema.Types.ObjectId,
    ref: 'CategoriaDocumento',
    required: [true, 'A categoria do documento é obrigatória']
  },
  
  // Datas
  dataRecebimento: {
    type: Date,
    validate: {
      validator: function(this: IDocumento, value: Date) {
        // Se tem data de recebimento, não pode ter data de envio
        return !value || !this.dataEnvio;
      },
      message: 'Um documento não pode ter data de recebimento e envio simultaneamente'
    }
  },
  
  dataEnvio: {
    type: Date,
    validate: {
      validator: function(this: IDocumento, value: Date) {
        // Se tem data de envio, não pode ter data de recebimento
        return !value || !this.dataRecebimento;
      },
      message: 'Um documento não pode ter data de envio e recebimento simultaneamente'
    }
  },
  
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  
  dataVencimento: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        // Data de vencimento deve ser no futuro
        return !value || value > new Date();
      },
      message: 'A data de vencimento deve ser no futuro'
    }
  },
  
  // Status
  status: {
    type: String,
    enum: {
      values: ['rascunho', 'pendente', 'aprovado', 'rejeitado', 'arquivado'],
      message: 'Status deve ser: rascunho, pendente, aprovado, rejeitado ou arquivado'
    },
    default: 'rascunho'
  },
  
  // Arquivo no Cloudinary
  arquivo: {
    cloudinaryId: {
      type: String,
      required: [true, 'ID do Cloudinary é obrigatório']
    },
    url: {
      type: String,
      required: [true, 'URL do arquivo é obrigatória']
    },
    secureUrl: {
      type: String,
      required: [true, 'URL segura do arquivo é obrigatória']
    },
    originalName: {
      type: String,
      required: [true, 'Nome original do arquivo é obrigatório']
    },
    format: {
      type: String,
      required: [true, 'Formato do arquivo é obrigatório'],
      lowercase: true
    },
    size: {
      type: Number,
      required: [true, 'Tamanho do arquivo é obrigatório'],
      min: [1, 'Tamanho do arquivo deve ser maior que 0']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  
  // Metadados
  numeroProtocolo: {
    type: String,
    trim: true,
    unique: true,
    sparse: true // Permite valores null únicos
  },
  
  numeroReferencia: {
    type: String,
    trim: true
  },
  
  assunto: {
    type: String,
    trim: true,
    maxLength: [300, 'O assunto não pode ter mais de 300 caracteres']
  },
  
  remetente: {
    type: String,
    trim: true,
    maxLength: [200, 'O remetente não pode ter mais de 200 caracteres']
  },
  
  destinatario: {
    type: String,
    trim: true,
    maxLength: [200, 'O destinatário não pode ter mais de 200 caracteres']
  },
  
  // Tags
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Controle
  criadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'Usuário criador é obrigatório']
  },
  
  atualizadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  
  versao: {
    type: Number,
    default: 1
  }
  
}, {
  timestamps: true,
  versionKey: false
});

// Índices para melhorar performance das consultas
documentoSchema.index({ departamento: 1 });
documentoSchema.index({ tipoDocumento: 1 });
documentoSchema.index({ categoriaDocumento: 1 });
documentoSchema.index({ status: 1 });
documentoSchema.index({ dataRecebimento: -1 });
documentoSchema.index({ dataEnvio: -1 });
documentoSchema.index({ dataCriacao: -1 });
documentoSchema.index({ tags: 1 });
documentoSchema.index({ numeroProtocolo: 1 });
documentoSchema.index({ 'arquivo.cloudinaryId': 1 });

// Índice composto para busca por departamento e status
documentoSchema.index({ departamento: 1, status: 1 });

// Índice de texto para busca textual
documentoSchema.index({
  titulo: 'text',
  descricao: 'text',
  assunto: 'text',
  tags: 'text'
});

// Middleware para atualizar versão e usuário
documentoSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.versao += 1;
  }
  next();
});

// Método para verificar se é documento recebido ou enviado
documentoSchema.methods.getTipoMovimento = function() {
  if (this.dataRecebimento) return 'recebido';
  if (this.dataEnvio) return 'enviado';
  return 'interno';
};

// Método para verificar se está próximo do vencimento (7 dias)
documentoSchema.methods.isProximoVencimento = function() {
  if (!this.dataVencimento) return false;
  
  const hoje = new Date();
  const seteDiasFrente = new Date(hoje.getTime() + (7 * 24 * 60 * 60 * 1000));
  
  return this.dataVencimento <= seteDiasFrente && this.dataVencimento > hoje;
};

// Método para verificar se está vencido
documentoSchema.methods.isVencido = function() {
  if (!this.dataVencimento) return false;
  return this.dataVencimento < new Date();
};

// Virtual para URL do arquivo (sempre retorna a URL segura)
documentoSchema.virtual('urlArquivo').get(function() {
  return this.arquivo?.secureUrl || this.arquivo?.url;
});

// Garantir que virtuals sejam incluídos na serialização JSON
documentoSchema.set('toJSON', { virtuals: true });
documentoSchema.set('toObject', { virtuals: true });

export const Documento = mongoose.model<IDocumento>('Documento', documentoSchema);
export default Documento;
