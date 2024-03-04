import { FastifyInstance } from 'fastify/types/instance.js';
import { UserSession, decodedSessionToken } from './utils.js';
import { FastifyRequest } from 'fastify';
import { Prisma } from '@prisma/client';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      session: UserSession;
    };
  }
}

const setRequestingUser = (
  request: FastifyRequest,
  user: Prisma.UserGetPayload<{}>,
) => {
  request.user.id = user.id;
  request.user.session = user.session as unknown as UserSession;
};

export async function authorize(
  this: FastifyInstance,
  request: FastifyRequest,
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
  setRequestingUser(request, user);
}

export async function isAdmin(this: FastifyInstance) {}
