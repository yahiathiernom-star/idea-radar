import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';

import { registerBodySchema } from './auth.schema.js';
import { EmailAlreadyUsedError, registerUser } from './auth.service.js';

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
}
