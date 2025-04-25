'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Box, 
  Tags, 
  Settings, 
  Users, 
  FileText,
  ShoppingBag,
  MessageSquare,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  Home,
  Package,
  Tag,
  Star,
  Ticket,
  Trash,
} from 'lucide-react';

const navigation = [
  { name: 'Главная', href: '/admin', icon: Home },
  { name: 'Товары', href: '/admin/products', icon: Package },
  { name: 'Категории', href: '/admin/categories', icon: Tag },
  { name: 'Заказы', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Отзывы', href: '/admin/reviews', icon: Star },
  { name: 'Промокоды', href: '/admin/promocodes', icon: Ticket },
  { name: 'Пользователи', href: '/admin/users', icon: Users },
  { name: 'Страницы', href: '/admin/pages', icon: FileText },
  { name: 'Медиа', href: '/admin/media', icon: ImageIcon },
  { name: 'Настройки', href: '/admin/settings', icon: Settings },
  { name: 'Удаленные товары', href: '/admin/deleted-products', icon: Trash },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    }
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive"></div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Мобильная кнопка меню */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Боковая панель */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 bg-white shadow-xl lg:shadow-md
      `}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-center h-16 border-b">
            <Link href="/admin" className="flex items-center gap-2">
              <Image
                src="https://i.postimg.cc/x1WVRHjs/DALLE-2025-02-05-111-1.png"
                alt="Logo"
                width={40}
                height={40}
                className="h-8 w-auto"
              />
              <span className="text-xl font-medium text-graphite">Admin</span>
            </Link>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200
                        ${isActive 
                          ? 'bg-olive text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <div className="mb-4 px-4 py-2">
              <div className="text-sm text-gray-600">Вы вошли как</div>
              <div className="font-medium text-gray-900">{session.user?.email}</div>
            </div>
            <button
              onClick={async () => {
                await signOut({ redirect: false });
                router.push('/');
              }}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg 
              hover:bg-red-50 hover:text-red-600 transition-colors duration-200 w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Основной контент */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-8">
          {children}
        </div>
      </main>

      {/* Оверлей для мобильного меню */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
} 