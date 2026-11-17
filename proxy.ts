// proxy.ts (na raiz do projeto)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// O Next.js 16 espera a função chamada 'proxy' (ou export default)
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verifica a categoria TGT
  if (pathname.startsWith('/votar/tgt')) {
    const jaVotou = request.cookies.has('tgt_voted_tgt');
    if (jaVotou) {
      return NextResponse.redirect(new URL('/obrigado?categoria=tgt', request.url));
    }
  }

  // Verifica a categoria MERCADO
  if (pathname.startsWith('/votar/mercado')) {
    const jaVotou = request.cookies.has('tgt_voted_mercado');
    if (jaVotou) {
      return NextResponse.redirect(new URL('/obrigado?categoria=mercado', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/votar/:path*',
};