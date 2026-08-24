import type { FastifyInstance } from 'fastify';

import { authenticateUser } from '../auth/auth.middleware.js';
import { createIdeaBodySchema } from './idea.schema.js';
import { createIdea } from './idea.service.js';

export function registerIdeaRoutes(app: FastifyInstance) {
  app.post('/ideas', { preHandler: authenticateUser }, async (request, reply) => {
    const auth = request.auth;

    if (!auth) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const parsedBody = createIdeaBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send({
        error: 'ValidationError',
        message: 'Invalid idea payload',
        issues: parsedBody.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    try {
      const idea = await createIdea(parsedBody.data, auth.user.id);

      return await reply.status(201).send({
        idea,
      });
    } catch (error) {
      request.log.error(error);

      return reply.status(500).send({
        error: 'InternalServerError',
        message: 'Unable to create idea',
      });
    }
  });
}
