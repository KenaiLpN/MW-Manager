"use client";

import { useState, useEffect } from "react";
import { isAxiosError } from "axios";
import { CadSidebar } from "@/components/cadsidebar";
import Modal from "../../components/modal";
import TabelaClientes from "@/components/tabelaclientes";
import api from "@/services/api";

// Tipagem de cliente
interface Cliente {
  id_usuario: number;
  nome: string;
  email: string;
  cpf: string;
  chk_ativo?: boolean;
}

export default function CadCliPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const modalSearchLayout =
    "p-1 w-40 rounded bg-white m-4 border border-gray-300";

  // 4. Lógica de GET (Busca de Clientes)
  useEffect(() => {
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
    fetchClientes();
  }, []);

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
          <h2 className="text-2xl font-bold m-4">Cadastro de Cliente</h2>
          <div>
            <h1 className="ml-4">ID </h1>

            <input
              type="type"
              placeholder="Nome"
              className={modalSearchLayout}
            />
            <input
              type="text"
              placeholder="CPF / CNPJ"
              className={modalSearchLayout}
            />
            <input
              type="text"
              placeholder="Email"
              className={modalSearchLayout}
            />
            <input
              type="text"
              placeholder="Celular"
              className={modalSearchLayout}
            />
            <input
              type="text"
              placeholder="Nome"
              className={modalSearchLayout}
            />
            <input
              type="text"
              placeholder="Nome"
              className={modalSearchLayout}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                alert("Ação confirmada!");
                closeModal();
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Confirmar
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
