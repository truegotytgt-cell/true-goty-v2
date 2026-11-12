// app/api/vote/route.ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB, salvarVotosNoBanco } from '../../../lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { env } = getCloudflareContext();

    // 1. VERIFICAÇÃO DO TURNSTILE (O ESCUDO)
    // O token vem junto com os dados que o frontend enviou
    const turnstileToken = body.scores[0]?.turnstileToken;

    if (!turnstileToken) {
      return NextResponse.json({ success: false, error: "Token ausente" }, { status: 400 });
    }

    // Perguntamos para a Cloudflare se o token é válido
    const formData = new FormData();
    formData.append('secret', env.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY);
    formData.append('response', turnstileToken);

    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });
    
    const turnstileData = await turnstileRes.json();

    // Se a Cloudflare disser que é um robô ou o token for falso, bloqueia!
    if (!turnstileData.success) {
      console.log("❌ Bot bloqueado pelo Turnstile!");
      return NextResponse.json({ success: false, error: "Falha na verificação de segurança" }, { status: 403 });
    }

    // 2. SALVANDO NO BANCO (Se passou pelo escudo)
    const db = getDB(env);
    await salvarVotosNoBanco(db, body.scores);

    console.log("✅ Votos salvos no banco D1 após verificação de segurança!");
    
    return NextResponse.json({ success: true, message: "Votos salvos!" });
    
  } catch (error) {
    console.error("❌ Erro ao salvar no banco:", error);
    return NextResponse.json({ success: false, error: "Falha ao processar" }, { status: 500 });
  }
}