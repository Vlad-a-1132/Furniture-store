'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Star } from 'lucide-react';

// Временные данные для демонстрации
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Диван угловой "Комфорт"',
    slug: 'divan-uglovoy-komfort',
    description: 'Удобный угловой диван с мягкими подушками',
    seoTitle: 'Купить угловой диван Комфорт',
    seoDescription: 'Угловой диван Комфорт - идеальное решение для вашей гостиной',
    keywords: ['диван', 'угловой диван', 'мебель'],
    specifications: {
      'Размеры': '200x150x85 см',
      'Материал обивки': 'Велюр',
      'Наполнитель': 'Пенополиуретан'
    },
    price: 45990,
    images: ['/images/products/sofa-1.jpg', '/images/products/sofa-2.jpg'],
    defaultImage: '/images/products/sofa-1.jpg',
    categoryId: '1',
    category: {
      id: '1',
      name: 'Диваны и кресла',
      href: 'divany-i-kresla',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    subcategoryId: '2',
    subcategory: {
      id: '2',
      name: 'Диваны угловые',
      href: 'divany-uglovye',
      parentId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    inStock: true,
    discount: 10,
    material: 'textile',
    colorVariants: [
      {
        id: '1',
        name: 'Бежевый',
        hex: '#F5DEB3',
        image: '/images/products/sofa-1.jpg',
        productId: '1'
      },
      {
        id: '2',
        name: 'Серый',
        hex: '#808080',
        image: '/images/products/sofa-2.jpg',
        productId: '1'
      }
    ],
    rating: 4.5,
    reviewsCount: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Кресло "Уют"',
    slug: 'kreslo-uyut',
    description: 'Стильное кресло с высокой спинкой',
    seoTitle: 'Купить кресло Уют',
    seoDescription: 'Кресло Уют - комфорт и стиль для вашего дома',
    keywords: ['кресло', 'мебель'],
    specifications: {
      'Размеры': '80x90x100 см',
      'Материал обивки': 'Рогожка',
      'Наполнитель': 'Пенополиуретан'
    },
    price: 15990,
    images: ['/images/products/chair-1.jpg', '/images/products/chair-2.jpg'],
    defaultImage: '/images/products/chair-1.jpg',
    categoryId: '1',
    category: {
      id: '1',
      name: 'Диваны и кресла',
      href: 'divany-i-kresla',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    subcategoryId: '3',
    subcategory: {
      id: '3',
      name: 'Кресла',
      href: 'kresla',
      parentId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    inStock: true,
    discount: undefined,
    material: 'textile',
    colorVariants: [
      {
        id: '3',
        name: 'Зеленый',
        hex: '#228B22',
        image: '/images/products/chair-1.jpg',
        productId: '2'
      },
      {
        id: '4',
        name: 'Синий',
        hex: '#000080',
        image: '/images/products/chair-2.jpg',
        productId: '2'
      }
    ],
    rating: 4.8,
    reviewsCount: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Закрытие выпадающего списка при клике вне компонента
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Поиск товаров при вводе
    if (query.length >= 2) {
      // В реальном приложении здесь будет запрос к API
      const searchResults = mockProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск товаров..."
          className="w-full py-2 pl-10 pr-4 rounded-xl bg-white/80 backdrop-blur-sm 
          border border-olive/20 focus:outline-none focus:ring-2 focus:ring-olive/30 
          placeholder:text-graphite/50"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-olive/50" />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full 
            hover:bg-olive/10 transition-colors"
          >
            <X className="w-4 h-4 text-graphite/50" />
          </button>
        )}
      </form>

      {/* Выпадающий список с результатами */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto 
        bg-white rounded-xl shadow-lg border border-olive/10 z-50">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/catalog/${product.slug}`}
              className="flex items-center gap-4 p-4 hover:bg-beige/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 64px, 64px"
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-graphite font-medium">{product.name}</h3>
                <p className="text-sm text-graphite/60 line-clamp-1">
                  {product.description}
                </p>
                <p className="text-olive font-medium mt-1">
                  {product.price.toLocaleString()} ₽
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          index < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : index < product.rating
                            ? 'fill-yellow-400/50 text-yellow-400/50'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviewsCount})
                  </span>
                </div>
              </div>
            </Link>
          ))}
          <div className="p-4 border-t border-olive/10">
            <button
              onClick={handleSubmit}
              className="w-full py-2 text-center text-graphite/70 hover:text-graphite 
              transition-colors"
            >
              Показать все результаты
            </button>
          </div>
        </div>
      )}

      {/* Сообщение, если ничего не найдено */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white 
        rounded-xl shadow-lg border border-olive/10 text-center text-graphite/70">
          По вашему запросу ничего не найдено
        </div>
      )}
    </div>
  );
} 