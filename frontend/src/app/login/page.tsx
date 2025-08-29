"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import ModernInput from "@/components/ui/ModernInput";
import ModernButton from "@/components/ui/ModernButton";
import AuthCard from "@/components/ui/AuthCard";
// import AuthLink from "@/components/ui/AuthLink";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useNotification } from "@/hooks/useNotification";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: showError } = useNotification();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fields, errors, isValid, getFieldProps } = useAuthForm(
    {
      email: "",
      password: "",
    },
    {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        custom: (value) => {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return "Email inválido";
          }
          return null;
        },
      },
      password: {
        required: true,
        minLength: 6,
      },
    }
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) return;

    setIsLoading(true);

    try {
      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Login attempted:", {
        email: fields.email.value,
        password: fields.password.value,
      });

      // Aqui você vai chamar seu backend ou supabase
      // await signIn(fields.email.value, fields.password.value);

      success(
        "Login realizado com sucesso!",
        "Redirecionando para o dashboard..."
      );
    } catch (error) {
      console.error("Erro no login:", error);
      showError(
        "Erro no login",
        "Verifique suas credenciais e tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const emailProps = getFieldProps("email");
  const passwordProps = getFieldProps("password");

  return (
    <AuthCard
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta para acessar os documentos"
      type="login"
    >
      <form onSubmit={handleLogin} className="space-y-6">
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
                ${
                  passwordProps.error
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-blue-200"
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

          {passwordProps.touched && passwordProps.error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <span>{passwordProps.error}</span>
            </div>
          )}
        </div>

        {/* Botão de Login */}
        <ModernButton
          type="submit"
          loading={isLoading}
          disabled={!isValid || isLoading}
          fullWidth
          size="lg"
        >
          {isLoading ? "Entrando..." : "Entrar na Conta"}
        </ModernButton>
      </form>
    </AuthCard>
  );
};

export default LoginPage;
