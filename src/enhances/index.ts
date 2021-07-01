import { ResolversEnhanceMap } from '@generated/type-graphql';
import { userActionsConfig } from './user';

export const resolveEnhanceMap: ResolversEnhanceMap = {
  User: userActionsConfig,
};
