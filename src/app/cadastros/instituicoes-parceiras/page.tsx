"use client";

import { useState, useEffect } from "react";
import { CadSidebar } from "@/components/cadsidebar";
import Modal from "../../../components/modal"; 
import api from "@/services/api";
import TabelaInstituicoesParceiras, { InstituicaoParceira } from "@/components/tabelas/tabelainstituicoesparceiras";

interface ParceiroFormData {
  NomeFantasia: string;
  RazaoSocial: string;
  cep: string; // Auxiliar para busca de CEP no formulário (não salva no banco pois não tem coluna)
  Logradouro: string;
  Numero: string;
  Bairro: string;
  Cidade: string;
  Estado: string;
}

export default function InstituicoesParceirasPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [lista, setLista] = useState<InstituicaoParceira[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);

  const [formData, setFormData] = useState<ParceiroFormData>({
    NomeFantasia: "",
    RazaoSocial: "",
    cep: "",
    Logradouro: "",
    Numero: "",
    Bairro: "",
    Cidade: "",
    Estado: "",
  });

  // Função de busca de CEP para facilitar o cadastro
  const buscaCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            Logradouro: data.logradouro,
            Bairro: data.bairro,
            Cidade: data.localidade,
            Estado: data.uf,
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP");
      }
    }
  };

  const openModalNew = () => {
    setEditingId(null);
    setFormData({
      NomeFantasia: "",
      RazaoSocial: "",
      cep: "",
      Logradouro: "",
      Numero: "",
      Bairro: "",
      Cidade: "",
      Estado: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: InstituicaoParceira) => {
    setEditingId(item.IdParceiro);
    setFormData({
      NomeFantasia: item.NomeFantasia || "",
      RazaoSocial: item.RazaoSocial || "",
      cep: "", // O CEP não vem do banco, inicia vazio
      Logradouro: item.Logradouro || "",
      Numero: item.Numero || "",
      Bairro: item.Bairro || "",
      Cidade: item.Cidade || "",
      Estado: item.Estado || "",
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
      const response = await api.get(`/instituicoes-parceiras?page=${pagina}&limit=10`);
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja excluir esta instituição?")) return;

    try {
      await api.delete(`/instituicoes-parceiras/${id}`);
      alert("Excluído com sucesso!");
      fetchData(page);
    } catch (err: any) {
      alert("Erro ao excluir.");
    }
  };

  const handleSalvar = async () => {
    setSaving(true);
    try {
      if (!formData.NomeFantasia) {
        alert("O Nome Fantasia é obrigatório.");
        setSaving(false);
        return;
      }

      // Monta o payload removendo campos auxiliares como 'cep' que não existem no banco
      const payload = {
        NomeFantasia: formData.NomeFantasia,
        RazaoSocial: formData.RazaoSocial,
        Logradouro: formData.Logradouro,
        Numero: formData.Numero,
        Bairro: formData.Bairro,
        Cidade: formData.Cidade,
        Estado: formData.Estado,
      };

      if (editingId) {
        await api.put(`/instituicoes-parceiras/${editingId}`, payload);
        alert("Atualizado com sucesso!");
      } else {
        await api.post("/instituicoes-parceiras", payload);
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
          <h1 className="text-xl font-bold text-[#133c86] ml-4">
            Instituições Parceiras
          </h1>
          <button
            onClick={openModalNew}
            className="px-6 py-3 bg-[#34495E] text-white font-semibold rounded-lg shadow-md hover:bg-[#253341a4] mr-4 cursor-pointer"
          >
            Novo Parceiro
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <TabelaInstituicoesParceiras
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
            {editingId ? "Editar Parceiro" : "Novo Parceiro"}
          </h2>

          <div className="p-4 grid grid-cols-1 gap-4">
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Nome Fantasia <span className="text-red-500">*</span>
              </label>
              <input
                name="NomeFantasia"
                value={formData.NomeFantasia}
                onChange={handleChange}
                type="text"
                maxLength={150}
                placeholder="Nome da Instituição"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Razão Social
              </label>
              <input
                name="RazaoSocial"
                value={formData.RazaoSocial}
                onChange={handleChange}
                type="text"
                maxLength={250}
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            <hr className="my-2" />
            <p className="text-sm font-bold text-gray-500">Endereço</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">CEP</label>
                <input
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  onBlur={(e) => buscaCEP(e.target.value)}
                  type="text"
                  placeholder="00000-000"
                  className="p-2 w-full rounded border border-gray-300"
                />
              </div>

               <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Estado (UF)
                </label>
                <input
                  name="Estado"
                  value={formData.Estado}
                  onChange={handleChange}
                  type="text"
                  maxLength={2}
                  className="p-2 w-full rounded border border-gray-300"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Cidade
              </label>
              <input
                name="Cidade"
                value={formData.Cidade}
                onChange={handleChange}
                type="text"
                maxLength={100}
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
               <div className="col-span-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Logradouro
                </label>
                <input
                  name="Logradouro"
                  value={formData.Logradouro}
                  onChange={handleChange}
                  type="text"
                  maxLength={200}
                  className="p-2 w-full rounded border border-gray-300"
                />
              </div>

               <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Número
                </label>
                <input
                  name="Numero"
                  value={formData.Numero}
                  onChange={handleChange}
                  type="text"
                  maxLength={20}
                  className="p-2 w-full rounded border border-gray-300"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Bairro
              </label>
              <input
                name="Bairro"
                value={formData.Bairro}
                onChange={handleChange}
                type="text"
                maxLength={100}
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