'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast.error('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Произошла ошибка');
      }

      toast.success('Пароль успешно изменен');
      router.push('/auth/signin');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
          <div className="text-center text-red-500">
            Недействительная ссылка для сброса пароля
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        <div>
          <h2 className="text-3xl font-light text-center text-graphite">
            Создание нового пароля
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Введите новый пароль для вашего аккаунта
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="text-sm text-graphite">
                Новый пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border 
                border-olive/20 placeholder-graphite/50 text-graphite focus:outline-none 
                focus:ring-2 focus:ring-olive/30 focus:border-olive/30"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-sm text-graphite">
                Подтвердите пароль
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border 
                border-olive/20 placeholder-graphite/50 text-graphite focus:outline-none 
                focus:ring-2 focus:ring-olive/30 focus:border-olive/30"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
              text-sm font-medium rounded-lg text-white bg-graphite hover:bg-olive focus:outline-none 
              focus:ring-2 focus:ring-offset-2 focus:ring-olive/30 transition-colors duration-300 
              disabled:opacity-50"
            >
              {isLoading ? 'Сохранение...' : 'Сохранить новый пароль'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 