'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserIcon, LogOutIcon, Settings } from 'lucide-react';

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (!session) {
    return (
      <Link
        href="/auth/signin"
        className="flex items-center text-graphite hover:text-olive transition-colors duration-300"
      >
        <UserIcon className="h-5 w-5 mr-2" />
        <span>Войти</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-graphite hover:text-olive transition-colors duration-300"
      >
        <UserIcon className="h-5 w-5 mr-2" />
        <span>{session.user?.name || 'Профиль'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <Link
            href="/profile"
            className="w-full px-4 py-2 text-left text-graphite hover:bg-beige/50 
            transition-colors duration-300 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Настройки профиля
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-left text-graphite hover:bg-beige/50 
            transition-colors duration-300 flex items-center"
          >
            <LogOutIcon className="h-4 w-4 mr-2" />
            Выйти
          </button>
        </div>
      )}
    </div>
  );
} 