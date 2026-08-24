import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { env } from '../../config/env.js';

export const accessTokenExpiresIn = '1h';

const accessTokenPayloadSchema = z.object({
  userId: z.string().min(1),
  email: z.email(),
});

export type AccessTokenPayload = {
  userId: string;
  email: string;
};

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: accessTokenExpiresIn,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);

    if (typeof payload === 'string') {
      return null;
    }

    return accessTokenPayloadSchema.parse(payload);
  } catch {
    return null;
  }
}
