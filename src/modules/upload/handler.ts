import {
  FastifyRequest,
  type FastifyInstance,
  FastifyReply,
} from 'fastify';

import { Static, Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { isValidPDF } from '../waitlist/helpers.js';

const UploadResumeSchema = Type.Object({
  resume: Type.Optional(
    Type.Uint8Array({
      title: 'Resume',
    }),
  ),
});
export type TUploadResumeRequest = {
  Body: Static<typeof UploadResumeSchema>;
};

// export default async (server: FastifyInstance) => {
//   await server.register(import('@fastify/multipart'), {
//     attachFieldsToBody: 'keyValues',
//     throwFileSizeLimit: true,
//     limits: {
//       fileSize: 15_000_000,
//       files: 1,
//     },
//   });

//   server.post<TUploadResumeRequest>('/waitlist', addToWaitlist);
// };

export async function uploadResume(
  this: FastifyInstance,
  request: FastifyRequest<TUploadResumeRequest>,
  reply: FastifyReply,
) {
  const errors = Value.Errors(UploadResumeSchema, request.body);

  const error = errors.First();
  if (error) {
    return reply.status(400).send({
      error: true,
      message: `${error.schema.title} is not valid`,
    });
  }

  const { resume } = request.body;

  if (resume && !(await isValidPDF(Buffer.from(resume)))) {
    return reply.status(400).send({
      error: true,
      message: `Please upload a valid PDF for resume`,
    });
  }

  // upload resume

  return reply.status(201).send({
    user: 'Hello world',
  });
}
