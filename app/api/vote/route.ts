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
      return NextResponse.json({ success: false, error: 'JSON inválido na requisição.' }, { status: 400 });
    }

    const { env } = getCloudflareContext();

    // 1. Extração e validação básica do Payload
    const turnstileToken = typeof body?.turnstileToken === 'string' ? body.turnstileToken.trim() : '';
    const categoriaRaw = body?.category ?? 'tgt';
    const pairwise: unknown = body?.pairwise;

    if (!turnstileToken) {
      return NextResponse.json({ success: false, error: 'Token do Turnstile ausente.' }, { status: 400 });
    }

    if (!isCategoriaValida(categoriaRaw)) {
      return NextResponse.json({ success: false, error: 'Categoria inválida.' }, { status: 400 });
    }

    const categoria: CategoriaValida = categoriaRaw;

    // 2. Validação dinâmica por categoria (45 no TGT, 15 no Mercado)
    const jogosCategoria = (jogosData as any)[categoria]?.top10 || [];
    if (!Array.isArray(jogosCategoria) || jogosCategoria.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Categoria não configurada ou sem jogos suficientes.' },
        { status: 400 }
      );
    }

    const totalConfrontosEsperados = (jogosCategoria.length * (jogosCategoria.length - 1)) / 2;

    if (!Array.isArray(pairwise) || pairwise.length !== totalConfrontosEsperados) {
      return NextResponse.json(
        { success: false, error: `Payload inválido. Esperado ${totalConfrontosEsperados} confrontos.` },
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
        return NextResponse.json({ success: false, error: 'Formato de confronto inválido.' }, { status: 400 });
      }

      const winnerTitle = (match as any).winner_title;
      const loserTitle = (match as any).loser_title;

      if (!titulosValidos.has(winnerTitle) || !titulosValidos.has(loserTitle)) {
        return NextResponse.json({ success: false, error: 'Jogo inexistente na categoria.' }, { status: 400 });
      }

      if (winnerTitle === loserTitle) {
        return NextResponse.json(
          { success: false, error: 'Um jogo não pode duelar contra si mesmo.' },
          { status: 400 }
        );
      }

      const parOrdenado = [winnerTitle, loserTitle].sort().join('|');
      if (confrontosUnicos.has(parOrdenado)) {
        return NextResponse.json(
          { success: false, error: 'Confronto duplicado detectado no envio.' },
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
        { success: false, error: 'Conjunto incompleto ou inválido de duelos.' },
        { status: 400 }
      );
    }

    // 3. Validação do Turnstile
    const turnstileSecret = (env as any).TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      console.error('ERRO CRÍTICO: TURNSTILE_SECRET_KEY não configurada no ambiente.');
      return NextResponse.json({ success: false, error: 'Erro interno de configuração.' }, { status: 500 });
    }

    const formData = new FormData();
    formData.append('secret', turnstileSecret);
    formData.append('response', turnstileToken);

    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    if (!turnstileRes.ok) {
      console.error('Falha HTTP na verificação do Turnstile:', turnstileRes.status);
      return NextResponse.json(
        { success: false, error: 'Falha temporária na verificação anti-bot.' },
        { status: 502 }
      );
    }

    const turnstileData: any = await turnstileRes.json();
    if (!turnstileData?.success) {
      const erroMotivo = Array.isArray(turnstileData?.['error-codes'])
        ? turnstileData['error-codes'].join(', ')
        : 'Falha na validação';
      return NextResponse.json({ success: false, error: `Verificação falhou (${erroMotivo})` }, { status: 403 });
    }

    const db = getDB(env);

    // 4. Criação do session_id (IP + SALT em SHA-256)
    let ip = request.headers.get('cf-connecting-ip')?.trim() || '';

    if (!ip && process.env.NODE_ENV === 'development') {
      ip = '127.0.0.1';
    }

    if (!ip) {
      return NextResponse.json({ success: false, error: 'Origem da requisição não identificada.' }, { status: 400 });
    }

    let salt = (env as any).SESSION_SALT || process.env.SESSION_SALT;
    if (!salt && process.env.NODE_ENV === 'development') {
      salt = 'tgt_local_dev_salt_apenas_para_testes';
    }

    if (!salt) {
      console.error('ERRO CRÍTICO: SESSION_SALT não configurado no ambiente.');
      return NextResponse.json({ success: false, error: 'Erro interno de configuração.' }, { status: 500 });
    }

    const session_id = await gerarHash(`${ip}${salt}`);

    // 5. Deduplicação por session_id + categoria
    const votoExistente = await db
      .prepare('SELECT id FROM results WHERE session_id = ? AND category = ? LIMIT 1')
      .bind(session_id, categoria)
      .first();

    if (votoExistente) {
      return NextResponse.json(
        { success: false, error: 'Você já votou nesta categoria! Obrigado por participar.' },
        { status: 403 }
      );
    }

    // 6. Recálculo de pontuação exclusivamente no servidor
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

    // 7. Persistência atômica no D1
    const votosStatements = prepararVotosStatements(db, scoresCalculados, session_id);
    const pairwiseStatements = prepararPairwiseStatements(db, pairwiseValidado, session_id);

    const batchResults = await db.batch([...votosStatements, ...pairwiseStatements]);
    const totalInserido = Array.isArray(batchResults)
      ? batchResults.reduce((acc: number, item: any) => acc + (item?.meta?.changes || 0), 0)
      : 0;

    if (totalInserido === 0) {
      return NextResponse.json(
        { success: false, error: 'Você já votou nesta categoria! Obrigado por participar.' },
        { status: 403 }
      );
    }

    const response = NextResponse.json({ success: true, message: 'Votos salvos!' });

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
    console.error('ERRO FATAL NA API:', error);
    return NextResponse.json({ success: false, error: 'Falha ao processar' }, { status: 500 });
  }
}