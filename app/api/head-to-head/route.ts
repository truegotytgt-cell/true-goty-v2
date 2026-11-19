import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '../../../lib/db';
import jogosData from '../../../lib/jogos.json';

const CATEGORIAS_VALIDAS = ['tgt', 'mercado'] as const;
type CategoriaValida = (typeof CATEGORIAS_VALIDAS)[number];

function resolverCategoria(raw: string | null): CategoriaValida {
  return raw === 'mercado' ? 'mercado' : 'tgt';
}

function resolverAno(raw: string | null): number {
  const parsed = Number(raw);
  if (Number.isInteger(parsed) && parsed >= 2024 && parsed <= 2030) {
    return parsed;
  }
  return 2026;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = resolverCategoria(searchParams.get('category'));
    const jogoA = searchParams.get('jogoA')?.trim() || '';
    const jogoB = searchParams.get('jogoB')?.trim() || '';
    const anoFiltro = resolverAno(searchParams.get('year'));

    if (!jogoA) {
      return NextResponse.json({ success: false, error: 'Jogo A é obrigatório.' }, { status: 400 });
    }

    const jogosCategoria = (jogosData as any)[categoria]?.top10 || [];
    const titulosValidos = new Set<string>(jogosCategoria.map((j: any) => j.titulo));

    if (!titulosValidos.has(jogoA)) {
      return NextResponse.json({ success: false, error: 'Jogo A inválido para esta categoria.' }, { status: 400 });
    }

    if (jogoB) {
      if (!titulosValidos.has(jogoB)) {
        return NextResponse.json({ success: false, error: 'Jogo B inválido para esta categoria.' }, { status: 400 });
      }

      if (jogoA === jogoB) {
        return NextResponse.json(
          { success: false, error: 'Jogo A e Jogo B devem ser diferentes.' },
          { status: 400 }
        );
      }
    }

    const { env } = getCloudflareContext();
    const db = getDB(env);

    // MODO 1: Confronto Direto (História) - 1 única consulta agregada
    if (jogoB) {
      const dueloQuery = await db
        .prepare(
          `SELECT winner_title, COUNT(*) as v
           FROM pairwise_results
           WHERE category = ? AND year = ?
             AND ((winner_title = ? AND loser_title = ?) OR (winner_title = ? AND loser_title = ?))
           GROUP BY winner_title`
        )
        .bind(categoria, anoFiltro, jogoA, jogoB, jogoB, jogoA)
        .all();

      const rows = Array.isArray(dueloQuery?.results) ? dueloQuery.results : [];
      let totalA = 0;
      let totalB = 0;

      rows.forEach((row: any) => {
        if (row?.winner_title === jogoA) totalA = Number(row.v) || 0;
        if (row?.winner_title === jogoB) totalB = Number(row.v) || 0;
      });

      const total = totalA + totalB;
      const porcentagemA = total > 0 ? Math.round((totalA / total) * 100) : 0;
      const porcentagemB = total > 0 ? 100 - porcentagemA : 0;

      const response = NextResponse.json({
        success: true,
        data: { jogoA, jogoB, vitoriasA: totalA, vitoriasB: totalB, total, porcentagemA, porcentagemB },
      });
      response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
      return response;
    }

    // MODO 2: Todos os Oponentes (Raio-X 1v1) - 1 única consulta
    const todosQuery = await db
      .prepare(
        `SELECT winner_title, loser_title, COUNT(*) as v
         FROM pairwise_results
         WHERE category = ? AND year = ? AND (winner_title = ? OR loser_title = ?)
         GROUP BY winner_title, loser_title`
      )
      .bind(categoria, anoFiltro, jogoA, jogoA)
      .all();

    const results = Array.isArray(todosQuery?.results) ? todosQuery.results : [];
    const statsMap: Record<
      string,
      { total: number; porcentagemA: number; porcentagemB: number; vitoriasA: number; vitoriasB: number }
    > = {};

    jogosCategoria.forEach((j: any) => {
      if (j.titulo !== jogoA) {
        statsMap[j.titulo] = { total: 0, porcentagemA: 0, porcentagemB: 0, vitoriasA: 0, vitoriasB: 0 };
      }
    });

    results.forEach((row: any) => {
      const opp = row?.winner_title === jogoA ? row?.loser_title : row?.winner_title;
      if (!opp || !statsMap[opp]) return;

      const vitorias = Number(row.v) || 0;
      if (row.winner_title === jogoA) {
        statsMap[opp].vitoriasA += vitorias;
      } else {
        statsMap[opp].vitoriasB += vitorias;
      }
    });

    Object.keys(statsMap).forEach((opp) => {
      const data = statsMap[opp];
      data.total = data.vitoriasA + data.vitoriasB;
      data.porcentagemA = data.total > 0 ? Math.round((data.vitoriasA / data.total) * 100) : 0;
      data.porcentagemB = data.total > 0 ? 100 - data.porcentagemA : 0;
    });

    const response = NextResponse.json({ success: true, data: statsMap });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
    return response;
  } catch (error) {
    console.error('Erro no Head-to-Head:', error);
    return NextResponse.json({ success: false, error: 'Falha ao processar' }, { status: 500 });
  }
}