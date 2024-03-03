import {
  type FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import OAuth2, { OAuth2Namespace } from '@fastify/oauth2';

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}

export default async (server: FastifyInstance) => {
  server.register(OAuth2, {
    name: 'googleOAuth2',
    scope: ['profile email'],
    credentials: {
      client: {
        id: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
        secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET as string,
      },
      auth: OAuth2.GOOGLE_CONFIGURATION,
    },
    // register a fastify url to start the redirect flow
    startRedirectPath: '/oauth/google',
    // google redirect here after the user login
    callbackUri: 'http://localhost:8080/oauth/google/callback',
  });

  server.get('/google/callback', async (request: FastifyRequest) => {
    const { token } =
      await server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
        request,
      );

    // TO-DO: handle undefined/null token
    console.log(token);

    return { token }; // TO-DO: redirect to frontend
  });
};

export const autoPrefix = '/oauth';
