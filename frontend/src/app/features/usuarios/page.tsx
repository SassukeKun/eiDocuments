"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Save, 
  User,
  Shield,
  Building2
} from 'lucide-react';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernInput } from '@/components/ui/ModernInput';
import { useNotification } from '@/hooks/useNotification';
import ManageLayout from '@/components/ui/ManageLayout';
import FormModal from '@/components/ui/FormModal';
import { UsuariosService } from '@/services/usuariosService';
import { DepartamentosService } from '@/services/departamentosService';
import { Usuario, CreateUsuario, UpdateUsuario } from '@/types';
import { Departamento } from '@/types';

const UsuariosPage = () => {
  const { success, error } = useNotification();
  
  // Estados
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  

  
  // Estado do formulário
  const [formData, setFormData] = useState<CreateUsuario>({
    nome: '',
    apelido: '',
    username: '',
    senha: '',
    departamento: '',
    roles: ['user'],
    ativo: true
  });

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      await Promise.all([
        carregarUsuarios(),
        carregarDepartamentos()
      ]);
    } catch (err) {
      error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const carregarUsuarios = async () => {
    try {
      const response = await UsuariosService.listar({ limit: 100 });
      setUsuarios(response.data);
    } catch (err) {
      error('Erro ao carregar usuários');
    }
  };

  const carregarDepartamentos = async () => {
    try {
      const response = await DepartamentosService.listar({ ativo: true });
      setDepartamentos(response.data);
    } catch (err) {
      error('Erro ao carregar departamentos');
    }
  };

  // Filtrar usuários
  const usuariosFiltrados = useMemo(() => {
    if (!searchQuery.trim()) return usuarios;
    
    return usuarios.filter(usuario => 
      usuario.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      usuario.apelido.toLowerCase().includes(searchQuery.toLowerCase()) ||
      usuario.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [usuarios, searchQuery]);

  // Limpar formulário
  const limparFormulario = () => {
    setFormData({
      nome: '',
      apelido: '',
      username: '',
      senha: '',
      departamento: '',
      roles: ['user'],
      ativo: true
    });
    setEditingUsuario(null);
  };

  // Abrir edição
  const abrirEdicao = (usuario: Usuario) => {
    setFormData({
      nome: usuario.nome,
      apelido: usuario.apelido,
      username: usuario.username,
      senha: '', // Não preencher senha na edição
      departamento: usuario.departamento,
      roles: usuario.roles,
      ativo: usuario.ativo
    });
    setEditingUsuario(usuario);
    setShowForm(true);
  };

  // Salvar usuário
  const salvarUsuario = async () => {
    try {
      setLoading(true);

      // Validações
      if (!formData.nome.trim()) {
        error('Nome é obrigatório');
        return;
      }
      if (!formData.apelido.trim()) {
        error('Apelido é obrigatório');
        return;
      }
      if (!formData.username.trim()) {
        error('Username é obrigatório');
        return;
      }
      if (!formData.departamento) {
        error('Departamento é obrigatório');
        return;
      }
      if (!editingUsuario && !formData.senha.trim()) {
        error('Senha é obrigatória para novos usuários');
        return;
      }

      if (editingUsuario) {
        // Atualizar
        const updateData: UpdateUsuario = {
          nome: formData.nome.trim(),
          apelido: formData.apelido.trim(),
          username: formData.username.trim(),
          departamento: formData.departamento,
          roles: formData.roles,
          ativo: formData.ativo
        };

        // Incluir senha apenas se foi fornecida
        if (formData.senha.trim()) {
          updateData.senha = formData.senha.trim();
        }

        await UsuariosService.atualizar(editingUsuario._id, updateData);
        success('Usuário atualizado com sucesso!');
      } else {
        // Criar
        const createData: CreateUsuario = {
          nome: formData.nome.trim(),
          apelido: formData.apelido.trim(),
          username: formData.username.trim(),
          senha: formData.senha.trim(),
          departamento: formData.departamento,
          roles: formData.roles,
          ativo: formData.ativo
        };

        await UsuariosService.criar(createData);
        success('Usuário criado com sucesso!');
      }

      await carregarUsuarios();
      setShowForm(false);
      limparFormulario();
    } catch (err) {
      error('Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  // Remover usuário
  const removerUsuario = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este usuário?')) {
      return;
    }

    try {
      setLoading(true);
      await UsuariosService.remover(id);
      success('Usuário removido com sucesso!');
      await carregarUsuarios();
    } catch (err) {
      error('Erro ao remover usuário');
    } finally {
      setLoading(false);
    }
  };

  // Obter nome do departamento
  const getDepartamentoNome = (departamentoId: string) => {
    const departamento = departamentos.find(d => d._id === departamentoId);
    return departamento ? departamento.nome : 'Departamento não encontrado';
  };

  // Renderizar badge de role
  const getRoleBadge = (role: string) => {
    const roleMap: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
      admin: { 
        label: 'Admin', 
        class: 'bg-red-100 text-red-800',
        icon: <Shield className="w-3 h-3" />
      },
      editor: { 
        label: 'Editor', 
        class: 'bg-blue-100 text-blue-800',
        icon: <Edit className="w-3 h-3" />
      },
      user: { 
        label: 'Usuário', 
        class: 'bg-gray-100 text-gray-800',
        icon: <User className="w-3 h-3" />
      },
    };
    
    const roleInfo = roleMap[role] || roleMap.user;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${roleInfo.class}`}>
        {roleInfo.icon}
        <span className="ml-1">{roleInfo.label}</span>
      </span>
    );
  };

  return (
    <ManageLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-600" />
            Usuários
          </h1>
          <p className="text-gray-600 mt-2">Gerencie os usuários do sistema</p>
        </div>
        
                 <div className="space-x-2">
           <ModernButton
             onClick={() => {
               setShowForm(true);
               limparFormulario();
             }}
             className="bg-blue-600 hover:bg-blue-700"
           >
             <Plus className="w-4 h-4 mr-2" />
             Novo Usuário
           </ModernButton>
         </div>
      </div>

      {/* Barra de pesquisa */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <ModernInput
            type="text"
            placeholder="Pesquisar usuários..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

             {/* Modal de Formulário */}

       
              {/* Modal de Formulário - Versão de Teste */}
       {showForm && (
         <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
             {/* Header */}
             <div className="border-b border-gray-200 px-6 py-4">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-medium leading-6 text-gray-900">
                   {editingUsuario ? 'Editar Usuário' : 'Novo Usuário'}
                 </h3>
                                    <button
                     type="button"
                     className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                     onClick={() => {
                       setShowForm(false);
                       limparFormulario();
                     }}
                   >
                   ✕
                 </button>
               </div>
             </div>

             {/* Body */}
             <div className="px-6 py-4">
               <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <ModernInput
                     label="Nome"
                     value={formData.nome}
                     onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                     placeholder="Digite o nome"
                   />

                   <ModernInput
                     label="Apelido"
                     value={formData.apelido}
                     onChange={(e) => setFormData({ ...formData, apelido: e.target.value })}
                     placeholder="Digite o apelido"
                   />

                   <ModernInput
                     label="Username"
                     value={formData.username}
                     onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                     placeholder="Digite o username"
                   />

                   <ModernInput
                     label={editingUsuario ? "Nova Senha (opcional)" : "Senha"}
                     type="password"
                     value={formData.senha}
                     onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                     placeholder={editingUsuario ? "Deixe em branco para manter" : "Digite a senha"}
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Departamento
                   </label>
                   <select
                     value={formData.departamento}
                     onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   >
                     <option value="">Selecione um departamento</option>
                     {departamentos.map((dept) => (
                       <option key={dept._id} value={dept._id}>
                         {dept.nome}
                       </option>
                     ))}
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Roles
                   </label>
                   <div className="grid grid-cols-3 gap-3">
                     {['admin', 'editor', 'user'].map((role) => (
                       <label key={role} className="flex items-center">
                         <input
                           type="checkbox"
                           checked={formData.roles.includes(role)}
                           onChange={(e) => {
                             if (e.target.checked) {
                               setFormData({
                                 ...formData,
                                 roles: [...formData.roles, role]
                               });
                             } else {
                               setFormData({
                                 ...formData,
                                 roles: formData.roles.filter(r => r !== role)
                               });
                             }
                           }}
                           className="mr-2"
                         />
                         <span className="text-sm text-gray-700 capitalize">{role}</span>
                       </label>
                     ))}
                   </div>
                 </div>

                 <div>
                   <label className="flex items-center">
                     <input
                       type="checkbox"
                       checked={formData.ativo}
                       onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                       className="mr-2"
                     />
                     <span className="text-sm text-gray-700">Usuário ativo</span>
                   </label>
                 </div>

                 <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                   <ModernButton
                     onClick={() => {
                       setShowForm(false);
                       limparFormulario();
                     }}
                     variant="outline"
                   >
                     Cancelar
                   </ModernButton>
                   <ModernButton
                     onClick={salvarUsuario}
                     disabled={loading}
                     className="bg-blue-600 hover:bg-blue-700"
                   >
                     <Save className="w-4 h-4 mr-2" />
                     {loading ? 'Salvando...' : 'Salvar'}
                   </ModernButton>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Criação
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Carregando usuários...
                  </td>
                </tr>
              ) : usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {usuario.nome} {usuario.apelido}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{usuario.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {getDepartamentoNome(usuario.departamento)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {usuario.roles.map((role) => (
                          <div key={role}>
                            {getRoleBadge(role)}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          usuario.ativo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {usuario.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(usuario.dataCriacao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <ModernButton
                          onClick={() => abrirEdicao(usuario)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="w-4 h-4" />
                        </ModernButton>
                        <ModernButton
                          onClick={() => removerUsuario(usuario._id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </ModernButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ManageLayout>
  );
};

export default UsuariosPage;
