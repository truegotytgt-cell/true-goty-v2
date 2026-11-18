// app/layout.tsx
import type { Metadata } from 'next';
import { Teko, Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DamascusBackground from '../components/DamascusBackground';
import { LanguageProvider } from '../components/LanguageProvider';

// Fontes novas
const teko = Teko({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-teko' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'TGT | True GOTY — A Voz da Comunidade',
  description: 'Qual é o verdadeiro Game of the Year? Voz aos jogadores. Sem corporativismo, apenas a opinião da comunidade.',
  metadataBase: new URL('https://truegoty.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${teko.variable} ${inter.variable}`}>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'transparent', overflowX: 'hidden' }}>
        
        {/* Vinheta escura sutil nas bordas (Sem o granulado) */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', boxShadow: 'inset 0 0 100px rgba(0,0,0,0.6)' }} />

        <LanguageProvider>
          <DamascusBackground />
          <Header />
          <div style={{ flex: 1, width: '100%', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}> 
            {children}
          </div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}