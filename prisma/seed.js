const { PrismaClient } = require('@prisma/client');
const { transliterate } = require('./seed-utils');

const prisma = new PrismaClient();

async function seed() {
  // Очищаем базу данных
  await prisma.adminFavorite.deleteMany();
  await prisma.adminCart.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.colorVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Создаем администратора
  await prisma.user.create({
    data: {
      id: 'admin',
      name: 'Администратор',
      email: 'admin@example.com',
      password: '$2a$12$kp3/VK6zxqhZqh6P1Ic/8eS6PJUvf/X6Y5qGXvs5f1WxNGYvNMKJi', // admin123
    },
  });

  // Создаем основные разделы
  const products = await prisma.category.create({
    data: {
      name: 'Товары',
      href: transliterate('Товары'),
      subcategories: {
        create: [
          {
            name: 'Кровати',
            href: transliterate('Кровати'),
            subcategories: {
              create: [
                {
                  name: 'Кровати каркасные',
                  href: transliterate('Кровати каркасные'),
                },
                {
                  name: 'Кровати мягкие',
                  href: transliterate('Кровати мягкие'),
                },
                {
                  name: 'Кровати двуспальные',
                  href: transliterate('Кровати двуспальные'),
                },
                {
                  name: 'Кровати-диваны',
                  href: transliterate('Кровати-диваны'),
                },
                {
                  name: 'Кровати полутораспальные',
                  href: transliterate('Кровати полутораспальные'),
                },
                {
                  name: 'Кровати односпальные',
                  href: transliterate('Кровати односпальные'),
                },
                {
                  name: 'Опции к кроватям',
                  href: transliterate('Опции к кроватям'),
                },
              ],
            },
          },
          {
            name: 'Матрасы и товары для сна',
            href: transliterate('Матрасы и товары для сна'),
            subcategories: {
              create: [
                {
                  name: 'Матрасы',
                  href: transliterate('Матрасы'),
                },
                {
                  name: 'Наматрасники',
                  href: transliterate('Наматрасники'),
                },
                {
                  name: 'Подушки',
                  href: transliterate('Подушки'),
                },
              ],
            },
          },
          {
            name: 'Диваны и кресла',
            href: transliterate('Диваны и кресла'),
            subcategories: {
              create: [
                {
                  name: 'Диваны прямые',
                  href: transliterate('Диваны прямые'),
                },
                {
                  name: 'Диваны угловые',
                  href: transliterate('Диваны угловые'),
                },
                {
                  name: 'Кресла мягкие',
                  href: transliterate('Кресла мягкие'),
                },
              ],
            },
          },
          {
            name: 'Пуфы и банкетки',
            href: transliterate('Пуфы и банкетки'),
            subcategories: {
              create: [
                {
                  name: 'Пуфы',
                  href: transliterate('Пуфы'),
                },
                {
                  name: 'Банкетки',
                  href: transliterate('Банкетки'),
                },
              ],
            },
          },
          {
            name: 'Шкафы',
            href: transliterate('Шкафы'),
            subcategories: {
              create: [
                {
                  name: 'Шкафы-купе',
                  href: transliterate('Шкафы-купе'),
                },
                {
                  name: 'Шкафы распашные',
                  href: transliterate('Шкафы распашные'),
                },
                {
                  name: 'Шкафы угловые',
                  href: transliterate('Шкафы угловые'),
                },
              ],
            },
          },
          {
            name: 'Стеллажи',
            href: transliterate('Стеллажи'),
          },
          {
            name: 'Комоды и тумбы',
            href: transliterate('Комоды и тумбы'),
            subcategories: {
              create: [
                {
                  name: 'Комоды',
                  href: transliterate('Комоды'),
                },
                {
                  name: 'Тумбы прикроватные',
                  href: transliterate('Тумбы прикроватные'),
                },
                {
                  name: 'Тумбы ТВ',
                  href: transliterate('Тумбы ТВ'),
                },
              ],
            },
          },
          {
            name: 'Столы и стулья',
            href: transliterate('Столы и стулья'),
            subcategories: {
              create: [
                {
                  name: 'Столы обеденные',
                  href: transliterate('Столы обеденные'),
                },
                {
                  name: 'Столы журнальные',
                  href: transliterate('Столы журнальные'),
                },
                {
                  name: 'Стулья',
                  href: transliterate('Стулья'),
                },
              ],
            },
          },
          {
            name: 'Готовые наборы',
            href: transliterate('Готовые наборы'),
          },
        ],
      },
    },
    include: {
      subcategories: true,
    },
  });

  const rooms = await prisma.category.create({
    data: {
      name: 'Комнаты',
      href: transliterate('Комнаты'),
      subcategories: {
        create: [
          {
            name: 'Спальня',
            href: transliterate('Спальня'),
          },
          {
            name: 'Гостиная',
            href: transliterate('Гостиная'),
          },
          {
            name: 'Детская',
            href: transliterate('Детская'),
          },
          {
            name: 'Прихожая',
            href: transliterate('Прихожая'),
          },
        ],
      },
    },
  });

  const collections = await prisma.category.create({
    data: {
      name: 'Коллекции',
      href: transliterate('Коллекции'),
    },
  });

  const custom = await prisma.category.create({
    data: {
      name: 'На заказ',
      href: transliterate('На заказ'),
    },
  });

  const sale = await prisma.category.create({
    data: {
      name: 'Акции и распродажа',
      href: transliterate('Акции и распродажа'),
    },
  });

  const kitchens = await prisma.category.create({
    data: {
      name: 'Кухни',
      href: transliterate('Кухни'),
      subcategories: {
        create: [
          {
            name: 'Готовые кухни',
            href: transliterate('Готовые кухни'),
          },
          {
            name: 'Модульные кухни',
            href: transliterate('Модульные кухни'),
          },
          {
            name: 'Кухни на заказ',
            href: transliterate('Кухни на заказ'),
          },
        ],
      },
    },
  });

  const offices = await prisma.category.create({
    data: {
      name: 'Офисы и гостиницы',
      href: transliterate('Офисы и гостиницы'),
      subcategories: {
        create: [
          {
            name: 'Офисная мебель',
            href: transliterate('Офисная мебель'),
            subcategories: {
              create: [
                {
                  name: 'Столы офисные',
                  href: transliterate('Столы офисные'),
                },
                {
                  name: 'Кресла офисные',
                  href: transliterate('Кресла офисные'),
                },
                {
                  name: 'Шкафы офисные',
                  href: transliterate('Шкафы офисные'),
                },
              ],
            },
          },
          {
            name: 'Мебель для гостиниц',
            href: transliterate('Мебель для гостиниц'),
          },
        ],
      },
    },
  });

  // Создаем продукты
  const divanyCategory = products.subcategories.find(cat => cat.name === 'Диваны и кресла');
  const krovatiCategory = products.subcategories.find(cat => cat.name === 'Кровати');
  const stolyCategory = products.subcategories.find(cat => cat.name === 'Столы и стулья');

  await prisma.product.create({
    data: {
      name: 'Диван угловой "Комфорт"',
      slug: transliterate('Диван угловой Комфорт'),
      description: 'Удобный угловой диван с обивкой из экокожи. Идеально подходит для современного интерьера.',
      seoTitle: 'Купить угловой диван Комфорт',
      seoDescription: 'Удобный угловой диван с обивкой из экокожи по выгодной цене',
      keywords: ['диван', 'угловой диван', 'мебель', 'гостиная'],
      specifications: {
        "Размеры": "245x155x90 см",
        "Материал обивки": "Экокожа",
        "Наполнитель": "ППУ",
        "Механизм": "Еврокнижка",
        "Бельевой ящик": "Есть"
      },
      price: 54990,
      images: [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
        "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea"
      ],
      defaultImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
      categoryId: products.id,
      subcategoryId: divanyCategory.id,
      inStock: true,
      discount: 15,
      material: "leather",
      rating: 4.5,
      reviewsCount: 12,
      colorVariants: {
        create: [
          {
            name: "Бежевый",
            hex: "#F5DEB3",
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
          },
          {
            name: "Серый",
            hex: "#808080",
            image: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea",
          }
        ]
      }
    },
  });

  await prisma.product.create({
    data: {
      name: 'Кресло "Уют"',
      slug: transliterate('Кресло Уют'),
      description: 'Мягкое кресло в скандинавском стиле. Идеально для чтения и отдыха.',
      seoTitle: 'Купить кресло Уют',
      seoDescription: 'Стильное и удобное кресло в скандинавском стиле',
      keywords: ['кресло', 'мягкое кресло', 'мебель', 'гостиная'],
      specifications: {
        "Размеры": "75x85x95 см",
        "Материал обивки": "Велюр",
        "Наполнитель": "ППУ",
        "Каркас": "Массив сосны",
        "Механизм": "Отсутствует"
      },
      price: 24990,
      images: [
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91"
      ],
      defaultImage: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",
      categoryId: products.id,
      subcategoryId: divanyCategory.id,
      inStock: true,
      material: "textile",
      rating: 4.8,
      reviewsCount: 8,
      colorVariants: {
        create: [
          {
            name: "Зеленый",
            hex: "#2E8B57",
            image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",
          },
          {
            name: "Синий",
            hex: "#4169E1",
            image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91",
          }
        ]
      }
    },
  });

  await prisma.product.create({
    data: {
      name: 'Кровать "Люкс"',
      slug: transliterate('Кровать Люкс'),
      description: 'Двуспальная кровать с мягким изголовьем и подъемным механизмом.',
      seoTitle: 'Купить кровать Люкс с мягким изголовьем',
      seoDescription: 'Современная двуспальная кровать с подъемным механизмом',
      keywords: ['кровать', 'двуспальная кровать', 'мебель', 'спальня'],
      specifications: {
        "Размеры": "160x200 см",
        "Материал обивки": "Рогожка",
        "Основание": "Ортопедическое",
        "Бельевой ящик": "Есть",
        "Подъемный механизм": "Есть"
      },
      price: 49990,
      images: [
        "https://images.unsplash.com/photo-1505693314120-0d443867891c",
        "https://images.unsplash.com/photo-1505693314120-0d443867891c"
      ],
      defaultImage: "https://images.unsplash.com/photo-1505693314120-0d443867891c",
      categoryId: products.id,
      subcategoryId: krovatiCategory.id,
      inStock: true,
      material: "textile",
      rating: 4.7,
      reviewsCount: 15,
      colorVariants: {
        create: [
          {
            name: "Бежевый",
            hex: "#F5DEB3",
            image: "https://images.unsplash.com/photo-1505693314120-0d443867891c",
          },
          {
            name: "Серый",
            hex: "#808080",
            image: "https://images.unsplash.com/photo-1505693314120-0d443867891c",
          }
        ]
      }
    },
  });

  await prisma.product.create({
    data: {
      name: 'Стол обеденный "Модерн"',
      slug: transliterate('Стол обеденный Модерн'),
      description: 'Современный обеденный стол из массива дуба со стеклянной столешницей.',
      seoTitle: 'Купить обеденный стол Модерн',
      seoDescription: 'Современный обеденный стол из массива дуба',
      keywords: ['стол', 'обеденный стол', 'мебель', 'столовая'],
      specifications: {
        "Размеры": "150x90x75 см",
        "Материал": "Массив дуба, стекло",
        "Покрытие": "Лак",
        "Количество мест": "6",
        "Раскладной": "Нет"
      },
      price: 34990,
      images: [
        "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4",
        "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4"
      ],
      defaultImage: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4",
      categoryId: products.id,
      subcategoryId: stolyCategory.id,
      inStock: true,
      material: "wood",
      rating: 4.9,
      reviewsCount: 20,
      colorVariants: {
        create: [
          {
            name: "Натуральный дуб",
            hex: "#B87A3D",
            image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4",
          },
          {
            name: "Венге",
            hex: "#4A3B2B",
            image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4",
          }
        ]
      }
    },
  });

  console.log('Database has been seeded. 🌱');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 