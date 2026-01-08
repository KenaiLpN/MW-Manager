import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export function BotaoSair() {
  const router = useRouter();

  async function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    localStorage.removeItem("projov_user");

    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Erro silencioso ao sair da API", error);
    } finally {
      window.location.href = "/login";
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-red-600 mr-3 rounded-xl items-center justify-center hover:bg-red-50 p-2 transition-colors"
      title="Sair do sistema"
    >
      <LogOut />
    </button>
  );
}
