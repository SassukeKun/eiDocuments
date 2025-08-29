"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    // TODO: Implementar lógica de autenticação para determinar o role do usuário
    // Por enquanto, simular verificação de role
    const userRole = getUserRole(); // Função que deve ser implementada
    
    if (userRole === 'admin' || userRole === 'editor') {
      router.push('/dashboard/admin');
    } else {
      router.push('/dashboard/user');
    }
  }, [router]);

  // TODO: Implementar função real de verificação de role
  const getUserRole = (): string => {
    // Simular - em produção, obter do contexto de autenticação ou token
    // Por enquanto, retornar admin para teste
    return 'admin'; // Alterar para 'user' para testar dashboard de usuário
  };

  // Loading state enquanto redireciona
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardPage;