import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { z } from 'zod';

// Schemas de validação
const loginSchema = z.object({
  email: z.string().email('Email deve ter um formato válido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome não pode exceder 100 caracteres'),
  email: z.string().email('Email deve ter um formato válido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  departamentoId: z.string().optional()
});

export class AuthController {
  // POST /auth/login
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, senha } = loginSchema.parse(req.body);
      
      const result = await AuthService.login(email, senha);
      
      res.json(ApiResponse.successData(result, 'Login realizado com sucesso'));
    } catch (error) {
      next(error);
    }
  }

  // POST /auth/register
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = registerSchema.parse(req.body);
      
      const result = await AuthService.register(data);
      
      res.status(201).json(ApiResponse.successData(result, 'Usuário criado com sucesso'));
    } catch (error) {
      next(error);
    }
  }

  // GET /auth/me
  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ApiResponse.errorData('Usuário não autenticado', 'UNAUTHORIZED'));
        return;
      }

      const userData = (req.user as any).toPublicJSON();
      
      res.json(ApiResponse.successData(userData, 'Dados do usuário obtidos com sucesso'));
    } catch (error) {
      next(error);
    }
  }

  // POST /auth/logout
  static async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Em um sistema real, você poderia invalidar o token em uma blacklist
      // Por enquanto, só retornamos sucesso (o cliente deve remover o token)
      
      res.json(ApiResponse.successData(null, 'Logout realizado com sucesso'));
    } catch (error) {
      next(error);
    }
  }

  // PUT /auth/change-password
  static async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const changePasswordSchema = z.object({
        senhaAtual: z.string().min(1, 'Senha atual é obrigatória'),
        novaSenha: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres')
      });

      const { senhaAtual, novaSenha } = changePasswordSchema.parse(req.body);

      if (!req.user) {
        res.status(401).json(ApiResponse.errorData('Usuário não autenticado', 'UNAUTHORIZED'));
        return;
      }

      // Verificar senha atual
      const senhaValida = await req.user.compararSenha(senhaAtual);
      if (!senhaValida) {
        res.status(400).json(ApiResponse.errorData('Senha atual incorreta', 'INVALID_PASSWORD'));
        return;
      }

      // Atualizar senha
      req.user.senha = novaSenha;
      await req.user.save(); // O middleware do modelo fará o hash automaticamente

      res.json(ApiResponse.successData(null, 'Senha alterada com sucesso'));
    } catch (error) {
      next(error);
    }
  }
}
