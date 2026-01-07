import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Se o usuário acessar a raiz "/" pura, manda para o login ou home
  if (pathname === '/') {
    return NextResponse.redirect(new URL(token ? '/home' : '/login', request.url));
  }

  // 2. Se não tiver token e tentar acessar áreas privadas, manda para o login
  if (!token && pathname.startsWith('/home')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Se já tiver token e tentar ir para o login, manda para a home
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/home/:path*', '/login'],
};