// app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '../../../lib/db';

export async function GET() {
  try {
    const { env } = getCloudflareContext();
    const db = getDB(env);

    // Conta o total de linhas na tabela results
    const { results } = await db.prepare("SELECT COUNT(*) as total_rows FROM results WHERE category = 'tgt'").all();
    
    // Cada voto gera 10 linhas. Dividimos por 10 para saber quantas pessoas votaram.
    const totalRows = results[0].total_rows as number;
    const totalVoters = Math.floor(totalRows / 10);

    return NextResponse.json({ success: true, totalVoters });
  } catch (error) {
    return NextResponse.json({ success: false, totalVoters: 0 }, { status: 500 });
  }
}