import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';

const prisma = new PrismaClient();

export interface RegistroDto {
  nomeEmpresa: string;
  cnpj: string;
  email: string;
  senha: string;
  nomeContato: string;
  telefone?: string;
}

export interface LoginDto {
  email: string;
  senha: string;
}

export interface TokenPayload {
  usuarioId: string;
  empresaId: string;
  email: string;
  cargo: string;
}

export class AuthService {
  async registro(data: RegistroDto) {
    // Verificar se email já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (usuarioExistente) {
      throw new Error('Email já cadastrado');
    }

    // Criar empresa
    const empresa = await prisma.empresa.create({
      data: {
        nome: data.nomeEmpresa,
        cnpj: data.cnpj,
        email: data.email,
        telefone: data.telefone,
      },
    });

    // Hash da senha
    const senhaHash = await bcrypt.hash(data.senha, 12);

    // Criar usuário
    const usuario = await prisma.usuario.create({
      data: {
        email: data.email,
        nome: data.nomeContato,
        senhaHash,
        cargo: 'ADMIN',
        empresaId: empresa.id,
        telefone: data.telefone,
      },
    });

    return {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        cargo: usuario.cargo,
      },
      empresa: {
        id: empresa.id,
        nome: empresa.nome,
      },
    };
  }

  async login(data: LoginDto) {
    const usuario = await prisma.usuario.findUnique({
      where: { email: data.email },
      include: { empresa: true },
    });

    if (!usuario) {
      throw new Error('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(data.senha, usuario.senhaHash);

    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
    }

    if (!usuario.ativo) {
      throw new Error('Usuário inativo');
    }

    // Gerar tokens
    const accessToken = this.gerarAccessToken({
      usuarioId: usuario.id,
      empresaId: usuario.empresaId,
      email: usuario.email,
      cargo: usuario.cargo,
    });

    const refreshToken = this.gerarRefreshToken({
      usuarioId: usuario.id,
      empresaId: usuario.empresaId,
      email: usuario.email,
      cargo: usuario.cargo,
    });

    return {
      accessToken,
      refreshToken,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        cargo: usuario.cargo,
        empresa: usuario.empresa,
      },
    };
  }

  private gerarAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRATION,
    });
  }

  private gerarRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRATION,
    });
  }

  async validarToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }

  async refreshToken(refreshToken: string) {
    const payload = await this.validarToken(refreshToken);

    const novoAccessToken = this.gerarAccessToken(payload);

    return {
      accessToken: novoAccessToken,
    };
  }
}

export default new AuthService();
