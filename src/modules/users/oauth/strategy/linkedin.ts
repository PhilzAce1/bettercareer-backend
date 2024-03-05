import { OAuthStrategy, SetOAuthUser } from './index.js';

type VerifyTokenPayload = {
  token: string;
};

export class LinkedInOAuthStrategy implements OAuthStrategy {
  private payload: VerifyTokenPayload | undefined;

  constructor() {}

  async serialize(setUser: SetOAuthUser) {
    if (this.payload) console.log(this.payload, setUser);
    throw new Error('Method not implemented.');
  }

  async verify() {
    this.payload = {
      token: 'string',
    };
  }
}
