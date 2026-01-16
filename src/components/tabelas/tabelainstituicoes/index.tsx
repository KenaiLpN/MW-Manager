import React from "react";

// Defina a interface aqui ou importe de @/types se preferir centralizar
export interface Instituicao {
  id_instituicao: number;
  nome_instituicao: string;
  email: string;
  cnpj?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  chk_ativo?: boolean;
  // Outros campos opcionais para edição...
  telefone?: string;
  cep?: string;
  complemento?: string;
  responsavel?: string;
  role_responsavel?: string;
  telefone_responsavel?: string;
  email_responsavel?: string;
}

interface TabelaInstituicoesProps {
  instituicoes: Instituicao[];
  loading: boolean;
  error: string | null;
  onEdit: (instituicao: Instituicao) => void;
  onDelete: (id: number) => void;
}

const TabelaInstituicoes: React.FC<TabelaInstituicoesProps> = ({
  instituicoes,
  loading,
  error,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="text-center p-8 text-[#133c86]">
        Carregando instituições...
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

  if (!instituicoes || instituicoes.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        Nenhuma instituição cadastrada.
      </div>
    );
  }

  return (
    <div className="p-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#bacce6]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider rounded-tl-lg">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider">
              Instituição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider">
              CNPJ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider">
              Cidade/UF
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
          {instituicoes.map((inst) => (
            <tr key={inst.id_instituicao} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {inst.id_instituicao}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {inst.nome_instituicao}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {inst.cnpj || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {inst.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {inst.cidade} / {inst.estado}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    inst.chk_ativo
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {inst.chk_ativo ? "Ativo" : "Inativo"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(inst)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(inst.id_instituicao)}
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

export default TabelaInstituicoes;