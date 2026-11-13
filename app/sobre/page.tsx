// app/sobre/page.tsx
'use client';

import Link from 'next/link';

export default function Sobre() {
  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem 2rem', minHeight: '80vh' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
        
        {/* COLUNA ESQUERDA: MANIFESTO */}
        <div style={{ borderLeft: '3px solid #D4AF37', paddingLeft: '2rem' }}>
          <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--purple-neon)', textShadow: '0 0 30px rgba(176, 38, 255, 0.5)', marginBottom: '1.5rem', lineHeight: 1 }}>
            TGT
          </div>
          <h1 style={{ color: '#F4F4F0', fontSize: '2rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '1rem' }}>
            Sem júri fechado.<br/>
            Sem empates.<br/>
            <span style={{ color: '#D4AF37' }}>Apenas o veredito de quem joga.</span>
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1rem', lineHeight: 1.6 }}>
            O True GOTY é a voz da comunidade contra as premiações corporativas.
          </p>
        </div>

        {/* COLUNA DIREITA: A HISTÓRIA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={{ color: '#D1D5DB', lineHeight: 1.8, fontSize: '1.05rem' }}>
            O TGT (True GOTY) nasceu de uma frustração compartilhada por muitos gamers: a sensação de que as grandes premiações da indústria nem sempre refletem a voz real da comunidade.
          </p>
          <p style={{ color: '#D1D5DB', lineHeight: 1.8, fontSize: '1.05rem' }}>
            Acreditamos que o verdadeiro Jogo do Ano não é aquele escolhido por um júri restrito ou influenciado por interesses corporativos. O verdadeiro vencedor deve ser aquele que marcou a vida dos jogadores, aquele que gerou as melhores discussões e aquele que o público realmente amou jogar.
          </p>
          <p style={{ color: '#D1D5DB', lineHeight: 1.8, fontSize: '1.05rem' }}>
            Por isso, construímos este sistema usando o Método de Condorcet, forçando comparações diretas (Mano a Mano) para que o vencedor seja a escolha mais justa. Este é um projeto independente, feito por gamers e para gamers.
          </p>

          <div style={{ 
            marginTop: '2rem', backgroundColor: 'rgba(28, 28, 30, 0.5)', backdropFilter: 'blur(10px)', 
            padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)' 
          }}>
            <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#FFF', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Para parcerias, patrocínios ou ideias:
            </p>
            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--purple-neon)' }}>
              truegoty.tgt@gmail.com
            </span>
          </div>
        </div>

      </div>

      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <Link href="/votar/tgt" style={{ 
          display: 'inline-block', background: 'linear-gradient(to right, #9333EA, #B026FF)', color: '#FFF', 
          padding: '1rem 3rem', fontSize: '1.1rem', fontWeight: 900, borderRadius: '50px', 
          textDecoration: 'none', boxShadow: '0 0 30px rgba(176, 38, 255, 0.4)', transition: 'transform 0.2s',
          border: '1px solid rgba(255,255,255,0.2)', letterSpacing: '1px'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          VOTAR NO TGT
        </Link>
      </div>
    </main>
  );
}