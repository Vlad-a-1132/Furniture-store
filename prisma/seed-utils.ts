function transliterate(text: string): string {
  const rusToLat = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya',
    ' ': '-', '_': '-', '/': '-', '\\': '-'
  } as const;

  return text
    .toLowerCase()
    .split('')
    .map(char => rusToLat[char as keyof typeof rusToLat] || char)
    .join('')
    .replace(/[^\w\s-]/g, '') // Удаляем все символы кроме букв, цифр и дефисов
    .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
    .replace(/-+/g, '-') // Заменяем множественные дефисы на один
    .replace(/^-+|-+$/g, '') // Убираем дефисы в начале и конце
    .replace(/[^a-z0-9-]/g, ''); // Оставляем только английские буквы, цифры и дефисы
}

module.exports = {
  transliterate,
}; 