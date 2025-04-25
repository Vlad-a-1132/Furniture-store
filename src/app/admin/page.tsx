'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  TrendingUp,
  Eye,
  Clock,
  Star,
  AlertCircle,
  Package,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DashboardData {
  stats: {
    name: string;
    value: string;
    trend: string;
  }[];
  recentOrders: {
    id: string;
    customer: string;
    amount: string;
    status: string;
    date: string;
  }[];
  recentActivity: {
    id: string;
    type: string;
    text: string;
    time: string;
  }[];
}

const iconMap = {
  view: Eye,
  order: ShoppingBag,
  review: Star,
  alert: AlertCircle,
  product: Package,
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
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
      return 'Ожидает';
    case 'processing':
      return 'В обработке';
    case 'completed':
      return 'Выполнен';
    case 'cancelled':
      return 'Отменён';
    default:
      return status;
  }
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-olive" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-medium text-gray-900 mb-2">Ошибка загрузки данных</h2>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const statIcons = {
    'Заказов сегодня': ShoppingBag,
    'Новых клиентов': Users,
    'Выручка за неделю': DollarSign,
    'Конверсия': TrendingUp,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-gray-800">Дашборд</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Обновлено только что</span>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.stats.map((stat) => {
          const Icon = statIcons[stat.name as keyof typeof statIcons];
          return (
            <div
              key={stat.name}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-medium text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="w-12 h-12 bg-olive/10 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-olive" />
                </div>
              </div>
              <div className="mt-4 text-sm text-green-600">
                {stat.trend} по сравнению с прошлой неделей
              </div>
            </div>
          );
        })}
      </div>

      {/* Последние заказы */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-gray-900">Последние заказы</h2>
        </div>
        <div className="divide-y">
          {data.recentOrders.map((order) => (
            <div key={order.id} className="p-6 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Заказ #{order.id}</p>
                <p className="text-sm text-gray-500">{order.customer}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-900">{order.amount}</span>
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>
          ))}
          {data.recentOrders.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              Нет последних заказов
            </div>
          )}
        </div>
      </div>

      {/* Последняя активность */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-gray-900">Последняя активность</h2>
        </div>
        <div className="divide-y">
          {data.recentActivity.map((activity) => {
            const Icon = iconMap[activity.type as keyof typeof iconMap] || Eye;
            return (
              <div key={activity.id} className="p-6 flex items-start gap-4">
                <div className="w-8 h-8 bg-olive/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-olive" />
                </div>
                <div>
                  <p className="text-gray-900">{activity.text}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(activity.time), { 
                      addSuffix: true,
                      locale: ru 
                    })}
                  </p>
                </div>
              </div>
            );
          })}
          {data.recentActivity.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              Нет последней активности
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 