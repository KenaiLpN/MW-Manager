"use client";
import { LayoutDashboard, LucideIcon, TvMinimalPlay, Ticket, UsersRound, CircleUserRound, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// ✅ CORREÇÃO 1: Sintaxe do objeto corrigida
const iconMap: { [key: string]: LucideIcon } = {
  Dashboard: LayoutDashboard,
  TvMinimalPlay: TvMinimalPlay,
  Ticket: Ticket,
  UsersRound: UsersRound,
  CircleUserRound: CircleUserRound,
};

interface NavItem {
  name: string;
  href: string;
  iconName: keyof typeof iconMap;
}

// Os dados permanecem os mesmos, mas a correção será feita na 'key'
const navItems: NavItem[] = [
  { name: "Cadastros", href: "/cadastros", iconName: "Dashboard" },
  { name: "Tabelas", href: "/anydesk", iconName: "TvMinimalPlay" },
  { name: "Comercial", href: "/chamados", iconName: "Ticket" },
  { name: "Orçamentos", href: "/clientes", iconName: "UsersRound" },
  { name: "Notas", href: "/perfil", iconName: "CircleUserRound" },
  { name: "Perfil", href: "/perfil", iconName: "CircleUserRound" },
  { name: "Segurança", href: "/perfil", iconName: "CircleUserRound" },
];

export function Header() {
  const pathname = usePathname();

  const baseLinkClasses = "flex items-center gap-2 text-[#52E8FB] transition font-medium duration-300 ease-in-out h-20 p-5";
  const activeLinkClasses = "text-[#FFFF] bg-[#1854af] font-medium";
  const inactive = "text-[#F6F6F6] transition font-medium duration-300 ease-in-out hover:text-[#FDFDFD] hover:bg-[#1854af]";

  const getLinkClasses = (href: string) => {
    // Para tratar os múltiplos links de "/perfil", podemos ajustar a lógica de 'ativo'
    // Aqui, vamos manter a lógica simples, mas em um caso real você poderia querer mais complexidade.
    const isActive = pathname === href;
    return `${baseLinkClasses} ${isActive ? activeLinkClasses : inactive}`;
  };

  return (
    <header className="flex bg-[#133c86] border-b border-[#e4e9f0] justify-between items-center">
      <h1 className="text-[#F6F6F6] text-2xl font-bold m-4">MW Manager</h1>

      <div className="flex space-x-4">
        {navItems.map((item) => {
          const IconComponent = iconMap[item.iconName];

          return (
            <Link
              key={item.name} // ✅ CORREÇÃO 2: Usando 'item.name' como chave única
              href={item.href}
              className={getLinkClasses(item.href)}
            >
              {IconComponent && <IconComponent className="w-5 h-5" />}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
      <div>
        <button>
          <LogOut className="text-[#F6F6F6] hover:bg-[#66ACE4] transition ease-in-out rounded-md m-5 " />
        </button>
      </div>
    </header>
  );
}