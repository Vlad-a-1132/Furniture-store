const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Удаляем существующего админа, если есть
  await prisma.user.deleteMany({
    where: {
      OR: [
        { id: 'admin' },
        { email: 'admin@example.com' }
      ]
    }
  });

  // Создаем нового админа
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.create({
    data: {
      id: 'admin',
      email: 'admin@example.com',
      name: 'Администратор',
      password: hashedPassword,
    },
  });

  console.log('Администратор создан:', admin);
}

main()
  .catch((e) => {
    console.error('Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 