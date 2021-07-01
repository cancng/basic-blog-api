import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from 'type-graphql';
import { Post } from '@generated/type-graphql';
import { PostInput } from './inputs/PostInput';
import { MyContext } from '../types/MyContext';
import { generateCode, generateSlug } from '../util/functions';
import { UserRole } from '.prisma/client';

@Resolver()
export class PostResolver {
  @Authorized(UserRole.ADMIN)
  @Mutation(() => Post)
  async createPost(
    @Arg('data') { title, body, thumbnail, categoryId }: PostInput,
    @Ctx() ctx: MyContext
  ) {
    try {
      let slug = generateSlug(title);
      const post = await ctx.prisma.post.findUnique({ where: { slug } });
      if (post) {
        slug = generateCode(10000, 99999) + '-' + slug;
      }
      return ctx.prisma.post.create({
        data: {
          title,
          slug,
          body,
          thumbnail,
          category: { connect: { id: categoryId } },
          user: { connect: { id: ctx.user?.id } },
        },
      });
    } catch (error) {
      console.log('catch err ⚠️', error.message);
      throw error.message;
    }
  }

  @Authorized(UserRole.ADMIN)
  @Mutation(() => Post)
  async editPost(
    @Arg('id', () => ID) id: string,
    @Arg('data') { title, body, thumbnail, categoryId }: PostInput,
    @Ctx() ctx: MyContext
  ) {
    try {
      const post = await ctx.prisma.post.findUnique({ where: { id } });

      if (post && post.title !== title) {
        const slug = generateSlug(title);
        return ctx.prisma.post.update({
          where: { id },
          data: {
            title,
            slug,
            body,
            thumbnail,
            category: { connect: { id: categoryId } },
            user: { connect: { id: ctx.user?.id } },
          },
        });
      } else {
        return ctx.prisma.post.update({
          where: { id },
          data: {
            title,
            body,
            thumbnail,
            category: { connect: { id: categoryId } },
            user: { connect: { id: ctx.user?.id } },
          },
        });
      }
    } catch (error) {
      console.log('catch err ⚠️', error.message);
      throw error.message;
    }
  }

  @Authorized(UserRole.ADMIN)
  @Mutation(() => Post)
  async deletePost(@Arg('id', () => ID) id: string, @Ctx() ctx: MyContext) {
    try {
      await ctx.prisma.comment.deleteMany({ where: { postId: id } });
      return ctx.prisma.post.delete({
        where: { id },
      });
    } catch (error) {
      console.log('catch err ⚠️', error.message);
      throw error.message;
    }
  }
}
