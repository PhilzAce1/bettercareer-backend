import {
  FastifyReply,
  type FastifyInstance,
  type FastifyRequest,
} from 'fastify';
import { type FastifyAuthFunction } from '@fastify/auth';
import { Prisma } from '@prisma/client';
import { type UserSession, decodedSessionToken } from './utils.js';

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

export async function authorize(
  this: FastifyInstance,
  request: FastifyRequest,
  _?: FastifyReply,
) {
  const payload = decodedSessionToken(request.headers.authorization);
  if (!payload?.user) throw new Error();

  const user = await this.prisma.user.findFirst({
    where: {
      id: payload.user.id,
      session: {
        array_contains: {
          provider: payload.user.provider,
        },
      },
    },
  });

  if (!user) throw new Error();
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
