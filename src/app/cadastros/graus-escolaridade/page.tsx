"use client";

import { useState, useEffect } from "react";
import { CadSidebar } from "@/components/cadsidebar";
import Modal from "../../../components/modal"; 
import api from "@/services/api";
import TabelaGrauEscolaridade, { GrauEscolaridade } from "@/components/tabelas/tabelagrauescolaridade";

export default function GrausEscolaridadePage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [lista, setLista] = useState<GrauEscolaridade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    descricao: "",
    chk_ativo: true,
  });

  const openModalNew = () => {
    setEditingId(null);
    setFormData({ descricao: "", chk_ativo: true });
    setIsModalOpen(true);
  };

  const handleEdit = (item: GrauEscolaridade) => {
    setEditingId(item.id_grau_escolaridade);
    setFormData({
      descricao: item.descricao,
      chk_ativo: item.chk_ativo,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  async function fetchData(pagina: number) {
    setLoading(true);
    try {
      const response = await api.get(`/grau-escolaridade?page=${pagina}&limit=10`);
      setLista(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (err) {
      console.error(err);
      setError("Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja excluir este registro?")) return;

    try {
      await api.delete(`/grau-escolaridade/${id}`);
      alert("Excluído com sucesso!");
      fetchData(page);
    } catch (err: any) {
      alert("Erro ao excluir.");
    }
  };

  const handleSalvar = async () => {
    setSaving(true);
    try {
      if (!formData.descricao.trim()) {
        alert("A descrição é obrigatória.");
        setSaving(false);
        return;
      }

      if (editingId) {
        await api.put(`/grau-escolaridade/${editingId}`, formData);
        alert("Atualizado com sucesso!");
      } else {
        await api.post("/grau-escolaridade", formData);
        alert("Cadastrado com sucesso!");
      }
      closeModal();
      fetchData(page);
    } catch (err: any) {
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
          <h1 className="text-xl font-bold text-[#133c86] ml-4">
            Graus de Escolaridade
          </h1>
          <button
            onClick={openModalNew}
            className="px-6 py-3 bg-[#34495E] text-white font-semibold rounded-lg shadow-md hover:bg-[#253341a4] mr-4 cursor-pointer"
          >
            Novo Cadastro
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <TabelaGrauEscolaridade
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
            {editingId ? "Editar Grau de Escolaridade" : "Novo Grau de Escolaridade"}
          </h2>

          <div className="p-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Descrição
              </label>
              <input
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                type="text"
                maxLength={100}
                placeholder="Ex: Ensino Médio Completo"
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