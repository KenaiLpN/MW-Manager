"use client";

import { useState, useEffect } from "react";
import { CadSidebar } from "@/components/cadsidebar";
import Modal from "../../../components/modal"; // Ajuste o caminho conforme sua estrutura

import api from "@/services/api";
// import { Cliente } from "@/types"; // Se tiver um tipo específico para Unidade, use-o aqui
import TabelaUnidades from "@/components/tabelas/tabelaunidades";

// Definição da interface do Form para garantir tipagem
interface UnidadeFormData {
  nome_unidade: string;
  cnpj: string;
  telefone: string;
  responsavel: string;
  telefone_responsavel: string;
  email_responsavel: string;
  role_responsavel: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  chk_ativo: boolean;
}

export default function Unidades() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Se possível, mude o tipo de Cliente[] para algo como Unidade[]
  const [unidades, setUnidades] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  // Estado inicializado com os campos corretos da Unidade
  const [formData, setFormData] = useState<UnidadeFormData>({
    nome_unidade: "",
    cnpj: "",
    telefone: "",
    responsavel: "",
    telefone_responsavel: "",
    email_responsavel: "",
    role_responsavel: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    chk_ativo: true,
  });

  const buscaCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`,
        );
        const data = await response.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            endereco: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP");
      }
    }
  };

  const [saving, setSaving] = useState<boolean>(false);

  const roles = ["Matriz", "Filial", "Parceiro", "Outro"];

  const estados = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  const openModalNew = () => {
    setEditingId(null);
    setFormData({
      nome_unidade: "",
      cnpj: "",
      telefone: "",
      responsavel: "",
      telefone_responsavel: "",
      email_responsavel: "",
      role_responsavel: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      chk_ativo: true,
    });
    setIsModalOpen(true);
  };

  const handleEditUnity = (item: any) => {
    setEditingId(item.id_unidade || item.id); // Ajuste conforme seu banco de dados
    setFormData({
      nome_unidade: item.nome_unidade || item.nome || "",
      cnpj: item.cnpj || item.cpf || "", // Fallback caso venha como cpf do banco
      telefone: item.telefone || "",
      responsavel: item.responsavel || "",
      telefone_responsavel: item.telefone_responsavel || "",
      email_responsavel: item.email_responsavel || item.email || "",
      role_responsavel: item.role_responsavel || "",
      cep: item.cep || "",
      endereco: item.endereco || "",
      numero: item.numero || "",
      complemento: item.complemento || "",
      bairro: item.bairro || "",
      cidade: item.cidade || "",
      estado: item.estado || "",
      chk_ativo: item.chk_ativo ?? true,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  async function fetchUnidades(
    paginaParaBuscar: number,
    searchTerm: string = search,
  ) {
    setLoading(true);
    try {
      const response = await api.get(
        `/unidade?page=${paginaParaBuscar}&limit=10${searchTerm ? `&search=${searchTerm}` : ""}`,
      );
      setUnidades(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (err) {
      console.error(err);
      setError("Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = () => {
    setPage(1);
    fetchUnidades(1, search);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setPage(1);
    fetchUnidades(1, "");
  };

  useEffect(() => {
    fetchUnidades(page);
  }, [page]);

  const handlePreviousPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteUnity = async (id: number) => {
    const confirmacao = window.confirm(
      "Tem certeza que deseja excluir esta unidade? Esta ação não pode ser desfeita.",
    );

    if (!confirmacao) return;

    try {
      await api.delete(`/unidade/${id}`); // Ajuste a rota se necessário
      alert("Unidade excluída com sucesso!");
      fetchUnidades(page);
    } catch (err: any) {
      console.error("Erro ao excluir:", err);
      const msg = err.response?.data?.message || "Erro ao excluir unidade.";
      alert(msg);
    }
  };

  // --- FUNÇÃO CORRIGIDA E SEM SENHA ---
  const handleSalvar = async () => {
    setSaving(true);

    try {
      // Preparação dos dados
      const payload: any = {};

      // Limpeza de campos vazios
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof UnidadeFormData];
        if (typeof value === "string" && value.trim() === "") return;
        payload[key] = value;
      });

      // Envio para API
      if (editingId) {
        // --- PUT ---
        await api.put(`/unidade/${editingId}`, payload);
        alert("Unidade atualizada com sucesso!");
      } else {
        // --- POST ---
        await api.post("/unidade", payload);
        alert("Unidade cadastrada com sucesso!");
      }

      closeModal();
      fetchUnidades(page);
    } catch (err: any) {
      console.error("Erro completo:", err);
      if (err.response?.data) {
        alert(`Erro de validação: ${JSON.stringify(err.response.data)}`);
      } else {
        alert("Erro ao salvar unidade.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-row h-full w-full">
      <aside>
        <CadSidebar />
      </aside>

      <div className="flex flex-col w-full h-full ">
        <div className="flex bg-[#bacce6] p-2 h-20 m-5 rounded justify-between items-center">
          <div className="flex items-center gap-2 ml-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar unidades..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyPress}
                className="p-2 pr-10 w-72 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#133c86]"
              />
              {search && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Limpar pesquisa"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#133c86] text-white font-semibold rounded hover:bg-[#0f2e6b] transition-colors cursor-pointer"
            >
              Pesquisar
            </button>
          </div>
          <div className="flex space-x-2"></div>
          <button
            onClick={openModalNew}
            className="px-6 py-3 bg-[#34495E] text-white font-semibold rounded-lg shadow-md hover:bg-[#253341a4] mr-4 cursor-pointer"
          >
            Nova Unidade
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {/* Certifique-se que o componente TabelaUnidades espera a prop 'unidades' e não 'clientes' se você mudou lá */}
          <TabelaUnidades
            unidades={unidades}
            loading={loading}
            error={error}
            onEdit={handleEditUnity}
            onDelete={handleDeleteUnity}
          />

          <div className="p-4">
            {!loading && !error && (
              <div className="flex justify-between items-center p-2 bg-[#bacce6] border-t border-gray-200 rounded">
                <span className="text-sm text-gray-700">
                  Página <span className="font-semibold">{page}</span> de{" "}
                  <span className="font-semibold">{totalPages}</span>
                </span>
                <div className="space-x-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className="m-1 px-4 py-1 border rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className="px-4 py-1 border rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-2xl font-bold m-4 text-gray-800">
            {editingId ? "Editar Unidade" : "Cadastro de Unidades"}
          </h2>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Linha 1 */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Nome da Unidade
              </label>
              <input
                name="nome_unidade"
                value={formData.nome_unidade}
                onChange={handleChange}
                type="text"
                placeholder="Nome da Unidade"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                CNPJ
              </label>
              <input
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            {/* Linha 2 */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Telefone da Unidade
              </label>
              <input
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Responsável
              </label>
              <input
                name="responsavel"
                value={formData.responsavel}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            {/* Linha 3 */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Telefone do Responsável
              </label>
              <input
                name="telefone_responsavel"
                value={formData.telefone_responsavel}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Email do Responsável
              </label>
              <input
                name="email_responsavel"
                value={formData.email_responsavel}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            {/* Linha 4 */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Tipo / Função
              </label>
              <select
                name="role_responsavel"
                value={formData.role_responsavel}
                onChange={handleChange}
                className="p-2 w-full rounded border border-gray-300 cursor-pointer"
              >
                <option value="">Selecione...</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">CEP</label>
              <input
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                onBlur={(e) => buscaCEP(e.target.value)}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            {/* Linha 5 */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="p-2 w-full rounded border border-gray-300 cursor-pointer"
              >
                <option value="">UF</option>
                {estados.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Cidade
              </label>
              <input
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            {/* Linha 6 */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Bairro
              </label>
              <input
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Endereço (Logradouro)
              </label>
              <input
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            {/* Linha 7 */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Número
              </label>
              {/* ATENÇÃO: name mudado de 'número' para 'numero' para facilitar o JS */}
              <input
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Complemento
              </label>
              <input
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 m-4 pt-4 border-t">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors cursor-pointer"
            >
              {saving ? "Salvando..." : "Confirmar"}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
