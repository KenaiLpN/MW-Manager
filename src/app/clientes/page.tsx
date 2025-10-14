'use client'

import { useState, useEffect } from "react";
import { SearchBox } from "../../components/searchbox/searchbox";
import { ClientCard } from "../../components/clicard";
import axios from "axios";

type Client = {
  id: number;
  cod_cli: number;
  razao_social: string;
  fantasia: string;
  cnpj: string;
  ie: string;
  endereco: string;
  num_endereco: number;
  cidade: string;
  bairro: string;
  estado: string;
  telefone: string;
  email: string;
  nome_contato: string;
  cep: number;
  chkAtivo: string;
  createdAt: string;
  updatedAt: string;
};

export default function ClientDataPage() {
  const [searchCod, setSearchCod] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderAsc] = useState(true);

  // 🚀 Aqui está o useEffect:
  useEffect(() => {
    async function fetchClients() {
      const token = localStorage.getItem("token");
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          "https://weaver-api.pixelforge.pro/clientes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setClients(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar a lista de clientes.");
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  return (
    <div className=" space-y-5 h-2000">
      <h1 className="text-white m-7 font-bold text-3xl">Dados do Cliente</h1>

<div className="m-7">    
    <SearchBox
      
        value={searchCod}
        onChange={(value: string) => setSearchCod(value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // Aqui você pode aplicar algum filtro na lista (ex: busca local), se quiser
          }
        }}
      />
</div>

    

      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {clients
        .filter((client) => {
          const search = searchCod.toLowerCase();

          return (
            client.cod_cli.toString().includes(search) ||
            client.cnpj.replace(/\D/g, "").includes(search) ||
            client.razao_social.toLowerCase().includes(search)
          );
        })
        .sort((a, b) =>
          orderAsc ? a.cod_cli - b.cod_cli : b.cod_cli - a.cod_cli
        )
        .map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
    </div>
  );
}
