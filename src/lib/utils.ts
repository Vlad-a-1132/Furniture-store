import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transliterate(str: string): string {
  const ru = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e',
    'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k',
    'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
    'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c',
    'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya'
  };

  str = str.toLowerCase();
  
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    result += ru[char as keyof typeof ru] || char;
  }

  // Заменяем все символы, кроме букв, цифр и дефиса на дефис
  result = result.replace(/[^a-z0-9-]/g, '-');
  
  // Убираем повторяющиеся дефисы
  result = result.replace(/-+/g, '-');
  
  // Убираем дефисы в начале и конце
  result = result.replace(/^-+|-+$/g, '');

  return result;
}

export async function generateUniqueSlug(prisma: any, name: string, excludeId?: string) {
  let slug = transliterate(name);
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        slug,
        id: excludeId ? { not: excludeId } : undefined,
      },
    });

    if (!existingProduct) {
      isUnique = true;
    } else {
      slug = `${transliterate(name)}-${counter}`;
      counter++;
    }
  }

  return slug;
} 