import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export function BotaoSair() {
  const router = useRouter();

  async function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";



    try {
      await fetch("http://localhost:3333/logout", {
        method: "POST", 
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({})
      });

      window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao sair", error);
      window.location.href = "/login";
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-red-600 mr-3 rounded-xl items-center justify-center"
    >
      <LogOut />
    </button>
  );
}
