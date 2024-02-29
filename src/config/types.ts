/* eslint-disable @typescript-eslint/consistent-type-definitions */

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: number;
      NODE_ENV: string;
      HOST: string;
    };
  }
}
