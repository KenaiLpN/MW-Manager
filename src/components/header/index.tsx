"use client";
import {
  LayoutDashboard,
  LucideIcon,
  TvMinimalPlay,
  Ticket,
  UsersRound,
  CircleUserRound,
  LogOut,
  ScrollText,
  LockKeyhole,
  Settings
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";
import logoFundacao from "../../images/logofundacao.png";


const iconMap: { [key: string]: LucideIcon } = {
  Dashboard: LayoutDashboard,
  TvMinimalPlay: TvMinimalPlay,
  Ticket: Ticket,
  UsersRound: UsersRound,
  CircleUserRound: CircleUserRound,ScrollText,LockKeyhole, Settings
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
  { name: "Orçamentos", href: "/orcamentos", iconName: "UsersRound" },
  { name: "Notas", href: "/notas", iconName: "ScrollText" },
  { name: "Perfil", href: "/perfil", iconName: "CircleUserRound" },
  { name: "Segurança", href: "/seguranca", iconName: "LockKeyhole" },
  { name: "Configurações", href: "/configuracoes", iconName: "Settings" },
];

export function Header() {
  const pathname = usePathname();

  const baseLinkClasses =
    "flex items-center gap-2 text-[#52E8FB] transition font-medium duration-300 ease-in-out h-20 p-5";
  const activeLinkClasses = "text-[#FFFF] bg-[#1854af] font-medium";
  const inactive =
    "text-[#F6F6F6] transition font-medium duration-300 ease-in-out hover:text-[#FDFDFD] hover:bg-[#1854af]";

  const getLinkClasses = (href: string) => {
    // Para tratar os múltiplos links de "/perfil", podemos ajustar a lógica de 'ativo'
    // Aqui, vamos manter a lógica simples, mas em um caso real você poderia querer mais complexidade.
    const isActive = pathname === href;
    return `${baseLinkClasses} ${isActive ? activeLinkClasses : inactive}`;
  };

  return (
    <header className="flex bg-[#133c86] border-b border-[#e4e9f0] justify-between items-center">
      <div className="ml-5">
        {/* <Image src={logoFundacao} alt="Logo" width={60} height={20}/> */}
        <h1 className="text-[#F6F6F6] text-2xl font-bold">PROJOV</h1>
        <p className="text-[#F6F6F6] text-xs">Rua Pará, nº 159 - - BARUERI - SP - . Tel.: (11) 4166-2630</p>
      </div>

      <div className="flex space-x-2">
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
