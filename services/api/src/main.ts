import { createApp } from '@/app';
import { env } from '@/config/env';
import logger from '@/utils/logger';

async function start() {
  try {
    const app = await createApp();

    await app.listen({ host: env.API_HOST, port: env.API_PORT });

    logger.info(
      `🚀 Server running at http://${env.API_HOST}:${env.API_PORT}`
    );
    logger.info(`Environment: ${env.NODE_ENV}`);
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
}

start();
