import jwt from 'jsonwebtoken';

import { env } from '../../config/env.js';

export const accessTokenExpiresIn = '1h';

export type AccessTokenPayload = {
  userId: string;
  email: string;
};

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: accessTokenExpiresIn,
  });
}
