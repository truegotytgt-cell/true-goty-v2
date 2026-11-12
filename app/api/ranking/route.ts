// app/api/ranking/route.ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '../../../lib/db';

export async function GET() {
  try {
    const { env } = getCloudflareContext();
    const db = getDB(env);

    const { results } = await db.prepare(
      "SELECT game_title, SUM(score) as total_score FROM results WHERE category = 'tgt' GROUP BY game_title ORDER BY total_score DESC"
    ).all();

    return NextResponse.json({ success: true, ranking: results });
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return NextResponse.json({ success: false, error: "Falha ao buscar ranking" }, { status: 500 });
  }
}