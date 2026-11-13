// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'TGT | True GOTY — A Voz da Comunidade',
  description: 'Qual é o verdadeiro Game of the Year? Voz aos jogadores. Sem corporativismo, apenas a opinião da comunidade.',
  metadataBase: new URL('https://truegoty.com'),
  openGraph: {
    title: 'TGT | True GOTY',
    description: 'Escolha o verdadeiro GOTY frente a frente, sem empates.',
    url: 'https://truegoty.com',
    siteName: 'True GOTY',
    images: [
      {
        url: '/og-image.jpg', // Você pode colocar uma imagem padrão na pasta public
        width: 1200,
        height: 630,
        alt: 'True GOTY Logo',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        backgroundColor: 'var(--bg-black)',
        overflowX: 'hidden'
      }}>
        <Header />
        
        <div style={{ 
          flex: 1, 
          paddingTop: '100px',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column'
        }}> 
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}