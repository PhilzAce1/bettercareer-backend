export type OAuthUser = {
  id: string;
  name?: string;
  photo?: string;
  email?: string;
  verifed?: boolean;
};

export type SetOAuthUser = (user: OAuthUser) => void;

export interface OAuthStrategy {
  serialize(setUser: SetOAuthUser): PromiseLike<void>;
  verify(): PromiseLike<void>;
}

export class OAuth {
  private strategy: OAuthStrategy;
  private user: OAuthUser | undefined;

  constructor(strategy?: OAuthStrategy) {
    if (!strategy) throw new TypeError();
    this.strategy = strategy;
  }

  async verify() {
    return this.strategy.verify();
  }

  private setUser(user: OAuthUser) {
    this.user = user;
  }

  async serialize() {
    return this.strategy.serialize(this.setUser);
  }

  getUser() {
    if (!this.user) throw new TypeError();
    return this.user;
  }
}

export { GoogleOAuthStrategy } from './google.js';
export { LinkedInOAuthStrategy } from './linkedin.js';
