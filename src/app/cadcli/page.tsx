"use client";

import { useState } from "react";
import { CadSidebar } from "@/components/cadsidebar";
import Modal from "../../components/modal";

export default function CadCliPage() {
  // ✅ CORREÇÃO: O estado e as funções foram movidos para DENTRO do componente.
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex">
      <aside>
        <CadSidebar />
      </aside>

      <div className="m-10 w-full">
        <h1 className="text-[#133c86] font-bold text-3xl mb-5">Clientes</h1>
        <div className="bg-[#d5deeb]  rounded flex h-175">
          <div className="flex bg-[#bacce6] h-18 m-5 rounded justify-between w-full items-center">
            {" "}
            {/* Adicionei items-center para alinhar verticalmente */}
            <input
              type="text"
              placeholder="Buscar clientes"
              className="p-1 w-40 rounded bg-white ml-4"
            />
            <div className="flex space-x-2">
              <button className="p-1 w-40 rounded bg-white">Colunas</button>
              <button className="p-1 w-40 rounded bg-white">Colunas</button>
              <button className="p-1 w-40 rounded bg-white">Colunas</button>
            </div>
            <button
              onClick={openModal}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 mr-4"
            >
              Novo
            </button>
            {/* O Modal continua aqui, mas agora tem acesso correto ao estado */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>


              <h2 className="text-2xl font-bold mb-4">Cadastro de Cliente</h2>
              <div>
                <input
                  type="type"
                  placeholder="Nome"
                  className="p-1 w-40 rounded bg-white ml-4"
                />
                <input
                  type="text"
                  placeholder="Nome"
                  className="p-1 w-40 rounded bg-white ml-4"
                />
                <input
                  type="text"
                  placeholder="Nome"
                  className="p-1 w-40 rounded bg-white ml-4"
                />
                <input
                  type="text"
                  placeholder="Nome"
                  className="p-1 w-40 rounded bg-white ml-4"
                />
                <input
                  type="text"
                  placeholder="Nome"
                  className="p-1 w-40 rounded bg-white ml-4"
                />
                <input
                  type="text"
                  placeholder="Nome"
                  className="p-1 w-40 rounded bg-white ml-4"
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
      </div>
    </div>
  );
}
