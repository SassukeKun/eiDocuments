import { z } from 'zod';
import mongoose from 'mongoose';

// Schema para ObjectId do MongoDB
const objectIdSchema = z.string().refine(
  (value) => mongoose.Types.ObjectId.isValid(value),
  { message: 'ID inválido' }
);

// Schema para validação de Departamento
export const departamentoSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome não pode ter mais de 100 caracteres')
    .trim(),
  
  descricao: z.string()
    .max(500, 'Descrição não pode ter mais de 500 caracteres')
    .optional(),
  
  sigla: z.string()
    .min(2, 'Sigla deve ter pelo menos 2 caracteres')
    .max(10, 'Sigla não pode ter mais de 10 caracteres')
    .optional(),
  
  ativo: z.boolean().default(true)
});

// Schema para validação de Tipo de Documento
export const tipoDocumentoSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome não pode ter mais de 100 caracteres')
    .trim(),
  
  descricao: z.string()
    .max(500, 'Descrição não pode ter mais de 500 caracteres')
    .optional(),
  
  icone: z.string()
    .max(50, 'Ícone não pode ter mais de 50 caracteres')
    .optional(),
  
  ativo: z.boolean().default(true)
});

// Schema para validação de Categoria de Documento
export const categoriaDocumentoSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome não pode ter mais de 100 caracteres')
    .trim(),
  
  descricao: z.string()
    .max(500, 'Descrição não pode ter mais de 500 caracteres')
    .optional(),
  
  departamento: objectIdSchema,
  
  cor: z.string()
    .regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato hexadecimal (#RRGGBB)')
    .optional(),
  
  ativo: z.boolean().default(true)
});

// Schema para validação de Documento
export const documentoSchema = z.object({
  titulo: z.string()
    .min(1, 'Título é obrigatório')
    .max(200, 'Título não pode ter mais de 200 caracteres')
    .trim(),
  
  descricao: z.string()
    .max(1000, 'Descrição não pode ter mais de 1000 caracteres')
    .optional(),
  
  departamento: objectIdSchema,
  tipoDocumento: objectIdSchema,
  categoriaDocumento: objectIdSchema,
  
  // Datas (validação condicional será feita no middleware)
  dataRecebimento: z.date().optional(),
  dataEnvio: z.date().optional(),
  dataCriacao: z.date().default(() => new Date()),
  dataVencimento: z.date().optional(),
  
  status: z.enum(['rascunho', 'pendente', 'aprovado', 'rejeitado', 'arquivado'])
    .default('rascunho'),
  
  numeroProtocolo: z.string()
    .max(50, 'Número de protocolo não pode ter mais de 50 caracteres')
    .optional(),
  
  numeroReferencia: z.string()
    .max(50, 'Número de referência não pode ter mais de 50 caracteres')
    .optional(),
  
  assunto: z.string()
    .max(200, 'Assunto não pode ter mais de 200 caracteres')
    .optional(),
  
  remetente: z.string()
    .max(100, 'Remetente não pode ter mais de 100 caracteres')
    .optional(),
  
  destinatario: z.string()
    .max(100, 'Destinatário não pode ter mais de 100 caracteres')
    .optional(),
  
  tags: z.array(z.string().max(30, 'Tag não pode ter mais de 30 caracteres'))
    .default([])
    .refine(tags => tags.length <= 10, 'Máximo de 10 tags permitidas')
}).refine(
  (data) => {
    // Validação: não pode ter data de recebimento e envio ao mesmo tempo
    return !(data.dataRecebimento && data.dataEnvio);
  },
  {
    message: 'Um documento não pode ter data de recebimento e envio simultaneamente',
    path: ['dataRecebimento', 'dataEnvio']
  }
);

// Schema para upload de arquivo
export const uploadFileSchema = z.object({
  id: objectIdSchema
});

// Schema para query parameters
export const queryParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  // Filtros específicos para documentos
  departamento: objectIdSchema.optional(),
  tipoDocumento: objectIdSchema.optional(),
  categoriaDocumento: objectIdSchema.optional(),
  status: z.enum(['rascunho', 'pendente', 'aprovado', 'rejeitado', 'arquivado']).optional(),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional()
});

// Tipos derivados dos schemas
export type DepartamentoInput = z.infer<typeof departamentoSchema>;
export type TipoDocumentoInput = z.infer<typeof tipoDocumentoSchema>;
export type CategoriaDocumentoInput = z.infer<typeof categoriaDocumentoSchema>;
export type DocumentoInput = z.infer<typeof documentoSchema>;
export type QueryParamsInput = z.infer<typeof queryParamsSchema>;
