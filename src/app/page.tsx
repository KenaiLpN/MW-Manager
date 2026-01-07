'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Função para verificar se o cookie "token" existe
    const checkAuth = () => {
      // Busca o cookie chamado 'token'
      const hasToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='));

      if (hasToken) {
        // Se tem token, manda para a Home
        router.push('/home');
      } else {
        // Se não tem, manda para o Login
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // Retorna um fundo neutro ou um loading enquanto redireciona
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );
}