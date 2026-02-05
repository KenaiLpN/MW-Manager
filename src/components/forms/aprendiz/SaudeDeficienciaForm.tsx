import React from "react";
import { HeartPulse } from "lucide-react";
import { AprendizFormData } from "./types";

interface Props {
  formData: AprendizFormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
}

export function SaudeDeficienciaForm({ formData, handleChange }: Props) {
  return (
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
                checked={!!formData.UsaMedicamentos}
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
                checked={!!formData.TemAlergia}
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
                checked={!!formData.TemProblemaSaude}
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
  );
}
