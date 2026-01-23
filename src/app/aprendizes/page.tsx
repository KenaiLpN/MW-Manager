"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AprendizSidebar } from "@/components/aprendizsidebar";
import api from "@/services/api";

// Interface para o Aprendiz baseada no modelo do Prisma
interface AprendizFormData {
  NomeJovem: string;
  NomeSocial?: string;
  CPF?: string;
  RG?: string;
  IdUnidade?: number;
  IdInstituicaoParceira?: number;
  IdEscola?: number;
  IdMonitorResponsavel?: number;
  DataNascimento?: string;
  Sexo?: string;
  Email?: string;
  Celular?: string;
  CEP?: string;
  Logradouro?: string;
  Numero?: string;
  Bairro?: string;
  Municipio?: string;
  UF_Endereco?: string;
  StatusJovem?: string;
}

export default function Aprendizes() {
  const router = useRouter();
  const [aprendizes, setAprendizes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  // Carregar dados iniciais
  useEffect(() => {
    fetchAprendizes(page);
  }, [page]);

  const fetchAprendizes = async (p: number, s: string = search) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/aprendiz?page=${p}&limit=10${s ? `&search=${s}` : ""}`,
      );
      setAprendizes(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <AprendizSidebar />

      <main className="flex-1 flex flex-col p-6 overflow-auto bg-gray-100">
        <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-[#133c86]">
              Cadastro de Aprendizes
            </h1>
            <p className="text-gray-500 mt-1">
              Gerencie os jovens aprendizes do programa
            </p>
          </div>
          <button
            onClick={() => router.push("/aprendizes/cadaprendizes")}
            className="px-6 py-3 bg-[#133c86] text-white font-semibold rounded-lg hover:bg-[#0f2e6b] transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <span className="text-xl">+</span> Novo Aprendiz
          </button>
        </div>

        {/* Search Bar for the table */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchAprendizes(1, search)}
            className="flex-1 p-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          <button
            onClick={() => fetchAprendizes(1, search)}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Buscar
          </button>
        </div>

        {/* Tabela Modernizada */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-bold text-gray-700 uppercase text-xs tracking-wider">
                  Nome
                </th>
                <th className="p-4 font-bold text-gray-700 uppercase text-xs tracking-wider">
                  CPF
                </th>
                <th className="p-4 font-bold text-gray-700 uppercase text-xs tracking-wider">
                  Unidade
                </th>
                <th className="p-4 font-bold text-gray-700 uppercase text-xs tracking-wider">
                  Status
                </th>
                <th className="p-4 font-bold text-gray-700 uppercase text-xs tracking-wider text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-400">
                    Carregando dados...
                  </td>
                </tr>
              ) : aprendizes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-400">
                    Nenhum aprendiz encontrado.
                  </td>
                </tr>
              ) : (
                aprendizes.map((a) => (
                  <tr
                    key={a.IdAluno}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {a.NomeJovem}
                    </td>
                    <td className="p-4 text-gray-600">
                      {a.CPF || "Não informado"}
                    </td>
                    <td className="p-4 text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded text-sm underline decoration-blue-200">
                        {a.unidade?.nome_unidade || "Não vinculada"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          a.StatusJovem === "Ativo"
                            ? "bg-green-100 text-green-700"
                            : a.StatusJovem === "Inativo"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {a.StatusJovem}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          router.push(
                            `/aprendizes/cadaprendizes?id=${a.IdAluno}`,
                          )
                        }
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all font-semibold text-sm"
                      >
                        Ver / Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="mt-4 flex justify-between items-center text-gray-500 text-sm italic">
          <span>
            Mostrando página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-white border rounded hover:bg-gray-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 bg-white border rounded hover:bg-gray-50"
            >
              Próxima
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
