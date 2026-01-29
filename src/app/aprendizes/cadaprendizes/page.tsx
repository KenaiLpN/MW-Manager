"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AprendizSidebar } from "@/components/aprendizsidebar";
import {
  ArrowLeft,
  Save,
  User,
  MapPin,
  Building,
  GraduationCap,
  Phone,
  Mail,
  Calendar,
  Info,
  FileText,
  HeartPulse,
  Briefcase,
  ShieldCheck,
  CreditCard,
  Clock,
  ClipboardList,
} from "lucide-react";
import api from "@/services/api";

// Interface Completa para o Aprendiz baseada no Prisma
interface AprendizFormData {
  IdAluno?: number;
  CodigoExterno?: string;
  NomeJovem: string;
  NomeSocial?: string;
  IdUnidade?: number;
  IdInstituicaoParceira?: number;
  IdEscola?: number;
  IdMonitorResponsavel?: number;
  IdTurmaCapacitacao?: number;
  DataNascimento?: string;
  Sexo?: string;
  EstadoCivil?: string;
  Nacionalidade?: string;
  UF_Naturalidade?: string;
  Naturalidade?: string;
  AlistamentoMilitar?: string;
  EstudaAtualmente?: string;
  EscolaridadeNivel?: string;
  TipoAprendizagem?: string;
  TurnoEscolar?: string;
  StatusJovem?: string;
  TipoPagamento?: string;
  CBO?: string;
  AreaAtuacao?: string;
  HorasDiarias?: number;
  MesesContrato?: number;
  DataInicioEmpresa?: string;
  DataInicioAprendizagem?: string;
  DataPrevistaTermino?: string;
  DataDesligamento?: string;
  DataInicioFerias?: string;
  DataTerminoFerias?: string;
  TurmaSimultaneidade?: string;
  TurmaCCI?: string;
  RG?: string;
  RG_DataEmissao?: string;
  RG_OrgaoExpedidor?: string;
  RG_UF?: string;
  CPF?: string;
  PIS?: string;
  CTPS_Numero?: string;
  CTPS_Serie?: string;
  Reservista?: string;
  TituloEleitor?: string;
  TituloSecao?: string;
  TituloZona?: string;
  CEP?: string;
  Logradouro?: string;
  Numero?: string;
  Complemento?: string;
  Bairro?: string;
  Municipio?: string;
  UF_Endereco?: string;
  TelefoneFixo?: string;
  Celular?: string;
  Email?: string;
  OutrosTelefones?: string;
  UsaMedicamentos?: boolean;
  MedicamentosQual?: string;
  MedicamentosFinalidade?: string;
  TemAlergia?: boolean;
  AlergiaQual?: string;
  TemProblemaSaude?: boolean;
  ProblemaSaudeQual?: string;
  Deficiencia?: string;
}

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

  const ufOptions = [
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
          <div className=" mx-auto flex justify-between items-center">
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
          <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {/* 1. DADOS PESSOAIS */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <User size={18} className="text-[#133c86]" />
                <h2 className="font-bold text-gray-700 uppercase text-xs tracking-wider">
                  Dados do Jovem
                </h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                <div className="flex flex-col gap-1.5 lg:col-span-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Código Externo
                  </label>
                  <input
                    name="CodigoExterno"
                    value={formData.CodigoExterno || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5 lg:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Nome Completo *
                  </label>
                  <input
                    name="NomeJovem"
                    value={formData.NomeJovem}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Nome Social
                  </label>
                  <input
                    name="NomeSocial"
                    value={formData.NomeSocial || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Data Nascimento
                  </label>
                  <input
                    type="date"
                    name="DataNascimento"
                    value={formData.DataNascimento || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Sexo
                  </label>
                  <select
                    name="Sexo"
                    value={formData.Sexo || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  >
                    <option value="">Selecione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Estado Civil
                  </label>
                  <select
                    name="EstadoCivil"
                    value={formData.EstadoCivil || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  >
                    <option value="">Selecione...</option>
                    <option value="Solteiro">Solteiro(a)</option>
                    <option value="Casado">Casado(a)</option>
                    <option value="Divorciado">Divorciado(a)</option>
                    <option value="Viúvo">Viúvo(a)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Nacionalidade
                  </label>
                  <input
                    name="Nacionalidade"
                    value={formData.Nacionalidade || ""}
                    onChange={handleChange}
                    placeholder="Ex: Brasileira"
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Naturalidade (Cidade)
                  </label>
                  <input
                    name="Naturalidade"
                    value={formData.Naturalidade || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    UF Naturalidade
                  </label>
                  <select
                    name="UF_Naturalidade"
                    value={formData.UF_Naturalidade || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  >
                    <option value="">--</option>
                    {ufOptions.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Alistamento Militar
                  </label>
                  <select
                    name="AlistamentoMilitar"
                    value={formData.AlistamentoMilitar || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  >
                    <option value="">Selecione...</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Status do Jovem
                  </label>
                  <select
                    name="StatusJovem"
                    value={formData.StatusJovem || ""}
                    onChange={handleChange}
                    className="p-3 bg-blue-50 text-blue-700 font-bold border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition-all shadow-sm"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Desligado">Desligado</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>
              </div>
            </section>

            {/* 2. VÍNCULO E CONTRATO */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <Briefcase size={18} className="text-[#133c86]" />
                <h2 className="font-bold text-gray-700 uppercase text-xs tracking-wider">
                  Vínculo e Contrato
                </h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-blue-600 uppercase">
                    Unidade Administrativa
                  </label>
                  <select
                    name="IdUnidade"
                    value={formData.IdUnidade || ""}
                    onChange={handleChange}
                    className="p-3 bg-blue-50/30 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-200 focus:bg-white outline-none transition-all"
                  >
                    <option value="">Selecione...</option>
                    {unidades.map((u) => (
                      <option key={u.id_unidade} value={u.id_unidade}>
                        {u.nome_unidade}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Instituição Parceira
                  </label>
                  <select
                    name="IdInstituicaoParceira"
                    value={formData.IdInstituicaoParceira || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  >
                    <option value="">Selecione...</option>
                    {instituicoes.map((i) => (
                      <option key={i.IdParceiro} value={i.IdParceiro}>
                        {i.NomeFantasia}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Orientador Responsável
                  </label>
                  <select
                    name="IdMonitorResponsavel"
                    value={formData.IdMonitorResponsavel || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  >
                    <option value="">Selecione...</option>
                    {orientadores.map((o) => (
                      <option key={o.IdOrientador} value={o.IdOrientador}>
                        {o.NomeOrientador}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Tipo de Aprendizagem
                  </label>
                  <select
                    name="TipoAprendizagem"
                    value={formData.TipoAprendizagem || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  >
                    <option value="">Selecione...</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Operacional">Operacional</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    CBO / Função
                  </label>
                  <input
                    name="CBO"
                    value={formData.CBO || ""}
                    onChange={handleChange}
                    placeholder="Código CBO"
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Área de Atuação
                  </label>
                  <input
                    name="AreaAtuacao"
                    value={formData.AreaAtuacao || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Horas Diárias
                  </label>
                  <input
                    type="number"
                    name="HorasDiarias"
                    value={formData.HorasDiarias || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Meses de Contrato
                  </label>
                  <input
                    type="number"
                    name="MesesContrato"
                    value={formData.MesesContrato || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Tipo de Pagamento
                  </label>
                  <select
                    name="TipoPagamento"
                    value={formData.TipoPagamento || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  >
                    <option value="">Selecione...</option>
                    <option value="Mensal">Mensalista</option>
                    <option value="Horista">Horista</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Data Início Empresa
                  </label>
                  <input
                    type="date"
                    name="DataInicioEmpresa"
                    value={formData.DataInicioEmpresa || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Data Início Aprendizagem
                  </label>
                  <input
                    type="date"
                    name="DataInicioAprendizagem"
                    value={formData.DataInicioAprendizagem || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Data Prevista Término
                  </label>
                  <input
                    type="date"
                    name="DataPrevistaTermino"
                    value={formData.DataPrevistaTermino || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Data Desligamento
                  </label>
                  <input
                    type="date"
                    name="DataDesligamento"
                    value={formData.DataDesligamento || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Início Férias
                  </label>
                  <input
                    type="date"
                    name="DataInicioFerias"
                    value={formData.DataInicioFerias || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Término Férias
                  </label>
                  <input
                    type="date"
                    name="DataTerminoFerias"
                    value={formData.DataTerminoFerias || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            {/* 3. ESCOLARIDADE E TURMAS */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <GraduationCap size={18} className="text-[#133c86]" />
                <h2 className="font-bold text-gray-700 uppercase text-xs tracking-wider">
                  Escolaridade e Turmas
                </h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Estuda Atualmente?
                  </label>
                  <select
                    name="EstudaAtualmente"
                    value={formData.EstudaAtualmente || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  >
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Escolaridade / Nível
                  </label>
                  <select
                    name="EscolaridadeNivel"
                    value={formData.EscolaridadeNivel || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  >
                    <option value="">Selecione...</option>
                    <option value="Fundamental Incompleto">
                      Fundamental Incompleto
                    </option>
                    <option value="Fundamental Completo">
                      Fundamental Completo
                    </option>
                    <option value="Médio Incompleto">Médio Incompleto</option>
                    <option value="Médio Completo">Médio Completo</option>
                    <option value="Superior Incompleto">
                      Superior Incompleto
                    </option>
                    <option value="Superior Completo">Superior Completo</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Instituição de Ensino
                  </label>
                  <select
                    name="IdEscola"
                    value={formData.IdEscola || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  >
                    <option value="">Selecione...</option>
                    {escolas.map((e) => (
                      <option key={e.id_instituicao} value={e.id_instituicao}>
                        {e.nome_instituicao}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Turno Escolar
                  </label>
                  <select
                    name="TurnoEscolar"
                    value={formData.TurnoEscolar || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  >
                    <option value="">Selecione...</option>
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                    <option value="Integral">Integral</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Turma Simultaneidade
                  </label>
                  <input
                    name="TurmaSimultaneidade"
                    value={formData.TurmaSimultaneidade || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Turma CCI
                  </label>
                  <input
                    name="TurmaCCI"
                    value={formData.TurmaCCI || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            {/* 4. DOCUMENTAÇÃO */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-[full]">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <FileText size={18} className="text-[#133c86]" />
                <h2 className="font-bold text-gray-700 uppercase text-xs tracking-wider">
                  Documentação
                </h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    CPF
                  </label>
                  <input
                    name="CPF"
                    value={formData.CPF || ""}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    RG
                  </label>
                  <input
                    name="RG"
                    value={formData.RG || ""}
                    onChange={handleChange}
                    placeholder="Número do RG"
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    RG Data Emissão
                  </label>
                  <input
                    type="date"
                    name="RG_DataEmissao"
                    value={formData.RG_DataEmissao || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Órgão Expedidor / UF
                  </label>
                  <div className="flex gap-2">
                    <input
                      name="RG_OrgaoExpedidor"
                      value={formData.RG_OrgaoExpedidor || ""}
                      onChange={handleChange}
                      placeholder="SSP"
                      className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    />
                    <select
                      name="RG_UF"
                      value={formData.RG_UF || ""}
                      onChange={handleChange}
                      className="w-20 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    >
                      <option value="">--</option>
                      {ufOptions.map((uf) => (
                        <option key={uf} value={uf}>
                          {uf}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    PIS / PASEP
                  </label>
                  <input
                    name="PIS"
                    value={formData.PIS || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    CTPS (Número / Série)
                  </label>
                  <div className="flex gap-2">
                    <input
                      name="CTPS_Numero"
                      value={formData.CTPS_Numero || ""}
                      onChange={handleChange}
                      placeholder="Número"
                      className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    />
                    <input
                      name="CTPS_Serie"
                      value={formData.CTPS_Serie || ""}
                      onChange={handleChange}
                      placeholder="Série"
                      className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Reservista
                  </label>
                  <input
                    name="Reservista"
                    value={formData.Reservista || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Título Eleitor (Z / S)
                  </label>
                  <div className="flex gap-2">
                    <input
                      name="TituloEleitor"
                      value={formData.TituloEleitor || ""}
                      onChange={handleChange}
                      placeholder="Número"
                      className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    />
                    <input
                      name="TituloZona"
                      value={formData.TituloZona || ""}
                      onChange={handleChange}
                      placeholder="Z"
                      className="w-16 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    />
                    <input
                      name="TituloSecao"
                      value={formData.TituloSecao || ""}
                      onChange={handleChange}
                      placeholder="S"
                      className="w-16 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 5. ENDEREÇO E CONTATO */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <MapPin size={18} className="text-[#133c86]" />
                <h2 className="font-bold text-gray-700 uppercase text-xs tracking-wider">
                  Endereço e Contato
                </h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  <div className="flex flex-col gap-1.5 lg:col-span-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      CEP
                    </label>
                    <input
                      name="CEP"
                      value={formData.CEP}
                      onChange={handleChange}
                      onBlur={(e) => buscaCEP(e.target.value)}
                      placeholder="00000-000"
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-4">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Logradouro
                    </label>
                    <input
                      name="Logradouro"
                      value={formData.Logradouro || ""}
                      onChange={handleChange}
                      placeholder="Rua, Avenida, etc"
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 lg:col-span-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Número
                    </label>
                    <input
                      name="Numero"
                      value={formData.Numero || ""}
                      onChange={handleChange}
                      placeholder="Nº"
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 lg:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Complemento
                    </label>
                    <input
                      name="Complemento"
                      value={formData.Complemento || ""}
                      onChange={handleChange}
                      placeholder="Apto, Bloco, etc"
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 lg:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Bairro
                    </label>
                    <input
                      name="Bairro"
                      value={formData.Bairro || ""}
                      onChange={handleChange}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 lg:col-span-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Município
                    </label>
                    <input
                      name="Municipio"
                      value={formData.Municipio || ""}
                      onChange={handleChange}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 lg:col-span-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      UF
                    </label>
                    <select
                      name="UF_Endereco"
                      value={formData.UF_Endereco || ""}
                      onChange={handleChange}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    >
                      <option value="">--</option>
                      {ufOptions.map((uf) => (
                        <option key={uf} value={uf}>
                          {uf}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-gray-100">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Celular
                    </label>
                    <div className="relative">
                      <Phone
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        name="Celular"
                        value={formData.Celular || ""}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                        className="p-3 pl-10 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Telefone Fixo
                    </label>
                    <input
                      name="TelefoneFixo"
                      value={formData.TelefoneFixo || ""}
                      onChange={handleChange}
                      placeholder="(00) 0000-0000"
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        name="Email"
                        value={formData.Email || ""}
                        onChange={handleChange}
                        placeholder="jovem@email.com"
                        className="p-3 pl-10 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Outros Telefones
                    </label>
                    <input
                      name="OutrosTelefones"
                      value={formData.OutrosTelefones || ""}
                      onChange={handleChange}
                      placeholder="Recados, etc"
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 6. INFORMAÇÕES DE SAÚDE */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <HeartPulse size={18} className="text-[#133c86]" />
                <h2 className="font-bold text-gray-700 uppercase text-xs tracking-wider">
                  Saúde e Deficiência
                </h2>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Medicamentos */}
                  <div className="space-y-4 p-4 rounded-xl bg-orange-50/30 border border-orange-100">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="UsaMedicamentos"
                        checked={formData.UsaMedicamentos}
                        onChange={handleChange}
                        className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                        id="med"
                      />
                      <label
                        htmlFor="med"
                        className="font-bold text-orange-900 cursor-pointer"
                      >
                        O jovem faz uso de medicamentos?
                      </label>
                    </div>
                    {formData.UsaMedicamentos && (
                      <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-2">
                        <input
                          name="MedicamentosQual"
                          value={formData.MedicamentosQual || ""}
                          onChange={handleChange}
                          placeholder="Quais?"
                          className="p-3 bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-100 outline-none"
                        />
                        <input
                          name="MedicamentosFinalidade"
                          value={formData.MedicamentosFinalidade || ""}
                          onChange={handleChange}
                          placeholder="Finalidade"
                          className="p-3 bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-100 outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Alergias */}
                  <div className="space-y-4 p-4 rounded-xl bg-red-50/30 border border-red-100">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="TemAlergia"
                        checked={formData.TemAlergia}
                        onChange={handleChange}
                        className="w-5 h-5 accent-red-500 rounded cursor-pointer"
                        id="alergia"
                      />
                      <label
                        htmlFor="alergia"
                        className="font-bold text-red-900 cursor-pointer"
                      >
                        O jovem tem alguma alergia?
                      </label>
                    </div>
                    {formData.TemAlergia && (
                      <input
                        name="AlergiaQual"
                        value={formData.AlergiaQual || ""}
                        onChange={handleChange}
                        placeholder="Qual?"
                        className="p-3 w-full bg-white border border-red-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none animate-in fade-in slide-in-from-top-2"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Deficiência */}
                  <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-blue-50/30 border border-blue-100">
                    <label className="font-bold text-blue-900">
                      Possui alguma Deficiência?
                    </label>
                    <select
                      name="Deficiencia"
                      value={formData.Deficiencia || ""}
                      onChange={handleChange}
                      className="p-3 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    >
                      <option value="Nenhuma">Nenhuma</option>
                      <option value="Física">Física</option>
                      <option value="Auditiva">Auditiva</option>
                      <option value="Visual">Visual</option>
                      <option value="Intelectual">Intelectual</option>
                      <option value="Múltipla">Múltipla</option>
                    </select>
                  </div>

                  {/* Problemas de Saúde */}
                  <div className="space-y-4 p-4 rounded-xl bg-purple-50/30 border border-purple-100">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="TemProblemaSaude"
                        checked={formData.TemProblemaSaude}
                        onChange={handleChange}
                        className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
                        id="saude"
                      />
                      <label
                        htmlFor="saude"
                        className="font-bold text-purple-900 cursor-pointer"
                      >
                        O jovem tem problemas de saúde?
                      </label>
                    </div>
                    {formData.TemProblemaSaude && (
                      <input
                        name="ProblemaSaudeQual"
                        value={formData.ProblemaSaudeQual || ""}
                        onChange={handleChange}
                        placeholder="Qual?"
                        className="p-3 w-full bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-100 outline-none animate-in fade-in slide-in-from-top-2"
                      />
                    )}
                  </div>
                </div>
              </div>
            </section>
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
