import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PrivateLayout from "@/components/PrivateLayout"; // Importe o componente que criamos

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MW Manager ",
  description: "Sistema de Gestão",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {/* Envolvemos tudo no PrivateLayout */}
        <PrivateLayout>
          {children}
        </PrivateLayout>
      </body>
    </html>
  );
}