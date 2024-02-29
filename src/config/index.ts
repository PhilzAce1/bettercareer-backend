import './types.js';

import { FastifyInstance } from "fastify";
import env from '@fastify/env';
import { schema } from './schema.js';

export const bindConfig = async (server: FastifyInstance) => {
  await server.register(env, {
    dotenv: true,
    data: process.env,
    schema,
  })
}