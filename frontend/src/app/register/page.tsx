"use client";

import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, CheckCircle } from "lucide-react";
import ModernInput from "@/components/ui/ModernInput";
import ModernButton from "@/components/ui/ModernButton";
import AuthCard from "@/components/ui/AuthCard";
import AuthLink from "@/components/ui/AuthLink";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useNotification } from "@/hooks/useNotification";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { success, error: showError } = useNotification();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fields, errors, isValid, getFieldProps, setFieldError } = useAuthForm(
    {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    {
      name: {
        required: true,
        minLength: 2,
        maxLength: 50
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        custom: (value) => {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return "Email inválido";
          }
          return null;
        }
      },
      password: {
        required: true,
        minLength: 8,
        custom: (value) => {
          if (value.length < 8) {
            return "Senha deve ter pelo menos 8 caracteres";
          }
          if (!/(?=.*[a-z])/.test(value)) {
            return "Senha deve conter pelo menos uma letra minúscula";
          }
          if (!/(?=.*[A-Z])/.test(value)) {
            return "Senha deve conter pelo menos uma letra maiúscula";
          }
          if (!/(?=.*\d)/.test(value)) {
            return "Senha deve conter pelo menos um número";
          }
          return null;
        }
      },
      confirmPassword: {
        required: true,
        custom: (value) => {
          if (value !== fields.password.value) {
            return "As senhas não coincidem";
          }
          return null;
        }
      }
    }
  );

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid || !agreedToTerms) return;
    
    setIsLoading(true);
    
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Register attempted:", {
        name: fields.name.value,
        email: fields.email.value,
        password: fields.password.value
      });
      
      // Aqui você vai chamar seu backend ou supabase
      // await signUp(fields.name.value, fields.email.value, fields.password.value);
      
      success("Conta criada com sucesso!", "Redirecionando para o dashboard...");
      
    } catch (error) {
      console.error("Erro no registro:", error);
      showError("Erro no registro", "Não foi possível criar sua conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const nameProps = getFieldProps("name");
  const emailProps = getFieldProps("email");
  const passwordProps = getFieldProps("password");
  const confirmPasswordProps = getFieldProps("confirmPassword");

  // Validar confirmação de senha quando a senha mudar
  React.useEffect(() => {
    if (fields.confirmPassword.value && fields.password.value !== fields.confirmPassword.value) {
      setFieldError("confirmPassword", "As senhas não coincidem");
    } else if (fields.confirmPassword.value && fields.password.value === fields.confirmPassword.value) {
      setFieldError("confirmPassword", null);
    }
  }, [fields.password.value, fields.confirmPassword.value, setFieldError]);

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(password)) strength++;
    
    return {
      strength,
      color: strength < 2 ? 'red' : strength < 4 ? 'yellow' : 'green',
      text: strength < 2 ? 'Fraca' : strength < 4 ? 'Média' : 'Forte'
    };
  };

  const passwordStrength = getPasswordStrength(fields.password.value);

  return (
    <AuthCard
      title="Criar Conta"
      subtitle="Junte-se à nossa plataforma de documentos inteligentes"
      type="register"
    >
      <form onSubmit={handleRegister} className="space-y-6">
        {/* Campo Nome */}
        <ModernInput
          type="text"
          placeholder="Digite seu nome completo"
          label="Nome completo"
          required
          icon={<User className="h-5 w-5" />}
          {...nameProps}
          error={nameProps.touched ? nameProps.error : null}
        />

        {/* Campo Email */}
        <ModernInput
          type="email"
          placeholder="Digite seu email"
          label="Email"
          required
          icon={<Mail className="h-5 w-5" />}
          {...emailProps}
          error={emailProps.touched ? emailProps.error : null}
        />

        {/* Campo Senha */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Senha
            <span className="text-red-500 ml-1">*</span>
          </label>
          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              value={passwordProps.value}
              onChange={passwordProps.onChange}
              onBlur={passwordProps.onBlur}
              className={`
                w-full px-4 py-3 pl-10 pr-12 rounded-xl border-2 transition-all duration-300 ease-in-out
                ${passwordProps.error 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }
                focus:outline-none focus:ring-4 shadow-sm hover:shadow-lg
                dark:bg-gray-800 dark:border-gray-600 dark:text-white
                dark:focus:border-blue-400 dark:focus:ring-blue-900
              `}
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
          
          {/* Indicador de força da senha */}
          {passwordProps.value && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.color === 'red' ? 'bg-red-500' :
                      passwordStrength.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength.color === 'red' ? 'text-red-600' :
                  passwordStrength.color === 'yellow' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {passwordStrength.text}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className={`flex items-center space-x-1 ${
                  passwordProps.value.length >= 8 ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <CheckCircle size={12} />
                  <span>8+ caracteres</span>
                </div>
                <div className={`flex items-center space-x-1 ${
                  /(?=.*[a-z])/.test(passwordProps.value) ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <CheckCircle size={12} />
                  <span>Letra minúscula</span>
                </div>
                <div className={`flex items-center space-x-1 ${
                  /(?=.*[A-Z])/.test(passwordProps.value) ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <CheckCircle size={12} />
                  <span>Letra maiúscula</span>
                </div>
                <div className={`flex items-center space-x-1 ${
                  /(?=.*\d)/.test(passwordProps.value) ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <CheckCircle size={12} />
                  <span>Número</span>
                </div>
              </div>
            </div>
          )}
          
          {passwordProps.touched && passwordProps.error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <span>{passwordProps.error}</span>
            </div>
          )}
        </div>

        {/* Campo Confirmar Senha */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirmar Senha
            <span className="text-red-500 ml-1">*</span>
          </label>
          
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme sua senha"
              value={confirmPasswordProps.value}
              onChange={confirmPasswordProps.onChange}
              onBlur={confirmPasswordProps.onBlur}
              className={`
                w-full px-4 py-3 pl-10 pr-12 rounded-xl border-2 transition-all duration-300 ease-in-out
                ${confirmPasswordProps.error 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }
                focus:outline-none focus:ring-4 shadow-sm hover:shadow-lg
                dark:bg-gray-800 dark:border-gray-600 dark:text-white
                dark:focus:border-blue-400 dark:focus:ring-blue-900
              `}
            />
            
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Lock className="h-5 w-5" />
            </div>
            
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {confirmPasswordProps.touched && confirmPasswordProps.error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <span>{confirmPasswordProps.error}</span>
            </div>
          )}
        </div>

        {/* Termos e condições */}
        <div className="space-y-4">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
            />
            <div className="text-sm text-gray-600">
              <span>Concordo com os </span>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Termos de Serviço
              </button>
              <span> e </span>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Política de Privacidade
              </button>
            </div>
          </label>
        </div>

        {/* Botão de Registro */}
        <ModernButton
          type="submit"
          loading={isLoading}
          disabled={!isValid || !agreedToTerms || isLoading}
          fullWidth
          size="lg"
        >
          {isLoading ? "Criando conta..." : "Criar Conta"}
        </ModernButton>

        {/* Divisor */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        {/* Botões de redes sociais */}
        <div className="grid grid-cols-2 gap-3">
          <ModernButton
            variant="outline"
            size="md"
            icon={<span className="text-blue-600">G</span>}
            onClick={() => console.log("Google signup")}
          >
            Google
          </ModernButton>
          
          <ModernButton
            variant="outline"
            size="md"
            icon={<span className="text-blue-800">f</span>}
            onClick={() => console.log("Facebook signup")}
          >
            Facebook
          </ModernButton>
        </div>

        {/* Link para login */}
        <div className="text-center pt-4">
          <p className="text-gray-600">
            Já tem uma conta?{" "}
            <AuthLink href="/login" variant="backward">
              Fazer login
            </AuthLink>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;
