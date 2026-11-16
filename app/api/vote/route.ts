// app/api/vote/route.ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB, salvarVotosNoBanco, salvarPairwiseNoBanco, PairwiseVotoDB } from '../../../lib/db';

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
    
    const turnstileToken = body.scores[0]?.turnstileToken;
    const categoria = body.scores[0]?.category || 'tgt';
    const pairwise: PairwiseVotoDB[] = body.pairwise || [];

    if (!turnstileToken) {
      return NextResponse.json({ success: false, error: "Token do Turnstile ausente" }, { status: 400 });
    }

    // 1. Validação do Turnstile
    const formData = new FormData();
    formData.append('secret', env.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY || '');
    formData.append('response', turnstileToken);

    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });
    
    const turnstileData = await turnstileRes.json();

    if (!turnstileData.success) {
      console.log("❌ Bot bloqueado pelo Turnstile!", turnstileData);
      // Retorna o erro exato para o frontend (ex: invalid-input-secret, timeout-or-duplicate)
      const erroMotivo = turnstileData['error-codes']?.join(', ') || 'Erro desconhecido';
      return NextResponse.json({ success: false, error: `Verificação falhou (${erroMotivo})` }, { status: 403 });
    }

    const db = getDB(env);

    // 2. CRIAÇÃO DO SESSION_ID (IP-HASH)
    const ip = request.headers.get('cf-connecting-ip') || 'ip-desconhecido';
    const salt = env.SESSION_SALT || 'tgt_salto_secreto_dev'; 
    const session_id = await gerarHash(ip + salt);

    // 3. TRAVA DE SEGURANÇA (Dedup)
    const votoExistente = await db.prepare(
      "SELECT id FROM results WHERE session_id = ? AND category = ? LIMIT 1"
    ).bind(session_id, categoria).first();

    if (votoExistente) {
      return NextResponse.json(
        { success: false, error: "Você já votou nesta categoria! Obrigado por participar." }, 
        { status: 403 }
      );
    }

    // 4. Salva no banco D1
    await salvarVotosNoBanco(db, body.scores, session_id);
    if (pairwise.length > 0) {
      await salvarPairwiseNoBanco(db, pairwise, session_id);
    }
    console.log("✅ Votos e confrontos salvos com sucesso no D1!");

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
    console.error("❌ ERRO FATAL NA API:", error);
    return NextResponse.json({ success: false, error: "Falha ao processar" }, { status: 500 });
  }
}