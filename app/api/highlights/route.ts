// app/api/highlights/route.ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '../../../lib/db';

// Tipagem básica para o resultado da nossa query agregada
type ConfrontoAgregado = {
  jogo_a: string;
  jogo_b: string;
  vitorias_a: number;
  vitorias_b: number;
  total: number;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('category') || 'tgt';
    const anoAtual = new Date().getFullYear();
    const anoFiltro = searchParams.get('year') || anoAtual.toString();

    const { env } = getCloudflareContext();
    const db = getDB(env);

    // 1. Descobrir o Top 1 e o Último Colocado (All-time)
    const { results: ranking } = await db.prepare(
      "SELECT game_title, SUM(score) as total_score FROM results WHERE category = ? GROUP BY game_title ORDER BY total_score DESC"
    ).bind(categoria).all();

    if (!ranking || ranking.length < 2) {
      return NextResponse.json({ success: true, message: "Dados insuficientes", data: null });
    }

    const primeiroColocado = ranking[0].game_title;
    const ultimoColocado = ranking[ranking.length - 1].game_title;

    // 2. A NOVA Zebra do Ano: 
    // Qual jogo o ÚLTIMO colocado mais conseguiu vencer neste ano?
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

    // 3. Uma ÚNICA query para pegar todos os confrontos agrupados
    // Ela normaliza os pares para Jogo A vs Jogo B, independente de quem ganhou.
    // Assim, conseguimos as vitórias de A e de B de uma vez só.
    const { results: todosConfrontos } = await db.prepare(`
      WITH ParesNormalizados AS (
        SELECT
          CASE WHEN winner_title < loser_title THEN winner_title ELSE loser_title END AS jogo_a,
          CASE WHEN winner_title < loser_title THEN loser_title ELSE winner_title END AS jogo_b,
          CASE WHEN winner_title < loser_title THEN 1 ELSE 0 END AS win_a,
          CASE WHEN winner_title > loser_title THEN 1 ELSE 0 END AS win_b
        FROM pairwise_results
        WHERE category = ? AND year = ?
      )
      SELECT 
        jogo_a, 
        jogo_b, 
        SUM(win_a) AS vitorias_a,
        SUM(win_b) AS vitorias_b,
        SUM(win_a) + SUM(win_b) AS total
      FROM ParesNormalizados
      GROUP BY jogo_a, jogo_b
    `).bind(categoria, anoFiltro).all<ConfrontoAgregado>();

    let confrontoParelho = null;
    let confrontoDesequilibrado = null;

    if (todosConfrontos && todosConfrontos.length > 0) {
      let menorDiferencaProporcional = 2.0; // O máximo possível é 1.0 (100% vs 0%)
      let maiorDiferencaProporcional = -1.0;

      for (const c of todosConfrontos) {
        if (c.total === 0) continue;

        // A mágica acontece aqui: diferença dividida pelo total (proporção)
        const diferencaProporcional = Math.abs(c.vitorias_a - c.vitorias_b) / c.total;
        
        const porcentagemA = Math.round((c.vitorias_a / c.total) * 100);
        const porcentagemB = 100 - porcentagemA;

        const confrontoFormatado = {
          jogo_a: c.jogo_a,
          jogo_b: c.jogo_b,
          porcentagem_a: porcentagemA,
          porcentagem_b: porcentagemB
        };

        // Verifica se é o mais parelho
        if (diferencaProporcional < menorDiferencaProporcional) {
          menorDiferencaProporcional = diferencaProporcional;
          confrontoParelho = confrontoFormatado;
        }

        // Verifica se é o mais desequilibrado
        if (diferencaProporcional > maiorDiferencaProporcional) {
          maiorDiferencaProporcional = diferencaProporcional;
          confrontoDesequilibrado = confrontoFormatado;
        }
      }
    }

    // 4. Monta a resposta com Cache de 5 minutos (300 segundos)
    const response = NextResponse.json({
      success: true,
      ano: anoFiltro,
      data: {
        zebra: zebra,
        parelho: confrontoParelho,
        desequilibrado: confrontoDesequilibrado
      }
    });

    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');

    return response;

  } catch (error) {
    console.error("Erro ao buscar highlights:", error);
    return NextResponse.json({ success: false, error: "Falha ao processar" }, { status: 500 });
  }
}