/* eslint-disable @typescript-eslint/naming-convention */

export const schema = {
  type: 'object',
  required: [
    'PORT',
    'NODE_ENV',
    'HOST',
    'DATABASE_URL',
    'GOOGLE_OAUTH_CLIENT_ID',
    'SESSION_TOKEN_LIFETIME',
    'SESSION_TOKEN_KEY',
    'LINKEDIN_OAUTH_USERINFO_ENDPOINT',
    'RESEND_API_KEY',
    'RESEND_FROM',
  ] as const,
  properties: {
    PORT: {
      type: 'number',
      default: 8080,
    },
    HOST: { type: 'string' },
    NODE_ENV: { type: 'string' },
    DATABASE_URL: { type: 'string' },
    GOOGLE_OAUTH_CLIENT_ID: { type: 'string' },
    GOOGLE_OAUTH_CLIENT_SECRET: { type: 'string' },
    SESSION_TOKEN_LIFETIME: {
      type: 'number',
      default: 30,
    },
    SESSION_TOKEN_KEY: { type: 'string' },
    LINKEDIN_OAUTH_USERINFO_ENDPOINT: { type: 'string' },
    RESEND_API_KEY: { type: 'string' },
    RESEND_FROM: { type: 'string' },
  },
} as const;

type ConfigProperties = (typeof schema)['properties'];
type ConfigPropertyKey = keyof ConfigProperties;
type ConfigPropertyType<K extends ConfigPropertyKey> =
  ConfigProperties[K]['type'] extends 'string'
    ? string
    : ConfigProperties[K]['type'] extends 'number'
      ? number
      : never;

type Config = {
  [K in ConfigPropertyKey]: ConfigPropertyType<K>;
};

declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Config {}
  }
}
