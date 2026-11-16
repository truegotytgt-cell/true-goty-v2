// app/api/ranking/route.ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '../../../lib/db';

export async function GET(request: Request) {
  try {
    // 1. Pegamos a categoria da URL (ex: /api/ranking?category=mercado)
    // Se não vier nada, usamos 'tgt' como padrão.
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('category') || 'tgt';

    const { env } = getCloudflareContext();
    const db = getDB(env);

    // 2. A query agora usa o parâmetro '?' em vez do 'tgt' fixo
    const { results } = await db.prepare(
      "SELECT game_title, SUM(score) as total_score FROM results WHERE category = ? GROUP BY game_title ORDER BY total_score DESC"
    ).bind(categoria).all();

    return NextResponse.json({ success: true, ranking: results });
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return NextResponse.json({ success: false, error: "Falha ao buscar ranking" }, { status: 500 });
  }
}