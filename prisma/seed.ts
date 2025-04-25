const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Функция для копирования изображения в папку uploads
async function copyImageToUploads(imageName: string): Promise<string> {
  const sourceDir = path.join(process.cwd(), 'seed-images');
  const targetDir = path.join(process.cwd(), 'public', 'uploads');
  
  // Создаем папку uploads, если её нет
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const sourcePath = path.join(sourceDir, imageName);
  const targetPath = path.join(targetDir, imageName);

  // Проверяем существование исходного файла
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source image not found: ${sourcePath}`);
    return `/uploads/${imageName}`; // Возвращаем путь даже если файл не существует
  }

  try {
    // Копируем файл
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied image: ${imageName}`);
    return `/uploads/${imageName}`;
  } catch (error) {
    console.error(`Error copying image ${imageName}:`, error);
    return `/uploads/${imageName}`;
  }
}

async function main() {
  // Очищаем существующие данные
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const livingRoom = await prisma.category.create({
    data: {
      name: 'Гостиная',
      href: 'living-room',
    },
  });

  const bedroom = await prisma.category.create({
    data: {
      name: 'Спальня',
      href: 'bedroom',
    },
  });

  const kitchen = await prisma.category.create({
    data: {
      name: 'Кухня',
      href: 'kitchen',
    },
  });

  // Create subcategories
  const sofas = await prisma.category.create({
    data: {
      name: 'Диваны',
      href: 'sofas',
      parentId: livingRoom.id,
    },
  });

  const chairs = await prisma.category.create({
    data: {
      name: 'Стулья',
      href: 'chairs',
      parentId: livingRoom.id,
    },
  });

  const beds = await prisma.category.create({
    data: {
      name: 'Кровати',
      href: 'beds',
      parentId: bedroom.id,
    },
  });

  const wardrobes = await prisma.category.create({
    data: {
      name: 'Шкафы',
      href: 'wardrobes',
      parentId: bedroom.id,
    },
  });

  const tables = await prisma.category.create({
    data: {
      name: 'Столы',
      href: 'tables',
      parentId: kitchen.id,
    },
  });

  // Копируем все изображения перед созданием продуктов
  const imageFiles = [
    'sofa1.jpg', 'sofa2.jpg', 'sofa3.jpg',
    'chair1.jpg', 'chair2.jpg',
    'bed1.jpg', 'bed2.jpg',
    'wardrobe1.jpg', 'wardrobe2.jpg',
    'table1.jpg', 'table2.jpg'
  ];

  for (const imageFile of imageFiles) {
    await copyImageToUploads(imageFile);
  }

  // Create products
  const products = [
    {
      name: 'Диван "Комфорт Люкс"',
      slug: 'divan-komfort-luks',
      description: 'Роскошный диван с обивкой из высококачественного велюра. Механизм трансформации "Еврокнижка" обеспечивает удобное спальное место. Диван оснащен вместительным бельевым ящиком.',
      price: 54999,
      discount: 15,
      specifications: {
        'Размеры': '245x105x95 см',
        'Спальное место': '195x145 см',
        'Материал обивки': 'Велюр',
        'Наполнитель': 'ППУ, периотек',
        'Механизм': 'Еврокнижка',
        'Бельевой ящик': 'Есть',
      },
      images: [
        '/uploads/sofa1.jpg',
        '/uploads/sofa2.jpg',
        '/uploads/sofa3.jpg'
      ],
      defaultImage: '/uploads/sofa1.jpg',
      categoryId: sofas.id,
      inStock: true,
      material: 'Велюр',
    },
    {
      name: 'Стул "Модерн"',
      slug: 'stul-modern',
      description: 'Современный стул с эргономичной спинкой. Идеально подходит как для домашнего использования, так и для офиса. Прочный металлический каркас обеспечивает надежность конструкции.',
      price: 7999,
      specifications: {
        'Размеры': '45x45x95 см',
        'Материал сиденья': 'Экокожа',
        'Каркас': 'Металл',
        'Максимальная нагрузка': '120 кг',
      },
      images: [
        '/uploads/chair1.jpg',
        '/uploads/chair2.jpg'
      ],
      defaultImage: '/uploads/chair1.jpg',
      categoryId: chairs.id,
      inStock: true,
      material: 'Экокожа',
    },
    {
      name: 'Кровать "Сон Премиум"',
      slug: 'krovat-son-premium',
      description: 'Роскошная двуспальная кровать с мягким изголовьем. Комплектуется ортопедическим основанием и подъемным механизмом для доступа к бельевому ящику.',
      price: 69999,
      discount: 10,
      specifications: {
        'Размеры': '180x200 см',
        'Высота изголовья': '120 см',
        'Материал обивки': 'Рогожка',
        'Основание': 'Ортопедическое',
        'Подъемный механизм': 'Есть',
        'Бельевой ящик': 'Есть',
      },
      images: [
        '/uploads/bed1.jpg',
        '/uploads/bed2.jpg'
      ],
      defaultImage: '/uploads/bed1.jpg',
      categoryId: beds.id,
      inStock: true,
      material: 'Рогожка',
    },
    {
      name: 'Шкаф-купе "Максимум"',
      slug: 'shkaf-kupe-maximum',
      description: 'Вместительный шкаф-купе с зеркальными дверями. Продуманная система хранения включает штанги для вешалок, полки и ящики. Плавный ход дверей обеспечивается качественной фурнитурой.',
      price: 45999,
      specifications: {
        'Размеры': '220x60x240 см',
        'Материал корпуса': 'ЛДСП',
        'Двери': 'Зеркало/ЛДСП',
        'Количество секций': '3',
        'Количество штанг': '2',
        'Количество полок': '8',
      },
      images: [
        '/uploads/wardrobe1.jpg',
        '/uploads/wardrobe2.jpg'
      ],
      defaultImage: '/uploads/wardrobe1.jpg',
      categoryId: wardrobes.id,
      inStock: true,
      material: 'ЛДСП',
    },
    {
      name: 'Стол "Фьюжн"',
      slug: 'stol-fusion',
      description: 'Современный обеденный стол с керамической столешницей. Прочная металлическая база обеспечивает устойчивость. Идеально подходит для семейных обедов и приема гостей.',
      price: 34999,
      discount: 5,
      specifications: {
        'Размеры': '160x90x75 см',
        'Материал столешницы': 'Керамика',
        'Основание': 'Металл',
        'Максимальная нагрузка': '100 кг',
      },
      images: [
        '/uploads/table1.jpg',
        '/uploads/table2.jpg'
      ],
      defaultImage: '/uploads/table1.jpg',
      categoryId: tables.id,
      inStock: true,
      material: 'Керамика',
    },
  ];

  // Создаем продукты
  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        rating: 0,
        reviewsCount: 0,
        keywords: [product.name, product.material, 'мебель', 'интерьер'],
        colorVariants: {
          create: [
            {
              name: 'Бежевый',
              hex: '#F5F5DC',
              image: product.defaultImage,
            },
            {
              name: 'Серый',
              hex: '#808080',
              image: product.defaultImage,
            },
          ],
        },
      },
    });
  }

  // Создаем администратора
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Администратор',
      password: adminPassword,
    },
  });

  console.log({ admin });

  console.log('База данных успешно заполнена тестовыми данными! 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 