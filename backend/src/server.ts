import Fastify from 'fastify';

import { registerAuthRoutes } from './features/auth/auth.routes.js';
import { registerIdeaRoutes } from './features/ideas/idea.routes.js';

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.get('/health', () => {
    return {
      status: 'ok',
    };
  });

  registerAuthRoutes(app);
  registerIdeaRoutes(app);

  return app;
}
