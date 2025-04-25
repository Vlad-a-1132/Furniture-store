'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types/index';
import ProductCard from '@/components/ProductCard';
import { Search } from 'lucide-react';

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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const searchProducts = () => {
      setIsLoading(true);
      // В реальном приложении здесь будет запрос к API
      const searchResults = mockProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(searchResults);
      setIsLoading(false);
    };

    searchProducts();
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige to-[#EAE8E3] pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Search className="w-6 h-6 text-olive" />
          <h1 className="text-3xl font-light text-graphite">
            Результаты поиска
          </h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive"></div>
          </div>
        ) : results.length > 0 ? (
          <>
            <p className="text-graphite/60 mb-8">
              По запросу "{query}" найдено {results.length} {
                results.length === 1 ? 'товар' :
                results.length < 5 ? 'товара' : 'товаров'
              }
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-graphite/70 text-lg">
              По запросу "{query}" ничего не найдено.
              <br />
              Попробуйте изменить поисковый запрос.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 