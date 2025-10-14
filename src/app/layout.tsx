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
      <body className="bg-[#0D1117]">{children}</body>
    </html>
  );
}
