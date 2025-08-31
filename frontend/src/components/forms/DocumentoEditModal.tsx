"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Upload } from 'lucide-react';
import { Documento } from '@/types';

interface DocumentoEditModalProps {
  documento: Documento | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (documento: Documento, formData: DocumentoEditData) => Promise<void>;
}

interface DocumentoEditData {
  titulo: string;
  descricao: string;
  categoria: string;
  tipo: string;
  tipoMovimento: 'enviado' | 'recebido' | 'interno';
  remetente: string;
  destinatario: string;
  responsavel: string;
  dataEnvio: string;
  dataRecebimento: string;
  tags: string[];
  status: string;
  novoArquivo?: File;
}

const DocumentoEditModal: React.FC<DocumentoEditModalProps> = ({
  documento,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<DocumentoEditData>({
    titulo: '',
    descricao: '',
    categoria: '',
    tipo: '',
    tipoMovimento: 'interno',
    remetente: '',
    destinatario: '',
    responsavel: '',
    dataEnvio: '',
    dataRecebimento: '',
    tags: [],
    status: 'ativo'
  });
  
  const [loading, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  // Resetar form quando o documento muda
  useEffect(() => {
    if (documento) {
      setFormData({
        titulo: documento.titulo || '',
        descricao: documento.descricao || '',
        categoria: documento.categoria?.nome || '',
        tipo: documento.tipo?.nome || '',
        tipoMovimento: documento.tipoMovimento || 'interno',
        remetente: documento.remetente || '',
        destinatario: documento.destinatario || '',
        responsavel: documento.responsavel || '',
        dataEnvio: documento.dataEnvio ? documento.dataEnvio.split('T')[0] : '',
        dataRecebimento: documento.dataRecebimento ? documento.dataRecebimento.split('T')[0] : '',
        tags: documento.tags || [],
        status: documento.status || 'ativo'
      });
      setTagsInput((documento.tags || []).join(', '));
    }
  }, [documento]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        novoArquivo: file
      }));
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagsInput(value);
    
    // Converter string de tags em array
    const tagsArray = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    setFormData(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documento) return;

    // Validações básicas
    if (!formData.titulo.trim()) {
      alert('Título é obrigatório');
      return;
    }

    if (!formData.categoria.trim()) {
      alert('Categoria é obrigatória');
      return;
    }

    if (!formData.tipo.trim()) {
      alert('Tipo é obrigatório');
      return;
    }

    if (formData.tipoMovimento === 'interno' && !formData.responsavel.trim()) {
      alert('Responsável é obrigatório para documentos internos');
      return;
    }

    setSaving(true);
    try {
      await onSave(documento, formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      alert('Erro ao salvar documento. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !documento) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Editar Documento</h2>
              <p className="text-sm text-gray-500">{documento.titulo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coluna esquerda */}
            <div className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Categoria e Tipo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <input
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <input
                    type="text"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Tipo de Movimento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Movimento *
                </label>
                <select
                  name="tipoMovimento"
                  value={formData.tipoMovimento}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="recebido">Recebido</option>
                  <option value="enviado">Enviado</option>
                  <option value="interno">Interno</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ativo">Ativo</option>
                  <option value="arquivado">Arquivado</option>
                  <option value="rascunho">Rascunho</option>
                </select>
              </div>
            </div>

            {/* Coluna direita */}
            <div className="space-y-4">
              {/* Campos condicionais baseados no tipo de movimento */}
              {formData.tipoMovimento === 'recebido' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remetente
                  </label>
                  <input
                    type="text"
                    name="remetente"
                    value={formData.remetente}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {formData.tipoMovimento === 'enviado' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destinatário
                  </label>
                  <input
                    type="text"
                    name="destinatario"
                    value={formData.destinatario}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {formData.tipoMovimento === 'interno' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsável *
                  </label>
                  <input
                    type="text"
                    name="responsavel"
                    value={formData.responsavel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={formData.tipoMovimento === 'interno'}
                  />
                </div>
              )}

              {/* Datas */}
              {formData.tipoMovimento === 'enviado' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Envio
                  </label>
                  <input
                    type="date"
                    name="dataEnvio"
                    value={formData.dataEnvio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {formData.tipoMovimento === 'recebido' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Recebimento
                  </label>
                  <input
                    type="date"
                    name="dataRecebimento"
                    value={formData.dataRecebimento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={handleTagsChange}
                  placeholder="Ex: urgente, relatório, mensal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Novo Arquivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Substituir Arquivo (opcional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <div className="text-sm text-gray-600 mb-2">
                      Clique para selecionar um novo arquivo
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="novo-arquivo"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="novo-arquivo"
                      className="cursor-pointer px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Escolher Arquivo
                    </label>
                    {formData.novoArquivo && (
                      <div className="mt-2 text-sm text-gray-600">
                        Arquivo selecionado: {formData.novoArquivo.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentoEditModal;


