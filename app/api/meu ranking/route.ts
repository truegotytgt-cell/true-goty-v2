// app/api/meu-ranking/route.ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '../../../lib/db';

async function gerarHash(texto: string) {
  const msgBuffer = new TextEncoder().encode(texto);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function GET(request: Request) {
  try {
    const { env } = getCloudflareContext();
    
    // Pega o IP e o Salt (mesma lógica do voto)
    let ip = request.headers.get('cf-connecting-ip');
    let salt = env.SESSION_SALT || process.env.SESSION_SALT;

    // Válvula de escape para desenvolvimento local
    if (!ip && process.env.NODE_ENV === 'development') ip = '127.0.0.1';
    if (!salt && process.env.NODE_ENV === 'development') salt = 'tgt_local_dev_salt_apenas_para_testes';

    if (!ip || !salt) {
      return NextResponse.json({ success: false, error: "Origem não identificada" }, { status: 400 });
    }

    const session_id = await gerarHash(ip + salt);
    const db = getDB(env);

    // Busca os votos do usuário no banco, ordenados pela pontuação (score)
    const { results } = await db.prepare(
      "SELECT game_title, score FROM results WHERE session_id = ? AND category = 'tgt' ORDER BY score DESC"
    ).bind(session_id).all();

    // Se não encontrou votos, retorna uma lista vazia (o front-end lida com isso)
    return NextResponse.json({ success: true, ranking: results });
  } catch (error) {
    console.error("Erro ao buscar ranking pessoal:", error);
    return NextResponse.json({ success: false, error: "Falha ao buscar ranking" }, { status: 500 });
  }
}