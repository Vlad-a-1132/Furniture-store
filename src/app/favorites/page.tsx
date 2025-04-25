'use client';

import { useShop } from '@/contexts/ShopContext';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Product } from '@/types';

export default function FavoritesPage() {
  const { favorites } = useShop();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (favorites.length === 0) {
          setProducts([]);
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/products/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productIds: favorites }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching favorite products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [favorites]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-20">
        <h1 className="text-2xl font-medium text-graphite">Список избранного пуст</h1>
        <p className="text-gray-600 mb-4">Добавьте товары в избранное, чтобы сохранить их для будущих покупок</p>
        <Link 
          href="/catalog" 
          className="px-6 py-3 bg-olive text-white rounded-lg hover:bg-olive/90 transition-colors"
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen pt-20">
      <h1 className="text-2xl font-medium mb-8 text-graphite">Избранное</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
} 