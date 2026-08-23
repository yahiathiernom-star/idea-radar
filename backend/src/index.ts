import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';
import { buildApp } from './server.js';

const app = buildApp();

const shutdown = async () => {
  await app.close();
  await prisma.$disconnect();
};

process.on('SIGINT', () => {
  void shutdown().then(() => process.exit(0));
});

process.on('SIGTERM', () => {
  void shutdown().then(() => process.exit(0));
});

try {
  await prisma.$connect();
  await app.listen({ host: '0.0.0.0', port: env.PORT });
} catch (error) {
  app.log.error(error);
  await shutdown();
  process.exit(1);
}
