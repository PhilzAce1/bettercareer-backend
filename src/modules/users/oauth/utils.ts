import jwt from 'jsonwebtoken';

type SessionPayload = { id: string; provider: string };

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

  const { provider, ...user } = payload;
  const token = jwt.sign(user, SESSION_KEY, {
    expiresIn: `${SESSION_LIFETIME}d`,
  });

  return {
    token,
    iat: date,
    exp: date.setDate(date.getDate() + SESSION_LIFETIME),
    provider: payload.provider,
  };
};
