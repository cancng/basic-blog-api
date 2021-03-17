import { AuthenticationError } from 'apollo-server-express';
import { verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types/MyContext';

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authorization = context.req.headers.authorization;

  if (!authorization) {
    throw new AuthenticationError('Token is required');
  }

  try {
    const token = authorization.split('Bearer ')[1];
    const decodedToken = verify(token, process.env.JWT_SECRET!);
    // console.log('token geldi 🐤', decodedToken);
    context.user = decodedToken as any;
  } catch (error) {
    console.log('isauth middleware catch ⚠️', error);
    throw new AuthenticationError('Token is required');
  }
  return next();
};