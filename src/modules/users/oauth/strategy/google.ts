import { OAuth2Client, type TokenPayload } from 'google-auth-library';

export const verify = async (token: string) => {
  const client = new OAuth2Client();

  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });
  } catch {}

  return ticket?.getPayload();
};

export const serialize = (payload?: TokenPayload) => {
  if (!payload) throw new TypeError();

  return {
    id: payload.sub,
    name: payload.name,
    photo: payload.picture,
    email: payload.email,
    verifed: payload.email_verified,
  };
};
