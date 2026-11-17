// app/api/og/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const t1 = searchParams.get('t1') || 'Jogo 1';
    const t2 = searchParams.get('t2') || 'Jogo 2';
    const t3 = searchParams.get('t3') || 'Jogo 3';
    
    // Transforma o caminho relativo (ex: /zelda.jpg) em URL absoluta (https://site.com/zelda.jpg)
    const getAbsoluteUrl = (imagePath: string) => {
      if (!imagePath) return '';
      const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
      return new URL(cleanPath, request.url).toString();
    };

    const i1 = getAbsoluteUrl(searchParams.get('i1') || '');
    const i2 = getAbsoluteUrl(searchParams.get('i2') || '');
    const i3 = getAbsoluteUrl(searchParams.get('i3') || '');

    return new ImageResponse(
      (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#020005', backgroundImage: `radial-gradient(circle at 50% 30%, rgba(88, 28, 135, 0.4) 0%, transparent 60%)`, fontFamily: 'sans-serif', padding: '40px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ color: '#FFF', fontSize: '50px', margin: 0, fontWeight: 900 }}>MEU TRUE GOTY</h1>
            <h2 style={{ color: '#B026FF', fontSize: '30px', margin: 0, marginTop: '5px' }}>TOP 3</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px' }}>
              <div style={{ position: 'relative' }}>
                {i1 ? <img src={i1} style={{ width: '280px', height: '280px', borderRadius: '16px', border: '6px solid #D4AF37', objectFit: 'cover' }} /> : <div style={{ width: '280px', height: '280px', backgroundColor: '#222', borderRadius: '16px' }}></div>}
                <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#D4AF37', color: '#000', padding: '4px 16px', borderRadius: '50px', fontSize: '18px', fontWeight: 'bold' }}>1º</div>
              </div>
              <h3 style={{ color: '#D4AF37', fontSize: '24px', margin: '10px 0 0 0', textAlign: 'center', fontWeight: 'bold' }}>{t1}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '220px' }}>
              <div style={{ position: 'relative' }}>
                {i2 ? <img src={i2} style={{ width: '200px', height: '200px', borderRadius: '12px', border: '4px solid #E2E8F0', objectFit: 'cover' }} /> : <div style={{ width: '200px', height: '200px', backgroundColor: '#222', borderRadius: '12px' }}></div>}
                <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#E2E8F0', color: '#000', padding: '4px 16px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold' }}>2º</div>
              </div>
              <h3 style={{ color: '#FFF', fontSize: '20px', margin: '10px 0 0 0', textAlign: 'center' }}>{t2}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '220px' }}>
              <div style={{ position: 'relative' }}>
                {i3 ? <img src={i3} style={{ width: '200px', height: '200px', borderRadius: '12px', border: '4px solid #CD7F32', objectFit: 'cover' }} /> : <div style={{ width: '200px', height: '200px', backgroundColor: '#222', borderRadius: '12px' }}></div>}
                <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#CD7F32', color: '#000', padding: '4px 16px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold' }}>3º</div>
              </div>
              <h3 style={{ color: '#FFF', fontSize: '20px', margin: '10px 0 0 0', textAlign: 'center' }}>{t3}</h3>
            </div>
          </div>

          <div style={{ display: 'flex', marginTop: '30px', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#a1a1aa', fontSize: '20px' }}>Faça o seu em</span>
            <span style={{ color: '#FFF', fontSize: '24px', fontWeight: 'bold' }}>truegoty.com</span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 } // Formato paisagem para preview de link
    );
  } catch (e: any) {
    console.error("Erro ao gerar imagem OG:", e);
    return new Response('Falha ao gerar imagem', { status: 500 });
  }
}