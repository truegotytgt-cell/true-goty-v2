// app/api/reset/route.ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '../../../lib/db';

export async function POST() {
  // 🔒 TRAVA DE SEGURANÇA: rota bloqueada em produção.
  // Só funciona quando você está rodando localmente (npm run dev).
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { success: false, error: 'Rota de reset desabilitada em produção.' },
      { status: 403 }
    );
  }

  try {
    const { env } = getCloudflareContext();
    const db = getDB(env);

    // Apaga os votos agregados e os confrontos pareados, em batch atômico.
    await db.batch([
      db.prepare('DELETE FROM results'),
      db.prepare('DELETE FROM pairwise_results'),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Banco resetado com sucesso (somente em ambiente de desenvolvimento).',
    });
  } catch (error) {
    console.error('Erro no reset:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao resetar o banco.' },
      { status: 500 }
    );
  }
}