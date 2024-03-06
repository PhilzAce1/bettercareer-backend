/* eslint-disable @typescript-eslint/consistent-type-definitions */

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: number;
      NODE_ENV: string;
      HOST: string;
      GOOGLE_OAUTH_CLIENT_ID: string;
      GOOGLE_OAUTH_CLIENT_SECRET: string;
      LINKEDIN_OAUTH_CLIENT_ID: string;
      LINNKEDIN_OAUTH_CLIENT_SECRET: string;
      LINKED_ACCESS_TOKEN_API: string;
      LINKED_USER_INFO_API: string;
    };
  }
}
