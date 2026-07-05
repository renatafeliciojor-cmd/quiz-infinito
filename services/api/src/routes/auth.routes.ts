import { FastifyInstance } from 'fastify';
import authController from '@/controllers/auth.controller';

export async function authRoutes(app: FastifyInstance) {
  // Rota pública
  app.post('/auth/registro', (request, reply) =>
    authController.registro(request, reply)
  );

  app.post('/auth/login', (request, reply) =>
    authController.login(request, reply)
  );

  app.post('/auth/refresh', (request, reply) =>
    authController.refresh(request, reply)
  );

  // Rotas protegidas
  app.post('/auth/logout', async (request, reply) => {
    await request.jwtVerify();
    return authController.logout(request, reply);
  });

  app.get('/auth/me', async (request, reply) => {
    await request.jwtVerify();
    return authController.me(request, reply);
  });
}
