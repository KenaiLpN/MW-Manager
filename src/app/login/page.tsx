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
      
      // 1. Pegamos o token que veio no JSON
      const { token, user } = response.data; // Ajuste se vier response.data.user e response.data.token

      // 2. Salvamos os dados do usuário (como você já fazia)
      localStorage.setItem("projov_user", JSON.stringify(user));

      // 3. --- O PULO DO GATO ---
      // Criamos um cookie DO FRONTEND com o mesmo valor do token.
      // Isso permite que o PrivateLayout leia o token via document.cookie.
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax; Secure`;

      // 4. Redirecionamento (O window.location garante que o layout leia o cookie novo)
      window.location.href = "/home";
      
    } catch (error) {
      console.error(error);
      alert("Erro ao fazer login. Verifique seus dados.");
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#2b3c4d]">
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
            className="w-full p-3 rounded-xl bg-[#F3F4F6] border-4 border-[#34495E] focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#F3F4F6] border-4 border-[#34495E] focus:border-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading} // Desabilita o botão enquanto carrega
          className={`w-full text-white p-3 rounded cursor-pointer transition-all
    ${
      loading
        ? "bg-blue-400 cursor-not-allowed" // Estilo quando carregando
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
