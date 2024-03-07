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
import { TemporaryServiceError } from '../../../helpers/error.js';

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
  const { token } = request.body;

  const auth = new OAuth(
    provider === 'google'
      ? new GoogleOAuthStrategy(token)
      : provider === 'linkedin'
        ? new LinkedInOAuthStrategy(token)
        : undefined,
  );

  await auth.verify();
  await auth.serialize();

  const OAuthUser = auth.getUser();

  let user = await this.prisma.user
    .findFirst({
      where: {
        providers: {
          array_contains: {
            provider,
            externalId: OAuthUser.id,
          },
        },
      },
    })
    .catch(() => {
      throw new TemporaryServiceError();
    });

  // TODO: check if user exist but with different provider

  let isNewUser = false;
  if (!user) {
    user = await this.prisma.user
      .create({
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
      })
      .catch(() => {
        throw new TemporaryServiceError();
      });

    isNewUser = true;
  }

  if (user.suspended) throw new TemporaryServiceError();
  if (user.deleted) throw new TemporaryServiceError();

  const userWithSession = await this.prisma.user
    .update({
      where: { id: user.id },
      data: {
        session: createSession({
          user: {
            id: user.id,
            provider,
          },
        }),
      },
    })
    .catch(() => {
      throw new TemporaryServiceError();
    });

  if (!userWithSession.session) throw new TemporaryServiceError();
  const session = userWithSession.session as UserSession;

  const { providers, ...cleanUser } = user;
  const status = isNewUser ? 'created' : 'ok';
  return reply[status]({
    isNewUser,
    user: cleanUser,
    token: session.token,
  });
}

export async function resetSession(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await this.prisma.user
    .update({
      where: { id: request.user.id },
      data: { session: {} },
    })
    .catch(() => {
      throw new TemporaryServiceError();
    });

  return reply.noContent();
}
