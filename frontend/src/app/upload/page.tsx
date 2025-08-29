"use client";

import React, { useState, useCallback } from "react";
import { 
  Upload, 
  FileText, 
  X, 
  Plus, 
  Tag, 
  Folder, 
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Eye,
  Download,
  Building2,
  Save
} from "lucide-react";
import UserLayout from "@/components/ui/UserLayout";
import PageHeader from "@/components/ui/PageHeader";
import { useToastContext } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

interface DocumentForm {
  titulo: string;
  descricao: string;
  categoria: string;
  tipoMovimento: 'recebido' | 'enviado' | 'interno';
  remetente: string;
  destinatario: string;
  responsavel: string;
  dataEnvio: string;
  dataRecebimento: string;
  tags: string[];
  ativo: boolean;
}

const UploadPage = () => {
  const { success, error } = useToastContext();
  const router = useRouter();
  
  // TODO: Obter departamento do usuário logado do contexto de autenticação
  const userDepartment = "Recursos Humanos"; // Simular departamento do usuário
  
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<DocumentForm>({
    titulo: '',
    descricao: '',
    categoria: '',
    tipoMovimento: 'interno',
    remetente: '',
    destinatario: '',
    responsavel: '',
    dataEnvio: '',
    dataRecebimento: '',
    tags: [],
    ativo: true
  });

  // Não é mais necessário carregar departamentos pois o usuário já tem um departamento fixo

  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain'
  ];

  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    if (!allowedFileTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: "Tipo de arquivo não suportado. Use PDF, Word, Excel, PowerPoint, imagens ou texto." 
      };
    }
    
    if (file.size > maxFileSize) {
      return { 
        isValid: false, 
        error: "Arquivo muito grande. Tamanho máximo: 50MB" 
      };
    }
    
    return { isValid: true };
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles: UploadFile[] = [];
    
    newFiles.forEach(file => {
      const validation = validateFile(file);
      
      if (validation.isValid) {
        const uploadFile: UploadFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'uploading',
          progress: 0
        };

        // Criar preview para imagens
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            uploadFile.preview = e.target?.result as string;
            setFiles(prev => [...prev]);
          };
          reader.readAsDataURL(file);
        }

        validFiles.push(uploadFile);
      } else {
        error(validation.error || "Arquivo inválido");
      }
    });

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      // Auto-preencher título se vazio e só tiver um arquivo
      if (!formData.titulo && validFiles.length === 1) {
        const fileName = validFiles[0].name.split('.')[0];
        setFormData(prev => ({ ...prev, titulo: fileName }));
      }
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleInputChange = (field: keyof DocumentForm, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Lógica especial para mudança de tipo de movimento
      if (field === 'tipoMovimento') {
        // Limpar campos específicos do tipo anterior
        newData.remetente = '';
        newData.destinatario = '';
        newData.responsavel = '';
        newData.dataEnvio = '';
        newData.dataRecebimento = '';
        
        // Auto-preencher data atual para tipos que requerem data
        const today = new Date().toISOString().split('T')[0];
        if (value === 'enviado') {
          newData.dataEnvio = today;
        } else if (value === 'recebido') {
          newData.dataRecebimento = today;
        }
      }
      
      return newData;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📈';
    if (type.includes('text')) return '📃';
    return '📎';
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      error("Selecione pelo menos um arquivo para upload");
      return;
    }

    if (!formData.titulo.trim()) {
      error("Digite um título para o documento");
      return;
    }

    // Validações específicas por tipo de movimento
    if (formData.tipoMovimento === 'enviado') {
      if (!formData.destinatario?.trim()) {
        error("Destinatário é obrigatório para documentos enviados");
        return;
      }
      if (!formData.dataEnvio) {
        error("Data de envio é obrigatória para documentos enviados");
        return;
      }
    } else if (formData.tipoMovimento === 'recebido') {
      if (!formData.remetente?.trim()) {
        error("Remetente é obrigatório para documentos recebidos");
        return;
      }
      if (!formData.dataRecebimento) {
        error("Data de recebimento é obrigatória para documentos recebidos");
        return;
      }
    } else if (formData.tipoMovimento === 'interno') {
      if (!formData.responsavel?.trim()) {
        error("Responsável é obrigatório para documentos internos");
        return;
      }
    }

    setIsUploading(true);

    try {
      // Simular upload com progresso
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Simular progresso
        for (let progress = 0; progress <= 100; progress += 10) {
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, progress } : f
          ));
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Marcar como sucesso
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'success' as const, progress: 100 } : f
        ));
      }

      success(`Upload concluído! ${files.length} arquivo(s) enviado(s) com sucesso`);
      
      // Redirecionar para meus documentos após 2 segundos
      setTimeout(() => {
        router.push('/user/meus-documentos');
      }, 2000);
    } catch (err) {
      error("Erro durante o upload. Tente novamente.");
      setFiles(prev => prev.map(f => ({ ...f, status: 'error' as const })));
    } finally {
      setIsUploading(false);
    }
  };

  const isFormValid = () => {
    if (files.length === 0 || !formData.titulo.trim() || isUploading) {
      return false;
    }
    
    // Validações específicas por tipo de movimento
    if (formData.tipoMovimento === 'enviado') {
      return !!(formData.destinatario?.trim() && formData.dataEnvio);
    } else if (formData.tipoMovimento === 'recebido') {
      return !!(formData.remetente?.trim() && formData.dataRecebimento);
    } else if (formData.tipoMovimento === 'interno') {
      return !!(formData.responsavel?.trim());
    }
    
    return true;
  };

  return (
    <UserLayout>
      <div>
        <PageHeader
          title="Upload de Documentos"
          subtitle="Adicione novos documentos ao sistema"
          showAdd={false}
          showExport={false}
          showSearch={false}
          showFilter={false}
        />

        {/* Área de Upload de Arquivos */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecionar Arquivos</h3>
          
          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragOver ? 'Solte os arquivos aqui' : 'Arraste arquivos aqui'}
            </p>
            <p className="text-gray-600 mb-4">
              ou clique para selecionar arquivos
            </p>
            
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt"
              className="hidden"
              id="file-input"
            />
            
            <label htmlFor="file-input">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Selecionar Arquivos
              </button>
            </label>
            
            <p className="text-sm text-gray-500 mt-4">
              Tipos suportados: PDF, Word, Excel, PowerPoint, Imagens, Texto • Máximo: 50MB
            </p>
          </div>
        </div>

        {/* Lista de Arquivos Selecionados */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Arquivos Selecionados ({files.length})
            </h3>
            
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-xl">{getFileIcon(file.type)}</div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                      <p className="text-xs text-gray-600">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {file.status === 'uploading' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{file.progress}%</span>
                      </div>
                    )}
                    
                    {file.status === 'success' && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">Enviado</span>
                      </div>
                    )}
                    
                    {file.status === 'error' && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">Erro</span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulário de Metadados */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Informações do Documento
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Título */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do Documento *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite o título do documento"
                required
              />
            </div>

            {/* Departamento (somente leitura) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departamento
              </label>
              <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-700">{userDepartment}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Departamento do usuário logado</p>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione uma categoria</option>
                {/* TODO: Carregar categorias do departamento do usuário */}
              </select>
              <p className="text-xs text-gray-500 mt-1">Categorias disponíveis no seu departamento</p>
            </div>

            {/* Tipo de Movimento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Movimento
              </label>
              <select
                value={formData.tipoMovimento}
                onChange={(e) => handleInputChange('tipoMovimento', e.target.value as 'recebido' | 'enviado' | 'interno')}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="interno">Interno</option>
                <option value="recebido">Recebido</option>
                <option value="enviado">Enviado</option>
              </select>
            </div>

            {/* Campos condicionais baseados no tipo de movimento */}
            {formData.tipoMovimento === 'enviado' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destinatário *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.destinatario}
                      onChange={(e) => handleInputChange('destinatario', e.target.value)}
                      className="block w-full pl-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nome do destinatário"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Envio *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.dataEnvio}
                      onChange={(e) => handleInputChange('dataEnvio', e.target.value)}
                      className="block w-full pl-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.tipoMovimento === 'recebido' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remetente *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.remetente}
                      onChange={(e) => handleInputChange('remetente', e.target.value)}
                      className="block w-full pl-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nome do remetente"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Recebimento *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.dataRecebimento}
                      onChange={(e) => handleInputChange('dataRecebimento', e.target.value)}
                      className="block w-full pl-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.tipoMovimento === 'interno' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsável *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.responsavel}
                    onChange={(e) => handleInputChange('responsavel', e.target.value)}
                    className="block w-full pl-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nome do responsável pelo documento"
                    required
                  />
                </div>
              </div>
            )}

            {/* Descrição */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                placeholder="Descreva o conteúdo do documento..."
                rows={3}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex-1 relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Adicionar tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleTagKeyPress}
                    className="block w-full pl-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!newTag.trim()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleUpload}
            disabled={!isFormValid()}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span>Enviar {files.length > 0 ? `${files.length} Arquivo(s)` : 'Documento'}</span>
              </>
            )}
          </button>
        </div>

        {/* Mensagem de validação */}
        {!isFormValid() && (files.length > 0 || formData.titulo || formData.dataEnvio || formData.dataRecebimento || formData.remetente || formData.destinatario || formData.responsavel) && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Campos obrigatórios pendentes:</p>
                <ul className="list-disc list-inside space-y-1">
                  {files.length === 0 && <li>Selecione pelo menos um arquivo</li>}
                  {!formData.titulo.trim() && <li>Digite um título para o documento</li>}
                  {formData.tipoMovimento === 'enviado' && !formData.destinatario?.trim() && <li>Informe o destinatário</li>}
                  {formData.tipoMovimento === 'enviado' && !formData.dataEnvio && <li>Selecione a data de envio</li>}
                  {formData.tipoMovimento === 'recebido' && !formData.remetente?.trim() && <li>Informe o remetente</li>}
                  {formData.tipoMovimento === 'recebido' && !formData.dataRecebimento && <li>Selecione a data de recebimento</li>}
                  {formData.tipoMovimento === 'interno' && !formData.responsavel?.trim() && <li>Informe o responsável</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UploadPage;
