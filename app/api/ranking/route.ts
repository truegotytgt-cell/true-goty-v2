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
    const anoFiltro = resolverAno(searchParams.get('year'));

    const { env } = getCloudflareContext();
    const db = getDB(env);

    const queryResult = await db
      .prepare(
        `SELECT winner_title, loser_title, COUNT(*) as wins
         FROM pairwise_results
         WHERE category = ? AND year = ?
         GROUP BY winner_title, loser_title`
      )
      .bind(categoria, anoFiltro)
      .all();

    const rows = Array.isArray(queryResult?.results) ? queryResult.results : [];
    const matrizVitorias = new Map<string, Map<string, number>>();

    rows.forEach((row: any) => {
      if (typeof row?.winner_title !== 'string' || typeof row?.loser_title !== 'string') return;
      if (!matrizVitorias.has(row.winner_title)) {
        matrizVitorias.set(row.winner_title, new Map());
      }
      matrizVitorias.get(row.winner_title)!.set(row.loser_title, Number(row.wins) || 0);
    });

    const getVitorias = (jogoA: string, jogoB: string): number => {
      return matrizVitorias.get(jogoA)?.get(jogoB) || 0;
    };

    const jogosCategoria = (jogosData as any)[categoria]?.top10 || [];
    const placar = new Map<string, { pontos: number; rating: number }>();

    jogosCategoria.forEach((jogo: any) => {
      placar.set(jogo.titulo, {
        pontos: 0,
        rating: typeof jogo.user_rating_original === 'number' ? jogo.user_rating_original : 0,
      });
    });

    jogosCategoria.forEach((jogoA: any) => {
      let pontos = 0;
      jogosCategoria.forEach((jogoB: any) => {
        if (jogoA.titulo !== jogoB.titulo) {
          const vitoriasA = getVitorias(jogoA.titulo, jogoB.titulo);
          const vitoriasB = getVitorias(jogoB.titulo, jogoA.titulo);
          if (vitoriasA > vitoriasB) pontos++;
        }
      });
      const entry = placar.get(jogoA.titulo);
      if (entry) entry.pontos = pontos;
    });

    // Ordem: pontos -> confronto direto -> índice inicial (quando existir) -> alfabético
    const rankingFinal = Array.from(placar.entries())
      .map(([titulo, data]) => ({
        game_title: titulo,
        total_score: data.pontos,
        rating: data.rating,
      }))
      .sort((a, b) => {
        if (b.total_score !== a.total_score) return b.total_score - a.total_score;
        const vitoriasAB = getVitorias(a.game_title, b.game_title);
        const vitoriasBA = getVitorias(b.game_title, a.game_title);
        if (vitoriasAB !== vitoriasBA) return vitoriasBA - vitoriasAB;
        if (b.rating !== a.rating) return b.rating - a.rating;
        return a.game_title.localeCompare(b.game_title);
      });

    const response = NextResponse.json({ success: true, year: anoFiltro, ranking: rankingFinal });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
    return response;
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    return NextResponse.json({ success: false, error: 'Falha ao buscar ranking' }, { status: 500 });
  }
}