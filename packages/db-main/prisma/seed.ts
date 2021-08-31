import { PrismaClient, Prisma } from '@prisma/client';
import { AuthHashService } from 'halprin-web-app/src/backend/auth/crypt/auth-hash-service';

const prisma = new PrismaClient();

const authHashService = new AuthHashService();

const getUserSeed = async (): Promise<Prisma.UserCreateInput[]> => {
  return [
    {
      firstName: 'Sébastien',
      lastName: 'Vanvelthem',
      nickname: 'belgattitude',
      email: 'belgattitude@gmail.com',
      roles: ['ADMIN'],
      password: await authHashService.hashPassword('demo'),
    },
    {
      firstName: 'Demo',
      lastName: 'Contredanse',
      nickname: 'contredanse',
      email: 'ilove@contredanse.org',
      roles: ['ADMIN'],
      password: await authHashService.hashPassword('demo'),
    },
  ];
};

const apps: Prisma.AppCreateInput[] = [
  {
    reference: 'mfts',
    name: 'Material for the spine',
    url: 'https://www.materialforthespine.com',
  },
  {
    reference: 'life-art',
    name: 'Anna Halprin - Life art process',
    url: 'https://www.contredanse.org',
  },
];

const userMediaHistory: Prisma.UserMediaHistoryCreateInput[] = [
  {
    email: 'ilove@contredanse.org',
    appReference: 'life-art',
    mediaSlug: 'to-the-roots-of-dance',
    fullyWatchedAt: new Date(),
  },
  {
    email: 'ilove@contredanse.org',
    appReference: 'life-art',
    mediaSlug: 'dance-as-a-science',
    favoritedAt: new Date(),
  },
  {
    email: 'ilove@contredanse.org',
    appReference: 'life-art',
    mediaSlug: 'in-the-environment',
    fullyWatchedAt: new Date(),
    favoritedAt: new Date(),
  },
];

async function main() {
  console.log(`Start seeding ...`);
  // apps
  for (const a of apps) {
    const { reference, ...rest } = a;
    const app = await prisma.app.upsert({
      where: { reference: reference },
      update: { ...rest },
      create: a,
    });
    console.log(`Created or updated app '${app.reference}' with id: ${app.id}`);
  }
  // users and posts
  const userData = await getUserSeed();
  for (const u of userData) {
    const { email, ...rest } = u;
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { ...rest },
      create: u,
    });
    console.log(`Created or updated user '${u.email}' with id: ${user.id}`);
  }
  // user media history
  for (const umh of userMediaHistory) {
    const { email, mediaSlug, appReference, fullyWatchedAt, favoritedAt } = umh;
    const history = await prisma.userMediaHistory.upsert({
      where: {
        email_mediaSlug_appReference: {
          mediaSlug: mediaSlug,
          appReference: appReference ?? '',
          email: email,
        },
      },
      update: { fullyWatchedAt: fullyWatchedAt, favoritedAt: favoritedAt },
      create: umh,
    });
    console.log(`Created or updated userMediaHistory with id: ${history.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
