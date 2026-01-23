"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  AlertCircle,
  Cake,
  Users,
  UserSearch,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    name: "Cadastro de Aprendizes",
    href: "/aprendizes",
    icon: <ClipboardList size={18} />,
  },
  {
    name: "Ocorrências",
    href: "/aprendizes/ocorrencias",
    icon: <AlertCircle size={18} />,
  },
  {
    name: "Aniversariantes",
    href: "/aprendizes/aniversariantes",
    icon: <Cake size={18} />,
  },
  {
    name: "Lista de Aprendizes Ativos",
    href: "/aprendizes/ativos",
    icon: <Users size={18} />,
  },
  {
    name: "Pesquisa Candidatos",
    href: "/aprendizes/candidatos",
    icon: <UserSearch size={18} />,
  },
];

export function AprendizSidebar() {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredItems = menuItems.filter((item) =>
    item.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .includes(
        searchTerm
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
      ),
  );

  return (
    <aside className="w-64 bg-[#34495E] h-full flex flex-col shadow-xl">
      {/* Search Section */}
     

      <nav className="flex-1 overflow-y-auto pt-2">
        <ul className="space-y-1">
          {/* Parent Item - Like in the legacy HTML */}
          <li className="px-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between p-3 text-gray-300 hover:bg-[#2c3e50] hover:text-white rounded transition-colors group"
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={20} className="text-blue-400" />
                <span className="font-semibold text-sm uppercase tracking-wider">
                  Aprendiz
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>

            {/* Children Items */}
            {isExpanded && (
              <ul className="mt-1 ml-4 border-l border-[#2c3e50] space-y-1">
                {filteredItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 p-2.5 rounded-r-md transition-all text-sm ${
                          isActive
                            ? "bg-[#1854af] text-white border-l-4 border-blue-400 pl-2"
                            : "text-gray-400 hover:text-white hover:bg-[#2c3e50] pl-3"
                        }`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Footer / Meta */}
      <div className="p-4 bg-[#2c3e50] text-[10px] text-gray-400 text-center uppercase tracking-widest">
        Programa Jovem Aprendiz
      </div>
    </aside>
  );
}
