// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// O nome da função agora é 'proxy'
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Se o usuário estiver tentando acessar a página de votação do TGT...
  if (pathname.startsWith('/votar/tgt')) {
    // Verifica se o cookie de "já votou" existe
    const jaVotou = request.cookies.has('tgt_voted_tgt');

    // Se ele já votou, redireciona para a página de Obrigado
    if (jaVotou) {
      return NextResponse.redirect(new URL('/obrigado', request.url));
    }
  }

  // Se não tiver o cookie, deixa ele passar normalmente
  return NextResponse.next();
}

// Mantemos a configuração de onde ele deve atuar
export const config = {
  matcher: '/votar/:path*',
};