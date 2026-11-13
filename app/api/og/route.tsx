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
    const base64 = imageBuffer.toString('base64');
    let mime = 'image/jpeg';
    if (cleanPath.endsWith('.png')) mime = 'image/png';
    return `data:${mime};base64,${base64}`;
  } catch (e: any) {
    return ''; 
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const t1 = searchParams.get('t1') || 'Jogo 1';
    const i1 = searchParams.get('i1') || '';
    const t2 = searchParams.get('t2') || 'Jogo 2';
    const i2 = searchParams.get('i2') || '';
    const t3 = searchParams.get('t3') || 'Jogo 3';
    const i3 = searchParams.get('i3') || '';

    const b64_i1 = getBase64Image(i1);
    const b64_i2 = getBase64Image(i2);
    const b64_i3 = getBase64Image(i3);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            // EFEITO AÇO DAMASCO: Fundo roxo profundo com linhas douradas diagonais simuladas
            backgroundColor: '#05000A',
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(88, 28, 135, 0.8) 0%, #05000A 70%),
              repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(212, 175, 55, 0.05) 20px, rgba(212, 175, 55, 0.05) 22px),
              repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(212, 175, 55, 0.03) 30px, rgba(212, 175, 55, 0.03) 32px)
            `,
            padding: '40px',
            fontFamily: 'sans-serif'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px', zIndex: 10 }}>
            <h1 style={{ color: '#F4F4F0', fontSize: '70px', margin: 0, textAlign: 'center', fontWeight: 900, letterSpacing: '2px', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              MEU TRUE GOTY
            </h1>
            <h2 style={{ color: '#D4AF37', fontSize: '50px', margin: 0, marginTop: '10px', fontWeight: 'bold', letterSpacing: '4px', textShadow: '0 0 20px rgba(212, 175, 55, 0.5)' }}>
              TOP 3
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px', zIndex: 10 }}>
            {b64_i1 ? (
              <img src={b64_i1} style={{ width: '500px', height: '500px', borderRadius: '30px', border: '6px solid #D4AF37', objectFit: 'cover', boxShadow: '0 0 80px rgba(176, 38, 255, 0.9), 0 0 20px rgba(212, 175, 55, 0.6)' }} />
            ) : (
              <div style={{ width: '500px', height: '500px', backgroundColor: '#222', borderRadius: '30px', display: 'flex' }}></div>
            )}
            <h3 style={{ color: '#F4F4F0', fontSize: '48px', margin: '25px 0 0 0', fontWeight: 900, textAlign: 'center', textShadow: '0 0 30px rgba(176, 38, 255, 0.8)' }}>
              1º {t1}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '50px', width: '100%', zIndex: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px' }}>
              {b64_i2 ? (
                <img src={b64_i2} style={{ width: '300px', height: '300px', borderRadius: '20px', border: '4px solid #A1A1AA', objectFit: 'cover', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }} />
              ) : (
                <div style={{ width: '300px', height: '300px', backgroundColor: '#222', borderRadius: '20px', display: 'flex' }}></div>
              )}
              <h3 style={{ color: '#F4F4F0', fontSize: '30px', margin: '15px 0 0 0', textAlign: 'center', fontWeight: 'bold' }}>
                2º {t2}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px' }}>
              {b64_i3 ? (
                <img src={b64_i3} style={{ width: '300px', height: '300px', borderRadius: '20px', border: '4px solid #CD7F32', objectFit: 'cover', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }} />
              ) : (
                <div style={{ width: '300px', height: '300px', backgroundColor: '#222', borderRadius: '20px', display: 'flex' }}></div>
              )}
              <h3 style={{ color: '#F4F4F0', fontSize: '30px', margin: '15px 0 0 0', textAlign: 'center', fontWeight: 'bold' }}>
                3º {t3}
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', marginTop: '80px', zIndex: 10 }}>
            <h2 style={{ color: '#A1A1AA', fontSize: '34px', margin: 0, textAlign: 'center', letterSpacing: '1px' }}>
              Faça o seu em <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>truegoty.com</span>
            </h2>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1920,
      }
    );
  } catch (e: any) {
    console.error("ERRO GERAL NA API:", e.message);
    return new Response('Falha ao gerar imagem', { status: 500 });
  }
}