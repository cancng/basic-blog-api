import { Query, Resolver } from 'type-graphql';
/* import { Ctx, UseMiddleware } from 'type-graphql';
import { isAuth } from '../middlewares/isAuth';
import { MyContext } from '../types/MyContext'; */

@Resolver()
export class TestResolver {
  /* @UseMiddleware(isAuth)
  @Query(() => String)
  async testQuery(@Ctx() ctx: MyContext) {
    return 'asdasd';
  } */

  @Query(() => String)
  async testQuery() {
    return 'asdasd';
  }
}
