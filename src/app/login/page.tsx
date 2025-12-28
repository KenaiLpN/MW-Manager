"use client";
import { useState } from "react";
import api from "@/services/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Dropdown } from "primereact/dropdown";
import UserDropDown from "@/components/userdropdown";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await api.post("/login", { email, senha });

      const { token } = response.data;

      // Salva o token nos Cookies (Expira em 1 dia)
      Cookies.set("token", token, { expires: 1 });

      // Redireciona para a página principal (Dashboard ou CadCli)
      router.push("/home");
    } catch (error) {
      alert("Erro ao fazer login. Verifique seus dados.");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#455f79]">
      <img src="" alt="" />
      <form
        onSubmit={handleLogin}
        className="flex flex-col p-8 bg-[#34495E] shadow-md w-110 rounded-2xl gap-4"
      >
        <h1 className="text-2xl font-bold text-center text-[#FFFF]">
          Bem vindo ao PROJOV
        </h1>
        <p className="flex justify-center text-[#FFFF]">
          Gestão do Programa Jovem Aprendiz
        </p>

        <div>
          <h1 className="text-[#FFFF]">Perfil:</h1>
          <UserDropDown />
        </div>

        <div>
          <h1 className="text-[#FFFF]">Email:</h1>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded bg-[#F3F4F6]"
          />
        </div>
        <div>
          <h1 className="text-[#FFFF]">Senha:</h1>
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-2 border rounded bg-[#F3F4F6]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-t from-[#455f79] to-[#455f79] text-white p-2 rounded hover:gradient-to-b hover:from-[#2d4b5f] hover:to-[#455f79] cursor-pointer"
        >
          Entrar
        </button>
         <button 
        className="flex justify-center text-[#FFFF] hover:text-blue-500"
        id="lostpassword"
        >Esqueci minha senha</button>
</form>

    </div>
  );
}
