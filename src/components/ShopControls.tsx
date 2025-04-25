'use client';

import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useShop } from '@/contexts/ShopContext';

export default function ShopControls() {
  const { cartItemsCount, favoritesCount } = useShop();

  return (
    <div className="flex items-center space-x-2">
      <Link href="/favorites" className="p-2 hover:bg-gray-100 rounded-full relative">
        <Heart className="h-6 w-6 text-gray-600" />
        {favoritesCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-olive text-white text-xs rounded-full 
          w-5 h-5 flex items-center justify-center">
            {favoritesCount}
          </span>
        )}
      </Link>
      <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full relative">
        <ShoppingCart className="h-6 w-6 text-gray-600" />
        {cartItemsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-olive text-white text-xs rounded-full 
          w-5 h-5 flex items-center justify-center">
            {cartItemsCount}
          </span>
        )}
      </Link>
    </div>
  );
} 