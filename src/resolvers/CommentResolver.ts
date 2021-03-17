import { Arg, Ctx, ID, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { Comment } from '@generated/type-graphql';
import { CommentInput } from './inputs/CommentInput';
import { MyContext } from '../types/MyContext';
import { generateName } from '../util/functions';
import { isAuth } from '../middlewares/isAuth';
import { isEmpty } from 'class-validator';

@Resolver()
export class CommentResolver {
  @Mutation(() => Comment)
  async createComment(
    @Arg('id', () => ID) id: string,
    @Arg('data') { authorName, body }: CommentInput,
    @Ctx() ctx: MyContext
  ) {
    try {
      if (isEmpty(body)) throw new Error('Yorum boş gönderilemez');
      return ctx.prisma.comment.create({
        data: {
          body,
          authorName: authorName.length <= 0 ? generateName() : authorName,
          post: { connect: { id } },
        },
      });
    } catch (error) {
      console.log('catch err ⚠️', error.message);
      throw error.message;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Comment)
  async editComment(
    @Arg('id', () => ID) id: string,
    { authorName, body }: CommentInput
  ) {
    try {
    } catch (error) {
      console.log('catch err ⚠️', error.message);
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => String)
  async deleteComment(@Arg('id', () => ID) id: string, @Ctx() ctx: MyContext) {
    try {
      await ctx.prisma.comment.delete({ where: { id } });
      return 'Yorum kaldırıldı';
    } catch (error) {
      console.log('catch err ⚠️', error.message);
      throw error;
    }
  }
}
