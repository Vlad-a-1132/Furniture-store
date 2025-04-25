'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Image from 'next/image';

interface DeletedProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
  default_image: string;
  category_name: string | null;
  subcategory_name: string | null;
  deleted_at: string;
}

export default function DeletedProductsPage() {
  const [deletedProducts, setDeletedProducts] = useState<DeletedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDeletedProducts = async () => {
    try {
      const response = await fetch('/api/admin/products/deleted');
      const data = await response.json();
      setDeletedProducts(data);
    } catch (error) {
      console.error('Error fetching deleted products:', error);
      toast.error('Ошибка при загрузке удаленных товаров');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const response = await fetch('/api/admin/products/deleted', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to restore product');

      toast.success('Товар успешно восстановлен');
      await fetchDeletedProducts();
    } catch (error) {
      console.error('Error restoring product:', error);
      toast.error('Ошибка при восстановлении товара');
    }
  };

  useEffect(() => {
    fetchDeletedProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Удаленные товары</h1>
      {deletedProducts.length === 0 ? (
        <p className="text-gray-500">Нет удаленных товаров</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deletedProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm">
              <div className="relative h-48 mb-4">
                <Image
                  src={product.default_image || product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-1">
                Категория: {product.category_name || 'Не указана'}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Подкатегория: {product.subcategory_name || 'Не указана'}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Удален: {format(new Date(product.deleted_at), 'dd MMMM yyyy', { locale: ru })}
              </p>
              <button
                onClick={() => handleRestore(product.id)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Восстановить
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 