"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Usuários", href: "/cadastros/users" },
  { name: "Pessoas", href: "/cadastros/pessoas" },
  { name: "Unidades", href: "/cadastros/unidades" },
  { name: "Montadoras", href: "/cadastros/montadoras" },
  { name: "Fornecedores", href: "/cadastros/fornecedores" },
  { name: "Produtos", href: "/cadastros/produtos" },
  { name: "Serviços", href: "/cadastros/servicos" },
  { name: "Veículos", href: "/cadastros/veiculos" },
  { name: "Empresas", href: "/cadastros/empresas" },
  { name: "Certificados", href: "/cadastros/certificados" },
];

export function CadSidebar() {
  const pathname = usePathname();

  const baseLinkClasses =
    "flex items-center transition font-medium duration-300 ease-in-out h-14 w-50 justify-center hover:bg-[#253341a4] ";

  const activeLinkClasses = "text-[#FFFF] bg-[#253341a4] font-medium focus:ring-2 focus:ring-gray-500/10";

  const inactive = "text-[#F6F6F6] transition font-medium duration-300 ease-in-out hover:text-[#FDFDFD] hover:bg-[#1854af]";

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;

    return `${baseLinkClasses} ${isActive ? activeLinkClasses : inactive}`;
  };

  return (
    <div className="flex flex-col bg-[#34495E] w-50 h-full items-center">
      {navItems.map((item) => {
        return (
          <Link
            key={item.href}
            href={item.href}
            className={getLinkClasses(item.href)}
          >
           

            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
