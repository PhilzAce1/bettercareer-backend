import fastify from 'fastify';
import env from '@fastify/env';
import autoload from '@fastify/autoload';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { schema } from './config/index.js';
import { isDevelopment } from './helpers/index.js';
import * as guards from './modules/users/oauth/guards.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = fastify({
  logger: true,
});

await server.register(env, {
  dotenv: true,
  data: process.env,
  schema,
});

if (isDevelopment) {
  await server.register(import('fastify-print-routes'));
}

await server.register(import('@fastify/auth'));
server.decorate('authorize', guards.authorize);
server.decorate('oauthorize', guards.oauthorize);

await server.register(import('@fastify/static'), {
  root: join(__dirname, '..', 'static'),
  prefix: '/static/',
});

await server.register(autoload, {
  dir: join(__dirname, 'plugins'),
  dirNameRoutePrefix: false,
  maxDepth: 1,
});

await server.register(autoload, {
  dir: join(__dirname, 'modules'),
  dirNameRoutePrefix: false,
  prefix: '/v1',
  maxDepth: 1,
});

server.get('*', (_request, reply) => reply.send('OK'));

export const startServer = async () => {
  try {
    const address = await server.listen({
      port: server.config.PORT,
      host: server.config.HOST,
    });

    server.log.info(`Server running at ${address}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};
