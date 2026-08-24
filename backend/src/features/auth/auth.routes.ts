import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';

import { authenticateUser } from './auth.middleware.js';
import { loginBodySchema, registerBodySchema } from './auth.schema.js';
import {
  EmailAlreadyUsedError,
  InvalidLoginCredentialsError,
  loginUser,
  registerUser,
} from './auth.service.js';

export function registerAuthRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (request, reply) => {
    const parsedBody = registerBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send({
        error: 'ValidationError',
        message: 'Invalid registration payload',
        issues: parsedBody.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    try {
      const user = await registerUser(parsedBody.data);

      return await reply.status(201).send({
        user,
      });
    } catch (error) {
      if (error instanceof EmailAlreadyUsedError) {
        return reply.status(409).send({
          error: 'EmailAlreadyUsed',
          message: 'Email is already used',
        });
      }

      if (error instanceof ZodError) {
        return reply.status(400).send({
          error: 'ValidationError',
          message: 'Invalid registration payload',
        });
      }

      request.log.error(error);

      return reply.status(500).send({
        error: 'InternalServerError',
        message: 'Unable to register user',
      });
    }
  });

  app.post('/auth/login', async (request, reply) => {
    const parsedBody = loginBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send({
        error: 'ValidationError',
        message: 'Invalid login payload',
        issues: parsedBody.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    try {
      const result = await loginUser(parsedBody.data);

      return await reply.status(200).send(result);
    } catch (error) {
      if (error instanceof InvalidLoginCredentialsError) {
        return reply.status(401).send({
          error: 'InvalidCredentials',
          message: 'Invalid email or password',
        });
      }

      if (error instanceof ZodError) {
        return reply.status(400).send({
          error: 'ValidationError',
          message: 'Invalid login payload',
        });
      }

      request.log.error(error);

      return reply.status(500).send({
        error: 'InternalServerError',
        message: 'Unable to login user',
      });
    }
  });

  app.get('/auth/me', { preHandler: authenticateUser }, async (request, reply) => {
    const auth = request.auth;

    if (!auth) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    return await reply.status(200).send({
      user: auth.user,
    });
  });
}
