import { TemporaryServiceError } from '../../../../helpers/error.js';

export type OAuthUser = {
  id: string;
  name?: string;
  photo?: string;
  email?: string;
  verifed?: boolean;
};

export type SetOAuthUser = (user: OAuthUser) => void;

export interface OAuthStrategy {
  serialize(): PromiseLike<void>;
  verify(): PromiseLike<void>;
  me(): OAuthUser | undefined;
}

export class OAuth {
  private strategy: OAuthStrategy;

  constructor(strategy?: OAuthStrategy) {
    if (!strategy) throw new TypeError();
    this.strategy = strategy;
  }

  async verify() {
    return this.strategy.verify();
  }

  me() {
    const user = this.strategy.me();
    if (!user) throw new TemporaryServiceError();
    return user;
  }

  async serialize() {
    return this.strategy.serialize();
  }
}

export { GoogleOAuthStrategy } from './google.js';
export { LinkedInOAuthStrategy } from './linkedin.js';
