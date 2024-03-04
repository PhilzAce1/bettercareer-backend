import jwt from 'jsonwebtoken';

type SessionPayload = {
  user: {
    id: string;
    provider: string;
  };
};

export type UserSession = {
  token: string;
  iat: number;
  exp: number;
  provider: string;
};

const SESSION_LIFETIME = 30;
const SESSION_KEY = 'MycroOnBetterCareersF';

export const createSession = (payload: SessionPayload) => {
  const date = new Date();

  const token = jwt.sign(payload.user, SESSION_KEY, {
    expiresIn: `${SESSION_LIFETIME}d`,
  });

  return {
    token,
    iat: date,
    exp: date.setDate(date.getDate() + SESSION_LIFETIME),
    provider: payload.user.provider,
  };
};

export const decodedSessionToken = (token?: string) => {
  if (!token) throw new TypeError();

  return jwt.decode(token, {
    complete: true,
  }) as unknown as SessionPayload;
};
