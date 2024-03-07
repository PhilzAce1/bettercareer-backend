import got from 'got';
import { TemporaryServiceError } from '../../../../helpers/error.js';
import { OAuthStrategy, SetOAuthUser } from './index.js';

type UserInfoFromLinkedIn = {
  sub: string;
  name: string;
  picture: string;
  email: string;
  email_verified: boolean;
};

export class LinkedInOAuthStrategy implements OAuthStrategy {
  private userInfoFromLinkedIn: UserInfoFromLinkedIn | undefined;
  private token: string;

  constructor(token?: string) {
    if (!token) throw new TemporaryServiceError();
    this.token = token;
  }

  async serialize(setUser: SetOAuthUser) {
    if (!this.userInfoFromLinkedIn) throw new TemporaryServiceError();
    const userInfo = this.userInfoFromLinkedIn;

    setUser({
      id: userInfo.sub,
      name: userInfo.name,
      photo: userInfo.picture,
      email: userInfo.email,
      verifed: userInfo.email_verified,
    });
  }

  async verify() {
    try {
      const user = await got
        .post(process.env.LINKEDIN_OAUTH_USERINFO_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .json<UserInfoFromLinkedIn>();

      if (!user) throw new TemporaryServiceError();
      this.userInfoFromLinkedIn = user;
    } catch {
      throw new TemporaryServiceError();
    }
  }
}
