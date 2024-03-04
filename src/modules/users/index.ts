import { type FastifyInstance } from 'fastify';
import { authenticate } from './oauth/index.js';

export default async (server: FastifyInstance) => {
  server.post('/oauth/:provider', authenticate);
};
