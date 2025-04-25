import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Если запрос идет на порт 3000, перенаправляем на 3001
  if (request.nextUrl.port === '3000') {
    return NextResponse.redirect(
      new URL(request.nextUrl.pathname, 'http://localhost:3001')
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
}; 