import { buildSchema } from 'type-graphql';
import {
  relationResolvers,
  FindManyPostResolver,
  FindManyCategoryResolver,
  FindFirstPostResolver,
  FindFirstCategoryResolver,
} from '@generated/type-graphql';
import { TestResolver } from '../resolvers/TestResolver';

export default function createSchema() {
  return buildSchema({
    resolvers: [
      TestResolver,
      ...relationResolvers,
      FindManyPostResolver,
      FindManyCategoryResolver,
      FindFirstPostResolver,
      FindFirstCategoryResolver,
    ],
  });
}
