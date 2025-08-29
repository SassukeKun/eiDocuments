"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const DashboardPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // Redirecionar baseado nos roles do usuário
      if (user.roles.includes('admin') || user.roles.includes('editor')) {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/user');
      }
    } else if (!loading && !user) {
      // Se não autenticado, redirecionar para login
      router.push('/login');
    }
  }, [router, user, loading]);

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