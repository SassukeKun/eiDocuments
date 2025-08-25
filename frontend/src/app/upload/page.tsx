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
  Download
} from "lucide-react";
import ModernButton from "@/components/ui/ModernButton";
import ModernInput from "@/components/ui/ModernInput";
import { useNotification } from "@/hooks/useNotification";
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

interface Department {
  id: string;
  name: string;
  color: string;
}

const UploadPage = () => {
  const { success, showError } = useNotification();
  const router = useRouter();
  
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [description, setDescription] = useState("");
  const [responsible, setResponsible] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const departments: Department[] = [
    { id: "rh", name: "Recursos Humanos", color: "bg-blue-500" },
    { id: "financeiro", name: "Financeiro", color: "bg-green-500" },
    { id: "ti", name: "Tecnologia da Informação", color: "bg-purple-500" },
    { id: "marketing", name: "Marketing", color: "bg-pink-500" },
    { id: "operacoes", name: "Operações", color: "bg-orange-500" },
    { id: "juridico", name: "Jurídico", color: "bg-red-500" }
  ];

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
        showError("Arquivo inválido", validation.error);
      }
    });

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
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
      showError("Erro", "Selecione pelo menos um arquivo para upload");
      return;
    }

    if (!selectedDepartment) {
      showError("Erro", "Selecione um departamento");
      return;
    }

    setIsUploading(true);

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

    setIsUploading(false);
    success("Upload concluído!", `${files.length} arquivo(s) enviado(s) com sucesso`);
    
    // Redirecionar para dashboard após 2 segundos
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  const isFormValid = files.length > 0 && selectedDepartment && !isUploading;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">eiDocuments</h1>
                <p className="text-sm text-gray-600">Upload de Documentos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ModernButton
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Voltar ao Dashboard
              </ModernButton>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Área de Upload */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Adicionar Novos Documentos
            </h2>
            <p className="text-gray-600">
              Arraste e solte arquivos ou clique para selecionar
            </p>
          </div>

          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
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
              <ModernButton variant="primary" className="cursor-pointer">
                Selecionar Arquivos
              </ModernButton>
            </label>
            
            <p className="text-sm text-gray-500 mt-4">
              Tipos suportados: PDF, Word, Excel, PowerPoint, Imagens, Texto
            </p>
            <p className="text-sm text-gray-500">
              Tamanho máximo: 50MB por arquivo
            </p>
                    </div>
        </div>

        {/* Lista de Arquivos */}
        {files.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Arquivos Selecionados ({files.length})
            </h3>
            
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getFileIcon(file.type)}</div>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(file.size)} • {file.type}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {file.status === 'uploading' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{file.progress}%</span>
                      </div>
                    )}
                    
                    {file.status === 'success' && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Enviado</span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulário de Metadados */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Informações do Documento
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Departamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departamento *
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione um departamento</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Responsável */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsável
              </label>
              <ModernInput
                placeholder="Nome do responsável"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                icon={<User className="h-5 w-5 text-gray-400" />}
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o conteúdo do documento..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex items-center space-x-2 mb-3">
              <ModernInput
                placeholder="Adicionar tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                icon={<Tag className="h-5 w-5 text-gray-400" />}
                className="flex-1"
              />
              <ModernButton
                variant="outline"
                onClick={addTag}
                disabled={!newTag.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </ModernButton>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Botão de Upload */}
        <div className="text-center">
          <ModernButton
            variant="primary"
            size="lg"
            onClick={handleUpload}
            disabled={!isFormValid}
            className="px-12 py-4 text-lg"
          >
            {isUploading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Enviando...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Enviar {files.length} Arquivo(s)</span>
              </div>
            )}
          </ModernButton>
          
          {!isFormValid && (
            <p className="text-sm text-gray-500 mt-3">
              {files.length === 0 && "Selecione pelo menos um arquivo • "}
              {!selectedDepartment && "Selecione um departamento"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
