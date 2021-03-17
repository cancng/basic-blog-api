import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import bcrypt from 'bcryptjs';
import { MyContext } from '../types/MyContext';
// import { isEmpty } from 'class-validator';
import { generateToken } from '../util/functions';
import { isAuth } from '../middlewares/isAuth';
import { User } from '@generated/type-graphql';

@ObjectType()
class LoginResponse {
  @Field()
  id: string;
  @Field()
  token: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => LoginResponse, {
    nullable: true,
    description: 'Login mutation. Returns user id and authorization token',
  })
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext
  ): Promise<LoginResponse> {
    const user = await ctx.prisma.user.findUnique({ where: { username } });
    if (!user) throw new Error('Giriş bilgileri yanlış');

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) throw new Error('Giriş bilgileri yanlış (pw)');

    const token = generateToken(user.id, user.username);

    return {
      id: user.id,
      token,
    };
  }

  @UseMiddleware(isAuth)
  @Query(() => User, {
    description: 'Returns user info which is logged in',
    nullable: true,
  })
  async me(@Ctx() ctx: MyContext) {
    try {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user?.id },
      });
      if (!user) throw new Error('Bir hata oluştu');
      return user;
    } catch (error) {
      console.log('catch err ⚠️', error.message);
      throw error;
    }
  }
}
