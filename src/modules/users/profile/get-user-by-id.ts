import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from 'fastify';

export type GetUserByIdRequest = {
  Params: {
    id?: string;
  };
};

export async function getUserById(
  this: FastifyInstance,
  request: FastifyRequest<GetUserByIdRequest>,
  reply: FastifyReply,
) {
  const isCurrentUser = !request.params.id;
  const userId = request.params.id || request.user.id;

  const user = await this.prisma.user.findFirst({
    where: { id: userId },
    select: {
      session: isCurrentUser,
      providers: false,
    },
  });

  if (!user) throw new Error('User not found');
  return reply.send({ user });
}
