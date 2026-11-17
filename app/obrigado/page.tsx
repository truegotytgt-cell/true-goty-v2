// app/obrigado/page.tsx
import { Suspense } from 'react';
import type { Metadata } from 'next';
import ObrigadoClient from './ObrigadoClient';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedSearchParams = await searchParams || {};
  const t1 = resolvedSearchParams.t1 || 'Meu Top 3';
  const i1 = resolvedSearchParams.i1 || '';
  const t2 = resolvedSearchParams.t2 || 'Jogo 2';
  const i2 = resolvedSearchParams.i2 || '';
  const t3 = resolvedSearchParams.t3 || 'Jogo 3';
  const i3 = resolvedSearchParams.i3 || '';

  const ogImageUrl = `/api/og?t1=${encodeURIComponent(t1 as string)}&i1=${encodeURIComponent(i1 as string)}&t2=${encodeURIComponent(t2 as string)}&i2=${encodeURIComponent(i2 as string)}&t3=${encodeURIComponent(t3 as string)}&i3=${encodeURIComponent(i3 as string)}`;

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

export default function ObrigadoPage() {
  return (
    <Suspense fallback={<main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--purple-neon)' }}>Carregando...</main>}>
      <ObrigadoClient />
    </Suspense>
  );
}