"use client";

import React, { useState, useEffect } from 'react';
import { CreateUsuario, UpdateUsuario, Usuario, Departamento } from '@/types';
import { useUsuarios } from '@/hooks/useUsuarios';
import { useDepartamentos } from '@/hooks/useDepartamentos';

interface UsuarioFormProps {
  usuario?: Usuario | null; // null para criar, objeto para editar
  onSuccess?: () => void;
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({
  usuario,
  onSuccess
}) => {
  const { criar, atualizar, verificarUsername } = useUsuarios();
  const { carregarAtivos } = useDepartamentos();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  
  const [formData, setFormData] = useState<CreateUsuario>({
    nome: '',
    apelido: '',
    username: '',
    senha: '',
    departamento: '',
    roles: ['user'],
    ativo: true
  });

  const isEditing = !!usuario;

  useEffect(() => {
    if (usuario) {
      // Modo edição - preencher formulário
      setFormData({
        nome: usuario.nome,
        apelido: usuario.apelido,
        username: usuario.username,
        senha: '', // Senha vazia no modo edição
        departamento: typeof usuario.departamento === 'string' ? usuario.departamento : usuario.departamento._id,
        roles: usuario.roles || ['user'],
        ativo: usuario.ativo
      });
    } else {
      // Modo criação - limpar formulário
      setFormData({
        nome: '',
        apelido: '',
        username: '',
        senha: '',
        departamento: '',
        roles: ['user'],
        ativo: true
      });
    }
    setErrors({});
  }, [usuario]);

  // Carregar departamentos ativos
  useEffect(() => {
    const loadDepartamentos = async () => {
      try {
        const response = await carregarAtivos();
        setDepartamentos(response);
      } catch (error) {
        console.error('Erro ao carregar departamentos:', error);
      }
    };
    loadDepartamentos();
  }, [carregarAtivos]);

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

  const handleRoleChange = (role: string, checked: boolean) => {
    setFormData(prev => {
      const currentRoles = prev.roles || [];
      const newRoles = checked 
        ? [...currentRoles, role]
        : currentRoles.filter(r => r !== role);
      
      return { ...prev, roles: newRoles };
    });
    
    if (errors.roles) {
      setErrors(prev => ({ ...prev, roles: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.length > 100) {
      newErrors.nome = 'Nome não pode exceder 100 caracteres';
    }

    if (!formData.apelido.trim()) {
      newErrors.apelido = 'Apelido é obrigatório';
    } else if (formData.apelido.length > 50) {
      newErrors.apelido = 'Apelido não pode exceder 50 caracteres';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username é obrigatório';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username deve ter pelo menos 3 caracteres';
    } else if (formData.username.length > 30) {
      newErrors.username = 'Username não pode exceder 30 caracteres';
    } else if (!/^[a-zA-Z0-9._]+$/.test(formData.username)) {
      newErrors.username = 'Username deve conter apenas letras, números, pontos e underscores';
    }

    if (!isEditing && !formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha && formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.departamento) {
      newErrors.departamento = 'Departamento é obrigatório';
    }

    if (!formData.roles || formData.roles.length === 0) {
      newErrors.roles = 'Pelo menos uma função deve ser selecionada';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Verificar se username já existe
    const usernameExists = await verificarUsername(formData.username, usuario?._id);
    if (usernameExists) {
      setErrors(prev => ({ ...prev, username: 'Este username já está em uso' }));
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing) {
        const updateData: UpdateUsuario = { ...formData };
        // Se senha estiver vazia, não enviar
        if (!updateData.senha?.trim()) {
          delete updateData.senha;
        }
        await atualizar(usuario._id, updateData);
      } else {
        await criar(formData);
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const availableRoles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'editor', label: 'Editor' },
    { value: 'user', label: 'Usuário' }
  ];

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
          placeholder="Digite o nome completo"
          disabled={loading}
          maxLength={100}
        />
        {errors.nome && (
          <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
        )}
      </div>

      {/* Apelido */}
      <div>
        <label htmlFor="apelido" className="block text-sm font-medium text-gray-700">
          Apelido *
        </label>
        <input
          type="text"
          id="apelido"
          name="apelido"
          value={formData.apelido}
          onChange={handleInputChange}
          className={`mt-1 block w-full rounded-md border ${errors.apelido ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
          placeholder="Como prefere ser chamado"
          disabled={loading}
          maxLength={50}
        />
        {errors.apelido && (
          <p className="mt-1 text-sm text-red-600">{errors.apelido}</p>
        )}
      </div>

      {/* Username */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username *
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className={`mt-1 block w-full rounded-md border ${errors.username ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm lowercase`}
          placeholder="usuario.nome"
          disabled={loading}
          maxLength={30}
          style={{ textTransform: 'lowercase' }}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Use apenas letras, números, pontos e underscores
        </p>
      </div>

      {/* Senha */}
      <div>
        <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
          Senha {!isEditing && '*'}
        </label>
        <input
          type="password"
          id="senha"
          name="senha"
          value={formData.senha}
          onChange={handleInputChange}
          className={`mt-1 block w-full rounded-md border ${errors.senha ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
          placeholder={isEditing ? "Deixe vazio para manter a senha atual" : "Digite a senha"}
          disabled={loading}
        />
        {errors.senha && (
          <p className="mt-1 text-sm text-red-600">{errors.senha}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {isEditing ? "Deixe vazio para não alterar a senha" : "Mínimo de 6 caracteres"}
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
          className={`mt-1 block w-full rounded-md border ${errors.departamento ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
          disabled={loading}
        >
          <option value="">Selecione um departamento</option>
          {departamentos.map((depto) => (
            <option key={depto._id} value={depto._id}>
              {depto.nome} ({depto.codigo})
            </option>
          ))}
        </select>
        {errors.departamento && (
          <p className="mt-1 text-sm text-red-600">{errors.departamento}</p>
        )}
      </div>

      {/* Roles */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Funções *
        </label>
        <div className="space-y-2">
          {availableRoles.map((role) => (
            <label key={role.value} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.roles?.includes(role.value) || false}
                onChange={(e) => handleRoleChange(role.value, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-700">
                {role.label}
              </span>
            </label>
          ))}
        </div>
        {errors.roles && (
          <p className="mt-1 text-sm text-red-600">{errors.roles}</p>
        )}
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
            Usuário ativo
          </span>
        </label>
        <p className="mt-1 text-sm text-gray-500">
          Usuários inativos não poderão fazer login no sistema
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

export default UsuarioForm;
