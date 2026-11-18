// app/api/og/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge'; // Otimização para Cloudflare

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url);

    // 1. SEGURANÇA: Sanitiza o texto para evitar estouro de memória no Worker
    const sanitizeText = (val: string | null, defaultText: string) => {
      const text = (val || defaultText).replace(/[<>]/g, ''); // Evita HTML injection
      return text.length > 35 ? text.substring(0, 35) + '...' : text;
    };

    const t1 = sanitizeText(searchParams.get('t1'), 'Campeão TGT');
    const t2 = sanitizeText(searchParams.get('t2'), '2º Lugar');
    const t3 = sanitizeText(searchParams.get('t3'), '3º Lugar');

    // 2. SEGURANÇA: Trava as imagens no seu próprio domínio (evita SSRF)
    const resolveLocalImage = (rawPath: string | null) => {
      if (!rawPath) return '';
      // Só aceita caminhos que começam com '/' e não têm 'http' ou '//'
      if (!rawPath.startsWith('/') || rawPath.startsWith('//') || rawPath.includes(':')) {
        return '';
      }
      const resolved = new URL(rawPath, origin);
      return resolved.origin === origin ? resolved.toString() : '';
    };

    const i1 = resolveLocalImage(searchParams.get('i1'));
    const i2 = resolveLocalImage(searchParams.get('i2'));
    const i3 = resolveLocalImage(searchParams.get('i3'));

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            backgroundColor: '#050508',
            // Gradiente simples (Satori suporta)
            backgroundImage: 'radial-gradient(circle at 50% 35%, rgba(176, 38, 255, 0.28) 0%, transparent 65%)',
            border: '2px solid #D4AF37',
            padding: '36px 48px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Cabeçalho */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: '#B026FF', fontSize: '18px', fontWeight: 800, letterSpacing: '4px' }}>
              TEMPORADA 2026 • VEREDITO OFICIAL
            </span>
            <h1 style={{ color: '#FFFFFF', fontSize: '44px', margin: '6px 0 0 0', fontWeight: 900, letterSpacing: '2px' }}>
              MEU PÓDIO TRUE GOTY
            </h1>
          </div>

          {/* Pódio com capas na proporção 3:4 e cantos retos */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '40px', width: '100%' }}>
            
            {/* 2º Lugar (Prata) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '210px' }}>
              <span style={{ color: '#E2E8F0', fontSize: '15px', fontWeight: 800, letterSpacing: '2px', marginBottom: '8px' }}>
                2º LUGAR
              </span>
              {i2 ? (
                <img src={i2} style={{ width: '195px', height: '260px', border: '2px solid #E2E8F0', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '195px', height: '260px', backgroundColor: '#141419', border: '2px solid #E2E8F0' }} />
              )}
              <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 700, marginTop: '10px', textAlign: 'center' }}>
                {t2}
              </span>
            </div>

            {/* 1º Lugar (Ouro - Destaque) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '250px' }}>
              <span style={{ color: '#D4AF37', fontSize: '18px', fontWeight: 900, letterSpacing: '3px', marginBottom: '8px' }}>
                ★ CAMPEÃO ★
              </span>
              {i1 ? (
                <img src={i1} style={{ width: '240px', height: '320px', border: '3px solid #D4AF37', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '240px', height: '320px', backgroundColor: '#141419', border: '3px solid #D4AF37' }} />
              )}
              <span style={{ color: '#D4AF37', fontSize: '22px', fontWeight: 900, marginTop: '10px', textAlign: 'center' }}>
                {t1}
              </span>
            </div>

            {/* 3º Lugar (Bronze) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '210px' }}>
              <span style={{ color: '#CD7F32', fontSize: '15px', fontWeight: 800, letterSpacing: '2px', marginBottom: '8px' }}>
                3º LUGAR
              </span>
              {i3 ? (
                <img src={i3} style={{ width: '195px', height: '260px', border: '2px solid #CD7F32', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '195px', height: '260px', backgroundColor: '#141419', border: '2px solid #CD7F32' }} />
              )}
              <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 700, marginTop: '10px', textAlign: 'center' }}>
                {t3}
              </span>
            </div>
          </div>

          {/* Rodapé */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#A1A1AA', fontSize: '18px' }}>DEFINA O SEU EM</span>
            <span style={{ color: '#D4AF37', fontSize: '20px', fontWeight: 900, letterSpacing: '1px' }}>
              TRUEGOTY.COM
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          // O Cache é essencial para não sobrecarregar o Cloudflare
          'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
        },
      }
    );
  } catch (e) {
    console.error('Erro ao gerar imagem OG:', e);
    return new Response('Falha ao gerar imagem', { status: 500 });
  }
}