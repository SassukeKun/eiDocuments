import { apiPost, apiGet } from '@/lib/api';

export interface User {
  _id: string;
  username: string;
  nome: string;
  apelido: string;
  departamento: {
    _id: string;
    nome: string;
    codigo: string;
  };
  roles: string[];
  ativo: boolean;
}

export interface LoginRequest {
  username: string;
  senha: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    usuario: User;
  };
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiPost<AuthResponse>('/auth/login', credentials);
  }

  async logout(): Promise<void> {
    await apiPost('/auth/logout', {});
  }

  async refreshToken(): Promise<void> {
    await apiPost('/auth/refresh', {});
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiGet<{ success: boolean; data: { usuario: User } }>('/auth/me');
    return response.data.usuario;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiPost('/auth/change-password', {
      senhaAtual: currentPassword,
      novaSenha: newPassword
    });
  }

  // Métodos para verificar permissões
  isAdmin(user: User): boolean {
    return user.roles.includes('admin');
  }

  canEdit(user: User): boolean {
    return user.roles.includes('admin') || user.roles.includes('editor');
  }

  canManageUsers(user: User): boolean {
    return user.roles.includes('admin') || user.roles.includes('user_manager');
  }

  canDeleteDocuments(user: User): boolean {
    return user.roles.includes('admin') || user.roles.includes('document_manager');
  }

  hasRole(user: User, role: string): boolean {
    return user.roles.includes(role);
  }

  hasAnyRole(user: User, roles: string[]): boolean {
    return roles.some(role => user.roles.includes(role));
  }

  hasAllRoles(user: User, roles: string[]): boolean {
    return roles.every(role => user.roles.includes(role));
  }

  // Determinar dashboard baseado nos roles
  getDashboardPath(user: User): string {
    if (this.isAdmin(user)) {
      return '/dashboard/admin';
    }
    return '/dashboard/user';
  }
}

export const authService = new AuthService();
