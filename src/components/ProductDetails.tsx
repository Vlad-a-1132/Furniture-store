'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from 'lucide-react';
import type { Product, ColorVariant } from '@/types/index';
import { useShop } from '@/contexts/ShopContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedColorVariant, setSelectedColorVariant] = useState<ColorVariant | null>(null);
  const { addToCart, isInCart } = useShop();
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'description' | 'specs' | 'reviews'>('description');

  const handleAddToCart = () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    addToCart(product.id);
  };

  const currentImage = selectedColorVariant?.image || product.defaultImage || product.images[0];

  const handleReviewSubmitted = () => {
    window.location.reload();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Изображение товара */}
        <div className="relative aspect-square">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className="object-cover rounded-xl"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Информация о товаре */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-light text-graphite mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {renderStars(Math.round(product.rating))}
              </div>
              <span className="text-graphite ml-2">{product.rating}</span>
            </div>
            <p className="text-graphite/80">{product.description}</p>
          </div>

          {/* Цена */}
          <div className="flex items-end gap-4">
            {product.discount ? (
              <>
                <div>
                  <p className="text-sm text-olive/80 line-through">
                    {product.price.toLocaleString()} ₽
                  </p>
                  <p className="text-3xl font-medium text-graphite">
                    {(product.price * (1 - product.discount / 100)).toLocaleString()} ₽
                  </p>
                </div>
                <span className="px-3 py-1 bg-olive/10 text-olive rounded-full">
                  -{product.discount}%
                </span>
              </>
            ) : (
              <p className="text-3xl font-medium text-graphite">
                {product.price.toLocaleString()} ₽
              </p>
            )}
          </div>

          {/* Выбор цвета */}
          {product.colorVariants?.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Цвет</h3>
              <div className="flex gap-3">
                {product.colorVariants.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColorVariant(color)}
                    className={`relative w-12 h-12 rounded-full p-1 ${
                      selectedColorVariant?.id === color.id
                        ? 'ring-2 ring-olive ring-offset-2'
                        : ''
                    }`}
                    title={color.name}
                  >
                    <span
                      className="block w-full h-full rounded-full"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
              {selectedColorVariant && (
                <p className="mt-2 text-sm text-gray-600">{selectedColorVariant.name}</p>
              )}
            </div>
          )}

          {/* Кнопка добавления в корзину */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors ${
              isInCart(product.id)
                ? 'bg-olive/10 text-olive'
                : 'bg-olive text-white hover:bg-olive/90'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>
              {isInCart(product.id) ? 'В корзине' : 'Добавить в корзину'}
            </span>
          </button>

          {/* Характеристики */}
          <div className="pt-6 border-t border-olive/10">
            <h3 className="text-lg font-medium text-graphite mb-6">
              Характеристики
            </h3>
            <div className="space-y-5">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="grid grid-cols-[1fr,2fr] gap-4 items-baseline">
                  <dt className="text-sm text-graphite/60">{key}:</dt>
                  <dd className="text-graphite">{String(value)}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[1fr,2fr] gap-4 items-baseline">
                <dt className="text-sm text-graphite/60">Категория:</dt>
                <dd className="text-graphite">{product.category?.name}</dd>
              </div>
              <div className="grid grid-cols-[1fr,2fr] gap-4 items-baseline">
                <dt className="text-sm text-graphite/60">Материал:</dt>
                <dd className="text-graphite">{product.material}</dd>
              </div>
              <div className="grid grid-cols-[1fr,2fr] gap-4 items-baseline">
                <dt className="text-sm text-graphite/60">Наличие:</dt>
                <dd className={product.inStock ? 'text-olive' : 'text-red-500'}>
                  {product.inStock ? 'В наличии' : 'Нет в наличии'}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div className="mt-12">
        <div className="border-b">
          <div className="flex gap-8">
            <button
              onClick={() => setSelectedTab('description')}
              className={`py-4 text-sm font-medium border-b-2 ${
                selectedTab === 'description'
                  ? 'border-olive text-olive'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Описание
            </button>
            <button
              onClick={() => setSelectedTab('specs')}
              className={`py-4 text-sm font-medium border-b-2 ${
                selectedTab === 'specs'
                  ? 'border-olive text-olive'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Характеристики
            </button>
            <button
              onClick={() => setSelectedTab('reviews')}
              className={`py-4 text-sm font-medium border-b-2 ${
                selectedTab === 'reviews'
                  ? 'border-olive text-olive'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Отзывы ({product.reviewsCount})
            </button>
          </div>
        </div>

        <div className="py-6">
          {selectedTab === 'description' && (
            <div className="prose max-w-none">
              {product.description}
            </div>
          )}

          {selectedTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'reviews' && (
            <div className="space-y-8">
              <ReviewList reviews={product.reviews || []} />
              {session ? (
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
                  <ReviewForm
                    productId={product.id}
                    onSuccess={() => {
                      // Refresh the product data to show the new review
                      router.refresh();
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    Please{' '}
                    <a href="/auth/signin" className="text-olive hover:underline">
                      sign in
                    </a>{' '}
                    to write a review
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 