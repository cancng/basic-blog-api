import { Arg, Ctx, ID, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { Page } from '@generated/type-graphql';
import { isAuth } from '../middlewares/isAuth';
import { PageInput } from './inputs/PageInput';
import { MyContext } from '../types/MyContext';
import { isEmpty } from 'class-validator';
import { generateSlug } from '../util/functions';

@Resolver()
export class PageResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Page)
  async createPage(
    @Arg('data') { title, content }: PageInput,
    @Ctx() ctx: MyContext
  ) {
    if (isEmpty(title.trim())) throw new Error('Sayfa başlığı gereklidir');
    if (isEmpty(content.trim())) throw new Error('Sayfa içeriği gereklidir');
    try {
      const slug = generateSlug(title);
      const page = await ctx.prisma.page.findUnique({ where: { slug } });
      if (page) throw new Error('Bu sayfa başlığı kullanılıyor');

      return ctx.prisma.page.create({
        data: {
          title,
          content,
          slug,
          user: { connect: { id: ctx.user?.id } },
        },
      });
    } catch (error) {
      console.log('catch err ⚠️', error.message);
      throw error;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Page)
  async editPage(
    @Arg('id', () => ID) id: string,
    @Arg('data') { title, content }: PageInput,
    @Ctx() ctx: MyContext
  ) {
    if (isEmpty(title.trim())) throw new Error('Sayfa başlığı gereklidir');
    if (isEmpty(content.trim())) throw new Error('Sayfa içeriği gereklidir');
    try {
      const slug = generateSlug(title);
      const page = await ctx.prisma.page.findUnique({ where: { slug } });
      if (page && page.slug !== slug)
        throw new Error('Bu sayfa başlığı kullanılıyor');
      return ctx.prisma.page.update({
        where: {
          id,
        },
        data: {
          title,
          content,
          slug,
          user: { connect: { id: ctx.user?.id } },
        },
      });
    } catch (error) {
      console.log('catch err ⚠️', error.message);
      throw error;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => String)
  async deletePage(@Arg('id', () => ID) id: string, @Ctx() ctx: MyContext) {
    try {
      await ctx.prisma.page.delete({ where: { id } });
      return 'Sayfa kaldırıldı';
    } catch (error) {
      console.log('catch err ⚠️', error.message);
      throw error;
    }
  }
}
