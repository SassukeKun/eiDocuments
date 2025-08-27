"use client";

import React, { useState } from 'react';
import ManageLayout from '@/components/ui/ManageLayout';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { TableColumn, TableAction } from '@/components/ui/DataTable';
import { Users, Edit, Trash2, Eye, Shield, User, Mail, Building2 } from 'lucide-react';
import { useNotification } from '@/hooks/useNotification';

// Dados de exemplo - substituir por service real quando estiver pronto
const mockUsers = [
  {
    _id: '1',
    nome: 'João Silva',
    email: 'joao.silva@empresa.com',
    departamento: { nome: 'Administração', codigo: 'ADM' },
    role: 'admin',
    ativo: true,
    dataCriacao: new Date().toISOString(),
    ultimoLogin: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: '2',
    nome: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    departamento: { nome: 'Recursos Humanos', codigo: 'RH' },
    role: 'user',
    ativo: true,
    dataCriacao: new Date(Date.now() - 86400000).toISOString(),
    ultimoLogin: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: '3',
    nome: 'Pedro Oliveira',
    email: 'pedro.oliveira@empresa.com',
    departamento: { nome: 'TI', codigo: 'TI' },
    role: 'manager',
    ativo: false,
    dataCriacao: new Date(Date.now() - 172800000).toISOString(),
    ultimoLogin: new Date(Date.now() - 86400000).toISOString(),
  },
];

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState(mockUsers);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { success, error } = useNotification();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setUsuarios(mockUsers);
      return;
    }

    const filtered = mockUsers.filter(user =>
      user.nome.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.departamento.nome.toLowerCase().includes(query.toLowerCase())
    );
    setUsuarios(filtered);
  };

  const handleDelete = async (usuario: any) => {
    if (!confirm(`Deseja realmente excluir o usuário "${usuario.nome}"?`)) {
      return;
    }

    try {
      // Implementar service de exclusão
      success('Usuário excluído com sucesso');
      setUsuarios(prev => prev.filter(u => u._id !== usuario._id));
    } catch (err) {
      error('Erro ao excluir usuário');
    }
  };

  const getRoleBadge = (role: string) => {
    const roleMap: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
      admin: { 
        label: 'Admin', 
        class: 'bg-red-100 text-red-800',
        icon: <Shield className="w-3 h-3" />
      },
      manager: { 
        label: 'Gerente', 
        class: 'bg-blue-100 text-blue-800',
        icon: <Users className="w-3 h-3" />
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 3600);
    
    if (diffInHours < 1) {
      return 'Agora mesmo';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const columns: TableColumn[] = [
    {
      key: 'nome',
      title: 'Usuário',
      sortable: true,
      render: (value, record) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'departamento',
      title: 'Departamento',
      sortable: true,
      width: 'w-32',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <div>
            <div className="font-medium text-sm">{value.nome}</div>
            <div className="text-xs text-gray-500">{value.codigo}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Função',
      sortable: true,
      width: 'w-24',
      render: (value) => getRoleBadge(value),
    },
    {
      key: 'ultimoLogin',
      title: 'Último Login',
      sortable: true,
      width: 'w-28',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {formatDate(value)}
        </span>
      ),
    },
    {
      key: 'dataCriacao',
      title: 'Data de Criação',
      sortable: true,
      width: 'w-32',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString('pt-BR')}
        </span>
      ),
    },
    {
      key: 'ativo',
      title: 'Status',
      sortable: true,
      width: 'w-20',
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            value
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
  ];

  const actions: TableAction[] = [
    {
      key: 'view',
      label: 'Visualizar',
      icon: <Eye className="w-4 h-4" />,
      onClick: (record) => {
        console.log('Visualizar usuário:', record);
      },
    },
    {
      key: 'edit',
      label: 'Editar',
      icon: <Edit className="w-4 h-4" />,
      onClick: (record) => {
        console.log('Editar usuário:', record);
      },
    },
    {
      key: 'permissions',
      label: 'Permissões',
      icon: <Shield className="w-4 h-4" />,
      onClick: (record) => {
        console.log('Gerenciar permissões:', record);
      },
    },
    {
      key: 'delete',
      label: 'Excluir',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: handleDelete,
      variant: 'danger',
    },
  ];

  return (
    <ManageLayout>
      <div>
        <PageHeader
          title="Usuários"
          subtitle="Gerencie os usuários do sistema"
          onAdd={() => console.log('Adicionar usuário')}
          onSearch={handleSearch}
          onFilter={() => console.log('Filtrar usuários')}
          onExport={() => console.log('Exportar usuários')}
          addButtonText="Novo Usuário"
          searchPlaceholder="Pesquisar usuários..."
        />

        <DataTable
          data={usuarios}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="Nenhum usuário encontrado"
          onSort={(column, direction) => {
            console.log('Ordenar por:', column, direction);
          }}
        />
      </div>
    </ManageLayout>
  );
};

export default UsuariosPage;
