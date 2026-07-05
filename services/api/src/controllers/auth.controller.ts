import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import authService from '@/services/auth.service';
import logger from '@/utils/logger';

const registroSchema = z.object({
  nomeEmpresa: z.string().min(3, 'Nome da empresa deve ter pelo menos 3 caracteres'),
  cnpj: z.string().min(14, 'CNPJ deve ter 14 dígitos'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  nomeContato: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  telefone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export class AuthController {
  async registro(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = registroSchema.parse(request.body);
      const resultado = await authService.registro(body);

      reply.status(201).send({
        success: true,
        data: resultado,
      });
    } catch (error) {
      logger.error(error, 'Erro ao registrar usuário');

      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          errors: error.errors,
        });
      }

      reply.status(400).send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao registrar',
      });
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = loginSchema.parse(request.body);
      const resultado = await authService.login(body);

      // Armazenar refresh token em cookie seguro
      reply.setCookie('refreshToken', resultado.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 dias
      });

      reply.status(200).send({
        success: true,
        data: {
          accessToken: resultado.accessToken,
          usuario: resultado.usuario,
        },
      });
    } catch (error) {
      logger.error(error, 'Erro ao fazer login');

      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          errors: error.errors,
        });
      }

      reply.status(401).send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao fazer login',
      });
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie('refreshToken');

    reply.status(200).send({
      success: true,
      message: 'Desconectado com sucesso',
    });
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    try {
      const refreshToken = request.cookies.refreshToken;

      if (!refreshToken) {
        return reply.status(401).send({
          success: false,
          message: 'Refresh token não encontrado',
        });
      }

      const resultado = await authService.refreshToken(refreshToken);

      reply.status(200).send({
        success: true,
        data: {
          accessToken: resultado.accessToken,
        },
      });
    } catch (error) {
      logger.error(error, 'Erro ao renovar token');

      reply.clearCookie('refreshToken');

      reply.status(401).send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao renovar token',
      });
    }
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    try {
      const usuario = (request as any).user;

      reply.status(200).send({
        success: true,
        data: usuario,
      });
    } catch (error) {
      logger.error(error, 'Erro ao obter dados do usuário');

      reply.status(500).send({
        success: false,
        message: 'Erro ao obter dados do usuário',
      });
    }
  }
}

export default new AuthController();
