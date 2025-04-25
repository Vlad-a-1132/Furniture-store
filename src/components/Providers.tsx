'use client';

import { ShopProvider } from '@/contexts/ShopContext';
import AuthProvider from '@/contexts/AuthProvider';
import { SessionProvider } from 'next-auth/react';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ShopProvider>
          {children}
        </ShopProvider>
      </AuthProvider>
    </SessionProvider>
  );
} 