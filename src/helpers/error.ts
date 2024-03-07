import createError from '@fastify/error';

export const TemporaryServiceError = createError(
  `TEMPORARY_SERVICE_ERROR`,
  `We are currently unable to process your request, please try again later`,
  500,
);
