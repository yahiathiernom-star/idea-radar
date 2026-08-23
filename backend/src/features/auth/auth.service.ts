import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

import { prisma } from '../../lib/prisma.js';
import type { RegisterBody } from './auth.schema.js';

const passwordSaltRounds = 12;

export class EmailAlreadyUsedError extends Error {
  constructor() {
    super('Email already used');
    this.name = 'EmailAlreadyUsedError';
  }
}

export async function registerUser(input: RegisterBody) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    throw new EmailAlreadyUsedError();
  }

  const passwordHash = await bcrypt.hash(input.password, passwordSaltRounds);

  try {
    return await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new EmailAlreadyUsedError();
    }

    throw error;
  }
}
