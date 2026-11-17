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

    // 1. Puxa os confrontos agrupados (Isso gasta pouquíssima leitura no D1)
    // Ex: GTA VI vs Zelda -> 100 vitórias (se 100 pessoas votaram no GTA)
    const { results } = await db.prepare(
      "SELECT winner_title, loser_title, COUNT(*) as wins FROM pairwise_results WHERE category = ? GROUP BY winner_title, loser_title"
    ).bind(categoria).all();

    // 2. Prepara a Matriz de Confrontos
    const matrizVitorias = new Map<string, Map<string, number>>();
    
    results.forEach((row: any) => {
      if (!matrizVitorias.has(row.winner_title)) matrizVitorias.set(row.winner_title, new Map());
      matrizVitorias.get(row.winner_title)!.set(row.loser_title, row.wins);
    });

    // Função auxiliar para pegar quantas vezes A venceu B
    const getVitorias = (jogoA: string, jogoB: string) => {
      return matrizVitorias.get(jogoA)?.get(jogoB) || 0;
    };

    // 3. Inicializa todos os jogos da categoria com 0 pontos
    const jogosCategoria = (jogosData as any)[categoria]?.top10 || [];
    const placar = new Map<string, number>();
    
    jogosCategoria.forEach((jogo: any) => {
      placar.set(jogo.titulo, 0);
    });

    // 4. Calcula o Condorcet Global
    jogosCategoria.forEach((jogoA: any) => {
      let pontos = 0;
      
      jogosCategoria.forEach((jogoB: any) => {
        if (jogoA.titulo !== jogoB.titulo) {
          const vitoriasA = getVitorias(jogoA.titulo, jogoB.titulo);
          const vitoriasB = getVitorias(jogoB.titulo, jogoA.titulo);

          // Se o Jogo A venceu o Jogo B mais vezes do que perdeu, ganha 1 ponto
          if (vitoriasA > vitoriasB) {
            pontos++;
          }
        }
      });
      
      placar.set(jogoA.titulo, pontos);
    });

    // 5. Ordena e desempata por confronto direto
    const rankingFinal = Array.from(placar.entries())
      .map(([titulo, pontos]) => ({ game_title: titulo, total_score: pontos }))
      .sort((a, b) => {
        if (b.total_score !== a.total_score) return b.total_score - a.total_score;

        // Desempate: Head-to-Head
        const aVenceuB = getVitorias(a.game_title, b.game_title) > getVitorias(b.game_title, a.game_title);
        if (aVenceuB) return -1;
        
        const bVenceuA = getVitorias(b.game_title, a.game_title) > getVitorias(a.game_title, b.game_title);
        if (bVenceuA) return 1;

        return 0;
      });

    return NextResponse.json({ success: true, ranking: rankingFinal });
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return NextResponse.json({ success: false, error: "Falha ao buscar ranking" }, { status: 500 });
  }
}