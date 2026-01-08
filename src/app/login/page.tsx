"use client";
import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import UserDropDown from "@/components/userdropdown";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/login", { email, senha });
      const dadosDoUsuario = response.data.user;

      // Guarda dados visuais (nome, email) - OK
      localStorage.setItem("projov_user", JSON.stringify(dadosDoUsuario));

      // Pequeno hack: Forçar o reload ou usar router.push
      // window.location.href é bom aqui porque força o PrivateLayout a reler os cookies do zero
      window.location.href = "/home";
    } catch (error) {
      console.error(error);
      alert("Erro ao fazer login. Verifique seus dados.");
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#d9f1fc]">
      <img src="" alt="" />
      <form
        onSubmit={handleLogin}
        className="flex flex-col p-8 bg-[#34495E] shadow-2xl w-110 rounded-2xl gap-8 shadow-grey-900"
      >
        <div>
          <h1 className="text-2xl font-bold text-center text-[#FFFF]">
            Bem vindo ao PROJOV
          </h1>
          <p className="flex justify-center text-[#FFFF]">
            Gestão do Programa Jovem Aprendiz
          </p>
        </div>

        <div>
          <UserDropDown />
        </div>

        <div>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-[#F3F4F6]  outline-blue-500"
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-2 rounded bg-[#F3F4F6] outline-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading} // Desabilita o botão enquanto carrega
          className={`w-full text-white p-3 rounded cursor-pointer mt-6 transition-all
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed" // Estilo quando carregando
        : "bg-gradient-to-t from-[#345ce2] to-[#6a8dff] hover:gradient-to-b hover:from-[#6a8dff] hover:to-[#345ce2]" // Estilo normal
    }`}
        >
          {loading ? "Entrando..." : "Entrar"} {/* Muda o texto */}
        </button>
        <button
          type="button"
          className="flex justify-center text-[#FFFF] hover:text-blue-500"
          id="lostpassword"
        >
          Esqueci minha senha
        </button>
      </form>
    </div>
  );
}
