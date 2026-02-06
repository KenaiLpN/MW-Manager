import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PrivateLayout from "@/components/PrivateLayout";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProSis ",
  description: "Sistema de Gestão",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className} suppressHydrationWarning={true}>
        <PrivateLayout>{children}</PrivateLayout>
      </body>
    </html>
  );
}
