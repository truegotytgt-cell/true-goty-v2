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

    // 1. Descobrir o Top 1 e o Último Colocado (All-time)
    const { results: ranking } = await db.prepare(
      "SELECT game_title, SUM(score) as total_score FROM results WHERE category = ? GROUP BY game_title ORDER BY total_score DESC"
    ).bind(categoria).all();

    if (!ranking || ranking.length < 2) {
      return NextResponse.json({ success: true, message: "Dados insuficientes", data: null });
    }

    const primeiroColocado = ranking[0].game_title;
    const ultimoColocado = ranking[ranking.length - 1].game_title;

    // 2. A Zebra do Ano
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

    // 3. Pega todos os confrontos agrupados de forma simples (sem WITH, sem erros no TS)
    const { results: todosConfrontos } = await db.prepare(`
      SELECT winner_title, loser_title, COUNT(*) as vitorias
      FROM pairwise_results
      WHERE category = ? AND year = ?
      GROUP BY winner_title, loser_title
    `).bind(categoria, anoFiltro).all();

    // Agrupa os dados em um objeto para facilitar o cálculo
    const confrontosMapa: Record<string, { jogo_a: string, jogo_b: string, vitorias_a: number, vitorias_b: number, total: number }> = {};

    todosConfrontos.forEach((row: any) => {
      // Normaliza para que o Jogo A seja sempre o que vem primeiro em ordem alfabética
      const jogoA = row.winner_title < row.loser_title ? row.winner_title : row.loser_title;
      const jogoB = row.winner_title < row.loser_title ? row.loser_title : row.winner_title;
      const chave = `${jogoA}|${jogoB}`;

      if (!confrontosMapa[chave]) {
        confrontosMapa[chave] = { jogo_a: jogoA, jogo_b: jogoB, vitorias_a: 0, vitorias_b: 0, total: 0 };
      }

      if (row.winner_title === jogoA) {
        confrontosMapa[chave].vitorias_a += row.vitorias;
      } else {
        confrontosMapa[chave].vitorias_b += row.vitorias;
      }
      confrontosMapa[chave].total += row.vitorias;
    });

    let confrontoParelho = null;
    let confrontoDesequilibrado = null;

    const listaConfrontos = Object.values(confrontosMapa);

    if (listaConfrontos.length > 0) {
      let menorDiferenca = 2.0; 
      let maiorDiferenca = -1.0;

      for (const c of listaConfrontos) {
        if (c.total === 0) continue;

        const diferenca = Math.abs(c.vitorias_a - c.vitorias_b) / c.total;
        
        const porcentagemA = Math.round((c.vitorias_a / c.total) * 100);
        const porcentagemB = 100 - porcentagemA;

        const formatado = {
          jogo_a: c.jogo_a,
          jogo_b: c.jogo_b,
          porcentagem_a: porcentagemA,
          porcentagem_b: porcentagemB
        };

        if (diferenca < menorDiferenca) {
          menorDiferenca = diferenca;
          confrontoParelho = formatado;
        }

        if (diferenca > maiorDiferenca) {
          maiorDiferenca = diferenca;
          confrontoDesequilibrado = formatado;
        }
      }
    }

    const response = NextResponse.json({
      success: true,
      ano: anoFiltro,
      data: {
        zebra: zebra,
        parelho: confrontoParelho,
        desequilibrado: confrontoDesequilibrado
      }
    });

    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=120');
    return response;

  } catch (error) {
    console.error("Erro ao buscar highlights:", error);
    return NextResponse.json({ success: false, error: "Falha ao processar" }, { status: 500 });
  }
}