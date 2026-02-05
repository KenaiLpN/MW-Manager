"use client";

import { useState, useEffect } from "react";
import { EmpSidebar } from "@/components/empsidebar";
import Modal from "../../../components/modal";
import api from "@/services/api";
import TabelaRamosAtividade, {
  RamoAtividade,
} from "@/components/tabelas/tabelaramosatividade";

interface RamoFormData {
  Descricao: string;
  CodigoCNAE: string;
  Observacao: string;
  Ativo: boolean;
}

export default function CadRamosAtividadePage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [lista, setLista] = useState<RamoAtividade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const [formData, setFormData] = useState<RamoFormData>({
    Descricao: "",
    CodigoCNAE: "",
    Observacao: "",
    Ativo: true,
  });

  const openModalNew = () => {
    setEditingId(null);
    setFormData({
      Descricao: "",
      CodigoCNAE: "",
      Observacao: "",
      Ativo: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: RamoAtividade) => {
    setEditingId(item.IdRamo);
    setFormData({
      Descricao: item.Descricao,
      CodigoCNAE: item.CodigoCNAE || "",
      Observacao: item.Observacao || "",
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
        `/ramos-atividade?page=${pagina}&limit=10${searchTerm ? `&search=${searchTerm}` : ""}`,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as any;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este ramo de atividade?"))
      return;

    try {
      await api.delete(`/ramos-atividade/${id}`);
      alert("Excluído com sucesso!");
      fetchData(page);
    } catch (err: any) {
      alert("Erro ao excluir.");
    }
  };

  const handleSalvar = async () => {
    if (!formData.Descricao.trim()) {
      alert("A descrição é obrigatória.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/ramos-atividade/${editingId}`, formData);
        alert("Atualizado com sucesso!");
      } else {
        await api.post("/ramos-atividade", formData);
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
        <EmpSidebar />
      </aside>

      <div className="flex flex-col w-full h-full">
        <div className="flex bg-[#bacce6] p-2 h-20 m-5 rounded justify-between items-center">
          <div className="flex items-center gap-2 ml-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por descrição ou CNAE..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyPress}
                className="p-2 pr-10 w-80 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#133c86]"
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
            Novo Ramo
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <TabelaRamosAtividade
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
          <h2 className="text-2xl font-bold m-4 text-gray-800 border-b pb-2">
            {editingId ? "Editar Ramo de Atividade" : "Novo Ramo de Atividade"}
          </h2>

          <div className="p-4 grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Descrição (Máx 150)
              </label>
              <input
                name="Descricao"
                value={formData.Descricao}
                onChange={handleChange}
                type="text"
                maxLength={150}
                placeholder="Ex: Indústria de Alimentos"
                className="p-2 w-full rounded border border-gray-300 focus:ring-2 focus:ring-[#133c86] outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Código CNAE (Máx 20)
              </label>
              <input
                name="CodigoCNAE"
                value={formData.CodigoCNAE}
                onChange={handleChange}
                type="text"
                maxLength={20}
                placeholder="Ex: 10.12-1-01"
                className="p-2 w-full rounded border border-gray-300 focus:ring-2 focus:ring-[#133c86] outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Observação
              </label>
              <textarea
                name="Observacao"
                value={formData.Observacao}
                onChange={handleChange}
                rows={4}
                placeholder="Observações adicionais..."
                className="p-2 w-full rounded border border-gray-300 focus:ring-2 focus:ring-[#133c86] outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="Ativo"
                name="Ativo"
                type="checkbox"
                checked={formData.Ativo}
                onChange={handleChange}
                className="w-4 h-4 text-[#133c86] border-gray-300 rounded focus:ring-[#133c86] cursor-pointer"
              />
              <label
                htmlFor="Ativo"
                className="text-sm font-semibold text-gray-600 cursor-pointer"
              >
                Ramo Ativo
              </label>
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
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors cursor-pointer font-semibold shadow-sm"
            >
              {saving ? "Salvando..." : "Confirmar"}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
