'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      if (res.ok) {
        router.push('/auth/signin');
      } else {
        const data = await res.json();
        setError(data.error || 'Произошла ошибка при регистрации');
      }
    } catch (error) {
      setError('Произошла ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        <div>
          <h2 className="text-3xl font-light text-center text-graphite">
            Регистрация
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm text-graphite">
                Имя
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border 
                border-olive/20 placeholder-graphite/50 text-graphite focus:outline-none 
                focus:ring-2 focus:ring-olive/30 focus:border-olive/30"
              />
            </div>
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
              <label htmlFor="password" className="text-sm text-graphite">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
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
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-graphite/70">Уже есть аккаунт? </span>
            <Link 
              href="/auth/signin" 
              className="text-olive hover:text-graphite transition-colors duration-300"
            >
              Войти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 