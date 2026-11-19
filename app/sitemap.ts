import type { MetadataRoute } from 'next';
import jogosData from '../lib/jogos.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://truegoty.com';
  const agora = new Date();

  const rotasFixas: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: agora, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/votar`, lastModified: agora, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/votar/tgt`, lastModified: agora, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/votar/mercado`, lastModified: agora, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/resultados`, lastModified: agora, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/resultados/global`, lastModified: agora, changeFrequency: 'hourly', priority: 0.8 },
    { url: `${baseUrl}/indicados`, lastModified: agora, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/historia`, lastModified: agora, changeFrequency: 'hourly', priority: 0.7 },
    { url: `${baseUrl}/metodo`, lastModified: agora, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/sobre`, lastModified: agora, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contato`, lastModified: agora, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/termos`, lastModified: agora, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacidade`, lastModified: agora, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const slugsTgt = ((jogosData as any).tgt?.top10 || []).map((j: any) => j.slug).filter(Boolean);
  const rotasConfrontos: MetadataRoute.Sitemap = slugsTgt.map((slug: string) => ({
    url: `${baseUrl}/indicados/${slug}/confrontos?cat=tgt`,
    lastModified: agora,
    changeFrequency: 'daily',
    priority: 0.6,
  }));

  return [...rotasFixas, ...rotasConfrontos];
}