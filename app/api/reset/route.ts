// app/api/reset/route.ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '../../../lib/db';

export async function POST() {
  try {
    const { env } = getCloudflareContext();
    const db = getDB(env);

    // Deleta os dados do banco D1
    await db.prepare("DELETE FROM results WHERE 1=1").run();
    await db.prepare("DELETE FROM pairwise_results WHERE 1=1").run();

    // Cria a resposta de sucesso
    const response = NextResponse.json({ success: true, message: "Banco de dados limpo com sucesso!" });
    
    // A MÁGICA: Manda o navegador apagar os cookies de votação
    response.cookies.delete('tgt_voted_tgt');
    response.cookies.delete('tgt_voted_mercado');
    
    return response;
  } catch (error: any) {
    console.error("Erro ao limpar banco:", error);
    return NextResponse.json({ success: false, error: error.message || "Falha ao limpar banco." }, { status: 500 });
  }
}