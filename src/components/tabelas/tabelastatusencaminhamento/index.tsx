import React from "react";

export interface StatusEncaminhamento {
  IdStatus: number;
  Descricao: string;
  CorLegenda: string | null;
  FinalizaProcesso: boolean | null;
  PermiteReencaminhamento: boolean | null;
  Ativo: boolean | null;
}

interface TabelaProps {
  dados: StatusEncaminhamento[];
  loading: boolean;
  error: string | null;
  onEdit: (item: StatusEncaminhamento) => void;
  onDelete: (id: number) => void;
}

const TabelaStatusEncaminhamento: React.FC<TabelaProps> = ({
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
        Nenhum status cadastrado.
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
              Descrição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider">
              Cor
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-[#133c86] uppercase tracking-wider">
              Finaliza?
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-[#133c86] uppercase tracking-wider">
              Reencaminha?
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-[#133c86] uppercase tracking-wider">
              Ativo?
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#133c86] uppercase tracking-wider rounded-tr-lg">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {dados.map((item) => (
            <tr key={item.IdStatus} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.IdStatus}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.Descricao}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.CorLegenda && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                      style={{ backgroundColor: item.CorLegenda }}
                    />
                    <span>{item.CorLegenda}</span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                {item.FinalizaProcesso ? "Sim" : "Não"}
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                {item.PermiteReencaminhamento ? "Sim" : "Não"}
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.Ativo
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.Ativo ? "Sim" : "Não"}
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
                  onClick={() => onDelete(item.IdStatus)}
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

export default TabelaStatusEncaminhamento;