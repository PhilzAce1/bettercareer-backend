import { type FastifyInstance } from 'fastify';
import { authenticate } from './oauth/index.js';
import { getUserById } from './profile/get-user-by-id.js';
import { authorize, oauthorize } from './oauth/guards.js';

export default async (server: FastifyInstance) => {
  server.post('/oauth/:provider', authenticate);

  server.post(
    '/users/:id?',
    {
      preHandler: server.auth([server.oauthorize]),
    },
    getUserById,
  );
};

export const guards = { authorize, oauthorize };
