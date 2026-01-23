"use client";
import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import UserDropDown from "@/components/userdropdown";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setLoginError(false);

    try {
      const response = await api.post("/login", { email, senha });

      const { token, user } = response.data;

      localStorage.setItem("projov_user", JSON.stringify(user));

      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax; Secure`;

      window.location.href = "/home";
    } catch (error) {
      console.error(error);
      setLoginError(true);
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#253442]">
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
            onChange={(e) => {
              setEmail(e.target.value);
              setLoginError(false);
            }}
            className={`w-full p-3 rounded-xl bg-[#F3F4F6] border-2 outline-none ${
              loginError
                ? "border-red-500 focus:border-red-500"
                : "border-[#34495E] focus:border-blue-500"
            }`}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setLoginError(false);
            }}
            className={`w-full p-3 rounded-xl bg-[#F3F4F6] border-2 outline-none ${
              loginError
                ? "border-red-500 focus:border-red-500"
                : "border-[#34495E] focus:border-blue-500"
            }`}
          />
        </div>

        {loginError && (
          <div className="text-red-500 text-sm text-center rounded">
            Credenciais inválidas. Verifique seu e-mail e senha.
          </div>
        )}

        <button
          type="submit"
          disabled={loading} // Desabilita o botão enquanto carrega
          className={`w-full text-white p-3 rounded cursor-pointer transition-[background-position] duration-500 ease-in-out
    ${
      loading
        ? "bg-blue-400 cursor-not-allowed" // Estilo quando carregando
        : "bg-gradient-to-t from-[#345ce2] via-[#6a8dff] to-[#345ce2] bg-[length:100%_200%] bg-bottom hover:bg-top" // Estilo normal com animação
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
