"use client";

import { useState, useEffect } from "react";

import { CadSidebar } from "@/components/cadsidebar";
import Modal from "../../../components/modal";
import TabelaClientes from "@/components/tabelaclientes";
import api from "@/services/api";
import { Cliente } from "@/types";


export default function CadCliPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  const roles = ["Usuário interno", "Aprendiz", "Educador/Tutor" , "Funcionário", "Parceiro" ];

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
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

  const handleSalvar = async () => {
    if (formData.senha_hash !== formData.senha2) {
      alert("As senhas não coincidem. Por favor, verifique.");
      return;
    }

    if (formData.senha_hash.length < 8) {
      alert("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    setSaving(true);
    try {
      const { senha2, ...dataToSend } = formData;
      
      await api.post("/users", dataToSend);

      alert("Cliente cadastrado com sucesso!");

      closeModal(); 
      fetchClientes(page); 
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar cliente. Verifique o console.");
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
          {" "}
          <input
            type="text"
            placeholder="Buscar usuários..."
            className="p-2 w-60 rounded bg-white ml-4"
          />
          <div className="flex space-x-2"></div>
          <button
            onClick={openModal}
            className="px-6 py-3 bg-[#34495E] text-white font-semibold rounded-lg shadow-md hover:bg-[#253341a4] mr-4 cursor-pointer"
          >
            Novo
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <TabelaClientes clientes={clientes} loading={loading} error={error} />

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
                    className="m-1 px-4 py-1 border rounded text-sm  font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className="px-4 py-1 border rounded text-sm font-medium  hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
            Cadastro de Usuários
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
                placeholder="000.000.000-00"
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
                placeholder="exemplo@email.com"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

           
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Telefone
              </label>
              <input
                name="telefone"
                value={formData.telefone} // Ajuste conforme seu formData
                onChange={handleChange}
                type="text"
                placeholder="(11) 99999-9999"
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
                placeholder="00000-000"
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
                <option value="">Selecione o estado</option>
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
                placeholder="Rua"
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
                placeholder="Bairro"
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
                placeholder="Cidade"
                className="p-2 w-full rounded border border-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">
                Senha
              </label>
              <input
                name="senha_hash"
                value={formData.senha_hash}
                onChange={handleChange}
                type="password"
                placeholder="Senha"
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

          {/* BOTÕES DE AÇÃO */}
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
