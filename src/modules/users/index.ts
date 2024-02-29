import { type FastifyInstance } from 'fastify';

export default async (server: FastifyInstance) => {
  server.get('/users', async () => {
    const users = await server.prisma.user.findMany();
    return { users };
  });
};
