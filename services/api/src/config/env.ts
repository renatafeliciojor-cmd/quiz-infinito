import dotenv from 'dotenv';

dotenv.config();

export const env = {
  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_PORT: parseInt(process.env.API_PORT || '3001'),
  API_HOST: process.env.API_HOST || '0.0.0.0',
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3001',
  WEB_BASE_URL: process.env.WEB_BASE_URL || 'http://localhost:3000',

  // Database
  DATABASE_URL: process.env.DATABASE_URL || '',

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'sua-chave-secreta-super-longa-aqui',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '15m',
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d',

  // Twilio
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_WHATSAPP_NUMBER: process.env.TWILIO_WHATSAPP_NUMBER || '',

  // Google Maps
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',

  // SendGrid
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || 'noreply@levechopp.com.br',

  // Stripe
  STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY || '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',

  // Sentry
  SENTRY_DSN: process.env.SENTRY_DSN || '',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
};

// Validar variáveis críticas
if (!env.DATABASE_URL && env.NODE_ENV === 'production') {
  throw new Error('DATABASE_URL environment variable is required in production');
}

if (!env.JWT_SECRET && env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production');
}
