import { buildSchema } from 'type-graphql';
import {
  relationResolvers,
  FindManyPostResolver,
  FindManyCategoryResolver,
  FindFirstPostResolver,
  FindFirstCategoryResolver,
  FindManyCommentResolver,
} from '@generated/type-graphql';
import { TestResolver } from '../resolvers/TestResolver';
import { CategoryResolver } from '../resolvers/CategoryResolver';
import { UserResolver } from '../resolvers/UserResolver';
import { UploadResolver } from '../resolvers/UploadResolver';
import { PostResolver } from '../resolvers/PostResolver';
import { CommentResolver } from '../resolvers/CommentResolver';

export default function createSchema() {
  return buildSchema({
    resolvers: [
      UserResolver,
      PostResolver,
      CategoryResolver,
      CommentResolver,
      TestResolver,
      UploadResolver,
      ...relationResolvers,
      FindManyPostResolver,
      FindManyCategoryResolver,
      FindFirstPostResolver,
      FindFirstCategoryResolver,
      FindManyCommentResolver,
    ],
  });
}
