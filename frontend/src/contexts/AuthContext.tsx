'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAdmin: () => boolean;
  canEdit: () => boolean;
  canManageUsers: () => boolean;
  canDeleteDocuments: () => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Verificar se o usuário está autenticado ao carregar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, senha: string) => {
    try {
      setLoading(true);
      const response = await authService.login({ username, senha });
      setUser(response.data.usuario);
      
      // Redirecionar baseado no role
      const dashboardPath = authService.getDashboardPath(response.data.usuario);
      router.push(dashboardPath);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Retornar o erro para que a página de login possa lidar com ele
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  // Métodos de verificação de permissões
  const isAdmin = () => user ? authService.isAdmin(user) : false;
  const canEdit = () => user ? authService.canEdit(user) : false;
  const canManageUsers = () => user ? authService.canManageUsers(user) : false;
  const canDeleteDocuments = () => user ? authService.canDeleteDocuments(user) : false;
  const hasRole = (role: string) => user ? authService.hasRole(user, role) : false;
  const hasAnyRole = (roles: string[]) => user ? authService.hasAnyRole(user, roles) : false;
  const hasAllRoles = (roles: string[]) => user ? authService.hasAllRoles(user, roles) : false;

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshUser,
    isAdmin,
    canEdit,
    canManageUsers,
    canDeleteDocuments,
    hasRole,
    hasAnyRole,
    hasAllRoles
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
