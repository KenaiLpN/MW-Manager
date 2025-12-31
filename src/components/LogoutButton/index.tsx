import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function BotaoSair() {
  const router = useRouter();

  async function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      await fetch("http://localhost:3333/logout", {
        method: "POST", // Importante: Sua rota no backend é POST
        credentials: "include", // <--- O PULO DO GATO: Sem isso, o cookie não vai!
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({})
      });

      // Independente da resposta do backend ser 200 ou erro,
      // para o usuário, ele saiu.
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
