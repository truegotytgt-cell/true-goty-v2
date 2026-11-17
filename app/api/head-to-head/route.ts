// app/api/head-to-head/route.ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '../../../lib/db';
import jogosData from '../../../lib/jogos.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('category') || 'tgt';
    const jogoA = searchParams.get('jogoA');
    const jogoB = searchParams.get('jogoB');
    
    const anoAtual = new Date().getFullYear();
    const anoFiltro = searchParams.get('year') || anoAtual.toString();

    if (!jogoA) {
      return NextResponse.json({ success: false, error: "Jogo A é obrigatório" }, { status: 400 });
    }

    const { env } = getCloudflareContext();
    const db = getDB(env);

    // MODO 1: Confronto Direto (História) - Se o Jogo B for enviado
    if (jogoB) {
      const vitoriasA = await db.prepare(
        "SELECT COUNT(*) as v FROM pairwise_results WHERE category = ? AND year = ? AND winner_title = ? AND loser_title = ?"
      ).bind(categoria, anoFiltro, jogoA, jogoB).first();

      const vitoriasB = await db.prepare(
        "SELECT COUNT(*) as v FROM pairwise_results WHERE category = ? AND year = ? AND winner_title = ? AND loser_title = ?"
      ).bind(categoria, anoFiltro, jogoB, jogoA).first();

      const totalA = vitoriasA ? (vitoriasA.v as number) : 0;
      const totalB = vitoriasB ? (vitoriasB.v as number) : 0;
      const total = totalA + totalB;

      const porcentagemA = total > 0 ? Math.round((totalA / total) * 100) : 0;
      const porcentagemB = total > 0 ? Math.round((totalB / total) * 100) : 0;

      const response = NextResponse.json({
        success: true,
        data: { jogoA, jogoB, vitoriasA: totalA, vitoriasB: totalB, total, porcentagemA, porcentagemB }
      });
      response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
      return response;
    }

    // MODO 2: Todos os Oponentes (Confrontos) - Se o Jogo B NÃO for enviado
    // UMA ÚNICA CONSULTA no banco para pegar todos os confrontos deste jogo
    const { results } = await db.prepare(`
      SELECT winner_title, loser_title, COUNT(*) as v
      FROM pairwise_results
      WHERE category = ? AND year = ? AND (winner_title = ? OR loser_title = ?)
      GROUP BY winner_title, loser_title
    `).bind(categoria, anoFiltro, jogoA, jogoA).all();

    const jogosCategoria = (jogosData as any)[categoria]?.top10 || [];
    const statsMap: Record<string, any> = {};

    // Inicializa os 9 oponentes com 0 vitórias
    jogosCategoria.forEach((j: any) => {
      if (j.titulo !== jogoA) {
        statsMap[j.titulo] = { total: 0, porcentagemA: 0, porcentagemB: 0, vitoriasA: 0, vitoriasB: 0 };
      }
    });

    // Processa os resultados
    results.forEach((row: any) => {
      const opp = row.winner_title === jogoA ? row.loser_title : row.winner_title;
      if (!statsMap[opp]) return;

      const vitoriasA = row.winner_title === jogoA ? row.v : 0;
      const vitoriasB = row.winner_title === opp ? row.v : 0;
      
      statsMap[opp].vitoriasA += vitoriasA;
      statsMap[opp].vitoriasB += vitoriasB;
    });

    // Calcula as porcentagens
    Object.keys(statsMap).forEach(opp => {
      const data = statsMap[opp];
      data.total = data.vitoriasA + data.vitoriasB;
      data.porcentagemA = data.total > 0 ? Math.round((data.vitoriasA / data.total) * 100) : 0;
      data.porcentagemB = data.total > 0 ? 100 - data.porcentagemA : 0;
    });

    const response = NextResponse.json({ success: true, data: statsMap });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
    return response;

  } catch (error) {
    console.error("Erro no Head-to-Head:", error);
    return NextResponse.json({ success: false, error: "Falha ao processar" }, { status: 500 });
  }
}