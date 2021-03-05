import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

interface ContextUser {
  id: string;
  email: string;
}

export const prisma = new PrismaClient();

export interface MyContext {
  prisma: PrismaClient;
  req: Request;
  res: Response;
  user?: ContextUser;
}
