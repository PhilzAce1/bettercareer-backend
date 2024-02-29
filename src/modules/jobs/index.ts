import { FastifyInstance } from "fastify";

export default async (server: FastifyInstance) => {
  server.get('/', () => (
    "Hello, this is me"
  ))
}

export const autoPrefix = '/jobs';