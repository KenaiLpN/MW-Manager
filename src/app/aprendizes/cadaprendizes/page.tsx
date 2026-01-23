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
} from "lucide-react";
import api from "@/services/api";

// Interface para o Aprendiz
interface AprendizFormData {
  NomeJovem: string;
  NomeSocial?: string;
  CPF?: string;
  RG?: string;
  IdUnidade?: number;
  IdInstituicaoParceira?: number;
  IdEscola?: number;
  IdMonitorResponsavel?: number;
  DataNascimento?: string;
  Sexo?: string;
  Email?: string;
  Celular?: string;
  CEP?: string;
  Logradouro?: string;
  Numero?: string;
  Bairro?: string;
  Municipio?: string;
  UF_Endereco?: string;
  StatusJovem?: string;
}

function CadastroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingId = searchParams.get("id");

  const [unidades, setUnidades] = useState<any[]>([]);
  const [instituicoes, setInstituicoes] = useState<any[]>([]);
  const [escolas, setEscolas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<AprendizFormData>({
    NomeJovem: "",
    NomeSocial: "",
    CPF: "",
    IdUnidade: undefined,
    StatusJovem: "Ativo",
  });

  useEffect(() => {
    loadSelectData();
    if (editingId) {
      fetchAprendiz(editingId);
    }
  }, [editingId]);

  const loadSelectData = async () => {
    try {
      const [resUnidades, resParceiros, resEscolas] = await Promise.all([
        api.get("/unidade"),
        api.get("/instituicoes-parceiras"),
        api.get("/instituicao"),
      ]);
      setUnidades(resUnidades.data.data || []);
      setInstituicoes(resParceiros.data.data || []);
      setEscolas(resEscolas.data.data || []);
    } catch (err) {
      console.error("Erro ao carregar dados auxiliares", err);
    }
  };

  const fetchAprendiz = async (id: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/aprendiz/${id}`);
      const data = response.data;

      // Formatar data para o input date (YYYY-MM-DD)
      if (data.DataNascimento) {
        data.DataNascimento = new Date(data.DataNascimento)
          .toISOString()
          .split("T")[0];
      }

      setFormData(data);
    } catch (err) {
      console.error("Erro ao buscar aprendiz", err);
      alert("Erro ao carregar dados do aprendiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.startsWith("Id")
        ? value
          ? Number(value)
          : undefined
        : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.NomeJovem) {
      alert("O nome completo é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/aprendiz/${editingId}`, formData);
        alert("Aprendiz atualizado com sucesso!");
      } else {
        await api.post("/aprendiz", formData);
        alert("Aprendiz cadastrado com sucesso!");
      }
      router.push("/aprendizes");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar aprendiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc]">
      <AprendizSidebar />

      <main className="flex-1 flex flex-col overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#133c86]">
                  {editingId ? "Editar Aprendiz" : "Novo Aprendiz"}
                </h1>
                <p className="text-sm text-gray-500">
                  {editingId
                    ? "Atualize as informações do cadastro"
                    : "Preencha os dados para iniciar o cadastro"}
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
                className="px-6 py-2.5 bg-[#133c86] text-white rounded-lg font-bold hover:bg-[#0f2e6b] transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  "Salvando..."
                ) : (
                  <>
                    <Save size={18} />
                    {editingId ? "Salvar Alterações" : "Concluir Cadastro"}
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="max-w-6xl mx-auto space-y-8 pb-10">
            {/* Seção 1: Dados Pessoais */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <User size={18} className="text-[#133c86]" />
                <h2 className="font-bold text-gray-700 uppercase text-xs tracking-wider">
                  Dados Pessoais
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1.5 lg:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="NomeJovem"
                    value={formData.NomeJovem}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all placeholder:text-gray-400"
                    placeholder="Nome completo do jovem"
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
                    placeholder="Se houver"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    CPF
                  </label>
                  <input
                    name="CPF"
                    value={formData.CPF || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    placeholder="000.000.000-00"
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
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    placeholder="Número do documento"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Data de Nascimento
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="DataNascimento"
                      value={formData.DataNascimento || ""}
                      onChange={handleChange}
                      className="p-3 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Sexo
                  </label>
                  <select
                    name="Sexo"
                    value={formData.Sexo || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all cursor-pointer"
                  >
                    <option value="">Selecione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Celular
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      name="Celular"
                      value={formData.Celular || ""}
                      onChange={handleChange}
                      className="p-3 pl-10 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      name="Email"
                      value={formData.Email || ""}
                      onChange={handleChange}
                      className="p-3 pl-10 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                      placeholder="jovem@email.com"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Seção 2: Vínculo Institucional */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <Building size={18} className="text-[#133c86]" />
                <h2 className="font-bold text-gray-700 uppercase text-xs tracking-wider">
                  Vínculo Institucional
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-blue-600 uppercase flex items-center gap-1">
                    Unidade de Lotação
                  </label>
                  <select
                    name="IdUnidade"
                    value={formData.IdUnidade || ""}
                    onChange={handleChange}
                    className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-200 focus:bg-white outline-none transition-all cursor-pointer"
                  >
                    <option value="">Selecione a Unidade...</option>
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
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all cursor-pointer"
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
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                    <GraduationCap size={14} /> Escola / I.E.
                  </label>
                  <select
                    name="IdEscola"
                    value={formData.IdEscola || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all cursor-pointer"
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
                    Status do Vínculo
                  </label>
                  <select
                    name="StatusJovem"
                    value={formData.StatusJovem}
                    onChange={handleChange}
                    className={`p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer font-semibold ${
                      formData.StatusJovem === "Ativo"
                        ? "bg-green-50 text-green-700 border-green-100"
                        : formData.StatusJovem === "Inativo"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                          : "bg-red-50 text-red-700 border-red-100"
                    }`}
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Desligado">Desligado</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Seção 3: Endereço */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <MapPin size={18} className="text-[#133c86]" />
                <h2 className="font-bold text-gray-700 uppercase text-xs tracking-wider">
                  Endereço
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
                <div className="flex flex-col gap-1.5 md:col-span-1 lg:col-span-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    CEP
                  </label>
                  <input
                    name="CEP"
                    value={formData.CEP || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    placeholder="00000-000"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-3 lg:col-span-4">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Logradouro
                  </label>
                  <input
                    name="Logradouro"
                    value={formData.Logradouro || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    placeholder="Rua, Avenida, etc."
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-1 lg:col-span-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Número
                  </label>
                  <input
                    name="Numero"
                    value={formData.Numero || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    placeholder="Nº"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-2">
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

                <div className="flex flex-col gap-1.5 md:col-span-1 lg:col-span-3">
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

                <div className="flex flex-col gap-1.5 md:col-span-1 lg:col-span-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    UF
                  </label>
                  <input
                    name="UF_Endereco"
                    value={formData.UF_Endereco || ""}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all uppercase"
                    maxLength={2}
                    placeholder="UF"
                  />
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
