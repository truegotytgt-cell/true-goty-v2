// app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '../../../lib/db';

export async function GET() {
  try {
    const { env } = getCloudflareContext();
    const db = getDB(env);

    // Conta o total de linhas na tabela results em TODAS as categorias.
    // (Antes filtrava só 'tgt' — agora soma todas para já estar pronto para o Mercado.)
    const { results } = await db.prepare("SELECT COUNT(*) as total_rows FROM results").all();
    
    // Cada voto gera 10 linhas. Dividimos por 10 para saber quantas pessoas votaram.
    const totalRows = results[0].total_rows as number;
    const totalVoters = Math.floor(totalRows / 10);

    const response = NextResponse.json({ success: true, totalVoters });

    // 🛡️ Blindagem contra estouro da cota gratuita do D1:
    // O edge da Cloudflare guarda a resposta por 60s e serve cache "velho"
    // por mais 30s enquanto revalida em background.
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, totalVoters: 0 }, { status: 500 });
  }
}