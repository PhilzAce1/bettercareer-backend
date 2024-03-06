import { OAuthStrategy, SetOAuthUser } from './index.js';
import CustomError from '../../../../helpers/error.js';
import { exchangeLinkedInCode, getLinkedInUserData } from '../../oauth/strategy/utils.js';


export class LinkedInOAuthStrategy implements OAuthStrategy {
  private payload: any | undefined;
  private code: string;

  constructor(code?: string, error?: string, error_description?: string) {
    if (!code) throw new CustomError({
      message: 'LinkedIn OAuth code is required.',
      statusCode: 404,
      code: 'OAUTH ERROR'
    });

    if (error) throw new CustomError({
      message: `${error_description}` || 'LinkedIn authentication failed.',
      statusCode: Number(error),
      code: 'OAUTH ERROR'
    });

    this.code = code;

  }

  async serialize(setUser: SetOAuthUser) {
    if (!this.payload) throw new CustomError({
      message: 'User data not found.',
      statusCode: 404,
      code: 'OAUTH ERROR'
    });
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
    let payload;
    try {
      const { token } = await exchangeLinkedInCode({ code: this.code });
      payload = await getLinkedInUserData(token);

    } catch (error: any | unknown) {
      throw new CustomError({
        message: `${error.message}` || 'LinkedIn authentication failed.',
        statusCode: 404,
        code: 'ERROR'
      });
    }
    this.payload = payload
  }
}
