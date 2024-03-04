import { type Prisma, PrismaClient } from '@prisma/client';
import { type FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin = async (server: FastifyInstance) => {
  const prisma = new PrismaClient();
  await prisma.$connect();

  if (!server.hasDecorator('prisma')) {
    server.decorate('prisma', prisma);
  }

  server.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
};

export default fastifyPlugin(prismaPlugin, {
  name: '@bettercareer/fastify-prisma',
});
