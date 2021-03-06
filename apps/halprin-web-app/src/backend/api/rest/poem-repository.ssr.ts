import { PrismaClientDbMain } from '@contredanse/db-main';
import { InternalServerError } from '@tsed/exceptions';
import { UnPromisify } from '@contredanse/common';

export type GetPoems = UnPromisify<
  ReturnType<typeof PoemRepositorySsr['prototype']['getPoems']>
>;

export class PoemRepositorySsr {
  constructor(private prisma: PrismaClientDbMain) {}

  /**
   * @throws Error
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getPoems = async (options?: { limit?: number; offset?: number }) => {
    const { limit, offset } = options ?? {};
    try {
      return await this.prisma.poem.findMany({
        skip: offset,
        take: limit,
        orderBy: { author: 'desc' },
      });
    } catch (e) {
      throw new InternalServerError(`Poems can't be retrieved`, e);
    }
  };
}
