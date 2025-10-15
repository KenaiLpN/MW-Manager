"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Clientes", href: "/cadcli" },
  { name: "Pessoas", href: "/pessoas" },
  { name: "Unidades", href: "/unidades" },
  { name: "Montadoras", href: "/montadoras" },
  { name: "Fornecedores", href: "/fornecedores" },
  { name: "Produtos", href: "/produtos" },
  { name: "Serviços", href: "/servicos" },
  { name: "Veículos", href: "/veiculos" },
  { name: "Empresas", href: "/empresas" },
  { name: "Certificados", href: "/certificados" },
];

export function CadSidebar() {
  const pathname = usePathname();

  const baseLinkClasses =
    "flex items-center text-[#52E8FB] transition font-medium duration-300 ease-in-out h-14 w-50 justify-center";

  const activeLinkClasses = "text-[#FFFF] bg-[#1854af] font-medium";

  const inactive = "text-[#F6F6F6] transition font-medium duration-300 ease-in-out hover:text-[#FDFDFD] hover:bg-[#1854af]";

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;

    return `${baseLinkClasses} ${isActive ? activeLinkClasses : inactive}`;
  };

  return (
    <div className="flex flex-col bg-[#133c86] w-50 items-center h-full">
      {navItems.map((item) => {
        return (
          <Link
            key={item.href}
            href={item.href}
            className={getLinkClasses(item.href)}
          >
            {/* 5. Renderiza o ícone com o tamanho desejado */}

            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
