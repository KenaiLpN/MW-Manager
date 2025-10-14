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
  { name: "Dashboard", href: "/dashboard", iconName: "Dashboard" },
  { name: "Anydesk", href: "/anydesk", iconName: "TvMinimalPlay" },
  { name: "Chamados", href: "/chamados", iconName: "Ticket" },
  { name: "Clientes", href: "/clientes", iconName: "UsersRound" },
  { name: "Perfil", href: "/perfil", iconName: "CircleUserRound" },
];

export function Header() {
  const pathname = usePathname();

  const baseLinkClasses =
    "flex space-x-2  items-center text-[#52E8FB] transition font-medium duration-300 ease-in-out p-2 rounded-md ";

  const activeLinkClasses = "text-[#52E8FB] bg-[#113D4B] font-medium";

  const inactive =
    "text-[#F6F6F6] transition font-medium duration-300 ease-in-out hover:text-[#FDFDFD] p-1 hover:bg-[#252F3D]";

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;

    return `${baseLinkClasses} ${isActive ? activeLinkClasses : inactive}`;
  };

  return (
    <header className="flex bg-[#151D27] p-5 justify-between items-center">
      <h1 className="text-[#F6F6F6] text-2xl font-bold">CSTec</h1>

      <div className="flex space-x-10 mr-10">
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
          <LogOut className="text-[#F6F6F6] hover:bg-[#252F3D] transition ease-in-out rounded-md " />
        </button>
      </div>
    </header>
  );
}
