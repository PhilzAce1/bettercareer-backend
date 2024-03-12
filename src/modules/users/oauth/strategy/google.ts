import { OAuth2Client, type TokenPayload } from 'google-auth-library';
import { OAuthStrategy, OAuthUser } from './index.js';
import { TemporaryServiceError } from '../../../../helpers/error.js';

export class GoogleOAuthStrategy implements OAuthStrategy {
  private payload: TokenPayload | undefined;
  private user: OAuthUser | undefined;
  private client: OAuth2Client;
  private token: string;

  constructor(token?: string) {
    if (!token) throw new TemporaryServiceError();

    this.client = new OAuth2Client({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    });
    this.token = token;
  }

  async serialize() {
    if (!this.payload) throw new TemporaryServiceError();
    const payload = this.payload;

    this.user = {
      id: payload.sub,
      name: payload.name,
      photo: payload.picture,
      email: payload.email,
      verifed: payload.email_verified,
    };
  }

  me() {
    return this.user;
  }

  async verify() {
    let ticket;
    try {
      ticket = await this.client.verifyIdToken({
        idToken: this.token,
        audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
      });
    } catch {
      throw new TemporaryServiceError();
    }

    this.payload = ticket?.getPayload();
  }
}
