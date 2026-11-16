// app/api/og-story/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

function getBase64Image(imagePath: string) {
  try {
    if (!imagePath) return '';
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const fullPath = path.join(process.cwd(), 'public', cleanPath);
    if (!fs.existsSync(fullPath)) return '';
    const imageBuffer = fs.readFileSync(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    let mimeType = 'image/jpeg';
    if (ext === '.png') mimeType = 'image/png';
    if (ext === '.webp') mimeType = 'image/webp';
    return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#020005', backgroundImage: `radial-gradient(circle at 50% 30%, rgba(88, 28, 135, 0.4) 0%, transparent 60%), repeating-linear-gradient(60deg, transparent, transparent 30px, rgba(212, 175, 55, 0.04) 30px, rgba(212, 175, 55, 0.04) 32px)`, fontFamily: 'sans-serif' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
            <h1 style={{ color: '#FFF', fontSize: '75px', margin: 0, fontWeight: 900, letterSpacing: '-1px' }}>MEU TRUE GOTY</h1>
            <h2 style={{ color: '#B026FF', fontSize: '40px', margin: 0, marginTop: '5px', fontWeight: 'bold', letterSpacing: '2px' }}>TOP 3</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '50px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-30px', fontSize: '50px' }}>👑</div>
            {b64_i1 ? <img src={b64_i1} style={{ width: '480px', height: '480px', borderRadius: '20px', border: '8px solid #D4AF37', objectFit: 'cover', boxShadow: '0 0 100px rgba(176, 38, 255, 0.6)' }} /> : <div style={{ width: '480px', height: '480px', backgroundColor: '#222', borderRadius: '20px' }}></div>}
            <div style={{ backgroundColor: '#D4AF37', color: '#000', padding: '8px 30px', borderRadius: '50px', marginTop: '-25px', fontSize: '32px', fontWeight: 900 }}>1º LUGAR</div>
            <h3 style={{ color: '#D4AF37', fontSize: '45px', margin: '15px 0 0 0', fontWeight: 900, textAlign: 'center' }}>{t1}</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '60px', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px' }}>
              {b64_i2 ? <img src={b64_i2} style={{ width: '280px', height: '280px', borderRadius: '16px', border: '4px solid #E2E8F0', objectFit: 'cover' }} /> : <div style={{ width: '280px', height: '280px', backgroundColor: '#222', borderRadius: '16px' }}></div>}
              <div style={{ backgroundColor: '#E2E8F0', color: '#000', padding: '4px 20px', borderRadius: '50px', marginTop: '-15px', fontSize: '20px', fontWeight: 900 }}>2º</div>
              <h3 style={{ color: '#FFF', fontSize: '28px', margin: '15px 0 0 0', textAlign: 'center', fontWeight: 'bold' }}>{t2}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px' }}>
              {b64_i3 ? <img src={b64_i3} style={{ width: '280px', height: '280px', borderRadius: '16px', border: '4px solid #CD7F32', objectFit: 'cover' }} /> : <div style={{ width: '280px', height: '280px', backgroundColor: '#222', borderRadius: '16px' }}></div>}
              <div style={{ backgroundColor: '#CD7F32', color: '#000', padding: '4px 20px', borderRadius: '50px', marginTop: '-15px', fontSize: '20px', fontWeight: 900 }}>3º</div>
              <h3 style={{ color: '#FFF', fontSize: '28px', margin: '15px 0 0 0', textAlign: 'center', fontWeight: 'bold' }}>{t3}</h3>
            </div>
          </div>

          <div style={{ display: 'flex', marginTop: '80px', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#a1a1aa', fontSize: '28px' }}>Faça o seu em</span>
            <span style={{ color: '#FFF', fontSize: '32px', fontWeight: 'bold' }}>truegoty.com</span>
          </div>
        </div>
      ),
      { width: 1080, height: 1920 }
    );
  } catch (e: any) {
    return new Response('Falha ao gerar imagem', { status: 500 });
  }
}