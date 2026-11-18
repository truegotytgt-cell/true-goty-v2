// app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '../../../lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('category');

    const { env } = getCloudflareContext();
    const db = getDB(env);

    // Se veio categoria (?category=tgt), filtra. Se não, soma tudo.
    let stmt;
    if (categoria) {
      stmt = db.prepare("SELECT COUNT(*) as total_rows FROM results WHERE category = ?").bind(categoria);
    } else {
      stmt = db.prepare("SELECT COUNT(*) as total_rows FROM results");
    }

    const { results } = await stmt.all();

    // Cada voto gera 10 linhas (uma por jogo). Divide por 10 = nº de votantes.
    const totalRows = (results[0]?.total_rows as number) || 0;
    const totalVoters = Math.floor(totalRows / 10);

    const response = NextResponse.json({ success: true, totalVoters, category: categoria || 'all' });

    // 🛡️ Cache 60s no edge da Cloudflare (mesma estratégia das outras rotas).
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

    return response;
  } catch (error) {
    console.error('Erro em /api/stats:', error);
    return NextResponse.json({ success: false, totalVoters: 0 }, { status: 500 });
  }
}