'use client';

import { usePathname } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Динамический импорт компонентов
const Header = dynamic(() => import('@/components/Header'), {
  loading: () => <div className="h-20" /> // Placeholder для Header
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-20" /> // Placeholder для Footer
});

const ContactWidget = dynamic(() => import('@/components/ContactWidget'), {
  ssr: false // Отключаем SSR для ContactWidget
});

const Providers = dynamic(() => import('@/components/Providers'));
const Breadcrumbs = dynamic(() => import('@/components/Breadcrumbs'));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-olive/30 border-t-olive rounded-full animate-spin" />
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin') || false;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Providers>
        <div className="min-h-screen flex flex-col">
          {!isAdminPage && <Header />}
          <main className={isAdminPage ? 'flex-1' : 'pt-48 flex-1'}>
            {isAdminPage ? (
              children
            ) : (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs />
                {children}
              </div>
            )}
          </main>
          {!isAdminPage && <Footer />}
          {!isAdminPage && <ContactWidget />}
        </div>
      </Providers>
    </Suspense>
  );
} 