'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Promocode {
  id: string;
  code: string;
  discount: number;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  expiresAt?: Date;
}

interface PromocodeModalProps {
  promocode?: Promocode;
  onClose: () => void;
  onSave: (promocode: Partial<Promocode>) => void;
}

const PromocodeModal = ({ promocode, onClose, onSave }: PromocodeModalProps) => {
  const [code, setCode] = useState(promocode?.code || '');
  const [discount, setDiscount] = useState(promocode?.discount?.toString() || '');
  const [isActive, setIsActive] = useState(promocode?.isActive ?? true);
  const [usageLimit, setUsageLimit] = useState(promocode?.usageLimit?.toString() || '');
  const [expiresAt, setExpiresAt] = useState(
    promocode?.expiresAt ? new Date(promocode.expiresAt).toISOString().split('T')[0] : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: promocode?.id,
      code: code.toUpperCase(),
      discount: parseFloat(discount),
      isActive,
      usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-medium mb-4">
          {promocode ? 'Редактировать промокод' : 'Создать промокод'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Код
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
              required
              placeholder="SUMMER2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Скидка (%)
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
              required
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Лимит использований
            </label>
            <input
              type="number"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
              min="0"
              placeholder="Без ограничений"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Действует до
            </label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 text-olive rounded border-gray-300 focus:ring-olive"
            />
            <label className="ml-2 text-sm text-gray-700">
              Активен
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-olive text-white rounded hover:bg-olive/90"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function PromocodesPage() {
  const [promocodes, setPromocodes] = useState<Promocode[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromocode, setSelectedPromocode] = useState<Promocode>();

  useEffect(() => {
    fetchPromocodes();
  }, []);

  const fetchPromocodes = async () => {
    try {
      const response = await fetch('/api/promocodes');
      if (!response.ok) throw new Error('Failed to fetch promocodes');
      const data = await response.json();
      setPromocodes(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Не удалось загрузить промокоды');
    }
  };

  const handleSave = async (promocodeData: Partial<Promocode>) => {
    try {
      const response = await fetch('/api/promocodes', {
        method: promocodeData.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promocodeData),
      });

      if (!response.ok) throw new Error('Failed to save promocode');
      
      setIsModalOpen(false);
      fetchPromocodes();
      toast.success(
        promocodeData.id ? 'Промокод обновлен' : 'Промокод создан'
      );
    } catch (error) {
      console.error('Error:', error);
      toast.error('Не удалось сохранить промокод');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот промокод?')) return;

    try {
      const response = await fetch(`/api/promocodes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete promocode');
      
      fetchPromocodes();
      toast.success('Промокод удален');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Не удалось удалить промокод');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Промокоды</h1>
        <button
          onClick={() => {
            setSelectedPromocode(undefined);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-olive text-white rounded-lg hover:bg-olive/90"
        >
          <Plus className="w-5 h-5" />
          Создать промокод
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Код
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Скидка
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Использований
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действует до
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promocodes.map((promocode) => (
                <tr key={promocode.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {promocode.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {promocode.discount}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {promocode.usageCount}
                    {promocode.usageLimit ? ` / ${promocode.usageLimit}` : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {promocode.expiresAt
                      ? new Date(promocode.expiresAt).toLocaleDateString()
                      : '∞'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        promocode.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {promocode.isActive ? 'Активен' : 'Неактивен'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedPromocode(promocode);
                        setIsModalOpen(true);
                      }}
                      className="text-olive hover:text-olive/80 mr-3"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(promocode.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <PromocodeModal
          promocode={selectedPromocode}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPromocode(undefined);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
} 