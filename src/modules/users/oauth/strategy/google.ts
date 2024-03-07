import { OAuth2Client, type TokenPayload } from 'google-auth-library';
import { OAuthStrategy, SetOAuthUser } from './index.js';
import { TemporaryServiceError } from '../../../../helpers/error.js';

export class GoogleOAuthStrategy implements OAuthStrategy {
  private payload: TokenPayload | undefined;
  private client: OAuth2Client;
  private token: string;

  constructor(token?: string) {
    if (!token) throw new TemporaryServiceError();

    this.client = new OAuth2Client();
    this.token = token;
  }

  async serialize(setUser: SetOAuthUser) {
    if (!this.payload) throw new TemporaryServiceError();
    const payload = this.payload;

    setUser({
      id: payload.sub,
      name: payload.name,
      photo: payload.picture,
      email: payload.email,
      verifed: payload.email_verified,
    });
  }

  async verify() {
    let ticket;
    try {
      ticket = await this.client.verifyIdToken({
        idToken: this.token,
        audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
      });
    } catch (error) {
      throw new TemporaryServiceError(error);
    }

    this.payload = ticket?.getPayload();
  }
}
