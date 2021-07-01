import { PrismaClient } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';
import { verify } from 'jsonwebtoken';

interface ContextUser {
  id: string;
  email: string;
}

export const prisma = new PrismaClient();

export interface MyContext extends ExpressContext {
  prisma: PrismaClient;
  user?: ContextUser;
}

export const createContext = (ctx: MyContext) => {
  let token: string | undefined;
  if (ctx.req.headers.authorization) {
    token = ctx.req.headers.authorization.split('Bearer ')[1];
  }
  if (token) {
    verify(token, process.env.JWT_SECRET!, (err: any, decodedToken) => {
      ctx.user = decodedToken as ContextUser;
    });
  }
  return {
    ...ctx,
    prisma,
  };
};
