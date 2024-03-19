import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { TypeSystem } from '@sinclair/typebox/system';
import { Value } from '@sinclair/typebox/value';
import { isValidPDF, sendWaitlistEmail } from './helpers.js';

const EmailFormat = TypeSystem.Format('email', (value: string) =>
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(value),
);

const AddToWaitlistPayloadSchema = Type.Object({
  name: Type.String({ title: 'Name ' }),
  email: Type.String({
    title: 'Email',
    format: EmailFormat,
  }),
  resume: Type.Optional(
    Type.Uint8Array({
      title: 'Resume',
    }),
  ),
});

export type TAddToWaitlistRequest = {
  Body: Static<typeof AddToWaitlistPayloadSchema>;
};

export async function addToWaitlist(
  this: FastifyInstance,
  request: FastifyRequest<TAddToWaitlistRequest>,
  reply: FastifyReply,
) {
  const errors = Value.Errors(
    AddToWaitlistPayloadSchema,
    request.body,
  );

  const error = errors.First();
  if (error) {
    return reply.status(400).send({
      error: true,
      message: `${error.schema.title} is not valid`,
    });
  }

  const { name, email, resume } = request.body;

  // if (resume && !(await isValidPDF(Buffer.from(resume)))) {
  //   return reply.status(400).send({
  //     error: true,
  //     message: `Please upload a valid PDF for resume`,
  //   });
  // }

  const isWaitlisted = await this.prisma.waitlist.count({
    where: { email },
  });

  if (isWaitlisted) return reply.status(200);

  const waitlistEmail = await sendWaitlistEmail({ email, name });
  if (!waitlistEmail.error) {
    return reply.status(500).send({
      error: true,
      message:
        "Sorry, an error occurred on our end. We've been notified and are working on it. Please try again later.",
    });
  }

  // upload resume

  const user = await this.prisma.waitlist.create({
    data: { email, name, resume: 'string' },
    select: { name: true, email: true },
  });

  return reply.status(201).send({
    user,
  });
}
