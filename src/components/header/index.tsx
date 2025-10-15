"use client";
import { LayoutDashboard, LucideIcon, TvMinimalPlay, Ticket, UsersRound, CircleUserRound, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const iconMap: { [key: string]: LucideIcon } = {
  Dashboard: LayoutDashboard, TvMinimalPlay, Ticket, UsersRound, CircleUserRound
};

interface NavItem {
  name: string;
  href: string;
  iconName: keyof typeof iconMap;
}

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

  const baseLinkClasses =
    "flex items-center text-[#52E8FB] transition font-medium duration-300 ease-in-out h-20 p-5";

  const activeLinkClasses = "text-[#FFFF] bg-[#1854af] font-medium";

  const inactive =
    "text-[#F6F6F6] transition font-medium duration-300 ease-in-out hover:text-[#FDFDFD] hover:bg-[#1854af]";

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;

    return `${baseLinkClasses} ${isActive ? activeLinkClasses : inactive}`;
  };

  return (
    <header className="flex bg-[#133c86]  justify-between items-center">
      <h1 className="text-[#F6F6F6] text-2xl font-bold m-4">MW Manager</h1>

      <div className="flex space-x-4">
        {navItems.map((item) => {
          const IconComponent = iconMap[item.iconName];

          return (
            <Link
              key={item.href}
              href={item.href}
              className={getLinkClasses(item.href)}
            >
              {/* 5. Renderiza o ícone com o tamanho desejado */}
              <IconComponent className="w-5 h-5" />
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
