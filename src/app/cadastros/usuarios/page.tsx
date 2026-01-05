"use client";

import { useState, useEffect } from "react";
import { CadSidebar } from "@/components/cadsidebar";
import Modal from "../../../components/modal";
import TabelaUsuarios from "@/components/tabelausuarios";
import api from "@/services/api";
import { Cliente } from "@/types";

export default function CadCliPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    endereco: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    telefone: "",
    role: "",
    senha_hash: "",
    senha2: "",
    chk_ativo: true,
  });

  const buscaCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`
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

  const roles = [
    "Usuário interno",
    "Aprendiz",
    "Educador/Tutor",
    "Funcionário",
    "Parceiro",
  ];

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
      nome: "",
      cpf: "",
      email: "",
      endereco: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      telefone: "",
      role: "",
      senha_hash: "",
      senha2: "",
      chk_ativo: true,
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (cliente: Cliente) => {
    setEditingId(cliente.id_usuario);
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      cpf: cliente.cpf,
      endereco: cliente.endereco || "",
      bairro: cliente.bairro || "",
      cidade: cliente.cidade || "",
      estado: cliente.estado || "",
      cep: cliente.cep || "",
      telefone: cliente.telefone || "",
      role: cliente.role,
      senha_hash: "",
      senha2: "",
      chk_ativo: cliente.chk_ativo ?? false,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  async function fetchClientes(paginaParaBuscar: number) {
    setLoading(true);
    try {
      const response = await api.get(
        `/users?page=${paginaParaBuscar}&limit=10`
      );

      setClientes(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (err) {
      console.error(err);
      setError("Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClientes(page);
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

  // --- NOVA FUNÇÃO DE DELETE ---
  const handleDeleteUser = async (id: number) => {
    // 1. Confirmação visual nativa do browser
    const confirmacao = window.confirm(
      "Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
    );

    if (!confirmacao) return;

    try {
      await api.delete(`/users/${id}`);
      alert("Usuário excluído com sucesso!");

      // Atualiza a lista na página atual
      fetchClientes(page);
    } catch (err: any) {
      console.error("Erro ao excluir:", err);
      // Mensagem amigável caso o backend devolva erro (ex: usuário tem vínculos)
      const msg = err.response?.data?.message || "Erro ao excluir usuário.";
      alert(msg);
    }
  };

  // --- FUNÇÃO CORRIGIDA ---
  const handleSalvar = async () => {
    // 1. Validações Iniciais
    if (formData.senha_hash !== formData.senha2) {
      alert("As senhas não coincidem. Por favor, verifique.");
      return;
    }

    if (!editingId && formData.senha_hash.length < 8) {
      alert("Para novos usuários, a senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setSaving(true);

    try {
      // 2. Preparação dos dados (Sanitização)
      const { senha2, ...dataToSend } = formData;
      const payload: any = {};

      // Limpeza de campos vazios para não quebrar o Zod
      Object.keys(dataToSend).forEach((key) => {
        const value = dataToSend[key as keyof typeof dataToSend];

        // Se for a senha e estiver vazia, ignora (para não mandar senha vazia na edição)
        if (key === "senha_hash" && (!value || value === "")) return;

        // Se for string vazia em geral, não envia
        if (typeof value === "string" && value.trim() === "") return;

        payload[key] = value;
      });

      // 3. Envio para API
      if (editingId) {
        // --- MODO EDIÇÃO (PUT) ---
        await api.put(`/users/${editingId}`, payload);
        alert("Cliente atualizado com sucesso!");
      } else {
        // --- MODO CRIAÇÃO (POST) ---
        // Garante que a senha vá na criação se não foi filtrada pela lógica acima
        if (!payload.senha_hash && formData.senha_hash) {
          payload.senha_hash = formData.senha_hash;
        }
        await api.post("/users", payload);
        alert("Cliente cadastrado com sucesso!");
      }

      closeModal();
      fetchClientes(page); // Atualiza a tabela
    } catch (err: any) {
      // 4. Tratamento de Erro
      console.error("Erro completo:", err);

      if (err.response?.data) {
        console.log("Detalhes do erro Zod:", err.response.data);
        alert(`Erro de validação: ${JSON.stringify(err.response.data)}`);
      } else {
        alert("Erro ao salvar cliente.");
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
          <input
            type="text"
            placeholder="Buscar usuários..."
            className="p-2 w-60 rounded bg-white ml-4"
          />
          <div className="flex space-x-2"></div>
          <button
            onClick={openModalNew}
            className="px-6 py-3 bg-[#34495E] text-white font-semibold rounded-lg shadow-md hover:bg-[#253341a4] mr-4 cursor-pointer"
          >
            Novo
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <TabelaUsuarios
            clientes={clientes}
            loading={loading}
            error={error}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
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
            {editingId ? "Editar Usuário" : "Cadastro de Usuários"}
          </h2>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Nome
              </label>
              <input
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                type="text"
                placeholder="Nome Completo"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">CPF</label>
              <input
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Telefone
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
                Função
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="p-2 w-full rounded border border-gray-300 cursor-pointer"
              >
                <option value="">Selecione a função</option>
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
                Endereço
              </label>
              <input
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                type="text"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>
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

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Senha{" "}
                {editingId && (
                  <span className="text-xs font-normal text-gray-500">
                    (Deixe em branco para manter)
                  </span>
                )}
              </label>
              <input
                name="senha_hash"
                value={formData.senha_hash}
                onChange={handleChange}
                type="password"
                placeholder={editingId ? "Nova senha (opcional)" : "Senha"}
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Confirme sua Senha
              </label>
              <input
                name="senha2"
                value={formData.senha2}
                onChange={handleChange}
                type="password"
                placeholder="Confirme sua Senha"
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