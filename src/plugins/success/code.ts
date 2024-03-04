export const REPLY_KEY_STATUS_CODE = {
  ok: 200,
  created: 201,
  accepted: 202,
  nonAuthoritative: 203,
  noContent: 204,
} as const;

export type Status = keyof typeof REPLY_KEY_STATUS_CODE;

declare module 'fastify' {
  type FastifySuccess = {
    [key in keyof typeof REPLY_KEY_STATUS_CODE]: <T>(
      data?: T,
    ) => FastifyReply;
  };

  interface FastifyReply extends FastifySuccess {}
}
