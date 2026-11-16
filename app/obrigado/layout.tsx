// app/obrigado/layout.tsx
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  // No Next.js 15/16, searchParams precisa ser aguardado (await)
  const resolvedSearchParams = await searchParams || {};

  const t1 = resolvedSearchParams.t1 || 'Meu Top 3';
  const i1 = resolvedSearchParams.i1 || '';
  const t2 = resolvedSearchParams.t2 || 'Jogo 2';
  const i2 = resolvedSearchParams.i2 || '';
  const t3 = resolvedSearchParams.t3 || 'Jogo 3';
  const i3 = resolvedSearchParams.i3 || '';

  // Se estiver em produção, usa o domínio oficial. Se não, usa o localhost.
  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://truegoty.com' : 'http://localhost:3000';
  
  // Usa a rota da imagem HORIZONTAL para o preview
  const ogImageUrl = `${baseUrl}/api/og?t1=${encodeURIComponent(t1 as string)}&i1=${encodeURIComponent(i1 as string)}&t2=${encodeURIComponent(t2 as string)}&i2=${encodeURIComponent(i2 as string)}&t3=${encodeURIComponent(t3 as string)}&i3=${encodeURIComponent(i3 as string)}`;

  return {
    title: `Meu True GOTY: ${t1}`,
    description: 'Veja meu Top 3 no True GOTY e faça o seu também!',
    openGraph: {
      title: `Meu True GOTY: ${t1}`,
      description: 'Veja meu Top 3 no True GOTY e faça o seu também!',
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Meu True GOTY: ${t1}`,
      description: 'Veja meu Top 3 no True GOTY e faça o seu também!',
      images: [ogImageUrl],
    },
  };
}

export default function ObrigadoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}