"use client";

import React, { useState, useEffect } from 'react';
import { CreateTipoDocumento, UpdateTipoDocumento, TipoDocumento } from '@/types';
import { useTipos } from '@/hooks/useTipos';

interface TipoFormProps {
  tipo?: TipoDocumento | null;
  onSuccess?: () => void;
}

const TipoForm: React.FC<TipoFormProps> = ({
  tipo,
  onSuccess
}) => {
  const { criar, atualizar, verificarCodigo } = useTipos();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<CreateTipoDocumento>({
    nome: '',
    codigo: '',
    descricao: '',
    ativo: true
  });

  const isEditing = !!tipo;

  useEffect(() => {
    if (tipo) {
      // Modo edição - preencher formulário
      setFormData({
        nome: tipo.nome,
        codigo: tipo.codigo,
        descricao: tipo.descricao || '',
        ativo: tipo.ativo
      });
    } else {
      // Modo criação - limpar formulário
      setFormData({
        nome: '',
        codigo: '',
        descricao: '',
        ativo: true
      });
    }
    setErrors({});
  }, [tipo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'Código é obrigatório';
    } else if (!/^[A-Z0-9_-]+$/.test(formData.codigo)) {
      newErrors.codigo = 'Código deve conter apenas letras maiúsculas, números, hífen ou underscore';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkCodigoExists = async (codigo: string): Promise<boolean> => {
    if (!codigo.trim()) return false;
    
    try {
      const exists = await verificarCodigo(codigo, tipo?._id);
      return exists;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Verificar se código já existe
    const codigoExists = await checkCodigoExists(formData.codigo);
    if (codigoExists) {
      setErrors(prev => ({ ...prev, codigo: 'Este código já está em uso' }));
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing) {
        await atualizar(tipo._id, formData as UpdateTipoDocumento);
      } else {
        await criar(formData);
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar tipo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome */}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Nome *
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border ${errors.nome ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
            placeholder="Digite o nome do tipo"
            disabled={loading}
          />
          {errors.nome && (
            <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
          )}
        </div>

        {/* Código */}
        <div>
          <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
            Código *
          </label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            value={formData.codigo}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border ${errors.codigo ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm uppercase`}
            placeholder="PDF_DOC"
            disabled={loading}
            style={{ textTransform: 'uppercase' }}
          />
          {errors.codigo && (
            <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Use apenas letras maiúsculas, números, hífen ou underscore
          </p>
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Descrição opcional do tipo de documento"
            disabled={loading}
          />
        </div>

        {/* Ativo */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="ativo"
              checked={formData.ativo}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              disabled={loading}
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Tipo ativo
            </span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Tipos inativos não aparecerão nas opções de seleção
          </p>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </form>
  );
};

export default TipoForm;
