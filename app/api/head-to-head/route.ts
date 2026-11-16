// app/api/head-to-head/route.ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '../../../lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('category') || 'tgt';
    const jogoA = searchParams.get('jogoA');
    const jogoB = searchParams.get('jogoB');
    
    const anoAtual = new Date().getFullYear();
    const anoFiltro = searchParams.get('year') || anoAtual.toString();

    if (!jogoA || !jogoB) {
      return NextResponse.json({ success: false, error: "Selecione dois jogos" }, { status: 400 });
    }

    const { env } = getCloudflareContext();
    const db = getDB(env);

    // Quantas vezes o Jogo A venceu o Jogo B?
    const vitoriasA = await db.prepare(
      "SELECT COUNT(*) as v FROM pairwise_results WHERE category = ? AND year = ? AND winner_title = ? AND loser_title = ?"
    ).bind(categoria, anoFiltro, jogoA, jogoB).first();

    // Quantas vezes o Jogo B venceu o Jogo A?
    const vitoriasB = await db.prepare(
      "SELECT COUNT(*) as v FROM pairwise_results WHERE category = ? AND year = ? AND winner_title = ? AND loser_title = ?"
    ).bind(categoria, anoFiltro, jogoB, jogoA).first();

    const totalA = vitoriasA ? (vitoriasA.v as number) : 0;
    const totalB = vitoriasB ? (vitoriasB.v as number) : 0;
    const total = totalA + totalB;

    // Calcula a porcentagem
    const porcentagemA = total > 0 ? Math.round((totalA / total) * 100) : 0;
    const porcentagemB = total > 0 ? Math.round((totalB / total) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        jogoA,
        jogoB,
        vitoriasA: totalA,
        vitoriasB: totalB,
        total,
        porcentagemA,
        porcentagemB
      }
    });

  } catch (error) {
    console.error("Erro no Head-to-Head:", error);
    return NextResponse.json({ success: false, error: "Falha ao processar" }, { status: 500 });
  }
}