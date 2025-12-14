"use client";

import { useState, useEffect } from "react";
import { isAxiosError } from "axios";
import { CadSidebar } from "@/components/cadsidebar";
import Modal from "../../components/modal";
import TabelaClientes from "@/components/tabelaclientes";
import api from "@/services/api";
import { Cliente } from "@/types";
// Tipagem de cliente

export default function CadCliPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    chk_ativo: true,
  });

  const [saving, setSaving] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ nome: "", cpf: "", email: "", chk_ativo: true });
  };

  const modalSearchLayout =
    "p-1 w-40 rounded bg-white m-4 border border-gray-300";

  async function fetchClientes() {
    try {
      const response = await api.get("/users");
      setClientes(response.data);
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response) {
          setError(`Erro ${err.response.status}: Falha ao buscar dados.`);
        } else if (err.request) {
          setError("Erro de conexão: Verifique se a API está online.");
        }
      } else if (err instanceof Error) {
        setError(`Erro inesperado: ${err.message}`);
      } else {
        setError("Ocorreu um erro desconhecido na requisição.");
      }
    } finally {
      setLoading(false);
    }
  }
  // 4. Lógica de GET (Busca de Clientes)
  useEffect(() => {
    fetchClientes();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSalvar = async () => {
    setSaving(true);
    try {
      // Faz o POST para a rota /users (ou a rota correta de criação)
      await api.post("/users", formData);
      
      alert("Cliente cadastrado com sucesso!");
      
      closeModal();      // Fecha o modal
      fetchClientes();   // Atualiza a tabela com o novo cliente
      
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar cliente. Verifique o console.");
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="flex">
      <aside>
        <CadSidebar />
      </aside>

      <div className="m-10">
        <h1 className="text-[#133c86] font-bold text-3xl mb-5">Clientes</h1>

        <div className="bg-[#d5deeb] rounded flex flex-col h-175 w-400 ">
          <div className="flex bg-[#bacce6] h-18 m-5 rounded justify-between items-center">
            {" "}
            <input
              type="text"
              placeholder="Buscar clientes"
              className="p-1 w-40 rounded bg-white ml-4"
            />
            <div className="flex space-x-2">
              <button className="p-1 w-40 rounded bg-white">Colunas</button>
              <button className="p-1 w-40 rounded bg-white">Filtro</button>
              <button className="p-1 w-40 rounded bg-white">
                Exportar Lista
              </button>
            </div>
            <button
              onClick={openModal}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 mr-4"
            >
              Novo
            </button>
          </div>

          <div className="flex-grow">
            <TabelaClientes
              clientes={clientes}
              loading={loading}
              error={error}
            />
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
  <h2 className="text-2xl font-bold m-4 text-gray-800">Cadastro de Cliente</h2>

 
  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    
    {/* COLUNA 1: NOME */}
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-600">Nome</label>
      <input
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        type="text"
        placeholder="Nome Completo"
        className="p-2 w-full rounded border border-gray-300" 
      />
    </div>

    {/* COLUNA 2: CPF */}
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

    {/* COLUNA 1 (Linha 2): EMAIL */}
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-600">Email</label>
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        type="email"
        placeholder="exemplo@email.com"
        className="p-2 w-full rounded border border-gray-300"
      />
    </div>

    {/* COLUNA 2 (Linha 2): CELULAR */}
    {/* <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-600">Celular</label>
      <input
        name="celular"
        value={formData.cpf} // Ajuste conforme seu formData
        onChange={handleChange}
        type="text"
        placeholder="(11) 99999-9999"
        className="p-2 w-full rounded border border-gray-300"
      />
    </div> */}

   
    {/* <div className="col-span-2 flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-600">Observação / Endereço</label>
      <input
        name="observacao" 
        value={formData.cpf} 
        onChange={handleChange}
        type="text"
        placeholder="Endereço completo ou observações"
        className="p-2 w-full rounded border border-gray-300"
      />
    </div> */}

  </div>

  {/* BOTÕES DE AÇÃO */}
  <div className="flex justify-end gap-4 m-4 pt-4 border-t">
    <button
      onClick={closeModal}
      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
    >
      Cancelar
    </button>
    <button
      onClick={handleSalvar}
      disabled={saving}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
    >
      {saving ? 'Salvando...' : 'Confirmar'}
    </button>
  </div>
</Modal>
      </div>
    </div>
  );
}