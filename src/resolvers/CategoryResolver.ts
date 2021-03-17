import { Arg, Ctx, ID, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { isAuth } from '../middlewares/isAuth';
import { MyContext } from '../types/MyContext';
import { Category } from '@generated/type-graphql';
import { isEmpty } from 'class-validator';
import { generateSlug } from '../util/functions';
import { CategoryInput } from './inputs/CategoryInput';

@Resolver()
export class CategoryResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Category)
  async createCategory(
    @Arg('data') { title, thumbnail }: CategoryInput,
    @Ctx() ctx: MyContext
  ) {
    try {
      if (isEmpty(title)) throw new Error('Kategori başlığı gereklidir');
      let slug = generateSlug(title);
      const category = await ctx.prisma.category.findUnique({
        where: { slug },
      });
      if (category) throw new Error('Kategori başlığı kullanılıyor');

      return ctx.prisma.category.create({
        data: {
          title,
          thumbnail,
          slug,
          user: { connect: { id: ctx.user?.id } },
        },
      });
    } catch (error) {
      console.log('catch err ⚠️', error);
      throw error.message;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Category)
  async editCategory(
    @Arg('id', () => ID) id: string,
    @Arg('data') { title, thumbnail }: CategoryInput,
    @Ctx() ctx: MyContext
  ) {
    try {
      if (isEmpty(title)) throw new Error('Kategori başlığı gereklidir');
      const slug = generateSlug(title);
      const category = await ctx.prisma.category.findUnique({
        where: { slug },
      });

      if (category && category.title !== title)
        throw new Error('Kategori başlığı kullanılıyor');

      return ctx.prisma.category.update({
        where: {
          id,
        },
        data: {
          title,
          thumbnail,
          slug,
          user: { connect: { id: ctx.user?.id } },
        },
      });
    } catch (error) {
      console.log('catch err ⚠️', error);
      throw error.message;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => String, {
    description: 'delete a category, admin only',
  })
  async deleteCategory(@Arg('id', () => ID) id: string, @Ctx() ctx: MyContext) {
    try {
      await ctx.prisma.comment.deleteMany({
        where: { post: { categoryId: id } },
      });
      await ctx.prisma.post.deleteMany({ where: { categoryId: id } });
      await ctx.prisma.category.delete({ where: { id } });
      return 'Kategori ve yazıları kaldırıldı';
    } catch (error) {
      console.log('catch err ⚠️', error.message);
      throw error.message;
    }
  }
}
