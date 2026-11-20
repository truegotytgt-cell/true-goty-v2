import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import {
  getDB,
  prepararVotosStatements,
  prepararPairwiseStatements,
  PairwiseVotoDB,
} from '../../../lib/db';
import jogosData from '../../../lib/jogos.json';

const CATEGORIAS_VALIDAS = ['tgt', 'mercado'] as const;
type CategoriaValida = (typeof CATEGORIAS_VALIDAS)[number];

function isCategoriaValida(valor: unknown): valor is CategoriaValida {
  return typeof valor === 'string' && (CATEGORIAS_VALIDAS as readonly string[]).includes(valor);
}

async function gerarHash(texto: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(texto);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, code: 'INVALID_JSON', error: 'JSON inválido na requisição.' },
        { status: 400 }
      );
    }

    const { env } = getCloudflareContext();

    // 1. Extração e validação básica do Payload
    const turnstileToken = typeof body?.turnstileToken === 'string' ? body.turnstileToken.trim() : '';
    const categoriaRaw = body?.category ?? 'tgt';
    const pairwise: unknown = body?.pairwise;

    if (!turnstileToken) {
      return NextResponse.json(
        { success: false, code: 'TURNSTILE_MISSING', error: 'Token do Turnstile ausente.' },
        { status: 400 }
      );
    }

    if (!isCategoriaValida(categoriaRaw)) {
      return NextResponse.json(
        { success: false, code: 'INVALID_CATEGORY', error: 'Categoria inválida.' },
        { status: 400 }
      );
    }

    const categoria: CategoriaValida = categoriaRaw;
    const jogosCategoria = (jogosData as any)[categoria]?.top10 || [];

    if (!Array.isArray(jogosCategoria) || jogosCategoria.length < 2) {
      return NextResponse.json(
        { success: false, code: 'CATEGORY_UNAVAILABLE', error: 'Categoria não configurada ou sem jogos suficientes.' },
        { status: 400 }
      );
    }

    const totalConfrontosEsperados = (jogosCategoria.length * (jogosCategoria.length - 1)) / 2;
    if (!Array.isArray(pairwise) || pairwise.length !== totalConfrontosEsperados) {
      return NextResponse.json(
        { success: false, code: 'INVALID_PAYLOAD_SIZE', error: `Payload inválido. Esperado ${totalConfrontosEsperados} confrontos.` },
        { status: 400 }
      );
    }

    const titulosValidos = new Set<string>(jogosCategoria.map((j: any) => j.titulo));
    const confrontosUnicos = new Set<string>();
    const pairwiseValidado: PairwiseVotoDB[] = [];

    for (const match of pairwise) {
      if (
        !match ||
        typeof match !== 'object' ||
        typeof (match as any).winner_title !== 'string' ||
        typeof (match as any).loser_title !== 'string'
      ) {
        return NextResponse.json(
          { success: false, code: 'INVALID_MATCH_FORMAT', error: 'Formato de confronto inválido.' },
          { status: 400 }
        );
      }

      const winnerTitle = (match as any).winner_title;
      const loserTitle = (match as any).loser_title;

      if (!titulosValidos.has(winnerTitle) || !titulosValidos.has(loserTitle)) {
        return NextResponse.json(
          { success: false, code: 'INVALID_GAME_TITLE', error: 'Jogo inexistente na categoria.' },
          { status: 400 }
        );
      }

      if (winnerTitle === loserTitle) {
        return NextResponse.json(
          { success: false, code: 'SELF_DUEL_FORBIDDEN', error: 'Um jogo não pode duelar contra si mesmo.' },
          { status: 400 }
        );
      }

      const parOrdenado = [winnerTitle, loserTitle].sort().join('|');
      if (confrontosUnicos.has(parOrdenado)) {
        return NextResponse.json(
          { success: false, code: 'DUPLICATE_MATCH', error: 'Confronto duplicado detectado no envio.' },
          { status: 400 }
        );
      }

      confrontosUnicos.add(parOrdenado);
      pairwiseValidado.push({
        winner_title: winnerTitle,
        loser_title: loserTitle,
        category: categoria,
      });
    }

    if (confrontosUnicos.size !== totalConfrontosEsperados) {
      return NextResponse.json(
        { success: false, code: 'INCOMPLETE_MATCHES', error: 'Conjunto incompleto ou inválido de duelos.' },
        { status: 400 }
      );
    }

    const turnstileSecret = (env as any).TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      console.error('ERRO CRÍTICO: TURNSTILE_SECRET_KEY não configurada no ambiente.');
      return NextResponse.json(
        { success: false, code: 'CONFIG_ERROR', error: 'Erro interno de configuração.' },
        { status: 500 }
      );
    }

    const formData = new FormData();
    formData.append('secret', turnstileSecret);
    formData.append('response', turnstileToken);

    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(5000),
    });

    if (!turnstileRes.ok) {
      console.error('Falha HTTP na verificação do Turnstile:', turnstileRes.status);
      return NextResponse.json(
        { success: false, code: 'TURNSTILE_UNAVAILABLE', error: 'Falha temporária na verificação anti-bot.' },
        { status: 502 }
      );
    }

    const turnstileData: any = await turnstileRes.json();
    if (!turnstileData?.success) {
      console.warn('Falha na validação Turnstile:', turnstileData?.['error-codes']);
      return NextResponse.json(
        { success: false, code: 'TURNSTILE_FAILED', error: 'Falha na validação anti-bot.' },
        { status: 403 }
      );
    }

    const db = getDB(env);

    let ip = request.headers.get('cf-connecting-ip')?.trim() || '';
    if (!ip && process.env.NODE_ENV === 'development') {
      ip = '127.0.0.1';
    }
    if (!ip) {
      return NextResponse.json(
        { success: false, code: 'ORIGIN_MISSING', error: 'Origem da requisição não identificada.' },
        { status: 400 }
      );
    }

    let salt = (env as any).SESSION_SALT || process.env.SESSION_SALT;
    if (!salt && process.env.NODE_ENV === 'development') {
      salt = 'tgt_local_dev_salt_apenas_para_testes';
    }
    if (!salt) {
      console.error('ERRO CRÍTICO: SESSION_SALT não configurado no ambiente.');
      return NextResponse.json(
        { success: false, code: 'CONFIG_ERROR', error: 'Erro interno de configuração.' },
        { status: 500 }
      );
    }

    const session_id = await gerarHash(`${ip}${salt}`);

    const votoExistente = await db
      .prepare('SELECT id FROM results WHERE session_id = ? AND category = ? LIMIT 1')
      .bind(session_id, categoria)
      .first();

    if (votoExistente) {
      return NextResponse.json(
        { success: false, code: 'ALREADY_VOTED', error: 'Você já votou nesta categoria! Obrigado por participar.' },
        { status: 403 }
      );
    }

    const scoresMap = new Map<string, number>();
    jogosCategoria.forEach((j: any) => scoresMap.set(j.titulo, 0));
    for (const match of pairwiseValidado) {
      scoresMap.set(match.winner_title, (scoresMap.get(match.winner_title) || 0) + 1);
    }

    const scoresCalculados = Array.from(scoresMap.entries()).map(([titulo, pontos]) => ({
      game_title: titulo,
      score: pontos,
      category: categoria,
    }));

    const votosStatements = prepararVotosStatements(db, scoresCalculados, session_id);
    const pairwiseStatements = prepararPairwiseStatements(db, pairwiseValidado, session_id);

    const batchResults = await db.batch([...votosStatements, ...pairwiseStatements]);
    const totalInserido = Array.isArray(batchResults)
      ? batchResults.reduce((acc: number, item: any) => acc + (item?.meta?.changes || 0), 0)
      : 0;

    if (totalInserido === 0) {
      return NextResponse.json(
        { success: false, code: 'ALREADY_VOTED', error: 'Você já votou nesta categoria! Obrigado por participar.' },
        { status: 403 }
      );
    }

    const response = NextResponse.json({ success: true, message: 'Votos salvos!' });
    response.cookies.set({
      name: `tgt_voted_${categoria}`,
      value: 'true',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('ERRO FATAL NA API:', error);
    return NextResponse.json(
      { success: false, code: 'INTERNAL_ERROR', error: 'Falha ao processar' },
      { status: 500 }
    );
  }
}