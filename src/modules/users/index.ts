import { FastifyInstance } from "fastify";

export default async (server: FastifyInstance) => {
  server.get('/users/me', () => (
    "Hello, this is me"
  ))
}