"use client";

import { useState, useEffect } from "react";
import { CadSidebar } from "@/components/cadsidebar";
import Modal from "../../../components/modal";
import api from "@/services/api";
import TabelaCadastroRegiao, {
  CadastroRegiao,
} from "@/components/tabelas/tabelacadastroregiao";

interface RegiaoFormData {
  NomeRegiao: string;
  SiglaRegiao: string;
  ResponsavelRegional: string;
  Ativo: boolean;
}

export default function RegioesPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [lista, setLista] = useState<CadastroRegiao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const [formData, setFormData] = useState<RegiaoFormData>({
    NomeRegiao: "",
    SiglaRegiao: "",
    ResponsavelRegional: "",
    Ativo: true,
  });

  const openModalNew = () => {
    setEditingId(null);
    setFormData({
      NomeRegiao: "",
      SiglaRegiao: "",
      ResponsavelRegional: "",
      Ativo: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: CadastroRegiao) => {
    setEditingId(item.IdRegiao);
    setFormData({
      NomeRegiao: item.NomeRegiao,
      SiglaRegiao: item.SiglaRegiao || "",
      ResponsavelRegional: item.ResponsavelRegional || "",
      Ativo: item.Ativo ?? true,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  async function fetchData(pagina: number, searchTerm: string = search) {
    setLoading(true);
    try {
      const response = await api.get(
        `/regioes?page=${pagina}&limit=10${searchTerm ? `&search=${searchTerm}` : ""}`,
      );
      setLista(response.data.data);
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
    fetchData(1, search);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setPage(1);
    fetchData(1, "");
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handlePreviousPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja excluir esta região?")) return;

    try {
      await api.delete(`/regioes/${id}`);
      alert("Excluído com sucesso!");
      fetchData(page);
    } catch (err: any) {
      alert("Erro ao excluir.");
    }
  };

  const handleSalvar = async () => {
    setSaving(true);
    try {
      if (!formData.NomeRegiao) {
        alert("O Nome da Região é obrigatório.");
        setSaving(false);
        return;
      }

      if (editingId) {
        await api.put(`/regioes/${editingId}`, formData);
        alert("Atualizado com sucesso!");
      } else {
        await api.post("/regioes", formData);
        alert("Cadastrado com sucesso!");
      }
      closeModal();
      fetchData(page);
    } catch (err: any) {
      console.error(err);
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-row h-full w-full">
      <aside>
        <CadSidebar />
      </aside>

      <div className="flex flex-col w-full h-full">
        <div className="flex bg-[#bacce6] p-2 h-20 m-5 rounded justify-between items-center">
          <div className="flex items-center gap-2 ml-4">
            <h1 className="text-xl font-bold text-[#133c86] mr-4">
              Gestão de Regiões
            </h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nome, sigla..."
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
          <button
            onClick={openModalNew}
            className="px-6 py-3 bg-[#34495E] text-white font-semibold rounded-lg shadow-md hover:bg-[#253341a4] mr-4 cursor-pointer"
          >
            Nova Região
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <TabelaCadastroRegiao
            dados={lista}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <div className="p-4">
            {!loading && !error && (
              <div className="flex justify-between items-center p-2 bg-[#bacce6] border-t border-gray-200 rounded">
                <span className="text-sm text-gray-700">
                  Página <b>{page}</b> de <b>{totalPages}</b>
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
            {editingId ? "Editar Região" : "Nova Região"}
          </h2>

          <div className="p-4 grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Nome da Região <span className="text-red-500">*</span>
              </label>
              <input
                name="NomeRegiao"
                value={formData.NomeRegiao}
                onChange={handleChange}
                type="text"
                maxLength={100}
                placeholder="Ex: Sudeste"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Sigla
                </label>
                <input
                  name="SiglaRegiao"
                  value={formData.SiglaRegiao}
                  onChange={handleChange}
                  type="text"
                  maxLength={10}
                  placeholder="Ex: SE"
                  className="p-2 w-full rounded border border-gray-300"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Responsável Regional
                </label>
                <input
                  name="ResponsavelRegional"
                  value={formData.ResponsavelRegional}
                  onChange={handleChange}
                  type="text"
                  maxLength={100}
                  placeholder="Ex: João da Silva"
                  className="p-2 w-full rounded border border-gray-300"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="Ativo"
                checked={formData.Ativo}
                onChange={handleChange}
                className="h-5 w-5 cursor-pointer"
              />
              <label className="text-sm text-gray-700">Ativo?</label>
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
