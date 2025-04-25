'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Search } from 'lucide-react';
import UserMenu from './UserMenu';
import ShopControls from './ShopControls';
import SearchBar from './SearchBar';
import Image from 'next/image';

interface SubSubCategory {
  name: string;
  href: string;
}

interface SubCategory {
  name: string;
  href: string;
  subCategories?: SubSubCategory[];
  image?: string;
}

interface Category {
  name: string;
  href: string;
  subcategories?: SubCategory[];
}

const navigation: Category[] = [
  {
    name: 'Товары',
    href: '/catalog',
    subcategories: [
      {
        name: 'Кровати',
        href: '/catalog/beds',
        subCategories: [
          { name: 'Кровати каркасные', href: '/catalog/beds/frame' },
          { name: 'Кровати мягкие', href: '/catalog/beds/soft' },
          { name: 'Кровати двуспальные', href: '/catalog/beds/double' },
          { name: 'Кровати-диваны', href: '/catalog/beds/sofa' },
          { name: 'Кровати полутораспальные', href: '/catalog/beds/semi-double' },
          { name: 'Кровати односпальные', href: '/catalog/beds/single' },
          { name: 'Опции к кроватям', href: '/catalog/beds/options' },
        ],
        image: '/images/bed-preview.jpg',
      },
      {
        name: 'Матрасы и товары для сна',
        href: '/catalog/mattresses',
        subCategories: [
          { name: 'Матрасы пружинные', href: '/catalog/mattresses/spring' },
          { name: 'Матрасы беспружинные', href: '/catalog/mattresses/springless' },
          { name: 'Матрасы детские', href: '/catalog/mattresses/children' },
          { name: 'Наматрасники', href: '/catalog/mattresses/toppers' },
          { name: 'Подушки', href: '/catalog/mattresses/pillows' },
          { name: 'Защитные чехлы', href: '/catalog/mattresses/covers' },
          { name: 'Одеяла', href: '/catalog/mattresses/blankets' },
        ],
        image: 'https://i.postimg.cc/9Q6hJnj7/the-truth-about-mattresses-110609.webp'
      },
      {
        name: 'Диваны и кресла',
        href: '/catalog/sofas',
        subCategories: [
          { name: 'Диваны прямые', href: '/catalog/sofas/straight' },
          { name: 'Диваны угловые', href: '/catalog/sofas/corner' },
          { name: 'Диваны модульные', href: '/catalog/sofas/modular' },
          { name: 'Кресла', href: '/catalog/sofas/armchairs' },
          { name: 'Текстиль для мягкой мебели', href: '/catalog/sofas/textiles' },
        ],
        image: 'https://i.postimg.cc/HkqKd9fb/medley-sofas-collection.webp',
      },
      {
        name: 'Пуфы и банкетки',
        href: '/catalog/poufs',
        subCategories: [
          { name: 'Пуфы', href: '/catalog/poufs/poufs' },
          { name: 'Банкетки', href: '/catalog/poufs/benches' },
        ],
        image: 'https://i.postimg.cc/G3897kkv/71x-XR4-B98-IL-AC-UF1000-1000-QL80.webp'
      },
      {
        name: 'Шкафы',
        href: '/catalog/wardrobes',
        subCategories: [
          { name: 'Шкафы одностворчатые', href: '/catalog/wardrobes/single-door' },
          { name: 'Шкафы двустворчатые', href: '/catalog/wardrobes/double-door' },
          { name: 'Шкафы трехстворчатые', href: '/catalog/wardrobes/triple-door' },
          { name: 'Угловые шкафы', href: '/catalog/wardrobes/corner' },
          { name: 'Гардеробные', href: '/catalog/wardrobes/walk-in' },
          { name: 'Секции центральные', href: '/catalog/wardrobes/central-sections' },
          { name: 'Шкафы с зеркалом', href: '/catalog/wardrobes/mirror' },
          { name: 'Шкафы для спальни', href: '/catalog/wardrobes/bedroom' },
          { name: 'Шкафы для прихожей', href: '/catalog/wardrobes/hallway' },
          { name: 'Модульные шкафы', href: '/catalog/wardrobes/modular' },
          { name: 'Шкафы на заказ', href: '/catalog/wardrobes/custom' },
          { name: 'Гардеробная на заказ', href: '/catalog/wardrobes/custom-walk-in' },
        ],
        image: 'https://i.postimg.cc/jSjb1cyc/fitted-wardrobe-scaled-e1723319284634.webp'
      },
      {
        name: 'Стеллажи',
        href: '/catalog/shelving',
        subCategories: [
          { name: 'Стеллажи прямые', href: '/catalog/shelving/straight' },
          { name: 'Стеллажи угловые', href: '/catalog/shelving/corner' },
          { name: 'Стеллажная система на заказ', href: '/catalog/shelving/custom' },
        ],
        image: 'https://i.postimg.cc/tCwKrbCq/Fard-31-5-W-Steel-Shelving-Unit.webp'
      },
      {
        name: 'Комоды и тумбы',
        href: '/catalog/dressers',
        subCategories: [
          { name: 'Все комоды', href: '/catalog/dressers/all' },
          { name: 'Тумбы под ТВ', href: '/catalog/dressers/tv-stands' },
          { name: 'Тумбы прикроватные', href: '/catalog/dressers/bedside' },
          { name: 'Тумбы выкатные', href: '/catalog/dressers/rolling' },
          { name: 'Тумбы для обуви', href: '/catalog/dressers/shoe' },
          { name: 'Тумбы многоцелевые', href: '/catalog/dressers/multipurpose' },
        ],
        image: 'https://i.postimg.cc/dtcs1Grm/sikaic-dressers-black-modern-6-drawers-double-dresser-with-large-capacity-storage-cabinet-black-dj50.webp'
      },
      {
        name: 'Столы и стулья',
        href: '/catalog/tables',
        subCategories: [
          { name: 'Столы журнальные', href: '/catalog/tables/coffee' },
          { name: 'Столы обеденные', href: '/catalog/tables/dining' },
          { name: 'Столы письменные', href: '/catalog/tables/writing-desk' },
          { name: 'Столы компьютерные', href: '/catalog/tables/computer-desk' },
          { name: 'Столы придиванные', href: '/catalog/tables/side' },
          { name: 'Столы туалетные', href: '/catalog/tables/dressing' },
          { name: 'Опции к столам', href: '/catalog/tables/options' },
          { name: 'Стулья барные', href: '/catalog/chairs/bar' },
          { name: 'Стулья полубарные', href: '/catalog/chairs/counter' },
          { name: 'Стулья деревянные', href: '/catalog/chairs/wooden' },
          { name: 'Стулья металлические', href: '/catalog/chairs/metal' },
          { name: 'Кресла компьютерные', href: '/catalog/chairs/office' },
        ],
        image: 'https://i.postimg.cc/vHWQ6XsH/49da13d5-5f6d-4d9a-93a6-9176e7abf1d6.webp'
      },
      {
        name: 'Готовые наборы',
        href: '/catalog/sets',
        subCategories: [
          { name: 'В спальню', href: '/catalog/sets/bedroom' },
          { name: 'В гостиную', href: '/catalog/sets/living-room' },
          { name: 'В молодежную', href: '/catalog/sets/youth' },
          { name: 'В прихожую', href: '/catalog/sets/hallway' },
          { name: 'Все наборы', href: '/catalog/sets/all' },
        ],
        image: 'https://i.postimg.cc/ZqRrsWb2/B55-Verona.webp'
      },
      {
        name: 'Ещё',
        href: '/catalog/more',
        subCategories: [
          { name: 'Вешалки', href: '/catalog/more/hangers' },
          { name: 'Вешалка настенная', href: '/catalog/more/hangers/wall' },
          { name: 'Вешалка напольная', href: '/catalog/more/hangers/floor' },
          { name: 'Вешалка гардеробная', href: '/catalog/more/hangers/wardrobe' },
          { name: 'Зеркала', href: '/catalog/more/mirrors' },
          { name: 'Зеркала навесные', href: '/catalog/more/mirrors/wall' },
          { name: 'Зеркала для прихожей', href: '/catalog/more/mirrors/hallway' },
          { name: 'Зеркала напольные', href: '/catalog/more/mirrors/floor' },
          { name: 'Секции и полки', href: '/catalog/more/shelves' },
          { name: 'Навесные полки', href: '/catalog/more/shelves/wall' },
          { name: 'Секции навесные', href: '/catalog/more/shelves/sections' },
          { name: 'Офисные диваны, кресла, стулья', href: '/catalog/more/office-furniture' },
          { name: 'Офисные диваны', href: '/catalog/more/office-furniture/sofas' },
          { name: 'Офисные кресла и стулья', href: '/catalog/more/office-furniture/chairs' },
          { name: 'Аутлет', href: '/catalog/more/outlet' },
          { name: 'Распродажа', href: '/catalog/more/sale' },
        ],
        image: 'https://i.postimg.cc/ThM9Zf7m/furniture-1.webp'
      },
    ],
  },
  {
    name: 'Комнаты',
    href: '/rooms',
    subcategories: [
      { name: 'Спальни', href: '/rooms/bedrooms' },
      { name: 'Гостиные', href: '/rooms/living-rooms' },
      { name: 'Прихожие', href: '/rooms/hallways' },
      { name: 'Молодежные', href: '/rooms/youth' },
      { name: 'Кухни', href: '/rooms/kitchens' },
      { name: 'Кабинеты', href: '/rooms/offices' },
      { name: 'Офисы', href: '/rooms/business-offices' },
      { name: 'Гостиницы', href: '/rooms/hotels' },
    ],
  },
  {
    name: 'Коллекции',
    href: '/collections',
    subcategories: [
      { name: 'Классика', href: '/collections/classic' },
      { name: 'Модерн', href: '/collections/modern' },
      { name: 'Скандинавский стиль', href: '/collections/scandinavian' },
      { name: 'Лофт', href: '/collections/loft' },
      { name: 'Минимализм', href: '/collections/minimalism' },
    ],
  },
  {
    name: 'На заказ',
    href: '/custom',
    subcategories: [
      { name: 'Распашные шкафы', href: '/custom/swing-wardrobes' },
      { name: 'Шкафы-купе', href: '/custom/sliding-wardrobes' },
      { name: 'Гардеробные', href: '/custom/walk-in-closets' },
      { name: 'Стеллажные системы', href: '/custom/shelving-systems' },
      { name: 'Кухни', href: '/custom/kitchens' },
      { name: 'Решения для бизнеса', href: '/custom/business-solutions' },
    ],
  },
  {
    name: 'Акции и распродажа',
    href: '/sales',
    subcategories: [
      { name: 'Акции', href: '/sales/promotions' },
      { name: 'Аутлет', href: '/sales/outlet' },
      { name: 'Распродажа выставочных образцов', href: '/sales/showroom' },
    ],
  },
  {
    name: 'Кухни',
    href: '/kitchens',
    subcategories: [
      { name: 'Коллекции', href: '/kitchens/collections' },
      { name: 'Кухонные салоны', href: '/kitchens/showrooms' },
      { name: 'Акции', href: '/kitchens/sales' },
    ],
  },
  {
    name: 'Офисы и гостиницы',
    href: '/commercial',
    subcategories: [
      { name: 'Гостиничная мебель', href: '/commercial/hotel-furniture' },
      { name: 'Кабинеты', href: '/commercial/cabinets' },
      { name: 'Офисная мебель', href: '/commercial/office-furniture' },
      { name: 'Офисные диваны, кресла, стулья', href: '/commercial/office-seating' },
    ],
  },
];

