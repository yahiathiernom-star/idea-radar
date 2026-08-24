import { prisma } from '../../lib/prisma.js';
import type { CreateIdeaBody } from './idea.schema.js';

export async function createIdea(input: CreateIdeaBody, userId: string) {
  return await prisma.idea.create({
    data: {
      title: input.title,
      description: input.description,
      userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function listIdeasByUserId(userId: string) {
  return await prisma.idea.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      description: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
