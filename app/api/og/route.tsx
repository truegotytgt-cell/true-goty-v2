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
            backgroundColor: '#0A0A0F',
            backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(176, 38, 255, 0.2) 0%, #0A0A0F 70%)',
            padding: '40px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
            <h1 style={{ color: '#F4F4F0', fontSize: '60px', margin: 0, textAlign: 'center' }}>
              MEU TRUE GOTY
            </h1>
            <h2 style={{ color: '#B026FF', fontSize: '40px', margin: 0, marginTop: '10px', fontWeight: 'bold' }}>
              TOP 3
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '20px', width: '100%' }}>
            
            {/* 2º Lugar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '250px' }}>
              {b64_i2 ? (
                <img src={b64_i2} style={{ width: '250px', height: '250px', borderRadius: '16px', border: '4px solid #C0C0C0', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '250px', height: '250px', backgroundColor: '#333', borderRadius: '16px', display: 'flex' }}></div>
              )}
              <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '20px' }}>
                <h3 style={{ color: '#F4F4F0', fontSize: '24px', margin: 0, textAlign: 'center' }}>{t2}</h3>
              </div>
            </div>

            {/* 1º Lugar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '320px', marginBottom: '40px' }}>
              {b64_i1 ? (
                <img src={b64_i1} style={{ width: '320px', height: '320px', borderRadius: '20px', border: '6px solid #B026FF', objectFit: 'cover', boxShadow: '0 0 40px rgba(176, 38, 255, 0.6)' }} />
              ) : (
                <div style={{ width: '320px', height: '320px', backgroundColor: '#333', borderRadius: '20px', display: 'flex' }}></div>
              )}
              <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '20px' }}>
                <h3 style={{ color: '#B026FF', fontSize: '32px', margin: 0, fontWeight: 'bold', textAlign: 'center' }}>{t1}</h3>
              </div>
            </div>

            {/* 3º Lugar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '250px' }}>
              {b64_i3 ? (
                <img src={b64_i3} style={{ width: '250px', height: '250px', borderRadius: '16px', border: '4px solid #CD7F32', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '250px', height: '250px', backgroundColor: '#333', borderRadius: '16px', display: 'flex' }}></div>
              )}
              <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '20px' }}>
                <h3 style={{ color: '#F4F4F0', fontSize: '24px', margin: 0, textAlign: 'center' }}>{t3}</h3>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', marginTop: '80px' }}>
            <h2 style={{ color: '#F4F4F0', fontSize: '30px', margin: 0, textAlign: 'center' }}>
              Faça o seu em truegoty.com
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