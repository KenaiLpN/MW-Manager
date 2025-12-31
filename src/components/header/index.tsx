"use client";

import {
  LayoutDashboard,
  LucideIcon,
  TvMinimalPlay,
  Ticket,
  UsersRound,
  CircleUserRound,
  ScrollText,
  LockKeyhole,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BotaoSair } from "../LogoutButton";
import { UserMenu } from "../perfildropdown";
import api from "@/services/api"; // Importe seu api configurado

// ... (Mantenha seus arrays de iconMap e navItems iguais) ...
const iconMap: { [key: string]: LucideIcon } = {
  Dashboard: LayoutDashboard,
  TvMinimalPlay: TvMinimalPlay,
  Ticket: Ticket,
  UsersRound: UsersRound,
  CircleUserRound: CircleUserRound,
  ScrollText,
  LockKeyhole,
  Settings,
};

interface NavItem {
  name: string;
  href: string;
  iconName: keyof typeof iconMap;
}

const navItems: NavItem[] = [
  { name: "Cadastros", href: "/cadastros/users", iconName: "Dashboard" },
  { name: "Tabelas", href: "/anydesk", iconName: "TvMinimalPlay" },
  { name: "Comercial", href: "/chamados", iconName: "Ticket" },
  { name: "Orçamentos", href: "/orcamentos", iconName: "UsersRound" },
  { name: "Notas", href: "/notas", iconName: "ScrollText" },
  { name: "Segurança", href: "/seguranca", iconName: "LockKeyhole" },
];

export function Header() {
  // 1. Estado inicial
  const [user, setUser] = useState({
    nome: "", // Valor temporário
    role: "",
  });

  const pathname = usePathname();

  // 2. useEffect para buscar os dados assim que o Header aparecer
  useEffect(() => {
    // Busca os dados salvos no navegador
    const dadosSalvos = localStorage.getItem("projov_user");

    if (dadosSalvos) {
      const usuarioParseado = JSON.parse(dadosSalvos);
      setUser({
        nome: usuarioParseado.nome,
        role: usuarioParseado.role || "Sem cargo",
      });
    }
  }, []); // Array vazio = executa apenas 1 vez no load

  // ... (funções de classe css mantidas iguais) ...
  const baseLinkClasses = "flex items-center gap-2 text-[#52E8FB] transition font-medium duration-500 ease-in-out h-20 p-5";
  const activeLinkClasses = "text-[#F6F6F6] bg-[#253341a4] font-medium focus:ring-2 focus:ring-gray-500/10";
  const inactive = "text-[#F6F6F6] transition font-medium duration-300 ease-in-out hover:text-[#FDFDFD] hover:bg-[#253341a4]";

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;
    return `${baseLinkClasses} ${isActive ? activeLinkClasses : inactive}`;
  };

  return (
    <header className="flex bg-[#34495E] border-b border-[#e4e9f0] justify-between items-center">
      <div className="ml-5">
        <h1 className="text-[#F6F6F6] text-2xl font-bold">PROJOV</h1>
        <p className="text-[#F6F6F6] text-xs">
          Rua Pará, nº 159 - BARUERI - SP. Tel.: (11) 4166-2630
        </p>
      </div>

      <div className="flex">
        {navItems.map((item) => {
          const IconComponent = iconMap[item.iconName];
          return (
            <Link
              key={item.name}
              href={item.href}
              className={getLinkClasses(item.href)}
            >
              {IconComponent && <IconComponent className="w-5 h-5" />}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4 pr-5">
        {/* 4. Passando os dados CORRETOS para o seu componente */}
        <UserMenu nome={user.nome} role={user.role} />

      
      </div>
    </header>
  );
}