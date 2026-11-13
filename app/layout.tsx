// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DamascusBackground from '../components/DamascusBackground';
import { LanguageProvider } from '../components/LanguageProvider'; // <-- IMPORTADO

export const metadata: Metadata = {
  title: 'TGT | True GOTY — A Voz da Comunidade',
  description: 'Qual é o verdadeiro Game of the Year? Voz aos jogadores. Sem corporativismo, apenas a opinião da comunidade.',
  metadataBase: new URL('https://truegoty.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'transparent', overflowX: 'hidden' }}>
        <LanguageProvider> {/* <-- ENVOLVENDO TUDO */}
          <DamascusBackground />
          <Header />
          <div style={{ flex: 1, paddingTop: '100px', width: '100%', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}> 
            {children}
          </div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}