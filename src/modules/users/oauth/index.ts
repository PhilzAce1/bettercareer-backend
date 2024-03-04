import {
  type FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from 'fastify';
import {
  OAuth,
  GoogleOAuthStrategy,
  LinkedInOAuthStrategy,
} from './strategy/index.js';
import { UserSession, createSession } from './utils.js';

type OAuthProvider = 'google' | 'linkedin';

export type AuthenticateRequest = {
  Body: { token: string };
  Params: { provider: OAuthProvider };
};

export async function authenticate(
  this: FastifyInstance,
  request: FastifyRequest<AuthenticateRequest>,
  reply: FastifyReply,
) {
  const { provider } = request.params;

  const auth = new OAuth(
    provider === 'google'
      ? new GoogleOAuthStrategy(request.body.token)
      : provider === 'linkedin'
        ? new LinkedInOAuthStrategy()
        : undefined,
  );

  await auth.verify();
  await auth.serialize();

  const OAuthUser = auth.getUser();

  let user = await this.prisma.user.findFirst({
    where: {
      providers: {
        array_contains: {
          provider,
          externalId: OAuthUser.id,
        },
      },
    },
  });

  // TODO: check if user exist but with different provider

  if (!user) {
    user = await this.prisma.user.create({
      data: {
        name: OAuthUser.name as string,
        email: OAuthUser.email as string,
        photo: OAuthUser.photo as string,
        verified: OAuthUser.verifed,
        providers: [
          {
            provider,
            externalId: OAuthUser.id,
          },
        ],
      },
    });
  }

  if (user.suspended) throw new Error();
  if (user.deleted) throw new Error();

  const userWithSession = await this.prisma.user.update({
    where: { id: user.id },
    data: {
      session: createSession({
        user: {
          id: user.id,
          provider,
        },
      }),
    },
  });

  if (!userWithSession.session) throw new Error();
  const session = userWithSession.session as UserSession;

  const { providers, ...cleanUser } = user;
  reply.statusCode = 200;
  return reply.send({ user: cleanUser, token: session.token });
}
