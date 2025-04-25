'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Product, ColorVariant } from '@/types/index';
import { useShop } from '@/contexts/ShopContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInFavorites, toggleFavorite, addToCart, isInCart } = useShop();
  const { data: session } = useSession();
  const router = useRouter();
  const isFavorite = isInFavorites(product.id);
  const inCart = isInCart(product.id);
  
  // Состояние для текущего изображения и цветового варианта
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColorVariant, setSelectedColorVariant] = useState<ColorVariant | null>(null);

  // Получаем все доступные изображения
  const allImages = [
    product.defaultImage,
    ...product.images.filter(img => img !== product.defaultImage),
    ...product.colorVariants.map(variant => variant.image)
  ].filter(Boolean);

  const currentImage = allImages[currentImageIndex];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session?.user) {
      toast.error('Пожалуйста, войдите в систему');
      router.push('/auth/signin');
      return;
    }
    
    try {
      await toggleFavorite(product.id);
      toast.success(isFavorite ? 'Удалено из избранного' : 'Добавлено в избранное');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Произошла ошибка');
    }
  };

  const handleAddToCart = () => {
    if (!session) {
      toast.error('Пожалуйста, войдите в систему');
      router.push('/auth/signin');
      return;
    }
    try {
      addToCart(product.id);
      toast.success('Товар добавлен в корзину');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Произошла ошибка');
    }
  };

  return (
    <Link
      href={`/catalog/${product.slug}`}
      className="group relative bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-lg"
    >
      {/* Изображение */}
      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={currentImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Кнопки навигации */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}

        {/* Избранное */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-md"
        >
          {isFavorite ? (
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          ) : (
            <Heart className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Информация о товаре */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          <span className="hover:text-olive">
            {product.name}
          </span>
        </h3>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
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

        {/* Цветовые варианты */}
        {product.colorVariants.length > 0 && (
          <div className="flex gap-2 mb-4">
            {product.colorVariants.map((color) => (
              <button
                key={color.id}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColorVariant(color);
                  const variantImageIndex = allImages.indexOf(color.image);
                  if (variantImageIndex !== -1) {
                    setCurrentImageIndex(variantImageIndex);
                  }
                }}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  selectedColorVariant?.id === color.id 
                    ? 'border-olive scale-110' 
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        )}

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-4">
            {product.discount ? (
              <>
                <span className="text-xl font-medium text-gray-500 line-through">
                  {product.price.toLocaleString('ru-RU')} ₽
                </span>
                <span className="text-xl font-medium text-olive">
                  {(product.price * (1 - product.discount / 100)).toLocaleString('ru-RU')} ₽
                </span>
                <span className="text-sm text-red-500">-{product.discount}%</span>
              </>
            ) : (
              <span className="text-xl font-medium text-olive">
                {product.price.toLocaleString('ru-RU')} ₽
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full px-4 py-2 bg-olive text-white rounded-lg hover:bg-olive/90 transition-colors flex items-center justify-center gap-2 ${
              isInCart(product.id) ? 'bg-gray-100 text-gray-900' : ''
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            {isInCart(product.id) ? 'В корзине' : 'В корзину'}
          </button>
        </div>
      </div>
    </Link>
  );
} 