import fastify from 'fastify';
import autoload from '@fastify/autoload';
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { bindConfig } from './config/index.js';
import { isDevelopment } from './helpers/index.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);
const server = fastify();

await bindConfig(server);

if (isDevelopment) {
  await server.register(
    import("fastify-print-routes"),
  );
}

await server.register(import("@fastify/static"), {
  root: join(__dirname, "static"),
  prefix: "/static/",
});

server.register(autoload, {
  dir: join(__dirname, "modules"),
  dirNameRoutePrefix: false,
  maxDepth: 1,
})

server.get('*', (_request, reply) => {
  reply.send('OK')
})

server.listen({
  port: server.config.PORT,
  host: server.config.HOST,
}).then((address) => {
  console.info(`Server running at ${address}`);
});