import multer from 'multer';
import type { Request } from 'express';
import cloudinaryService from '../services/cloudinaryService';

// Configuração do multer para armazenar em memória
const storage = multer.memoryStorage();

// Filtro para tipos de arquivo permitidos
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Tipos de arquivo permitidos para documentos
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Apenas PDFs, documentos do Office, imagens e arquivos de texto são aceitos.'));
  }
};

// Configuração do multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
  },
});

// Middleware personalizado para upload para o Cloudinary
export const uploadToCloudinary = async (
  file: Express.Multer.File,
  departamento: string,
  numeroDocumento: string
) => {
  try {
    // Converte o buffer para base64 para upload
    const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    
    // Faz upload para o Cloudinary
    const result = await cloudinaryService.uploadDocumento(
      fileStr,
      departamento,
      numeroDocumento
    );

    return {
      cloudinaryId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      format: result.format,
      bytes: result.bytes,
      resourceType: result.resource_type,
      originalName: file.originalname,
      uploadedAt: new Date()
    };
  } catch (error) {
    console.error('Erro no upload para Cloudinary:', error);
    throw new Error('Falha no upload do arquivo para o Cloudinary');
  }
};

// Middleware para validar se o arquivo foi enviado
export const validateFileUpload = (req: Request, res: any, next: any) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'Nenhum arquivo foi enviado'
    });
  }
  next();
};
