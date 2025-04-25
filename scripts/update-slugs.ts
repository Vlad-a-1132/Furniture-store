const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

type TranslitMap = {
  [key: string]: string;
};

function transliterate(text: string): string {
  const rusToLat: TranslitMap = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya',
    ' ': '-', '_': '-', '/': '-', '\\': '-',
  };

  return text
    .toLowerCase()
    .split('')
    .map(char => rusToLat[char] || char)
    .join('')
    .replace(/[^\w\s-]/g, '') // Удаляем все символы кроме букв, цифр, пробелов и дефисов
    .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
    .replace(/-+/g, '-') // Заменяем множественные дефисы на один
    .replace(/^-+|-+$/g, ''); // Убираем дефисы в начале и конце
}

async function generateUniqueSlug(name: string, existingId?: string): Promise<string> {
  let slug = transliterate(name);
  let counter = 0;
  let uniqueSlug = slug;

  while (true) {
    const existing = await prisma.product.findFirst({
      where: {
        slug: uniqueSlug,
        ...(existingId ? { NOT: { id: existingId } } : {}),
      },
    });

    if (!existing) {
      break;
    }

    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }

  return uniqueSlug;
}

async function main() {
  try {
    // Получаем все товары
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products to update`);

    // Обновляем slug для каждого товара
    for (const product of products) {
      const slug = await generateUniqueSlug(product.name, product.id);
      await prisma.product.update({
        where: { id: product.id },
        data: { slug },
      });
      console.log(`Updated slug for product "${product.name}" to "${slug}"`);
    }

    console.log('All products have been updated successfully');
  } catch (error) {
    console.error('Error updating product slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 