import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Tenta pegar o token dos cookies
  const token = request.cookies.get('token')?.value;

  // 2. Define as rotas que são PÚBLICAS (não precisam de login)
  const loginURL = new URL('/login', request.url);
  const homedURL = new URL('/home', request.url);

const currentPath = request.nextUrl.pathname;


  // Se o usuário já está logado e tenta acessar /login, manda pro dashboard
  if (token && currentPath === '/login') {
    return NextResponse.redirect(homedURL);
  }

  // Se NÃO tem token e NÃO está na página de login, manda pro login
  if (!token && currentPath !== '/login') {
    return NextResponse.redirect(loginURL);
  }

  // Se estiver tudo ok, deixa passar
  return NextResponse.next();
}

// Configuração: Em quais rotas esse middleware vai rodar?
export const config = {
  matcher: [
    /*
     * Captura todas as rotas de páginas, permitindo que o middleware
     * decida o redirecionamento, ignorando apenas arquivos técnicos.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};