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
  metadataBase: new URL('https://truegoty.com'),
  title: {
    default: 'True GOTY 2026 (TGT) — Votação Game of the Year da Comunidade',
    template: '%s | True GOTY 2026',
  },
  description:
    'Qual é o verdadeiro Game of the Year (GOTY 2026)? Vote em duelos 1v1 pelo método Condorcet. Sem corporativismo, apenas a opinião real da comunidade gamer.',
  keywords: [
    'GOTY',
    'GOTY 2026',
    'Game of the Year',
    'Game of the Year 2026',
    'True GOTY',
    'TGT',
    'votação GOTY',
    'melhor jogo do ano 2026',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://truegoty.com',
    siteName: 'True GOTY',
    title: 'True GOTY 2026 — O Verdadeiro Game of the Year',
    description:
      'Escolha o melhor jogo do ano em confrontos diretos 1v1 e veja o ranking real da comunidade.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'True GOTY 2026 — O Verdadeiro Game of the Year',
    description:
      'Escolha o melhor jogo do ano em confrontos diretos 1v1 e veja o ranking real da comunidade.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${teko.variable} ${inter.variable}`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6183756677970634"
          crossOrigin="anonymous"
        />
      </head>
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