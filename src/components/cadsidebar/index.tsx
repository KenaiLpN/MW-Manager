"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Usuários", href: "/cadastros/usuarios" },
  { name: "Unidades", href: "/cadastros/unidades" },
  { name: "Instituições de Ensino", href: "/cadastros/instensino" },
  { name: "Situações do Participante", href: "/cadastros/sitparticipantes" },
  { name: "Ocorrências", href: "/cadastros/ocorrencias" },
  { name: "Profissões", href: "/cadastros/profissoes" },
  { name: "Graus de Parentesco", href: "/cadastros/grauparentesco" },
  { name: "Graus de Escolaridade", href: "/cadastros/grauescolaridade" },
  { name: "Feriados", href: "/cadastros/feriados" },
  { name: "Motivos de Desligamento", href: "/cadastros/motivodesligamento" },
  { name: "Instituições Parceiras", href: "/cadastros/instparceiras" },
  { name: "Status Encaminhamento", href: "/cadastros/statusencaminhamento" },
  { name: "Regiões", href: "/cadastros/regioes" },
];

export function CadSidebar() {
  const pathname = usePathname();

  const baseLinkClasses =
    "flex items-center transition font-medium duration-300 ease-in-out h-14 w-full justify-center hover:bg-[#253341a4] ";

  const activeLinkClasses = "text-[#FFFF] bg-[#253341a4] font-medium focus:ring-2 focus:ring-gray-500/10";

  const inactive = "text-[#F6F6F6] transition font-medium duration-300 ease-in-out hover:text-[#FDFDFD] hover:bg-[#1854af]";

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;

    return `${baseLinkClasses} ${isActive ? activeLinkClasses : inactive}`;
  };

  return (
    <div className="flex flex-col bg-[#34495E] w-60 h-full items-center">
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
