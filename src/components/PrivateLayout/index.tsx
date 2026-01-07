"use client"; // Obrigatório ser client-side para ler a rota

import { usePathname } from "next/navigation"
import { Header } from "../header";
// Importe sua TopBar aqui também se tiver

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Lista de rotas públicas onde a Sidebar/Topbar NÃO devem aparecer
  const isPublicPage = pathname === "/login" || pathname === "/cadastro";

  if (isPublicPage) {
    // Se for login, retorna apenas o conteúdo (o formulário de login) sem barras
    return <>{children}</>;
  }

  const showSidebar = pathname.startsWith("/cadastro");

  
  // Se for rota privada, retorna a estrutura com Topbar + Conteúdo
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