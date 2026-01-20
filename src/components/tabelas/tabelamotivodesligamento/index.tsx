import React from "react";

export interface MotivoDesligamento {
  IdMotivo: number;
  Descricao: string;
  Sigla: string;
  TipoDesligamento: string;
  Ativo: string; // Ex: "S" ou "N"
  DataCadastro: string;
}

interface TabelaProps {
  dados: MotivoDesligamento[];
  loading: boolean;
  error: string | null;
  onEdit: (item: MotivoDesligamento) => void;
  onDelete: (id: number) => void;
}

const TabelaMotivoDesligamento: React.FC<TabelaProps> = ({
  dados,
  loading,
  error,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="text-center p-8 text-[#133c86]">
        Carregando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-8 text-center border-t border-red-200">
        ❌ Erro: {error}
      </div>
    );
  }

  if (!dados || dados.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        Nenhum motivo cadastrado.
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { timeZone: 'UTC' });
  };

  return (
    <div className="p-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#bacce6]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider rounded-tl-lg">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider">
              Descrição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider">
              Sigla
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider">
              Data Cadastro
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider">
              Ativo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider rounded-tr-lg">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {dados.map((item) => (
            <tr key={item.IdMotivo} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.IdMotivo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.Descricao}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.Sigla}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.TipoDesligamento}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(item.DataCadastro)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.Ativo === "S"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.Ativo === "S" ? "Sim" : "Não"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(item)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(item.IdMotivo)}
                  className="text-red-600 hover:text-red-900"
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

export default TabelaMotivoDesligamento;