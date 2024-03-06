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
    GOOGLE_OAUTH_CLIENT_ID: { type: 'string' },
    GOOGLE_OAUTH_CLIENT_SECRET: { type: 'string' },
    LINKEDIN_OAUTH_CLIENT_ID: { type: 'string' },
    LINNKEDIN_OAUTH_CLIENT_SECRET: { type: 'string' },
    LINKED_ACCESS_TOKEN_API: { type: 'string' },
    LINKED_USER_INFO_API: { type: 'string' },
  },
};
