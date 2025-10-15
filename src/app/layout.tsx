import "./globals.css";
import { Header } from '../components/header'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Header/>
      <body className="bg-[#e4e9f0]">{children}</body>
    </html>
  );
}
