"use client";

import { useState, useEffect } from "react";
import { CadSidebar } from "@/components/cadsidebar";
import Modal from "../../../components/modal";
import api from "@/services/api";
import TabelaOcorrencias, { Ocorrencia } from "@/components/tabelas/tabelaocorrencias";

interface OcorrenciaFormData {
  descricao: string;
  data_ocorrencia: string; // usaremos string YYYY-MM-DD para o input
  id_participante: string; // string para facilitar o input, depois convertemos
  chk_ativo: boolean;
}

export default function OcorrenciasPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const initialFormState: OcorrenciaFormData = {
    descricao: "",
    data_ocorrencia: "",
    id_participante: "",
    chk_ativo: true,
  };

  const [formData, setFormData] = useState<OcorrenciaFormData>(initialFormState);
  const [saving, setSaving] = useState<boolean>(false);

  // Busca dados
  async function fetchOcorrencias(pagina: number) {
    setLoading(true);
    try {
      const response = await api.get(`/ocorrencia?page=${pagina}&limit=10`);
      setOcorrencias(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (err) {
      console.error(err);
      setError("Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOcorrencias(page);
  }, [page]);

  const openModalNew = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Ocorrencia) => {
    setEditingId(item.id_ocorrencia);
    
   
    const isoDate = item.data_ocorrencia ? item.data_ocorrencia.split("T")[0] : "";

    setFormData({
      descricao: item.descricao,
      data_ocorrencia: isoDate,
      id_participante: String(item.id_participante),
      chk_ativo: item.chk_ativo,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      chk_ativo: e.target.checked,
    }));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir esta ocorrência?")) return;
    try {
      await api.delete(`/ocorrencia/${id}`);
      alert("Excluído com sucesso!");
      fetchOcorrencias(page);
    } catch (err: any) {
      console.error(err);
      alert("Erro ao excluir.");
    }
  };

  const handleSalvar = async () => {
    setSaving(true);
    try {
      // Converte dados antes de enviar
      const payload = {
        descricao: formData.descricao,
        data_ocorrencia: formData.data_ocorrencia, // O schema espera "YYYY-MM-DD" ou Date
        id_participante: Number(formData.id_participante),
        chk_ativo: formData.chk_ativo
      };

      if (editingId) {
        await api.put(`/ocorrencia/${editingId}`, payload);
        alert("Ocorrência atualizada!");
      } else {
        await api.post("/ocorrencia", payload);
        alert("Ocorrência criada!");
      }
      closeModal();
      fetchOcorrencias(page);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Erro ao salvar.";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  // Paginação handlers
  const handlePreviousPage = () => { if (page > 1) setPage(page - 1); };
  const handleNextPage = () => { if (page < totalPages) setPage(page + 1); };

  return (
    <div className="flex flex-row h-full w-full">
      <aside>
        <CadSidebar />
      </aside>

      <div className="flex flex-col w-full h-full">
        <div className="flex bg-[#bacce6] p-2 h-20 m-5 rounded justify-between items-center">
          <h1 className="text-xl font-bold text-[#133c86] ml-4">
            Ocorrências
          </h1>
          <button
            onClick={openModalNew}
            className="px-6 py-3 bg-[#34495E] text-white font-semibold rounded-lg shadow-md hover:bg-[#253341a4] mr-4 cursor-pointer"
          >
            Nova Ocorrência
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <TabelaOcorrencias
            dados={ocorrencias}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <div className="p-4">
             {!loading && !error && (
              <div className="flex justify-between items-center p-2 bg-[#bacce6] border-t border-gray-200 rounded">
                <span className="text-sm text-gray-700">
                  Página <span className="font-semibold">{page}</span> de <span className="font-semibold">{totalPages}</span>
                </span>
                <div className="space-x-2">
                  <button onClick={handlePreviousPage} disabled={page === 1} className="m-1 px-4 py-1 border rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">Anterior</button>
                  <button onClick={handleNextPage} disabled={page === totalPages} className="px-4 py-1 border rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">Próxima</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-2xl font-bold m-4 text-gray-800">
            {editingId ? "Editar Ocorrência" : "Nova Ocorrência"}
          </h2>

          <div className="p-4 grid grid-cols-1 gap-4">
            
            {/* Descrição */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Descrição <span className="text-red-500">*</span>
              </label>
              <input
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                type="text"
                placeholder="Ex: Falta justificada"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            {/* Data */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Data da Ocorrência <span className="text-red-500">*</span>
              </label>
              <input
                name="data_ocorrencia"
                value={formData.data_ocorrencia}
                onChange={handleChange}
                type="date"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            {/* ID Participante */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                ID do Participante <span className="text-red-500">*</span>
              </label>
              <input
                name="id_participante"
                value={formData.id_participante}
                onChange={handleChange}
                type="number"
                placeholder="ID do aluno/participante"
                className="p-2 w-full rounded border border-gray-300"
              />
        
            </div>
            
            {/* Checkbox Ativo */}
            <div className="flex items-center gap-2 mt-2">
                <input 
                    type="checkbox"
                    id="chk_ativo"
                    checked={formData.chk_ativo}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
                <label htmlFor="chk_ativo" className="text-sm font-semibold text-gray-600 cursor-pointer">
                    Registro Ativo?
                </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 m-4 pt-4 border-t">
            <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer">Cancelar</button>
            <button onClick={handleSalvar} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 cursor-pointer">
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}