import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { Usuario } from '../models/Usuario.js';
import type { IUsuario } from '../models/Usuario.js';

// Interface para o token JWT
interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Interface para estender o Request com o usuário
export interface AuthenticatedRequest extends Request {
  user?: IUsuario;
}

// Middleware de autenticação
export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token de acesso não fornecido' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET não configurado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ message: 'Usuário não encontrado ou inativo' });
    }

    req.user = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Middleware para verificar se é admin
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Privilégios de administrador necessários.' });
  }

  next();
};

// Middleware opcional: verificar se é admin ou o próprio usuário
export const requireAdminOrSelf = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  const isAdmin = req.user.role === 'admin';
  const isSelf = req.user._id?.toString() === req.params.id;

  if (!isAdmin && !isSelf) {
    return res.status(403).json({ message: 'Acesso negado.' });
  }

  next();
};
