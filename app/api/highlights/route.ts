// app/api/highlights/route.ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '../../../lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('category') || 'tgt';
    const anoAtual = new Date().getFullYear();
    const anoFiltro = searchParams.get('year') || anoAtual.toString();

    const { env } = getCloudflareContext();
    const db = getDB(env);

    // 1. Descobrir o Top 1 e o Último Colocado
    const { results: ranking } = await db.prepare(
      "SELECT game_title, SUM(score) as total_score FROM results WHERE category = ? GROUP BY game_title ORDER BY total_score DESC"
    ).bind(categoria).all();

    if (!ranking || ranking.length < 2) {
      return NextResponse.json({ success: true, message: "Dados insuficientes", data: null });
    }

    const primeiroColocado = ranking[0].game_title;
    const ultimoColocado = ranking[ranking.length - 1].game_title;

    // 2. A NOVA Zebra do Ano (A sua ideia): 
    // Qual jogo o ÚLTIMO colocado mais conseguiu vencer?
    const zebraQuery = await db.prepare(`
      SELECT loser_title as jogo_derrotado, COUNT(*) as vitorias
      FROM pairwise_results 
      WHERE category = ? AND year = ? AND winner_title = ?
      GROUP BY loser_title
      ORDER BY vitorias DESC
      LIMIT 1
    `).bind(categoria, anoFiltro, ultimoColocado).first();

    const zebra = zebraQuery ? {
      lanterna: ultimoColocado,
      jogo_derrotado: zebraQuery.jogo_derrotado,
      vitorias: zebraQuery.vitorias
    } : null;

    // 3. O Confronto Mais Parelho
    const { results: parelhos } = await db.prepare(`
      SELECT 
        a.winner_title AS jogo_a, a.loser_title AS jogo_b, COUNT(*) AS total
      FROM pairwise_results a
      WHERE a.category = ? AND a.year = ?
      GROUP BY a.winner_title, a.loser_title
      ORDER BY ABS(
        (SELECT COUNT(*) FROM pairwise_results b WHERE b.category = a.category AND b.year = a.year AND b.winner_title = a.winner_title AND b.loser_title = a.loser_title) - 
        (SELECT COUNT(*) FROM pairwise_results c WHERE c.category = a.category AND c.year = a.year AND c.winner_title = a.loser_title AND c.loser_title = a.winner_title)
      ) ASC
      LIMIT 1
    `).bind(categoria, anoFiltro).all();

    let confrontoParelho = null;
    if (parelhos && parelhos.length > 0) {
      const c = parelhos[0];
      const vA = await db.prepare("SELECT COUNT(*) as v FROM pairwise_results WHERE category = ? AND year = ? AND winner_title = ? AND loser_title = ?").bind(categoria, anoFiltro, c.jogo_a, c.jogo_b).first();
      const vB = await db.prepare("SELECT COUNT(*) as v FROM pairwise_results WHERE category = ? AND year = ? AND winner_title = ? AND loser_title = ?").bind(categoria, anoFiltro, c.jogo_b, c.jogo_a).first();
      
      const total = (vA?.v as number) + (vB?.v as number);
      const divisaoA = total > 0 ? Math.round(((vA?.v as number) / total) * 100) : 50;

      confrontoParelho = { jogo_a: c.jogo_a, jogo_b: c.jogo_b, porcentagem_a: divisaoA, porcentagem_b: 100 - divisaoA };
    }

    // 4. O Confronto Mais Desequilibrado
    const { results: desequilibrados } = await db.prepare(`
      SELECT 
        a.winner_title AS jogo_a, a.loser_title AS jogo_b, COUNT(*) AS total
      FROM pairwise_results a
      WHERE a.category = ? AND a.year = ?
      GROUP BY a.winner_title, a.loser_title
      ORDER BY ABS(
        (SELECT COUNT(*) FROM pairwise_results b WHERE b.category = a.category AND b.year = a.year AND b.winner_title = a.winner_title AND b.loser_title = a.loser_title) - 
        (SELECT COUNT(*) FROM pairwise_results c WHERE c.category = a.category AND c.year = a.year AND c.winner_title = a.loser_title AND c.loser_title = a.winner_title)
      ) DESC
      LIMIT 1
    `).bind(categoria, anoFiltro).all();

    let confrontoDesequilibrado = null;
    if (desequilibrados && desequilibrados.length > 0) {
      const c = desequilibrados[0];
      const vA = await db.prepare("SELECT COUNT(*) as v FROM pairwise_results WHERE category = ? AND year = ? AND winner_title = ? AND loser_title = ?").bind(categoria, anoFiltro, c.jogo_a, c.jogo_b).first();
      const vB = await db.prepare("SELECT COUNT(*) as v FROM pairwise_results WHERE category = ? AND year = ? AND winner_title = ? AND loser_title = ?").bind(categoria, anoFiltro, c.jogo_b, c.jogo_a).first();
      
      const total = (vA?.v as number) + (vB?.v as number);
      const divisaoA = total > 0 ? Math.round(((vA?.v as number) / total) * 100) : 50;

      confrontoDesequilibrado = { jogo_a: c.jogo_a, jogo_b: c.jogo_b, porcentagem_a: divisaoA, porcentagem_b: 100 - divisaoA };
    }

    return NextResponse.json({
      success: true,
      ano: anoFiltro,
      data: {
        zebra: zebra,
        parelho: confrontoParelho,
        desequilibrado: confrontoDesequilibrado
      }
    });

  } catch (error) {
    console.error("Erro ao buscar highlights:", error);
    return NextResponse.json({ success: false, error: "Falha ao processar" }, { status: 500 });
  }
}