"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import { UserMenu } from "../perfildropdown";



interface NavItem {
  name: string;
  href: string;
 
}

const navItems: NavItem[] = [
  { name: "Cadastros", href: "/cadastros/usuarios" },
  { name: "Empresa", href: "/empresa/cadramosatividade" },
  { name: "Acessos", href: "/acessos" },
  { name: "Vagas", href: "/vagas" },
  { name: "Aprendiz", href: "/aprendiz" },
  { name: "Pedagógico", href: "/pedagogico"},
  { name: "Estatísticas", href: "/estatisticas"},
];

export function Header() {
  const [user, setUser] = useState({
    nome: "",
    role: "",
  });

  const pathname = usePathname();

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("projov_user");

    if (dadosSalvos) {
      const usuarioParseado = JSON.parse(dadosSalvos);
      setUser({
        nome: usuarioParseado.nome,
        role: usuarioParseado.role || "Sem cargo",
      });
    }
  }, []);

  const baseLinkClasses =
    "flex items-center gap-2 text-[#52E8FB] transition font-medium duration-500 ease-in-out h-20 p-5";
  const activeLinkClasses =
    "text-[#F6F6F6] bg-[#253341a4] font-medium focus:ring-2 focus:ring-gray-500/10";
  const inactive =
    "text-[#F6F6F6] transition font-medium duration-300 ease-in-out hover:text-[#FDFDFD] hover:bg-[#253341a4]";

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;
    return `${baseLinkClasses} ${isActive ? activeLinkClasses : inactive}`;
  };

  return (
    <header className="flex bg-[#34495E] border-b border-[#e4e9f0] justify-between items-center">
      <div className="ml-5">
        <h1 className="text-[#F6F6F6] text-2xl font-bold">PROSIS</h1>
        <p className="text-[#F6F6F6] text-xs">
          Rua Pará, nº 159 - BARUERI - SP. Tel.: (11) 4166-2630
        </p>
      </div>

      <div className="flex">
        {navItems.map((item) => {
         
          return (
            <Link
              key={item.name}
              href={item.href}
              className={getLinkClasses(item.href)}
            >
             
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4 pr-5">
        <UserMenu nome={user.nome} role={user.role} />
      </div>
    </header>
  );
}
