import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Tenta pegar o token dos cookies
  const token = request.cookies.get('mw_token')?.value;

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
  // O matcher abaixo diz: "Rode em tudo, MENOS arquivos estáticos, imagens, favicon, etc"
  matcher: [
    /*
     * Corresponde a todas as rotas de requisição exceto:
     * 1. /api (rotas de API)
     * 2. /_next/static (arquivos estáticos)
     * 3. /_next/image (arquivos de otimização de imagem)
     * 4. favicon.ico (ícone do navegador)
     * 5. Imagens publicas se houver (svg, png, jpg)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};