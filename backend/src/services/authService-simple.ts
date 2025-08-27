import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario';
import type { IUsuario } from '../models/Usuario';

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

  // Gerar token JWT
  static generateToken(usuario: IUsuario): string {
    const payload = {
      id: usuario.id,
      email: usuario.email,
      role: usuario.role
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    });
  }

  // Verificar token JWT
  static async verifyToken(token: string): Promise<IUsuario> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      
      const usuario = await Usuario.findById(decoded.id);
      if (!usuario || !usuario.ativo) {
        throw new Error('Usuário não encontrado ou inativo');
      }

      return usuario;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  // Login
  static async login(email: string, senha: string): Promise<{ usuario: any; token: string }> {
    const usuario = await Usuario.findOne({ email, ativo: true });
    
    if (!usuario) {
      throw new Error('Credenciais inválidas');
    }

    const senhaValida = await usuario.compararSenha(senha);
    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
    }

    // Atualizar último login
    usuario.ultimoLogin = new Date();
    await usuario.save();

    const token = this.generateToken(usuario);

    return {
      usuario: usuario.toPublicJSON(),
      token
    };
  }

  // Registro
  static async register(dadosUsuario: {
    nome: string;
    email: string;
    senha: string;
    role?: 'admin' | 'user';
    departamentoId?: string;
  }): Promise<{ usuario: any; token: string }> {
    // Verificar se email já existe
    const usuarioExistente = await Usuario.findOne({ email: dadosUsuario.email });
    if (usuarioExistente) {
      throw new Error('Email já está em uso');
    }

    // Criar novo usuário
    const novoUsuario = new Usuario({
      nome: dadosUsuario.nome,
      email: dadosUsuario.email,
      senha: dadosUsuario.senha, // A senha será hasheada automaticamente pelo pre('save')
      role: dadosUsuario.role || 'user',
      departamentoId: dadosUsuario.departamentoId
    });

    await novoUsuario.save();
    const token = this.generateToken(novoUsuario);

    return {
      usuario: novoUsuario.toPublicJSON(),
      token
    };
  }
}
