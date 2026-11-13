// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer'; // <-- Importando o novo Footer

export const metadata: Metadata = {
  title: 'TGT - True GOTY',
  description: 'Qual é o verdadeiro Game of the Year? Voz aos jogadores.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        {/* O paddingTop empurra o conteúdo para baixo do Header fixo */}
        <div style={{ flex: 1, paddingTop: '80px' }}> 
          {children}
        </div>
        <Footer /> {/* <-- Adicionando o Rodapé */}
      </body>
    </html>
  );
}