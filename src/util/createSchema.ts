import { buildSchema } from 'type-graphql';
import {
  applyResolversEnhanceMap,
  relationResolvers,
  FindManyPostResolver,
  FindManyCategoryResolver,
  FindFirstPostResolver,
  FindFirstCategoryResolver,
  FindManyCommentResolver,
  FindManyPageResolver,
  FindFirstPageResolver,
  FindManyUserResolver,
  FindUniqueUserResolver,
} from '@generated/type-graphql';
import { TestResolver } from '../resolvers/TestResolver';
import { CategoryResolver } from '../resolvers/CategoryResolver';
import { UserResolver } from '../resolvers/UserResolver';
import { UploadResolver } from '../resolvers/UploadResolver';
import { PostResolver } from '../resolvers/PostResolver';
import { CommentResolver } from '../resolvers/CommentResolver';
import { PageResolver } from '../resolvers/PageResolver';
import { customAuthChecker } from './authChecker';
import { resolveEnhanceMap } from '../enhances';

export default function createSchema() {
  applyResolversEnhanceMap(resolveEnhanceMap);
  return buildSchema({
    resolvers: [
      UserResolver,
      PostResolver,
      CategoryResolver,
      CommentResolver,
      PageResolver,
      TestResolver,
      UploadResolver,
      ...relationResolvers,
      FindManyUserResolver,
      FindUniqueUserResolver,
      FindManyPostResolver,
      FindManyCategoryResolver,
      FindFirstPostResolver,
      FindFirstCategoryResolver,
      FindManyCommentResolver,
      FindManyPageResolver,
      FindFirstPageResolver,
    ],
    validate: false,
    authChecker: customAuthChecker,
  });
}
