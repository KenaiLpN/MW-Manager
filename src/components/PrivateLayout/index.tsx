"use client"; 

import { usePathname, useRouter } from "next/navigation"; // Adicionei useRouter
import { useEffect, useState } from "react"; // Adicionei os hooks
import { Header } from "../header";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Estado para controlar se podemos mostrar a tela ou não
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Defina quais rotas são públicas (não precisam de login)
    // Dica: Adicione '/' se sua home for pública, ou remova se for privada
    const publicRoutes = ["/login", "/cadastro", "/recuperar-senha"];
    const isPublicPage = publicRoutes.includes(pathname);

    // 2. Função que verifica o cookie
    const checkAuth = () => {
      // Procura pelo cookie chamado "token"
      const hasToken = document.cookie.split("; ").find((row) => row.startsWith("token="));

      if (isPublicPage) {
        // Se é rota pública, libera geral
        setIsAuthorized(true);
      } else {
        // Se é rota privada...
        if (!hasToken) {
          // Não tem token? Manda pro login e bloqueia a tela
          setIsAuthorized(false);
          router.push("/login");
        } else {
          // Tem token? Libera o acesso
          setIsAuthorized(true);
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  // 3. Bloqueio de renderização (Loading)
  // Enquanto o useEffect não confirma a autorização, retornamos null (tela branca)
  // ou um Spinner de carregamento para não mostrar conteúdo proibido.
  if (!isAuthorized) {
    return null; 
  }

  // --- LÓGICA DE LAYOUT ORIGINAL ABAIXO ---

  const isPublicPage = pathname === "/login" || pathname === "/cadastro";

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
        {/* TOPBAR FIXA */}
       <header className="flex-none h-20 z-50">
            <Header />
       </header>

        <main className="flex-1 flex flex-col bg-gray-100 overflow-y-auto">           
           <div className=" flex-1">
              {children}
           </div>
        </main>
    </div>
  );
}