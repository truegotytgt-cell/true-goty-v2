// app/sobre/page.tsx
'use client';

import Link from 'next/link';

export default function Sobre() {
  return (
    <main style={{ maxWidth: '850px', margin: '0 auto', padding: '4rem 2rem', minHeight: '80vh' }}>
      
      <h1 style={{ color: 'var(--purple-neon)', fontSize: '3rem', fontWeight: 900, textAlign: 'center', marginBottom: '3rem', textShadow: '0 0 20px rgba(176, 38, 255, 0.3)' }}>
        A NOSSA HISTÓRIA
      </h1>

      <div style={{ 
        backgroundColor: 'rgba(28, 28, 30, 0.5)', backdropFilter: 'blur(10px)', 
        border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '24px', padding: '3rem',
        display: 'flex', flexDirection: 'column', gap: '1.5rem'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--purple-neon)', textShadow: '0 0 30px rgba(176, 38, 255, 0.6)' }}>
            TGT
          </span>
        </div>

        <p style={{ color: '#D1D5DB', lineHeight: 1.8, fontSize: '1.1rem' }}>
          O TGT (True GOTY) nasceu de uma frustração compartilhada por muitos gamers: a sensação de que as grandes premiações da indústria nem sempre refletem a voz real da comunidade.
        </p>

        <p style={{ color: '#D1D5DB', lineHeight: 1.8, fontSize: '1.1rem' }}>
          Acreditamos que o verdadeiro Jogo do Ano não é aquele escolhido por um júri restrito ou influenciado por interesses corporativos. O verdadeiro vencedor deve ser aquele que marcou a vida dos jogadores, aquele que gerou as melhores discussões e aquele que o público realmente amou jogar.
        </p>

        <p style={{ color: '#D1D5DB', lineHeight: 1.8, fontSize: '1.1rem' }}>
          Por isso, construímos este sistema usando o Método de Condorcet, forçando comparações diretas (Mano a Mano) para que o vencedor seja a escolha mais justa da comunidade. Este é um projeto independente, feito por gamers e para gamers.
        </p>

        <div style={{ 
          marginTop: '2rem', backgroundColor: 'rgba(10, 10, 15, 0.6)', padding: '2rem', 
          borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' 
        }}>
          <p style={{ fontWeight: 700, marginBottom: '1rem', color: '#FFF' }}>
            Para parcerias, patrocínios ou apenas para trocar uma ideia:
          </p>
          <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--purple-neon)' }}>
            truegoty.tgt@gmail.com
          </span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link href="/votar/tgt" style={{ 
          display: 'inline-block', backgroundColor: 'var(--purple-neon)', color: '#FFF', 
          padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 900, borderRadius: '8px', 
          textDecoration: 'none', boxShadow: '0 0 30px rgba(176, 38, 255, 0.4)', transition: 'transform 0.2s' 
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