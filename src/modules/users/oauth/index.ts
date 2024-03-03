import {
  type FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import OAuth2, { OAuth2Namespace } from '@fastify/oauth2';
import { STRATEGY } from './strategy/index.js';

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}

export default async (server: FastifyInstance) => {
  // server.register(OAuth2, {
  //   name: 'googleOAuth2',
  //   scope: ['profile email'],
  //   credentials: {
  //     client: {
  //       id: server.config.GOOGLE_OAUTH_CLIENT_ID,
  //       secret: server.config.GOOGLE_OAUTH_CLIENT_SECRET,
  //     },
  //     auth: OAuth2.default.GOOGLE_CONFIGURATION,
  //   },
  //   // register a fastify url to start the redirect flow
  //   startRedirectPath: '/oauth/google',
  //   // google redirect here after the user login
  //   callbackUri: 'http://localhost:8080/oauth/google/callback',
  // });

  // server.get('/google/callback', async (request: FastifyRequest) => {
  //   try {
  //     const { token } =
  //       await server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
  //         request,
  //       );

  //     // TO-DO: handle undefined/null token
  //     console.log(token);

  //     return { token }; // TO-DO: redirect to frontend
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  server.post(
    '/:provider',
    async (request: FastifyRequest<GoogleOauthFastifyRequest>) => {
      const { provider } = request.params;
      const handlers = STRATEGY[provider];

      if (!handlers) throw TypeError(`${provider} is not supported`);
      const payload = await handlers.verify(request.body.token);
      const user = handlers.serialize(payload);

      const hasAnAccount = await server.prisma.user.findFirst({
        where: { providers: {} },
      });
    },
  );
};

// Check if account exists with email

// If email exist
// Check provider is supported -> sigin in with google but they linkedin, inform user of existing accounts
// check suspsended, deleted
// If same provider, jwt, session, response

// If email !exist
// Create new user with the provider
// jwt, session, response

type GoogleOauthFastifyRequest = {
  Body: {
    token: string;
  };
  Params: {
    provider: 'google';
  };
};

export const autoPrefix = '/oauth';
