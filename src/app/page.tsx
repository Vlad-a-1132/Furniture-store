import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Banner from '@/components/Banner';
import PromoSlider from '@/components/PromoSlider';
import CategorySlider from '@/components/CategorySlider';
import ProductCard from '@/components/ProductCard';
import { Banner as BannerType, Product } from '@/types/index';

// Динамический импорт компонентов, которые не нужны сразу
const ProductFilters = dynamic(() => import('@/components/ProductFilters'), {
  ssr: false,
  loading: () => <div className="animate-pulse h-[200px] bg-gray-100 rounded-lg" />
});

// Временные данные для примера
const mockBanners: BannerType[] = [
  {
    id: '1',
    title: 'Новая коллекция мебели',
    description: 'Создайте уютный интерьер с нашей новой коллекцией',
    imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e',
    link: '/collections/new',
  },
  {
    id: '2',
    title: 'Скидки на диваны',
    description: 'До 30% на популярные модели',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    link: '/sale',
  },
];

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
  },
  {
    id: '3',
    name: 'Стол обеденный "Модерн"',
    description: 'Современный обеденный стол из массива дуба',
    price: 34990,
    images: ['https://images.unsplash.com/photo-1530018607912-eff2daa1bac4'],
    category: 'tables',
    subcategory: 'dining-tables',
    inStock: true,
    discount: 10,
    material: 'wood',
    createdAt: '2024-01-20',
    seoTitle: 'Стол обеденный "Модерн" - современный стол из массива дуба',
    seoDescription: 'Купить современный обеденный стол "Модерн" из массива дуба. Высокое качество материалов.',
    keywords: ['стол', 'обеденный стол', 'массив дуба', 'мебель'],
    specifications: {},
    rating: 4.8,
    reviewsCount: 20,
    colorVariants: []
  },
  {
    id: '4',
    name: 'Кровать "Люкс"',
    description: 'Двуспальная кровать с мягким изголовьем',
    price: 64990,
    images: ['https://images.unsplash.com/photo-1505693314120-0d443867891c'],
    category: 'beds',
    subcategory: 'double-beds',
    inStock: true,
    material: 'wood',
    createdAt: '2024-02-10',
    seoTitle: 'Кровать "Люкс" - двуспальная кровать с мягким изголовьем',
    seoDescription: 'Купить двуспальную кровать "Люкс" с мягким изголовьем. Современный дизайн, высокое качество материалов.',
    keywords: ['кровать', 'двуспальная кровать', 'мягкое изголовье', 'мебель'],
    specifications: {},
    rating: 4.7,
    reviewsCount: 15,
    colorVariants: []
  }
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <main className="min-h-screen bg-white">
          <Banner banners={mockBanners} />
          <PromoSlider />
          <CategorySlider />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Популярные товары
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </main>
      </Suspense>
    </div>
  );
} 