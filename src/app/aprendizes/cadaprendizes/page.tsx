"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AprendizSidebar } from "@/components/aprendizsidebar";
import { DadosPessoaisForm } from "@/components/forms/aprendiz/DadosPessoaisForm";
import { VinculoContratoForm } from "@/components/forms/aprendiz/VinculoContratoForm";
import { EscolaridadeTurmasForm } from "@/components/forms/aprendiz/EscolaridadeTurmasForm";
import { DocumentacaoForm } from "@/components/forms/aprendiz/DocumentacaoForm";
import { EnderecoContatoForm } from "@/components/forms/aprendiz/EnderecoContatoForm";
import { SaudeDeficienciaForm } from "@/components/forms/aprendiz/SaudeDeficienciaForm";
import { AprendizFormData } from "@/components/forms/aprendiz/types";
import { ArrowLeft, Save } from "lucide-react";
import api from "@/services/api";

function CadastroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingId = searchParams.get("id");

  const [unidades, setUnidades] = useState<any[]>([]);
  const [instituicoes, setInstituicoes] = useState<any[]>([]);
  const [escolas, setEscolas] = useState<any[]>([]);
  const [orientadores, setOrientadores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<AprendizFormData>({
    NomeJovem: "",
    NomeSocial: "",
    CodigoExterno: "",
    IdUnidade: undefined,
    IdInstituicaoParceira: undefined,
    IdEscola: undefined,
    IdMonitorResponsavel: undefined,
    IdTurmaCapacitacao: undefined,
    StatusJovem: "Ativo",
    EstudaAtualmente: "Sim",
    Sexo: "",
    EstadoCivil: "",
    Nacionalidade: "",
    Naturalidade: "",
    UF_Naturalidade: "",
    AlistamentoMilitar: "",
    EscolaridadeNivel: "",
    TipoAprendizagem: "",
    TurnoEscolar: "",
    TipoPagamento: "",
    CBO: "",
    AreaAtuacao: "",
    HorasDiarias: undefined,
    MesesContrato: undefined,
    DataNascimento: "",
    DataInicioEmpresa: "",
    DataInicioAprendizagem: "",
    DataPrevistaTermino: "",
    DataDesligamento: "",
    DataInicioFerias: "",
    DataTerminoFerias: "",
    TurmaSimultaneidade: "",
    TurmaCCI: "",
    RG: "",
    RG_DataEmissao: "",
    RG_OrgaoExpedidor: "",
    RG_UF: "",
    CPF: "",
    PIS: "",
    CTPS_Numero: "",
    CTPS_Serie: "",
    Reservista: "",
    TituloEleitor: "",
    TituloSecao: "",
    TituloZona: "",
    CEP: "",
    Logradouro: "",
    Numero: "",
    Complemento: "",
    Bairro: "",
    Municipio: "",
    UF_Endereco: "",
    TelefoneFixo: "",
    Celular: "",
    Email: "",
    OutrosTelefones: "",
    UsaMedicamentos: false,
    MedicamentosQual: "",
    MedicamentosFinalidade: "",
    TemAlergia: false,
    AlergiaQual: "",
    TemProblemaSaude: false,
    ProblemaSaudeQual: "",
    Deficiencia: "",
  });

  useEffect(() => {
    loadSelectData();
    if (editingId) {
      fetchAprendiz(editingId);
    }
  }, [editingId]);

  const loadSelectData = async () => {
    try {
      const [resUnidades, resParceiros, resEscolas, resOrientadores] =
        await Promise.all([
          api.get("/unidade"),
          api.get("/instituicoes-parceiras"),
          api.get("/instituicao"),
          api.get("/orientador"),
        ]);
      setUnidades(resUnidades.data.data || []);
      setInstituicoes(resParceiros.data.data || []);
      setEscolas(resEscolas.data.data || []);
      setOrientadores(resOrientadores.data.data || []);
    } catch (err) {
      console.error("Erro ao carregar dados auxiliares", err);
    }
  };

  const formatDateForInput = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split("T")[0];
  };

  const fetchAprendiz = async (id: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/aprendiz/${id}`);
      const data = response.data;

      const formattedData = { ...data };

      // Garantir que nenhum campo de texto seja null/undefined para o React
      Object.keys(formattedData).forEach((key) => {
        const val = formattedData[key];
        const isBooleanField =
          key === "UsaMedicamentos" ||
          key === "TemAlergia" ||
          key === "TemProblemaSaude";

        if (val === null || val === undefined) {
          if (isBooleanField) {
            formattedData[key] = false;
          } else if (
            key.startsWith("Id") ||
            typeof (formData as any)[key] === "number"
          ) {
            // Mantém undefined para Ids
          } else {
            formattedData[key] = "";
          }
        } else if (isBooleanField) {
          formattedData[key] = Boolean(val);
        }
      });

      // Formatar todas as datas para input date (YYYY-MM-DD)
      const dateFields = [
        "DataNascimento",
        "DataInicioEmpresa",
        "DataInicioAprendizagem",
        "DataPrevistaTermino",
        "DataDesligamento",
        "DataInicioFerias",
        "DataTerminoFerias",
        "RG_DataEmissao",
      ];

      dateFields.forEach((field) => {
        if (formattedData[field]) {
          formattedData[field] = new Date(formattedData[field])
            .toISOString()
            .split("T")[0];
        } else {
          formattedData[field] = "";
        }
      });

      setFormData(formattedData);
    } catch (err) {
      console.error("Erro ao buscar aprendiz", err);
      alert("Erro ao carregar dados do aprendiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        name.startsWith("Id") ||
        name === "HorasDiarias" ||
        name === "MesesContrato"
          ? value
            ? Number(value)
            : undefined
          : value || "", // Garante string vazia em vez de undefined
    }));
  };

  const handleSave = async () => {
    if (!formData.NomeJovem) {
      alert("O nome completo é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      // Limpar dados antes de enviar
      const dataToSend = { ...formData };
      delete dataToSend.IdAluno; // O ID já vai na URL do PUT

      if (editingId) {
        await api.put(`/aprendiz/${editingId}`, dataToSend);
        alert("Aprendiz atualizado com sucesso!");
      } else {
        await api.post("/aprendiz", dataToSend);
        alert("Aprendiz cadastrado com sucesso!");
      }
      router.push("/aprendizes");
    } catch (err: any) {
      console.error(err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Erro ao salvar aprendiz.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const buscaCEP = async (CEP: string) => {
    const cepLimpo = CEP.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`,
        );
        const data = await response.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            Logradouro: data.logradouro || "",
            Bairro: data.bairro || "",
            Municipio: data.localidade || "",
            UF_Endereco: data.uf || "",
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP");
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc]">
      <AprendizSidebar />

      <main className="flex-1 flex flex-col overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 cursor-pointer"
              >
                <ArrowLeft size={36} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#133c86]">
                  {editingId
                    ? "Formulário de Edição"
                    : "Formulário de Cadastro"}
                </h1>
                <p className="text-sm text-gray-500">
                  {formData.NomeJovem ||
                    (editingId ? "Carregando..." : "Novo Jovem Aprendiz")}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2.5 bg-[#133c86] text-white rounded-lg font-bold hover:bg-[#0f2e6b] transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  "Processando..."
                ) : (
                  <>
                    <Save size={18} />
                    {editingId ? "Atualizar" : "Salvar Cadastro"}
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="w-full space-y-10 pb-20">
            {/* 1. DADOS PESSOAIS */}
            <DadosPessoaisForm
              formData={formData}
              handleChange={handleChange}
            />

            {/* 2. VÍNCULO E CONTRATO */}
            <VinculoContratoForm
              formData={formData}
              handleChange={handleChange}
              unidades={unidades}
              instituicoes={instituicoes}
              orientadores={orientadores}
            />

            {/* 3. ESCOLARIDADE E TURMAS */}
            <EscolaridadeTurmasForm
              formData={formData}
              handleChange={handleChange}
              escolas={escolas}
            />

            {/* 4. DOCUMENTAÇÃO */}
            <DocumentacaoForm formData={formData} handleChange={handleChange} />

            {/* 5. ENDEREÇO E CONTATO */}
            <EnderecoContatoForm
              formData={formData}
              handleChange={handleChange}
              buscaCEP={buscaCEP}
            />

            {/* 6. INFORMAÇÕES DE SAÚDE */}
            <SaudeDeficienciaForm
              formData={formData}
              handleChange={handleChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CadAprendizes() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#133c86]"></div>
        </div>
      }
    >
      <CadastroForm />
    </Suspense>
  );
}
