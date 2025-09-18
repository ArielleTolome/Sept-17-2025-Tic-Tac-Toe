import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  FRONTEND_ORIGIN: z.string().url(),
  PUBLIC_WS_URL: z.string().url(),
  DATABASE_URL: z.string(),
  PRISMA_DB_PROVIDER: z.enum(['sqlite', 'postgresql']).default('sqlite'),
  WS_JWT_SECRET: z.string().min(16, 'WS_JWT_SECRET must be at least 16 characters'),
  JWT_ISSUER: z.string().default('tic-tac-toe'),
  TURN_TIMEOUT_SECONDS: z.coerce.number().min(5).max(120).default(10),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
  PUBLIC_WS_URL: process.env.PUBLIC_WS_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  PRISMA_DB_PROVIDER: process.env.PRISMA_DB_PROVIDER,
  WS_JWT_SECRET: process.env.WS_JWT_SECRET,
  JWT_ISSUER: process.env.JWT_ISSUER,
  TURN_TIMEOUT_SECONDS: process.env.TURN_TIMEOUT_SECONDS,
});
