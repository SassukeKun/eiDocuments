import cloudinary from '../config/cloudinary';
import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

interface UploadOptions {
  folder?: string;
  public_id?: string;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  format?: string;
}

interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  bytes: number;
  format: string;
  resource_type: string;
  created_at: string;
}

class CloudinaryService {
  /**
   * Upload um arquivo para o Cloudinary
   * @param filePath Caminho do arquivo ou buffer
   * @param options Opções do upload
   * @returns Resultado do upload
   */
  async uploadFile(
    filePath: string | Buffer, 
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      const defaultOptions: UploadOptions = {
        folder: 'eidocuments',
        resource_type: 'auto',
        ...options,
      };

      const result: UploadApiResponse = await cloudinary.uploader.upload(
        filePath as string,
        defaultOptions
      );

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        bytes: result.bytes,
        format: result.format,
        resource_type: result.resource_type,
        created_at: result.created_at,
      };
    } catch (error) {
      console.error('Erro no upload para Cloudinary:', error);
      throw new Error('Falha no upload do arquivo');
    }
  }

  /**
   * Upload um documento específico
   * @param file Arquivo do documento
   * @param departamento Nome do departamento
   * @param numero Número do documento
   * @returns Resultado do upload
   */
  async uploadDocumento(
    file: string | Buffer,
    departamento: string,
    numero: string
  ): Promise<UploadResult> {
    const publicId = `${departamento.toLowerCase().replace(/\s+/g, '_')}_doc_${numero}`;
    
    return this.uploadFile(file, {
      folder: `eidocuments/documentos/${departamento.toLowerCase().replace(/\s+/g, '_')}`,
      public_id: publicId,
      resource_type: 'auto',
    });
  }

  /**
   * Deleta um arquivo do Cloudinary
   * @param publicId ID público do arquivo
   * @param resourceType Tipo de recurso
   * @returns Resultado da exclusão
   */
  async deleteFile(publicId: string, resourceType: string = 'auto'): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return result;
    } catch (error) {
      console.error('Erro ao deletar arquivo do Cloudinary:', error);
      throw new Error('Falha ao deletar arquivo');
    }
  }

  /**
   * Gera uma URL assinada para acesso seguro
   * @param publicId ID público do arquivo
   * @param options Opções da transformação
   * @returns URL assinada
   */
  generateSecureUrl(publicId: string, options: any = {}): string {
    return cloudinary.url(publicId, {
      sign_url: true,
      type: 'authenticated',
      ...options,
    });
  }

  /**
   * Gera uma URL com transformações (para PDFs, etc.)
   * @param publicId ID público do arquivo
   * @param transformations Transformações a aplicar
   * @returns URL com transformações
   */
  generateTransformedUrl(publicId: string, transformations: any = {}): string {
    return cloudinary.url(publicId, {
      ...transformations,
    });
  }
}

export default new CloudinaryService();
