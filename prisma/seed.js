const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  await prisma.user.deleteMany();

  const testUser1 = await prisma.user.create({
    data: {
      username: 'admin',
      password: '$2a$10$HRR49Dor51a4QTTjOZcQFu/K1XiKs1s6Kkr17yplhQZgC5cJnyV3q', //123123
      role: 'ADMIN',
    },
  });

  return { testUser1 };
}

main()
  .then((data) => console.log('data 🐤', data))
  .catch((e) => console.error(e))
  .finally(async () => {
    console.log('DONE 🐤');
    await prisma.$disconnect();
  });
