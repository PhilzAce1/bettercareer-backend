/* eslint-disable @typescript-eslint/naming-convention */

export const schema = {
  type: 'object',
  required: ['PORT', 'NODE_ENV', 'HOST'],
  properties: {
    PORT: {
      type: 'string',
      default: 8080,
    },
    HOST: { type: 'string' },
    NODE_ENV: { type: 'string' },
    GOOGLE_OAUTH_CLIENT_ID:  { type: 'string' },
    GOOGLE_OAUTH_CLIENT_SECRET:  { type: 'string' }
  },
};
