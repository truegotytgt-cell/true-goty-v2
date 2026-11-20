import type { MetadataRoute } from 'next';
import jogosData from '../lib/jogos.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://truegoty.com';
  const dataLancamento = new Date('2026-11-20');

  const rotasFixas: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: dataLancamento, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/votar`, lastModified: dataLancamento, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/votar/tgt`, lastModified: dataLancamento, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/votar/mercado`, lastModified: dataLancamento, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/resultados`, lastModified: dataLancamento, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/resultados/global`, lastModified: dataLancamento, changeFrequency: 'hourly', priority: 0.8 },
    { url: `${baseUrl}/indicados`, lastModified: dataLancamento, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/historia`, lastModified: dataLancamento, changeFrequency: 'hourly', priority: 0.7 },
    { url: `${baseUrl}/metodo`, lastModified: dataLancamento, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/sobre`, lastModified: dataLancamento, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contato`, lastModified: dataLancamento, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/termos`, lastModified: dataLancamento, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacidade`, lastModified: dataLancamento, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const slugsTgt = ((jogosData as any).tgt?.top10 || []).map((j: any) => j.slug).filter(Boolean);
  const rotasConfrontos: MetadataRoute.Sitemap = slugsTgt.map((slug: string) => ({
    url: `${baseUrl}/indicados/${slug}/confrontos`,
    lastModified: dataLancamento,
    changeFrequency: 'daily',
    priority: 0.6,
  }));

  return [...rotasFixas, ...rotasConfrontos];
}