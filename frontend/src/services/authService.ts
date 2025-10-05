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
  role: 'admin' | 'editor' | 'user';
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
    const response = await apiGet<{ success: boolean; data: User }>('/auth/me');
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiPost('/auth/change-password', {
      senhaAtual: currentPassword,
      novaSenha: newPassword
    });
  }

  // Métodos para verificar permissões baseados no novo sistema hierárquico
  // admin: único, acesso total
  // editor: gerente departamental, acesso ao seu departamento
  // user: nível básico
  
  isAdmin(user: User): boolean {
    return user.role === 'admin';
  }

  isEditor(user: User): boolean {
    return user.role === 'editor';
  }

  isUser(user: User): boolean {
    return user.role === 'user';
  }

  canEdit(user: User): boolean {
    // Admin e Editor podem editar
    return user.role === 'admin' || user.role === 'editor';
  }

  canManageUsers(user: User): boolean {
    // Apenas Admin pode gerenciar usuários
    return user.role === 'admin';
  }

  canDeleteDocuments(user: User): boolean {
    // Admin e Editor podem deletar documentos
    return user.role === 'admin' || user.role === 'editor';
  }

  canAccessAllDepartments(user: User): boolean {
    // Apenas Admin pode acessar todos os departamentos
    return user.role === 'admin';
  }

  canAccessDepartment(user: User, departmentId: string): boolean {
    // Admin: acesso a todos
    // Editor: acesso apenas ao seu departamento
    // User: acesso apenas ao seu departamento
    if (user.role === 'admin') return true;
    return user.departamento._id === departmentId;
  }

  hasRole(user: User, role: 'admin' | 'editor' | 'user'): boolean {
    return user.role === role;
  }

  hasAnyRole(user: User, roles: ('admin' | 'editor' | 'user')[]): boolean {
    return roles.includes(user.role);
  }

  hasMinimumRole(user: User, minRole: 'admin' | 'editor' | 'user'): boolean {
    // Hierarquia: admin > editor > user
    const hierarchy: Record<string, number> = {
      admin: 3,
      editor: 2,
      user: 1
    };
    return hierarchy[user.role] >= hierarchy[minRole];
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
