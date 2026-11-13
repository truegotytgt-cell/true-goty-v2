// app/api/og/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

function getBase64Image(imagePath: string) {
  try {
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const fullPath = path.join(process.cwd(), 'public', cleanPath);
    const imageBuffer = fs.readFileSync(fullPath);
    return `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
  } catch (e: any) { return ''; }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const t1 = searchParams.get('t1') || 'Jogo 1';
    const t2 = searchParams.get('t2') || 'Jogo 2';
    const t3 = searchParams.get('t3') || 'Jogo 3';
    
    const b64_i1 = getBase64Image(searchParams.get('i1') || '');
    const b64_i2 = getBase64Image(searchParams.get('i2') || '');
    const b64_i3 = getBase64Image(searchParams.get('i3') || '');

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            width: '100%', height: '100%',
            // FUNDO DE LUXO (AÇO DAMASCO INTENSIFICADO)
            backgroundColor: '#020005',
            backgroundImage: `
              radial-gradient(circle at 50% 30%, rgba(88, 28, 135, 0.4) 0%, transparent 60%),
              repeating-linear-gradient(60deg, transparent, transparent 30px, rgba(212, 175, 55, 0.04) 30px, rgba(212, 175, 55, 0.04) 32px),
              repeating-linear-gradient(-60deg, transparent, transparent 40px, rgba(176, 38, 255, 0.04) 40px, rgba(176, 38, 255, 0.04) 42px)
            `,
            fontFamily: 'sans-serif'
          }}
        >
          {/* CABEÇALHO */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ height: '1px', width: '50px', background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
              <span style={{ color: '#D4AF37', fontSize: '20px', letterSpacing: '4px', fontWeight: 'bold' }}>OFICIAL</span>
              <div style={{ height: '1px', width: '50px', background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
            </div>
            <h1 style={{ color: '#FFF', fontSize: '75px', margin: 0, fontWeight: 900, letterSpacing: '-1px' }}>
              MEU TRUE GOTY
            </h1>
            <h2 style={{ color: '#B026FF', fontSize: '40px', margin: 0, marginTop: '5px', fontWeight: 'bold', letterSpacing: '2px' }}>
              TOP 3
            </h2>
          </div>

          {/* 1º LUGAR (Destaque Máximo) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '50px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-30px', fontSize: '50px', filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.8))' }}>👑</div>
            {b64_i1 ? (
              <img src={b64_i1} style={{ width: '480px', height: '480px', borderRadius: '20px', border: '8px solid #D4AF37', objectFit: 'cover', boxShadow: '0 0 100px rgba(176, 38, 255, 0.6), 0 0 40px rgba(212, 175, 55, 0.4)' }} />
            ) : (
              <div style={{ width: '480px', height: '480px', backgroundColor: '#222', borderRadius: '20px', display: 'flex' }}></div>
            )}
            <div style={{ backgroundColor: '#D4AF37', color: '#000', padding: '8px 30px', borderRadius: '50px', marginTop: '-25px', zIndex: 10, fontSize: '32px', fontWeight: 900, boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
              1º LUGAR
            </div>
            <h3 style={{ color: '#D4AF37', fontSize: '45px', margin: '15px 0 0 0', fontWeight: 900, textAlign: 'center', textShadow: '0 0 20px rgba(212, 175, 55, 0.5)' }}>
              {t1}
            </h3>
          </div>

          {/* 2º e 3º LUGARES */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '60px', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px' }}>
              {b64_i2 ? (
                <img src={b64_i2} style={{ width: '280px', height: '280px', borderRadius: '16px', border: '4px solid #E2E8F0', objectFit: 'cover', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }} />
              ) : (
                <div style={{ width: '280px', height: '280px', backgroundColor: '#222', borderRadius: '16px', display: 'flex' }}></div>
              )}
              <div style={{ backgroundColor: '#E2E8F0', color: '#000', padding: '4px 20px', borderRadius: '50px', marginTop: '-15px', zIndex: 10, fontSize: '20px', fontWeight: 900 }}>
                2º
              </div>
              <h3 style={{ color: '#FFF', fontSize: '28px', margin: '15px 0 0 0', textAlign: 'center', fontWeight: 'bold' }}>
                {t2}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px' }}>
              {b64_i3 ? (
                <img src={b64_i3} style={{ width: '280px', height: '280px', borderRadius: '16px', border: '4px solid #CD7F32', objectFit: 'cover', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }} />
              ) : (
                <div style={{ width: '280px', height: '280px', backgroundColor: '#222', borderRadius: '16px', display: 'flex' }}></div>
              )}
              <div style={{ backgroundColor: '#CD7F32', color: '#000', padding: '4px 20px', borderRadius: '50px', marginTop: '-15px', zIndex: 10, fontSize: '20px', fontWeight: 900 }}>
                3º
              </div>
              <h3 style={{ color: '#FFF', fontSize: '28px', margin: '15px 0 0 0', textAlign: 'center', fontWeight: 'bold' }}>
                {t3}
              </h3>
            </div>
          </div>

          {/* RODAPÉ DE COMPARTILHAMENTO */}
          <div style={{ display: 'flex', marginTop: '80px', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#a1a1aa', fontSize: '28px' }}>Faça o seu em</span>
            <span style={{ color: '#FFF', fontSize: '32px', fontWeight: 'bold', textShadow: '0 0 10px rgba(176, 38, 255, 0.8)' }}>truegoty.com</span>
          </div>
        </div>
      ),
      { width: 1080, height: 1920 }
    );
  } catch (e: any) {
    return new Response('Falha ao gerar imagem', { status: 500 });
  }
}