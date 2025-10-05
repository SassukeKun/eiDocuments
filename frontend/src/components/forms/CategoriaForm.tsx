"use client";

import React, { useState, useEffect } from 'react';
import { CreateCategoriaDocumento, UpdateCategoriaDocumento, CategoriaDocumento } from '@/types';
import { useCategorias } from '@/hooks/useCategorias';
import { useDepartamentos } from '@/hooks/useDepartamentos';
import { useAuth } from '@/hooks/useAuth';

interface CategoriaFormProps {
  categoria?: CategoriaDocumento | null;
  onSuccess?: () => void;
}

const cores = [
  { value: '#3B82F6', label: 'Azul', class: 'bg-blue-500' },
  { value: '#10B981', label: 'Verde', class: 'bg-green-500' },
  { value: '#F59E0B', label: 'Amarelo', class: 'bg-yellow-500' },
  { value: '#EF4444', label: 'Vermelho', class: 'bg-red-500' },
  { value: '#8B5CF6', label: 'Roxo', class: 'bg-purple-500' },
  { value: '#EC4899', label: 'Rosa', class: 'bg-pink-500' },
  { value: '#6B7280', label: 'Cinza', class: 'bg-gray-500' },
  { value: '#059669', label: 'Verde Escuro', class: 'bg-emerald-600' },
];

const CategoriaForm: React.FC<CategoriaFormProps> = ({
  categoria,
  onSuccess
}) => {
  const { criar, atualizar, verificarCodigo } = useCategorias();
  const { obterParaSelect: obterDepartamentos } = useDepartamentos();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [departamentos, setDepartamentos] = useState<{ value: string; label: string }[]>([]);
  
  // Editor só pode criar/editar no seu departamento
  const isEditor = user?.role === 'editor';
  const userDepartmentId = typeof user?.departamento === 'string' 
    ? user.departamento 
    : user?.departamento?._id;
  
  const [formData, setFormData] = useState<CreateCategoriaDocumento>({
    nome: '',
    codigo: '',
    descricao: '',
    departamento: '',
    cor: cores[0].value,
    icone: '',
    ativo: true
  });

  const isEditing = !!categoria;

  useEffect(() => {
    // Carregar departamentos
    loadDepartamentos();
    
    if (categoria) {
      // Modo edição - preencher formulário
      setFormData({
        nome: categoria.nome,
        codigo: categoria.codigo,
        descricao: categoria.descricao || '',
        departamento: typeof categoria.departamento === 'string' ? categoria.departamento : categoria.departamento._id,
        cor: categoria.cor || cores[0].value,
        icone: categoria.icone || '',
        ativo: categoria.ativo
      });
    } else {
      // Modo criação - limpar formulário
      // Editor: pré-seleciona seu departamento automaticamente
      setFormData({
        nome: '',
        codigo: '',
        descricao: '',
        departamento: isEditor && userDepartmentId ? userDepartmentId : '',
        cor: cores[0].value,
        icone: '',
        ativo: true
      });
    }
    setErrors({});
  }, [categoria, isEditor, userDepartmentId]);

  const loadDepartamentos = async () => {
    try {
      const deps = await obterDepartamentos();
      setDepartamentos(deps);
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    }

    if (!formData.departamento) {
      newErrors.departamento = 'Departamento é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkCodigoExists = async (codigo: string): Promise<boolean> => {
    if (!codigo.trim() || !formData.departamento) return false;
    
    try {
      const exists = await verificarCodigo(codigo, formData.departamento, categoria?._id);
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
        await atualizar(categoria._id, formData as UpdateCategoriaDocumento);
      } else {
        await criar(formData);
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
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
            placeholder="Digite o nome da categoria"
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
            className={`mt-1 block w-full rounded-md border ${errors.codigo ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
            placeholder="cat_001"
            disabled={loading}
          />
          {errors.codigo && (
            <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Use apenas letras, números, hífen ou underscore
          </p>
        </div>

        {/* Departamento */}
        <div>
          <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">
            Departamento *
          </label>
          <select
            id="departamento"
            name="departamento"
            value={formData.departamento}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border ${errors.departamento ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${isEditor ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            disabled={loading || isEditor}
          >
            <option value="">Selecione um departamento</option>
            {departamentos.map(dept => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
          {errors.departamento && (
            <p className="mt-1 text-sm text-red-600">{errors.departamento}</p>
          )}
          {isEditor && (
            <p className="mt-1 text-sm text-blue-600">
              🔒 Editores só podem criar categorias no seu próprio departamento
            </p>
          )}
        </div>

        {/* Cor */}
        <div>
          <label htmlFor="cor" className="block text-sm font-medium text-gray-700">
            Cor
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            {cores.map(cor => (
              <button
                key={cor.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, cor: cor.value }))}
                className={`w-8 h-8 rounded-full border-2 ${formData.cor === cor.value ? 'border-gray-800' : 'border-gray-300'} ${cor.class}`}
                title={cor.label}
                disabled={loading}
              />
            ))}
          </div>
          <input
            type="hidden"
            name="cor"
            value={formData.cor}
          />
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
            placeholder="Descrição opcional da categoria"
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
              Categoria ativa
            </span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Categorias inativas não aparecerão nas opções de seleção
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

export default CategoriaForm;
