"use client";

import React, { useState } from 'react';
import UserLayout from '@/components/ui/UserLayout';
import { User, Lock, Bell, Settings, Eye, EyeOff, Save } from 'lucide-react';

const ConfiguracoesPage = () => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [perfilData, setPerfilData] = useState({
    nome: 'João Silva',
    apelido: 'João',
    username: 'joao.silva',
    email: 'joao.silva@empresa.com',
    departamento: 'Recursos Humanos'
  });

  const [senhaData, setSenhaData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  const [notificacoes, setNotificacoes] = useState({
    emailNovoDocumento: true,
    emailMovimento: false,
    emailSemanal: true,
    notificacoesPush: true
  });

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'senha', label: 'Senha', icon: Lock },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'preferencias', label: 'Preferências', icon: Settings }
  ];

  const handlePerfilSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar atualização do perfil
    console.log('Atualizar perfil:', perfilData);
  };

  const handleSenhaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (senhaData.novaSenha !== senhaData.confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }
    // TODO: Implementar alteração de senha
    console.log('Alterar senha');
    setSenhaData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
  };

  const handleNotificacoesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar atualização das notificações
    console.log('Atualizar notificações:', notificacoes);
  };

  const renderPerfilTab = () => (
    <form onSubmit={handlePerfilSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              value={perfilData.nome}
              onChange={(e) => setPerfilData({ ...perfilData, nome: e.target.value })}
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apelido
            </label>
            <input
              type="text"
              value={perfilData.apelido}
              onChange={(e) => setPerfilData({ ...perfilData, apelido: e.target.value })}
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={perfilData.username}
              disabled
              className="block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">O username não pode ser alterado</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={perfilData.email}
              disabled
              className="block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Entre em contato com o administrador para alterar o email</p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departamento
            </label>
            <input
              type="text"
              value={perfilData.departamento}
              disabled
              className="block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Entre em contato com o administrador para alterar o departamento</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </button>
      </div>
    </form>
  );

  const renderSenhaTab = () => (
    <form onSubmit={handleSenhaSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Alterar Senha</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha Atual
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={senhaData.senhaAtual}
                onChange={(e) => setSenhaData({ ...senhaData, senhaAtual: e.target.value })}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showCurrentPassword ? 
                  <EyeOff className="w-4 h-4 text-gray-400" /> : 
                  <Eye className="w-4 h-4 text-gray-400" />
                }
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nova Senha
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={senhaData.novaSenha}
                onChange={(e) => setSenhaData({ ...senhaData, novaSenha: e.target.value })}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showNewPassword ? 
                  <EyeOff className="w-4 h-4 text-gray-400" /> : 
                  <Eye className="w-4 h-4 text-gray-400" />
                }
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={senhaData.confirmarSenha}
                onChange={(e) => setSenhaData({ ...senhaData, confirmarSenha: e.target.value })}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? 
                  <EyeOff className="w-4 h-4 text-gray-400" /> : 
                  <Eye className="w-4 h-4 text-gray-400" />
                }
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Lock className="w-4 h-4 mr-2" />
          Alterar Senha
        </button>
      </div>
    </form>
  );

  const renderNotificacoesTab = () => (
    <form onSubmit={handleNotificacoesSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preferências de Notificação</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Novos documentos</label>
              <p className="text-sm text-gray-500">Receber email quando novos documentos forem adicionados</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificacoes.emailNovoDocumento}
                onChange={(e) => setNotificacoes({ ...notificacoes, emailNovoDocumento: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Movimentos de documentos</label>
              <p className="text-sm text-gray-500">Notificar sobre alterações de status dos documentos</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificacoes.emailMovimento}
                onChange={(e) => setNotificacoes({ ...notificacoes, emailMovimento: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Resumo semanal</label>
              <p className="text-sm text-gray-500">Receber resumo semanal de atividades</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificacoes.emailSemanal}
                onChange={(e) => setNotificacoes({ ...notificacoes, emailSemanal: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Notificações push</label>
              <p className="text-sm text-gray-500">Receber notificações no navegador</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificacoes.notificacoesPush}
                onChange={(e) => setNotificacoes({ ...notificacoes, notificacoesPush: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Bell className="w-4 h-4 mr-2" />
          Salvar Preferências
        </button>
      </div>
    </form>
  );

  const renderPreferenciasTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preferências do Sistema</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">
            Esta seção estará disponível em breve. Aqui você poderá configurar:
          </p>
          <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Tema da interface (claro/escuro)</li>
            <li>Idioma do sistema</li>
            <li>Formato de data e hora</li>
            <li>Quantidade de itens por página</li>
            <li>Configurações de visualização</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie suas configurações pessoais e preferências</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'perfil' && renderPerfilTab()}
            {activeTab === 'senha' && renderSenhaTab()}
            {activeTab === 'notificacoes' && renderNotificacoesTab()}
            {activeTab === 'preferencias' && renderPreferenciasTab()}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ConfiguracoesPage;
