import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import logger from '@/utils/logger';
import { env } from '@/config/env';
import { authRoutes } from '@/routes/auth.routes';

export async function createApp() {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport:
        env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                ignore: 'pid,hostname',
              },
            }
          : undefined,
    },
  });

  // Plugins
  await app.register(fastifyHelmet);

  await app.register(fastifyCors, {
    origin: [env.WEB_BASE_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });

  // Health check
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Status
  app.get('/status', async () => {
    return {
      status: 'running',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    };
  });

  // Routes
  await app.register(authRoutes);

  return app;
}
