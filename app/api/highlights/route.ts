import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '../../../lib/db';

const CATEGORIAS_VALIDAS = ['tgt', 'mercado'] as const;
type CategoriaValida = (typeof CATEGORIAS_VALIDAS)[number];

function resolverCategoria(raw: string | null): CategoriaValida {
  return raw === 'mercado' ? 'mercado' : 'tgt';
}

function resolverAno(raw: string | null): string {
  const parsed = Number(raw);
  if (Number.isInteger(parsed) && parsed >= 2024 && parsed <= 2030) {
    return String(parsed);
  }
  return '2026';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = resolverCategoria(searchParams.get('category'));
    const anoFiltro = resolverAno(searchParams.get('year'));

    const { env } = getCloudflareContext();
    const db = getDB(env);

    // 1. Descobrir o Top 1 e o Último Colocado na categoria
    const rankingQuery = await db
      .prepare(
        'SELECT game_title, SUM(score) as total_score FROM results WHERE category = ? GROUP BY game_title ORDER BY total_score DESC'
      )
      .bind(categoria)
      .all();

    const ranking = Array.isArray(rankingQuery?.results) ? rankingQuery.results : [];

    if (ranking.length < 2) {
      return NextResponse.json({ success: true, message: 'Dados insuficientes', data: null });
    }

    const primeiroColocado = String(ranking[0].game_title || '');
    const ultimoColocado = String(ranking[ranking.length - 1].game_title || '');

    // 2. Busca todos os confrontos agrupados do ano/categoria em uma única leitura
    const confrontosQuery = await db
      .prepare(
        'SELECT winner_title, loser_title, COUNT(*) as vitorias FROM pairwise_results WHERE category = ? AND year = ? GROUP BY winner_title, loser_title'
      )
      .bind(categoria, anoFiltro)
      .all();

    const todosConfrontos = Array.isArray(confrontosQuery?.results) ? confrontosQuery.results : [];

    let zebra: { lanterna: string; jogo_derrotado: string; vitorias: number } | null = null;
    let maiorVitoriaLanterna = 0;

    const confrontosMapa: Record<
      string,
      { jogo_a: string; jogo_b: string; vitorias_a: number; vitorias_b: number; total: number }
    > = {};

    todosConfrontos.forEach((row: any) => {
      const winner = String(row?.winner_title || '');
      const loser = String(row?.loser_title || '');
      const vitorias = Number(row?.vitorias) || 0;
      if (!winner || !loser || vitorias <= 0) return;

      // Zebra: maior vitória do lanterna sobre outro jogo
      if (winner === ultimoColocado && loser !== primeiroColocado && vitorias > maiorVitoriaLanterna) {
        maiorVitoriaLanterna = vitorias;
        zebra = {
          lanterna: ultimoColocado,
          jogo_derrotado: loser,
          vitorias,
        };
      }

      // Normaliza chave A|B em ordem alfabética
      const jogoA = winner < loser ? winner : loser;
      const jogoB = winner < loser ? loser : winner;
      const chave = `${jogoA}|${jogoB}`;

      if (!confrontosMapa[chave]) {
        confrontosMapa[chave] = {
          jogo_a: jogoA,
          jogo_b: jogoB,
          vitorias_a: 0,
          vitorias_b: 0,
          total: 0,
        };
      }

      if (winner === jogoA) {
        confrontosMapa[chave].vitorias_a += vitorias;
      } else {
        confrontosMapa[chave].vitorias_b += vitorias;
      }
      confrontosMapa[chave].total += vitorias;
    });

    let confrontoParelho: {
      jogo_a: string;
      jogo_b: string;
      porcentagem_a: number;
      porcentagem_b: number;
    } | null = null;

    let confrontoDesequilibrado: {
      jogo_a: string;
      jogo_b: string;
      porcentagem_a: number;
      porcentagem_b: number;
    } | null = null;

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
          porcentagem_b: porcentagemB,
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
        zebra,
        parelho: confrontoParelho,
        desequilibrado: confrontoDesequilibrado,
      },
    });

    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=120');
    return response;
  } catch (error) {
    console.error('Erro ao buscar highlights:', error);
    return NextResponse.json({ success: false, error: 'Falha ao processar' }, { status: 500 });
  }
}