'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Lock } from 'lucide-react';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Добавляем отладочную информацию
    console.log('Session status:', status);
    console.log('Session data:', session);

    if (status === 'authenticated' && session?.user?.role === 'admin') {
      console.log('Redirecting to admin panel...');
      router.push('/admin');
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting to sign in with:', { email });
      const callbackUrl = searchParams.get('callbackUrl') || '/admin';
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      console.log('Sign in result:', result);

      if (result?.error) {
        setError(result.error);
      } else if (result?.url) {
        router.push(result.url);
      } else {
        setError('Произошла неизвестная ошибка');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Произошла ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  // Показываем загрузку при проверке сессии
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-olive/30 border-t-olive rounded-full animate-spin" />
      </div>
    );
  }

  // Если пользователь уже авторизован, не показываем форму входа
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Вы уже вошли в систему</p>
          <button
            onClick={() => router.push('/admin')}
            className="text-olive hover:underline"
          >
            Перейти в админ-панель
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image
              src="https://i.postimg.cc/x1WVRHjs/DALLE-2025-02-05-111-1.png"
              alt="Logo"
              width={200}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </div>
          <h1 className="text-2xl font-medium text-gray-900">
            Вход в админ-панель
          </h1>
          <p className="mt-2 text-gray-600">
            Введите свои данные для входа
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none 
              focus:ring-2 focus:ring-olive/30"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none 
              focus:ring-2 focus:ring-olive/30"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-olive text-white py-2 px-4 rounded-lg 
            hover:bg-olive/90 transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Войти</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 