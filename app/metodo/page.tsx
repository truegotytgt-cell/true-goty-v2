// app/metodo/page.tsx
'use client';

import Link from 'next/link';

export default function Metodo() {
  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', minHeight: '80vh' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span style={{ display: 'inline-block', color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '1rem' }}>
          ★ Como Funciona
        </span>
        <h1 style={{ color: 'var(--text-light)', fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>
          O NOSSO MÉTODO
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto' }}>
          O TGT não é apenas mais um prêmio de "jogo do ano". Construímos um sistema de votação em 3 fases, inspirado em modelos estatísticos, para garantir que o vencedor seja verdadeiramente a escolha da comunidade.
        </p>
      </div>

      {/* GRID DE 3 COLUNAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* FASE 01 */}
        <div style={{ 
          backgroundColor: 'rgba(28, 28, 30, 0.5)', backdropFilter: 'blur(10px)', 
          border: '1px solid rgba(176, 38, 255, 0.15)', borderRadius: '20px', padding: '3rem 2rem',
          position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'default'
        }}
        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--purple-neon)'}
        onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(176, 38, 255, 0.15)'}
        >
          <span style={{ position: 'absolute', top: '10px', right: '20px', fontSize: '6rem', fontWeight: 900, color: 'transparent', WebkitTextStroke: '1px rgba(212, 175, 55, 0.3)', zIndex: 0 }}>01</span>
          <div style={{ fontSize: '2rem', marginBottom: '1.5rem', zIndex: 1, position: 'relative' }}>🛡️</div>
          <h2 style={{ color: 'var(--purple-neon)', fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 800, zIndex: 1, position: 'relative' }}>A Curadoria</h2>
          <p style={{ color: '#D1D5DB', lineHeight: 1.7, fontSize: '0.95rem', zIndex: 1, position: 'relative' }}>
            Selecionamos 10 jogos com base em uma Média Ponderada de Metascore, OpenCritic e User Score. O filtro anti-Review Bombing garante que a opinião pública não seja sequestrada.
          </p>
        </div>

        {/* FASE 02 */}
        <div style={{ 
          backgroundColor: 'rgba(28, 28, 30, 0.5)', backdropFilter: 'blur(10px)', 
          border: '1px solid rgba(176, 38, 255, 0.15)', borderRadius: '20px', padding: '3rem 2rem',
          position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'default'
        }}
        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--purple-neon)'}
        onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(176, 38, 255, 0.15)'}
        >
          <span style={{ position: 'absolute', top: '10px', right: '20px', fontSize: '6rem', fontWeight: 900, color: 'transparent', WebkitTextStroke: '1px rgba(212, 175, 55, 0.3)', zIndex: 0 }}>02</span>
          <div style={{ fontSize: '2rem', marginBottom: '1.5rem', zIndex: 1, position: 'relative' }}>⚔️</div>
          <h2 style={{ color: 'var(--purple-neon)', fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 800, zIndex: 1, position: 'relative' }}>O Mata-Mata</h2>
          <p style={{ color: '#D1D5DB', lineHeight: 1.7, fontSize: '0.95rem', zIndex: 1, position: 'relative' }}>
            Usamos o Método de Condorcet. São 45 combates diretos entre os 10 indicados. Você compara frente a frente. É matematicamente o método mais justo de votação.
          </p>
        </div>

        {/* FASE 03 */}
        <div style={{ 
          backgroundColor: 'rgba(28, 28, 30, 0.5)', backdropFilter: 'blur(10px)', 
          border: '1px solid rgba(176, 38, 255, 0.15)', borderRadius: '20px', padding: '3rem 2rem',
          position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'default'
        }}
        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--purple-neon)'}
        onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(176, 38, 255, 0.15)'}
        >
          <span style={{ position: 'absolute', top: '10px', right: '20px', fontSize: '6rem', fontWeight: 900, color: 'transparent', WebkitTextStroke: '1px rgba(212, 175, 55, 0.3)', zIndex: 0 }}>03</span>
          <div style={{ fontSize: '2rem', marginBottom: '1.5rem', zIndex: 1, position: 'relative' }}>🏆</div>
          <h2 style={{ color: 'var(--purple-neon)', fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 800, zIndex: 1, position: 'relative' }}>O Placar</h2>
          <p style={{ color: '#D1D5DB', lineHeight: 1.7, fontSize: '0.95rem', zIndex: 1, position: 'relative' }}>
            Vitórias valem +1 e derrotas -1. Ao final, o seu ranking é somado ao Placar Global. O jogo com a maior pontuação da comunidade leva o título de True GOTY.
          </p>
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
          ENTENDI, QUERO VOTAR
        </Link>
      </div>
    </main>
  );
}