import type { FastifyReply, FastifyRequest } from 'fastify';

import { verifyAccessToken } from './auth.jwt.js';
import { findPublicUserById } from './auth.service.js';

type AuthenticatedUser = {
  id: string;
  email: string;
};

type AuthContext = {
  user: AuthenticatedUser;
};

declare module 'fastify' {
  interface FastifyRequest {
    auth?: AuthContext;
  }
}

function sendUnauthorized(reply: FastifyReply) {
  return reply.status(401).send({
    error: 'Unauthorized',
    message: 'Authentication required',
  });
}

export async function authenticateUser(request: FastifyRequest, reply: FastifyReply) {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return sendUnauthorized(reply);
  }

  const [scheme, token, extra] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token || extra) {
    return sendUnauthorized(reply);
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    return sendUnauthorized(reply);
  }

  const user = await findPublicUserById(payload.userId);

  if (!user) {
    return sendUnauthorized(reply);
  }

  request.auth = {
    user,
  };
}
