'use client';

import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    id: 1,
    name: 'Кровати и матрасы',
    description: 'Создайте спальню своей мечты с нашей коллекцией кроватей и матрасов.',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c',
    href: '/catalog?category=beds',
    className: 'col-span-2 row-span-2',
  },
  {
    id: 2,
    name: 'Стулья',
    description: 'Широкий выбор стульев для вашего дома и офиса.',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657',
    href: '/catalog?category=chairs',
    className: 'col-span-2 row-span-2',
  },
  {
    id: 3,
    name: 'Освещение',
    description: 'Создайте уютную атмосферу в доме.',
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5',
    href: '/catalog?category=lightning',
    className: 'col-span-1 row-span-1',
  },
  {
    id: 4,
    name: 'Шкафы',
    description: 'Стильные решения для хранения.',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2',
    href: '/catalog?category=cabinet',
    className: 'col-span-1 row-span-1',
  },
  {
    id: 5,
    name: 'Аксессуары',
    description: 'Детали, создающие уют.',
    image: 'https://images.unsplash.com/photo-1533090368676-1fd25485db88',
    href: '/catalog?category=accessories',
    className: 'col-span-1 row-span-1',
  },
  {
    id: 6,
    name: 'Столы',
    description: 'Обеденные и рабочие столы.',
    image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4',
    href: '/catalog?category=tables',
    className: 'col-span-1 row-span-1',
  },
];

export default function CategorySlider() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Заголовок */}
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-graphite mb-2">
            Популярные категории товаров
          </h2>
          <p className="text-graphite/70">
            Откройте для себя нашу коллекцию мебели и создайте дом своей мечты.
          </p>
        </div>

        {/* Сетка категорий */}
        <div className="grid grid-cols-4 gap-6 auto-rows-[200px]">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className={`group relative overflow-hidden rounded-2xl bg-white 
              hover:shadow-xl transition-all duration-300 ${category.className}`}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 
                group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 
              transition-colors duration-300" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-medium text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-white/90 mb-4">
                  {category.description}
                </p>
                <button className="w-fit px-4 py-2 bg-white/90 text-graphite rounded-lg 
                text-sm font-medium hover:bg-white transition-colors duration-300">
                  Смотреть товары
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 