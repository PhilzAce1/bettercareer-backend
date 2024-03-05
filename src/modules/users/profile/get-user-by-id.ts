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
  const isMe = !request.params.id || request.params.id === 'me';
  const userId = isMe ? request.user.id : request.params.id;

  const user = await this.prisma.user.findFirst({
    where: { id: userId },
    select: {
      session: isMe,
      providers: false,
    },
  });

  if (!user) throw new Error('User not found');
  return reply.ok({ user });
}
