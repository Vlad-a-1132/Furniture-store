'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Произошла ошибка');
      }

      toast.success('Инструкции по восстановлению пароля отправлены на ваш email');
      router.push('/auth/signin');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        <div>
          <h2 className="text-3xl font-light text-center text-graphite">
            Восстановление пароля
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Введите email, указанный при регистрации
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-sm text-graphite">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border 
              border-olive/20 placeholder-graphite/50 text-graphite focus:outline-none 
              focus:ring-2 focus:ring-olive/30 focus:border-olive/30"
            />
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
              {isLoading ? 'Отправка...' : 'Отправить'}
            </button>
          </div>

          <div className="text-center text-sm">
            <Link 
              href="/auth/signin" 
              className="text-olive hover:text-graphite transition-colors duration-300"
            >
              Вернуться к входу
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 