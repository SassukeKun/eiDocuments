"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToastContext } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const { login, loading, user } = useAuth();
  const { addToast } = useToastContext();
  const router = useRouter();

  // Redirecionar se já autenticado
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !senha.trim()) {
      addToast('warning', 'Campos obrigatórios', 'Por favor, preencha username e senha.');
      return;
    }

    try {
      await login(username, senha);
      addToast('success', 'Login realizado com sucesso!');
    } catch (error: any) {
      // Determinar tipo de erro e exibir toast apropriado
      let errorTitle = 'Erro ao realizar login';
      let errorMessage = '';
      
      if (error && error.message) {
        // Verificar se é erro de rede
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') || 
            error.message.includes('Erro de conexão') ||
            error.message.includes('fetch')) {
          errorTitle = 'Erro de conexão';
          errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
        }
        // Verificar se é erro de timeout
        else if (error.message.includes('Tempo limite') || 
                 error.message.includes('timeout') ||
                 error.message.includes('TimeoutError')) {
          errorTitle = 'Tempo limite esgotado';
          errorMessage = 'A conexão com o servidor demorou muito para responder. Tente novamente.';
        }
        // Verificar se é erro de credenciais (incluindo quando servidor retorna 500 para credenciais inválidas)
        else if (error.message.includes('Credenciais inválidas') || 
                 error.message.includes('Invalid credentials') ||
                 error.message.includes('401') ||
                 error.message.includes('Unauthorized')) {
          errorTitle = 'Credenciais inválidas';
          errorMessage = 'Nome de usuário ou senha incorretos.';
        }
        // Verificar se é erro do servidor
        else if (error.message.includes('500') || 
                 error.message.includes('Internal Server Error')) {
          errorTitle = 'Erro do servidor';
          errorMessage = 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.';
        }
        // Outros erros específicos
        else {
          errorMessage = error.message;
        }
      } else {
        errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
      }
      
      addToast('error', errorTitle, errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto">
              <img 
                src="/logo.jpg" 
                alt="Contratuz Logo" 
                className="w-16 h-16 rounded-xl object-cover shadow-lg"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">eiDocuments</h1>
            <p className="text-gray-600">Entre na sua conta</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="senha" className="text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !username.trim() || !senha.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </>
              ) : (
                <span>Entrar</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
