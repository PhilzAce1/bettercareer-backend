import { type FastifyInstance } from 'fastify';
import {
  type TAddToWaitlistRequest,
  addToWaitlist,
} from './handler.js';

export default async (server: FastifyInstance) => {
  await server.register(import('@fastify/multipart'), {
    attachFieldsToBody: 'keyValues',
    throwFileSizeLimit: true,
    limits: {
      fileSize: 15_000_000,
      files: 1,
    },
  });

  server.post<TAddToWaitlistRequest>('/waitlist', addToWaitlist);
};
