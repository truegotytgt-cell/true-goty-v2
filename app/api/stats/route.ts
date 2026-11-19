import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '../../../lib/db';

const CATEGORIAS_VALIDAS = ['tgt', 'mercado'] as const;
type CategoriaValida = (typeof CATEGORIAS_VALIDAS)[number];

function isCategoriaValida(valor: string): valor is CategoriaValida {
  return (CATEGORIAS_VALIDAS as readonly string[]).includes(valor);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoriaParam = searchParams.get('category');

    if (categoriaParam && !isCategoriaValida(categoriaParam)) {
      return NextResponse.json({ success: false, error: 'Categoria inválida.', totalVoters: 0 }, { status: 400 });
    }

    const { env } = getCloudflareContext();
    const db = getDB(env);

    // Conta vereditos distintos (session_id por categoria), evitando distorção entre arenas com 10 ou 6 jogos
    let stmt;
    if (categoriaParam) {
      stmt = db
        .prepare('SELECT COUNT(DISTINCT session_id) as total_voters FROM results WHERE category = ?')
        .bind(categoriaParam);
    } else {
      stmt = db.prepare(
        'SELECT COUNT(*) as total_voters FROM (SELECT DISTINCT session_id, category FROM results)'
      );
    }

    const queryResult = await stmt.all();
    const rows = Array.isArray(queryResult?.results) ? queryResult.results : [];
    const totalVoters = Number(rows[0]?.total_voters) || 0;

    const response = NextResponse.json({
      success: true,
      totalVoters,
      category: categoriaParam || 'all',
    });

    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
    return response;
  } catch (error) {
    console.error('Erro em /api/stats:', error);
    return NextResponse.json({ success: false, totalVoters: 0 }, { status: 500 });
  }
}