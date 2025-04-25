'use client';

import { useShop } from '@/contexts/ShopContext';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Product } from '@/types/index';

export default function CartPage() {
  const { cartItems, removeFromCart, updateCartItemQuantity, promocode, discount, applyPromocode, clearPromocode } = useShop();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productIds = cartItems.map(item => item.productId);
        const response = await fetch('/api/products/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds }),
        });
        const data = await response.json();
        const productsMap = data.reduce((acc: Record<string, Product>, product: Product) => {
          acc[product.id] = product;
          return acc;
        }, {});
        setProducts(productsMap);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (cartItems.length > 0) {
      fetchProducts();
    } else {
      setIsLoading(false);
    }
  }, [cartItems]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products[item.productId];
      if (!product) return total;
      const price = product.price * item.quantity;
      return total + price;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal * (1 - discount / 100);
  };

  const handleApplyPromocode = async () => {
    if (!promoInput.trim()) {
      setPromoError('Введите промокод');
      return;
    }

    try {
      await applyPromocode(promoInput.trim());
      setPromoError('');
      setPromoInput('');
    } catch (error) {
      setPromoError(error instanceof Error ? error.message : 'Ошибка применения промокода');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-medium">Корзина пуста</h1>
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
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-2xl font-medium mb-8">Корзина</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const product = products[item.productId];
            if (!product) return null;

            return (
              <div key={item.id} className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="relative w-24 h-24">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-grow">
                  <Link href={`/catalog/${product.slug}`} className="text-lg font-medium hover:text-olive">
                    {product.name}
                  </Link>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => item.quantity > 1 && updateCartItemQuantity(item.productId, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-1 hover:bg-gray-100 rounded text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-lg font-medium">
                    {(product.price * item.quantity).toLocaleString()} ₽
                  </div>
                  {item.quantity > 1 && (
                    <div className="text-sm text-gray-500">
                      {product.price.toLocaleString()} ₽ за шт.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm h-fit space-y-6">
          <div>
            <h2 className="text-xl font-medium mb-4">Промокод</h2>
            {promocode ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 p-2 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-700">{promocode}</p>
                    <p className="text-sm text-green-600">Скидка {discount}%</p>
                  </div>
                  <button
                    onClick={clearPromocode}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Отменить
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-stretch gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Введите промокод"
                    className="flex-1 min-w-0 px-3 py-2 border rounded-lg"
                  />
                  <button
                    onClick={handleApplyPromocode}
                    className="whitespace-nowrap px-4 py-2 bg-olive text-white rounded-lg hover:bg-olive/90"
                  >
                    Применить
                  </button>
                </div>
                {promoError && (
                  <p className="text-sm text-red-500">{promoError}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-medium mb-4">Итого</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Товары ({cartItems.length})</span>
                <span>{calculateSubtotal().toLocaleString()} ₽</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Скидка по промокоду</span>
                  <span>-{(calculateSubtotal() * discount / 100).toLocaleString()} ₽</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Доставка</span>
                <span>Бесплатно</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between text-lg font-medium">
                <span>К оплате</span>
                <span>{calculateTotal().toLocaleString()} ₽</span>
              </div>
              <button className="w-full py-3 bg-olive text-white rounded-lg hover:bg-olive/90 transition-colors mt-4">
                Оформить заказ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 