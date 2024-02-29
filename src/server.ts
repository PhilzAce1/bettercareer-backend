import fastify from 'fastify';
import env from '@fastify/env';
import autoload from '@fastify/autoload';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { schema } from './config/index.js';
import { isDevelopment } from './helpers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const server = fastify({
  logger: true,
});

const prisma = new PrismaClient();

await server.register(env, {
  dotenv: true,
  data: process.env,
  schema,
});

if (isDevelopment) {
  await server.register(import('fastify-print-routes'));
}

// eslint-disable-next-line no-warning-comments
// TODO: only here for test, refactor later
server.decorate('prisma', prisma);

await server.register(import('@fastify/static'), {
  root: join(__dirname, 'static'),
  prefix: '/static/',
});

await server.register(autoload, {
  dir: join(__dirname, 'modules'),
  dirNameRoutePrefix: false,
  maxDepth: 1,
});

server.get('*', (_request, reply) => reply.send('OK'));

server
  .listen({
    port: server.config.PORT,
    host: server.config.HOST,
  })
  .then((address) => {
    server.log.info(`Server running at ${address}`);
  })
  .catch((error) => {
    server.log.error(error);
    process.exit(1);
  });
