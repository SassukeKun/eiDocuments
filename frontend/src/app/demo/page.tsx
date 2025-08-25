"use client";

import React from "react";
import ModernInput from "@/components/ui/ModernInput";
import ModernButton from "@/components/ui/ModernButton";
import AuthCard from "@/components/ui/AuthCard";
import AuthLink from "@/components/ui/AuthLink";
import NotificationDemo from "@/components/ui/NotificationDemo";
import { useNotification } from "@/hooks/useNotification";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

const DemoPage = () => {
  const { success, error, warning, info } = useNotification();
  const [showPassword, setShowPassword] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Demonstração dos Componentes
          </h1>
          <p className="text-gray-600 text-lg">
            Teste todos os componentes modernos criados para a plataforma eiDocuments
          </p>
        </div>

        {/* Seção de Inputs */}
        <AuthCard title="Componentes de Input" subtitle="Teste os inputs modernos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModernInput
              type="text"
              placeholder="Digite seu nome"
              label="Nome"
              required
              icon={<User className="h-5 w-5" />}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />

            <ModernInput
              type="email"
              placeholder="Digite seu email"
              label="Email"
              required
              icon={<Mail className="h-5 w-5" />}
              value=""
              onChange={() => {}}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Senha com Toggle
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-3 pl-10 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <ModernInput
              type="text"
              placeholder="Input com erro"
              label="Input com Erro"
              value=""
              onChange={() => {}}
              error="Este campo tem um erro"
            />
          </div>
        </AuthCard>

        {/* Seção de Botões */}
        <AuthCard title="Componentes de Botão" subtitle="Teste os botões modernos">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ModernButton variant="primary" size="sm">
                Pequeno
              </ModernButton>
              <ModernButton variant="primary" size="md">
                Médio
              </ModernButton>
              <ModernButton variant="primary" size="lg">
                Grande
              </ModernButton>
              <ModernButton variant="primary" loading>
                Loading
              </ModernButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ModernButton variant="secondary">
                Secundário
              </ModernButton>
              <ModernButton variant="outline">
                Outline
              </ModernButton>
              <ModernButton variant="ghost">
                Ghost
              </ModernButton>
              <ModernButton disabled>
                Desabilitado
              </ModernButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModernButton variant="primary" fullWidth size="lg">
                Botão Largo
              </ModernButton>
              <ModernButton variant="outline" fullWidth size="lg">
                Outline Largo
              </ModernButton>
            </div>
          </div>
        </AuthCard>

        {/* Seção de Links */}
        <AuthCard title="Componentes de Link" subtitle="Teste os links de navegação">
          <div className="flex flex-wrap gap-4 justify-center">
            <AuthLink href="/login" variant="forward">
              Ir para Login
            </AuthLink>
            <AuthLink href="/register" variant="backward">
              Voltar para Registro
            </AuthLink>
          </div>
        </AuthCard>

        {/* Seção de Notificações */}
        <AuthCard title="Sistema de Notificações" subtitle="Teste as notificações">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ModernButton
              variant="outline"
              onClick={() => success("Sucesso!", "Operação realizada com sucesso!")}
            >
              Sucesso
            </ModernButton>
            
            <ModernButton
              variant="outline"
              onClick={() => error("Erro!", "Algo deu errado. Tente novamente.")}
            >
              Erro
            </ModernButton>
            
            <ModernButton
              variant="outline"
              onClick={() => warning("Atenção!", "Esta ação requer confirmação.")}
            >
              Aviso
            </ModernButton>
            
            <ModernButton
              variant="outline"
              onClick={() => info("Informação", "Aqui está uma informação útil.")}
            >
              Info
            </ModernButton>
          </div>
        </AuthCard>

        {/* Seção de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AuthCard
            title="Card de Login"
            subtitle="Exemplo de card para login"
            type="login"
          >
            <div className="space-y-4">
              <p className="text-gray-600 text-center">
                Este é um exemplo de como o card de login se parece.
              </p>
              <ModernButton variant="primary" fullWidth>
                Exemplo de Botão
              </ModernButton>
            </div>
          </AuthCard>

          <AuthCard
            title="Card de Registro"
            subtitle="Exemplo de card para registro"
            type="register"
          >
            <div className="space-y-4">
              <p className="text-gray-600 text-center">
                Este é um exemplo de como o card de registro se parece.
              </p>
              <ModernButton variant="primary" fullWidth>
                Exemplo de Botão
              </ModernButton>
            </div>
          </AuthCard>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-600">
            Todos os componentes estão funcionando perfeitamente! 🎉
          </p>
          <div className="mt-4 space-x-4">
            <AuthLink href="/login" variant="forward">
              Ir para Login
            </AuthLink>
            <AuthLink href="/register" variant="forward">
              Ir para Registro
            </AuthLink>
          </div>
        </div>
      </div>

      {/* Demo de Notificações */}
      <NotificationDemo />
    </div>
  );
};

export default DemoPage;
