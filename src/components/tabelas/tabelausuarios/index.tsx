// src/components/TabelaClientes.tsx

import React from "react";

import { Usuario } from "@/types";

interface TabelaUsuariosProps {
  usuarios: Usuario[];
  loading: boolean;
  error: string | null;
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: number) => void;
}

const TabelaUsuarios: React.FC<TabelaUsuariosProps> = ({
  usuarios,
  loading,
  error,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="text-center p-8 text-[#133c86]">
        Carregando clientes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-8 text-center border-t border-red-200">
        ❌ Erro ao buscar: {error}
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        Nenhum usuário cadastrado.
      </div>
    );
  }

  function formatCPF(cpf: string) {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }

  return (
    <div className="p-4 overflow-x-auto ">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#bacce6]">
          <tr>
            {/* Colunas ajustadas para refletir o JSON */}
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider rounded-tl-lg">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider">
              Função
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider">
              CPF
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider">
              Status
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider rounded-tr-lg">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {usuarios.map((usuario) => (
            // Usando id_usuario como chave
            <tr key={usuario.id_usuario} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {usuario.id_usuario}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {usuario.nome}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {usuario.role_responsavel}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCPF(usuario.cpf)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {usuario.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    usuario.chk_ativo
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {usuario.chk_ativo ? "Ativo" : "Inativo"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {/* Botões de Ação (ex: Editar, Excluir) */}
                <button
                  onClick={() => onEdit(usuario)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(usuario.id_usuario)}
                  className="text-red-600 hover:text-red-900 cursor-pointer"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaUsuarios;
