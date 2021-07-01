import { UserRole } from '.prisma/client';
import { AuthChecker } from 'type-graphql';
import { MyContext } from '../types/MyContext';

export const customAuthChecker: AuthChecker<MyContext> = async (
  root,
  roles
) => {
  const { context } = root;

  if (!context.user) {
    return false;
  } else {
    const user = await context.prisma.user.findUnique({
      where: { id: context.user.id },
    });
    if (
      roles &&
      (user?.role === UserRole.ADMIN || roles.some((x) => x === user?.role))
    ) {
      return true;
    }
    return false;
  }
};
