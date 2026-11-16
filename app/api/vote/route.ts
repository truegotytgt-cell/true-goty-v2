// app/api/vote/route.ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { 
  getDB, 
  prepararVotosStatements, 
  prepararPairwiseStatements, 
  PairwiseVotoDB 
} from '../../../lib/db';

async function gerarHash(texto: string) {
  const msgBuffer = new TextEncoder().encode(texto);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { env } = getCloudflareContext();
    
    // 1. Extração e Validação do Payload
    const turnstileToken = body.turnstileToken || body.scores?.[0]?.turnstileToken;
    const categoria = body.category || body.scores?.[0]?.category || 'tgt';
    const pairwise: PairwiseVotoDB[] = body.pairwise || [];

    if (!turnstileToken) {
      return NextResponse.json({ success: false, error: "Token do Turnstile ausente" }, { status: 400 });
    }

    if (!Array.isArray(pairwise) || pairwise.length !== 45) {
      return NextResponse.json({ success: false, error: "Payload inválido. Esperado 45 confrontos." }, { status: 400 });
    }

    // 2. Validação do Turnstile
    const formData = new FormData();
    formData.append('secret', env.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY || '');
    formData.append('response', turnstileToken);

    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });
    
    const turnstileData = await turnstileRes.json();

    if (!turnstileData.success) {
      const erroMotivo = turnstileData['error-codes']?.join(', ') || 'Erro desconhecido';
      return NextResponse.json({ success: false, error: `Verificação falhou (${erroMotivo})` }, { status: 403 });
    }

    const db = getDB(env);

    // 3. CRIAÇÃO DO SESSION_ID (IP-HASH)
    let ip = request.headers.get('cf-connecting-ip');
    
    // Válvula de escape APENAS para testes locais
    if (!ip && process.env.NODE_ENV === 'development') {
      ip = '127.0.0.1';
    }

    if (!ip) {
      return NextResponse.json({ success: false, error: "Origem da requisição não identificada." }, { status: 400 });
    }

    let salt = env.SESSION_SALT || process.env.SESSION_SALT; 
    
    // Válvula de escape APENAS para testes locais
    if (!salt && process.env.NODE_ENV === 'development') {
      salt = 'tgt_local_dev_salt_apenas_para_testes';
    }

    if (!salt) {
      console.error("ERRO CRÍTICO: SESSION_SALT não configurado no ambiente.");
      return NextResponse.json({ success: false, error: "Erro interno de configuração." }, { status: 500 });
    }

    const session_id = await gerarHash(ip + salt);

    // 4. TRAVA DE SEGURANÇA (Dedup rápida)
    const votoExistente = await db.prepare(
      "SELECT id FROM results WHERE session_id = ? AND category = ? LIMIT 1"
    ).bind(session_id, categoria).first();

    if (votoExistente) {
      return NextResponse.json(
        { success: false, error: "Você já votou nesta categoria! Obrigado por participar." }, 
        { status: 403 }
      );
    }

    // 5. RECÁLCULO DOS SCORES NO BACKEND (Zero confiança no frontend)
    const scoresMap = new Map<string, number>();
    
    for (const match of pairwise) {
      scoresMap.set(match.winner_title, (scoresMap.get(match.winner_title) || 0) + 1);
      if (!scoresMap.has(match.loser_title)) {
        scoresMap.set(match.loser_title, 0);
      }
    }

    const scoresCalculados = Array.from(scoresMap.entries()).map(([titulo, pontos]) => ({
      game_title: titulo,
      score: pontos,
      category: categoria
    }));

    // 6. Salva no banco D1 de forma ATÔMICA
    const votosStatements = prepararVotosStatements(db, scoresCalculados, session_id);
    const pairwiseStatements = prepararPairwiseStatements(db, pairwise, session_id);

    const todosStatements = [...votosStatements, ...pairwiseStatements];
    await db.batch(todosStatements);

    const response = NextResponse.json({ success: true, message: "Votos salvos!" });
    
    response.cookies.set({
      name: `tgt_voted_${categoria}`,
      value: 'true',
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });

    return response;
    
  } catch (error) {
    console.error("ERRO FATAL NA API:", error);
    return NextResponse.json({ success: false, error: "Falha ao processar" }, { status: 500 });
  }
}