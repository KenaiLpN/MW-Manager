"use client";

import { useState, useEffect } from "react";
import { CadSidebar } from "@/components/cadsidebar";
import Modal from "../../../components/modal"; 
import api from "@/services/api";
import TabelaInstituicoes, { Instituicao } from "@/components/tabelas/tabelainstituicoes";

// Interface do Form
interface InstituicaoFormData {
  nome_instituicao: string;
  email: string;
  senha?: string; // Campo extra para criação
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

export default function Instituicoes() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Estado inicial do formulário
  const initialFormState: InstituicaoFormData = {
    nome_instituicao: "",
    email: "",
    senha: "",
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
  };

  const [formData, setFormData] = useState<InstituicaoFormData>(initialFormState);
  const [saving, setSaving] = useState<boolean>(false);

  const roles = ["Diretor", "Coordenador", "Secretaria", "TI", "Outro"];
  
  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", 
    "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", 
    "SP", "SE", "TO"
  ];

  const buscaCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
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

  const openModalNew = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Instituicao) => {
    setEditingId(item.id_instituicao);
    setFormData({
      nome_instituicao: item.nome_instituicao,
      email: item.email,
      senha: "", // Senha não vem do back e não editamos aqui
      cnpj: item.cnpj || "",
      telefone: item.telefone || "",
      responsavel: item.responsavel || "",
      telefone_responsavel: item.telefone_responsavel || "",
      email_responsavel: item.email_responsavel || "",
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

  async function fetchInstituicoes(paginaParaBuscar: number) {
    setLoading(true);
    try {
      const response = await api.get(`/instituicao?page=${paginaParaBuscar}&limit=10`);
      setInstituicoes(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (err) {
      console.error(err);
      setError("Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInstituicoes(page);
  }, [page]);

  const handlePreviousPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (id: number) => {
    const confirmacao = window.confirm(
      "Tem certeza que deseja excluir esta instituição? Ação irreversível."
    );

    if (!confirmacao) return;

    try {
      await api.delete(`/instituicao/${id}`);
      alert("Instituição excluída com sucesso!");
      fetchInstituicoes(page);
    } catch (err: any) {
      console.error("Erro ao excluir:", err);
      const msg = err.response?.data?.message || "Erro ao excluir.";
      alert(msg);
    }
  };

  const handleSalvar = async () => {
    setSaving(true);

    try {
      // Clona o formData para manipular o payload
      const payload: any = { ...formData };

      // Se for edição, removemos a senha (o endpoint de update não aceita)
      if (editingId) {
        delete payload.senha;
      }

      // Limpeza de strings vazias (exceto booleanos)
      Object.keys(payload).forEach((key) => {
        const value = payload[key];
        if (typeof value === "string" && value.trim() === "") {
             // Opcional: ou remove a chave ou manda null, dependendo do back
             // No seu caso o back aceita string vazia ou trata. 
             // Vamos manter a string se não for nula, mas se quiser limpar:
             // delete payload[key];
        }
      });

      if (editingId) {
        // --- PUT ---
        await api.put(`/instituicao/${editingId}`, payload);
        alert("Instituição atualizada com sucesso!");
      } else {
        // --- POST ---
        await api.post("/instituicao", payload);
        alert("Instituição cadastrada com sucesso!");
      }

      closeModal();
      fetchInstituicoes(page);
    } catch (err: any) {
      console.error("Erro completo:", err);
      if (err.response?.data) {
        alert(`Erro: ${JSON.stringify(err.response.data)}`);
      } else {
        alert("Erro ao salvar instituição.");
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

      <div className="flex flex-col w-full h-full">
        <div className="flex bg-[#bacce6] p-2 h-20 m-5 rounded justify-between items-center">
          <input
            type="text"
            placeholder="Buscar instituições..."
            className="p-2 w-60 rounded bg-white ml-4"
          />
          <button
            onClick={openModalNew}
            className="px-6 py-3 bg-[#34495E] text-white font-semibold rounded-lg shadow-md hover:bg-[#253341a4] mr-4 cursor-pointer"
          >
            Nova Instituição
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <TabelaInstituicoes
            instituicoes={instituicoes}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
            {editingId ? "Editar Instituição" : "Nova Instituição"}
          </h2>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Linha 1: Nome e CNPJ */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Nome da Instituição <span className="text-red-500">*</span>
              </label>
              <input
                name="nome_instituicao"
                value={formData.nome_instituicao}
                onChange={handleChange}
                type="text"
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

            {/* Linha 2: Email e Senha */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Email (Login) <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            {/* Senha só aparece se NÃO estiver editando */}
            {!editingId && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Senha <span className="text-red-500">*</span>
                </label>
                <input
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="p-2 w-full rounded border border-gray-300"
                />
              </div>
            )}

            {/* Linha 3: Telefone e Responsável */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Telefone da Instituição
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
                Nome do Responsável
              </label>
              <input
                name="responsavel"
                value={formData.responsavel}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            {/* Linha 4: Dados Responsável */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Telefone Responsável
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
                Email Responsável
              </label>
              <input
                name="email_responsavel"
                value={formData.email_responsavel}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            {/* Linha 5: Cargo e CEP */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Cargo do Responsável
              </label>
              <select
                name="role_responsavel"
                value={formData.role_responsavel}
                onChange={handleChange}
                className="p-2 w-full rounded border border-gray-300 cursor-pointer"
              >
                <option value="">Selecione...</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
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

            {/* Linha 6: Endereço */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Endereço</label>
              <input
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Número</label>
              <input
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            {/* Linha 7: Bairro e Cidade */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Bairro</label>
              <input
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Cidade</label>
              <input
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            {/* Linha 8: Estado e Complemento */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="p-2 w-full rounded border border-gray-300 cursor-pointer"
              >
                <option value="">UF</option>
                {estados.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Complemento</label>
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