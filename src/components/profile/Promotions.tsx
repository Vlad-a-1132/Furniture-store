'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: number;
  validUntil: string;
  code?: string;
}

export default function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/promotions/active');
      if (!response.ok) throw new Error('Failed to fetch promotions');
      const data = await response.json();
      setPromotions(data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast.error('Не удалось загрузить акции');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Промокод скопирован');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive"></div>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">В данный момент нет активных акций</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {promotions.map((promotion) => (
        <div key={promotion.id} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="relative h-48">
            <Image
              src={promotion.image}
              alt={promotion.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{promotion.title}</h3>
            <p className="text-gray-600 mb-4">{promotion.description}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Скидка:</p>
                <p className="text-2xl font-bold text-olive">{promotion.discount}%</p>
              </div>
              {promotion.code && (
                <button
                  onClick={() => handleCopyCode(promotion.code!)}
                  className="px-4 py-2 bg-olive text-white rounded-lg hover:bg-olive/90 transition-colors"
                >
                  Копировать код
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Действует до {new Date(promotion.validUntil).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 