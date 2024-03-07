import jwt from 'jsonwebtoken';
import { TemporaryServiceError } from '../../../helpers/error.js';

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

const SESSION_TOKEN_LIFETIME = Number(
  process.env.SESSION_TOKEN_LIFETIME,
);
const SESSION_TOKEN_KEY = process.env.SESSION_TOKEN_KEY;

export const createSession = (payload: SessionPayload) => {
  const date = new Date();

  const token = jwt.sign(payload.user, SESSION_TOKEN_KEY, {
    expiresIn: `${SESSION_TOKEN_LIFETIME}d`,
  });

  return {
    token,
    iat: date,
    exp: date.setDate(date.getDate() + SESSION_TOKEN_LIFETIME),
    provider: payload.user.provider,
  };
};

export const decodedSessionToken = (token?: string) => {
  if (!token) throw new TemporaryServiceError();

  return jwt.decode(token, {
    complete: true,
  }) as unknown as SessionPayload;
};
