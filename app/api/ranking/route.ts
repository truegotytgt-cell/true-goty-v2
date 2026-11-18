// app/api/ranking/route.ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '../../../lib/db';
import jogosData from '../../../lib/jogos.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('category') || 'tgt';

    const { env } = getCloudflareContext();
    const db = getDB(env);

    // 1. Puxa os confrontos agrupados
    const { results } = await db.prepare(
      "SELECT winner_title, loser_title, COUNT(*) as wins FROM pairwise_results WHERE category = ? GROUP BY winner_title, loser_title"
    ).bind(categoria).all();

    const matrizVitorias = new Map<string, Map<string, number>>();
    results.forEach((row: any) => {
      if (!matrizVitorias.has(row.winner_title)) matrizVitorias.set(row.winner_title, new Map());
      matrizVitorias.get(row.winner_title)!.set(row.loser_title, row.wins);
    });

    const getVitorias = (jogoA: string, jogoB: string) => {
      return matrizVitorias.get(jogoA)?.get(jogoB) || 0;
    };

    // 2. Inicializa placar com pontuação E nota da crítica
    const jogosCategoria = (jogosData as any)[categoria]?.top10 || [];
    const placar = new Map<string, { pontos: number; rating: number }>();
    
    jogosCategoria.forEach((jogo: any) => {
      placar.set(jogo.titulo, { pontos: 0, rating: jogo.user_rating_original || 0 });
    });

    // 3. Calcula o Condorcet Global
    jogosCategoria.forEach((jogoA: any) => {
      let pontos = 0;
      jogosCategoria.forEach((jogoB: any) => {
        if (jogoA.titulo !== jogoB.titulo) {
          const vitoriasA = getVitorias(jogoA.titulo, jogoB.titulo);
          const vitoriasB = getVitorias(jogoB.titulo, jogoA.titulo);
          if (vitoriasA > vitoriasB) pontos++;
        }
      });
      placar.get(jogoA.titulo)!.pontos = pontos;
    });

    // 4. Ordena por Pontos, depois por Rating (Empate), depois Alfabeticamente
    const rankingFinal = Array.from(placar.entries())
      .map(([titulo, data]) => ({ 
        game_title: titulo, 
        total_score: data.pontos,
        rating: data.rating
      }))
      .sort((a, b) => {
        // 1º Critério: Pontos
        if (b.total_score !== a.total_score) return b.total_score - a.total_score;
        
        // 2º Critério: Nota da Crítica (Desempate inicial)
        if (b.rating !== a.rating) return b.rating - a.rating;

        // 3º Critério: Head-to-Head (Se já houver votos)
        const aVenceuB = getVitorias(a.game_title, b.game_title) > getVitorias(b.game_title, a.game_title);
        if (aVenceuB) return -1;
        const bVenceuA = getVitorias(b.game_title, a.game_title) > getVitorias(a.game_title, b.game_title);
        if (bVenceuA) return 1;

        // 4º Critério: Alfabético
        return a.game_title.localeCompare(b.game_title);
      });

    const response = NextResponse.json({ success: true, ranking: rankingFinal });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
    return response;

  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return NextResponse.json({ success: false, error: "Falha ao buscar ranking" }, { status: 500 });
  }
}