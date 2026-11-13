// app/api/vote/route.ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB, salvarVotosNoBanco } from '../../../lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { env } = getCloudflareContext();
    const turnstileToken = body.scores[0]?.turnstileToken;
    const categoria = body.scores[0]?.category || 'tgt';

    if (!turnstileToken) {
      return NextResponse.json({ success: false, error: "Token ausente" }, { status: 400 });
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
      console.log("❌ Bot bloqueado pelo Turnstile!");
      return NextResponse.json({ success: false, error: "Falha na verificação de segurança" }, { status: 403 });
    }

    // 2. Salva no banco D1
    const db = getDB(env);
    await salvarVotosNoBanco(db, body.scores);
    console.log("✅ Votos salvos com sucesso no D1!");

    // 3. Cria a resposta de sucesso
    const response = NextResponse.json({ success: true, message: "Votos salvos!" });
    
    // 4. A MÁGICA DO COOKIE (Agora do jeito certo!)
    response.cookies.set({
      name: `tgt_voted_${categoria}`,
      value: 'true',
      httpOnly: true, // JavaScript não pode ler
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 365, // 1 ano
      path: '/',
    });

    return response;
    
  } catch (error) {
    // Se der erro, isso vai imprimir no terminal a causa exata
    console.error("❌ ERRO FATAL NA API:", error);
    return NextResponse.json({ success: false, error: "Falha ao processar" }, { status: 500 });
  }
}