'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <select
      value={searchParams.get('sort') || 'default'}
      onChange={(e) => handleSort(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
    >
      <option value="default">По умолчанию</option>
      <option value="price_asc">Цена: по возрастанию</option>
      <option value="price_desc">Цена: по убыванию</option>
      <option value="name_asc">Название: А-Я</option>
      <option value="name_desc">Название: Я-А</option>
      <option value="rating">По рейтингу</option>
    </select>
  );
} 