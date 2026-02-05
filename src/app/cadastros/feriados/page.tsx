"use client";

import { useState, useEffect } from "react";
import { CadSidebar } from "@/components/cadsidebar";
import Modal from "../../../components/modal";
import api from "@/services/api";
import TabelaFeriados, { Feriado } from "@/components/tabelas/tabelaferiados";
import Pagination from "@/components/pagination";

interface FeriadoFormData {
  FerDescricao: string;
  FerData: string; // YYYY-MM-DD para input date
  FerUnidade: string;
  FerTipo?: string;
}

export default function FeriadosPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Feriado | null>(null);

  const [lista, setLista] = useState<Feriado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const [formData, setFormData] = useState<FeriadoFormData>({
    FerDescricao: "",
    FerData: "",
    FerUnidade: "",
    FerTipo: "",
  });

  const openModalNew = () => {
    setEditingItem(null);
    setFormData({
      FerDescricao: "",
      FerData: "",
      FerUnidade: "",
      FerTipo: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Feriado) => {
    setEditingItem(item);

    // Convertendo ISO para YYYY-MM-DD para preencher o input type="date"
    const dataFormatada = item.FerData
      ? new Date(item.FerData).toISOString().split("T")[0]
      : "";

    setFormData({
      FerDescricao: item.FerDescricao,
      FerData: dataFormatada,
      FerUnidade: String(item.FerUnidade),
      FerTipo: item.FerTipo || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  async function fetchData(pagina: number, searchTerm: string = search) {
    setLoading(true);
    try {
      const response = await api.get(
        `/feriado?page=${pagina}&limit=10${searchTerm ? `&search=${searchTerm}` : ""}`,
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (item: Feriado) => {
    if (!window.confirm("Deseja excluir este feriado?")) return;

    try {
      // Deletar usando unidade e data
      const dataFormatada = new Date(item.FerData).toISOString().split("T")[0];
      await api.delete(`/feriado/${item.FerUnidade}/${dataFormatada}`);
      alert("Excluído com sucesso!");
      fetchData(page);
    } catch (err: any) {
      alert("Erro ao excluir.");
    }
  };

  const handleSalvar = async () => {
    setSaving(true);
    try {
      // Validação simples
      if (!formData.FerDescricao || !formData.FerData || !formData.FerUnidade) {
        alert("Preencha todos os campos obrigatórios.");
        setSaving(false);
        return;
      }

      if (editingItem) {
        const dataOriginal = new Date(editingItem.FerData)
          .toISOString()
          .split("T")[0];
        await api.put(
          `/feriado/${editingItem.FerUnidade}/${dataOriginal}`,
          formData,
        );
        alert("Atualizado com sucesso!");
      } else {
        await api.post("/feriado", formData);
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
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por descrição, unidade..."
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
            Novo Feriado
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <TabelaFeriados
            dados={lista}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <div className="p-4">
            {!loading && !error && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            )}
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-2xl font-bold m-4 text-gray-800">
            {editingItem ? "Editar Feriado" : "Novo Feriado"}
          </h2>

          <div className="p-4 grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Descrição do Feriado
              </label>
              <input
                name="FerDescricao"
                value={formData.FerDescricao}
                onChange={handleChange}
                type="text"
                maxLength={50}
                placeholder="Ex: Confraternização Universal"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Data
                </label>
                <input
                  name="FerData"
                  value={formData.FerData}
                  onChange={handleChange}
                  type="date"
                  className="p-2 w-full rounded border border-gray-300"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Unidade
                </label>
                <input
                  name="FerUnidade"
                  value={formData.FerUnidade}
                  onChange={handleChange}
                  type="number"
                  placeholder="Ex: 1"
                  className="p-2 w-full rounded border border-gray-300"
                />
              </div>
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
