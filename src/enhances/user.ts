import { UserRole } from '.prisma/client';
import { ResolverActionsConfig } from '@generated/type-graphql';
import { Authorized } from 'type-graphql';

export const userActionsConfig: ResolverActionsConfig<'User'> = {
  users: [Authorized(UserRole.ADMIN)],
  user: [Authorized(UserRole.USER)],
};
