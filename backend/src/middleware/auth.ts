import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest, Auth0User } from '../types/api.js';
import { UnauthorizedError, ForbiddenError } from '../types/errors.js';
import jwt from 'jsonwebtoken';

// Simulação simples de verificação de token Auth0
// Em produção, você usaria a biblioteca oficial do Auth0
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = (req as any).headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new UnauthorizedError('Access token required');
    }

    // Em produção, você verificaria o token com Auth0
    // Por agora, vamos simular a decodificação
    const decoded = jwt.decode(token) as any;
    
    if (!decoded) {
      throw new UnauthorizedError('Invalid token');
    }

    // Simular dados do usuário Auth0
    const user: Auth0User = {
      sub: decoded.sub || 'auth0|12345',
      email: decoded.email || 'user@example.com',
      name: decoded.name,
      picture: decoded.picture,
      roles: decoded['https://app.example.com/roles'] || ['user'],
      permissions: decoded['https://app.example.com/permissions'] || []
    };

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware para verificar roles
export const requireRole = (requiredRoles: string | string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const userRoles = req.user.roles || [];
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    const hasRequiredRole = roles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      throw new ForbiddenError(`Required role(s): ${roles.join(', ')}`);
    }

    next();
  };
};

// Middleware para verificar permissões
export const requirePermission = (requiredPermissions: string | string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const userPermissions = req.user.permissions || [];
    const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    
    const hasRequiredPermission = permissions.some(permission => 
      userPermissions.includes(permission)
    );
    
    if (!hasRequiredPermission) {
      throw new ForbiddenError(`Required permission(s): ${permissions.join(', ')}`);
    }

    next();
  };
};
