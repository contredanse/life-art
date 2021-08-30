import { PrismaClientDbMain } from '@contredanse/db-main';
import { BadRequest, InternalServerError, NotFound } from '@tsed/exceptions';
import { Asserts, UnPromisify } from '@contredanse/common';

export type GetUserByEmail = UnPromisify<
  ReturnType<typeof UserRepositorySsr['prototype']['getUserByEmail']>
>;

export class UserRepositorySsr {
  constructor(private prisma: PrismaClientDbMain) {}

  /**
   * @throws Error
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getUserByEmail = async (email: string) => {
    try {
      Asserts.nonEmptyString(email, () => {
        return new BadRequest('Email must be a string');
      });
      const user = this.prisma.user.findUnique({
        where: { email: email },
        include: {
          apps: true,
          profile: true,
        },
      });
      Asserts.isPresent(
        user,
        () => new NotFound(`User ${email} can't be found`)
      );
      return user;
    } catch (e) {
      throw new InternalServerError(`getUserByEmail failed with ${email}.`, e);
    }
  };
}
