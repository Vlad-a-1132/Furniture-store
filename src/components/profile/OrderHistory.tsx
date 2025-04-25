'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    defaultImage: string;
  };
}

interface Order {
  id: string;
  status: string;
  total: number;
  items: OrderItem[];
  createdAt: string;
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Не удалось загрузить заказы');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает обработки';
      case 'processing':
        return 'В обработке';
      case 'completed':
        return 'Выполнен';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">У вас пока нет заказов</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">
                Заказ от {format(new Date(order.createdAt), 'd MMMM yyyy', { locale: ru })}
              </p>
              <p className="text-sm font-medium">№{order.id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>

          <div className="divide-y">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center gap-4">
                <Image
                  src={item.product.defaultImage}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} шт. × {item.price.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
                <p className="font-medium">
                  {(item.quantity * item.price).toLocaleString('ru-RU')} ₽
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <p className="font-medium">Итого:</p>
            <p className="text-xl font-semibold">
              {order.total.toLocaleString('ru-RU')} ₽
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 