const Header = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string>('Товары');
  const [hoveredSubCategory, setHoveredSubCategory] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setHoveredSubCategory(null);
    }, 300);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm">
      {/* Основная часть шапки */}
      <div className="py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex-shrink-0 w-[240px]">
                <Image
                  src="https://i.postimg.cc/x1WVRHjs/DALLE-2025-02-05-111-1.png"
                  alt="Логотип"
                  width={240}
                  height={80}
                  className="h-16 w-auto"
                />
              </Link>
              
              <div className="flex items-center gap-4">
                {/* Социальные сети */}
                <div className="flex items-center gap-3 mr-4">
                  <a 
                    href="https://t.me/yourstore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-graphite/70 hover:text-graphite transition-colors"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://wa.me/78001234567" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-graphite/70 hover:text-graphite transition-colors"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.828z"/>
                      <path d="M12 2C6.486 2 2 6.486 2 12c0 1.728.45 3.42 1.304 4.89L2 22l5.255-1.38C8.694 21.507 10.287 22 12 22c5.514 0 10-4.486 10-10S17.514 2 12 2zM12 20c-1.484 0-2.937-.375-4.227-1.087l-.392-.233-3.364.882.902-3.293-.247-.392A7.963 7.963 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://vk.com/yourstore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-graphite/70 hover:text-graphite transition-colors"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.161C3.94 7.721 4.043 8 4.043 8s1.79 4.258 3.817 6.403c1.858 1.967 3.968 1.838 3.968 1.838h.957z"/>
                    </svg>
                  </a>
                </div>

                <div className="flex items-center gap-6">
                  <a href="tel:+78001234567" className="flex items-center gap-2 text-sm text-graphite/70 hover:text-graphite transition-colors whitespace-nowrap">
                    <Phone className="w-4 h-4" />
                8 800 123-45-67
              </a>
                  <a href="#" className="flex items-center gap-2 text-sm text-graphite/70 hover:text-graphite transition-colors whitespace-nowrap">
                    <MessageCircle className="w-4 h-4" />
                Написать нам
              </a>
          </div>
        </div>
      </div>

            <div className="flex items-center gap-8">
              {/* Поисковая строка */}
              <div className="flex-grow max-w-xl">
                <SearchBar />
              </div>

              <div className="flex items-center gap-4">
                <UserMenu />
              <ShopControls />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Навигационное меню */}
      <nav className="border-t border-olive/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Основная навигация */}
          <ul className="flex space-x-8 h-12">
            {navigation.map((item) => (
              <li 
                key={item.name}
                onMouseEnter={() => {
                  setHoveredCategory(item.name);
                  setHoveredSubCategory(null);
                }}
                className="relative"
              >
                <Link
                  href={item.href}
                  className={`flex items-center h-full transition-colors ${
                    hoveredCategory === item.name 
                      ? 'text-gray-900 font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
                {hoveredCategory === item.name && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-olive"/>
                )}
              </li>
            ))}
          </ul>

          {/* Подкатегории */}
          <div 
            className="py-3 border-t border-gray-100 relative"
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
          >
            <ul className="flex flex-wrap gap-6">
              {navigation
                .find(item => item.name === hoveredCategory)
                ?.subcategories?.map((subcategory) => (
                  <li 
                    key={subcategory.name}
                    onMouseEnter={() => {
                      if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                      }
                      setHoveredSubCategory(subcategory.name);
                    }}
                  >
                    <Link
                      href={subcategory.href}
                      className="text-gray-600 hover:text-gray-900 whitespace-nowrap transition-colors text-sm"
                    >
                      {subcategory.name}
                    </Link>

                    {/* Третий уровень навигации */}
                    {hoveredSubCategory === subcategory.name && subcategory.subCategories && (
                      <div 
                        className="absolute left-0 top-full w-2/3 bg-white shadow-lg rounded-b-lg p-4 z-50"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <ul className="grid grid-cols-2 gap-2">
                              {subcategory.subCategories.map((subSubCategory) => (
                                <li key={subSubCategory.name}>
                                  <Link
                                    href={subSubCategory.href}
                                    className="text-gray-600 hover:text-gray-900 transition-colors text-base font-medium truncate block py-1"
                                  >
                                    {subSubCategory.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {subcategory.image && (
                            <div className="w-64">
                              <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                                <img
                                  src={
                                    subcategory.name === "Кровати" 
                                      ? "https://i.postimg.cc/GtWVMPJL/AMARE-LIVING258321-RT.jpg"
                                      : subcategory.name === "Диваны и кресла"
                                      ? "https://i.postimg.cc/QNfyH328/doriansofagreen.webp"
                                      : subcategory.name === "Шкафы"
                                      ? "https://i.postimg.cc/3wcJ1662/fhblack1167-toulouse-black-painted-large-triple-wardrobe-bedroom-storage-1.webp"
                                      : subcategory.image
                                  }
                                  alt={subcategory.name}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 