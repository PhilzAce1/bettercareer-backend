import {
  FastifyReply,
  type FastifyInstance,
  type FastifyRequest,
} from 'fastify';
import { type FastifyAuthFunction } from '@fastify/auth';
import { Prisma } from '@prisma/client';
import createError from '@fastify/error';
import { type UserSession, decodedSessionToken } from './utils.js';
import { TemporaryServiceError } from '../../../helpers/error.js';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      session: UserSession;
    };
  }

  interface FastifyInstance {
    authorize: FastifyAuthFunction;
    oauthorize: FastifyAuthFunction;
  }
}

type User = Prisma.UserGetPayload<{}>;
const setCurrentUser = (request: FastifyRequest, user: User) => {
  request.user.id = user.id;
  request.user.session = user.session as unknown as UserSession;
};

const ForbiddenError = createError(
  `FORBIDDEN`,
  'Authentication failed',
  403,
);

const getBearerTokenFromHeader = (authorization?: string) => {
  if (!authorization) return;
  const [, token] = authorization.split(' ');
  if (!token) return;
  return token;
};

export async function authorize(
  this: FastifyInstance,
  request: FastifyRequest,
  _?: FastifyReply,
) {
  const token = getBearerTokenFromHeader(
    request.headers.authorization,
  );
  const payload = decodedSessionToken(token);
  if (!payload?.user) throw new ForbiddenError();

  const user = await this.prisma.user
    .findFirst({
      where: {
        id: payload.user.id,
        session: {
          array_contains: {
            provider: payload.user.provider,
          },
        },
      },
    })
    .catch(() => {
      throw new TemporaryServiceError();
    });

  if (!user) throw new ForbiddenError();
  setCurrentUser(request, user);
}

// TODO: rename
export async function oauthorize(
  this: FastifyInstance,
  request: FastifyRequest,
  _?: FastifyReply,
) {
  try {
    await authorize.call(this, request);
  } catch {}
}
