import { type FastifyInstance } from 'fastify';
import { authenticate, resetSession } from './oauth/index.js';
import { getUserById } from './profile/get-user-by-id.js';
import { uploadResume } from '../upload/handler.js';

export default async (server: FastifyInstance) => {
  server.post('/oauth/:provider', authenticate);
  server.get(
    '/oauth/reset',
    {
      preHandler: server.auth([server.authorize]),
    },
    resetSession,
  );

  server.post(
    '/users/:id?',
    {
      preHandler: server.auth([server.oauthorize]),
    },
    getUserById,
  );
};
