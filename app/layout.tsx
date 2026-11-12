// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "TGT | True GOTY",
  description: "A voz dos jogadores. Sem corporativismo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        {/* O padding-top compensa o menu que fica fixo no topo */}
        <div style={{ paddingTop: '100px' }}>
          {children}
        </div>
      </body>
    </html>
  );
}