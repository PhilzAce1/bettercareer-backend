import * as GOOGLE from './google.js';
import * as LINKEDIN from './linkedin.js';

// TODO: add validation
type User = Partial<{
  id: string;
  name: string;
  photo: string;
  email: string;
  verifed: boolean;
}>;

type Provider = 'google';
type ProviderStrategy = {
  verify: (token: string) => Promise<unknown>;
  // TODO: fix any
  serialize: (payload?: any) => User;
};

export const STRATEGY = {
  google: {
    verify: GOOGLE.verify,
    serialize: GOOGLE.serialize,
  },
  // linkedin: {
  //   verify: LINKEDIN.verify,
  //   serialize: LINKEDIN.serialize,
  // },
} satisfies Record<Provider, ProviderStrategy>;
