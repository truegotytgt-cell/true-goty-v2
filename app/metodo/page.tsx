// app/metodo/page.tsx
'use client';

import Link from 'next/link';

export default function Metodo() {
  const fases = [
    {
      num: '01',
      title: 'A Curadoria',
      desc: 'Selecionamos 10 jogos com base em uma Média Ponderada de Metascore, OpenCritic e User Score. O filtro anti-Review Bombing garante que a opinião pública não seja sequestrada.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--purple-neon)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      )
    },
    {
      num: '02',
      title: 'O Mata-Mata',
      desc: 'Usamos o Método de Condorcet. São 45 combates diretos entre os 10 indicados. Você compara frente a frente. É matematicamente o método mais justo de votação.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--purple-neon)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
          <path d="M13 19l6-6" />
          <path d="M16 16l4 4" />
          <path d="M19 21l2-2" />
          <path d="M9.5 6.5L21 18v3h-3L6.5 9.5" />
          <path d="M11 5l6 6" />
          <path d="M8 8l-4-4" />
          <path d="M5 3l-2 2" />
        </svg>
      )
    },
    {
      num: '03',
      title: 'O Placar',
      desc: 'Cada vitória no confronto direto vale +1 ponto (podendo chegar de 0 a 9 pontos). Ao final, o seu ranking é somado ao Placar Global. O jogo com a maior pontuação da comunidade leva o título de True GOTY. Empates são resolvidos no mano a mano.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      )
    }
  ];

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '90px 2rem 1rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* CSS PURO PARA O HOVER (Sem as linhas conectoras) */}
      <style>{`
        .metodo-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .metodo-card:hover {
          border-color: var(--purple-neon) !important;
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(176, 38, 255, 0.15) !important;
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#D4AF37', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '0.8rem', backgroundColor: 'rgba(212, 175, 55, 0.08)', padding: '6px 16px', borderRadius: '50px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Como Funciona
        </span>
        <h1 style={{ color: 'var(--text-light)', fontSize: '3rem', fontWeight: 900, marginBottom: '0.8rem', letterSpacing: '-1px', lineHeight: 1.1 }}>
          O NOSSO MÉTODO
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '1rem', lineHeight: 1.5, maxWidth: '650px', margin: '0 auto' }}>
          O TGT não é apenas mais um prêmio de "jogo do ano". Construímos um sistema de votação em 3 fases, inspirado em modelos estatísticos, para garantir que o vencedor seja verdadeiramente a escolha da comunidade.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'stretch', width: '100%', position: 'relative' }}>
        
        {fases.map((fase, index) => (
          <div key={index} className="metodo-card" style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.02)', 
            backdropFilter: 'blur(16px)', 
            border: '1px solid rgba(176, 38, 255, 0.2)', 
            borderRadius: '20px', 
            padding: '2rem 1.5rem', 
            position: 'relative', 
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          }}>
            {/* Container isolado para o número fantasma */}
            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden', borderRadius: '20px', pointerEvents: 'none', zIndex: 0 }}>
              <span style={{ 
                position: 'absolute', top: '20px', right: '15px', fontSize: '5.5rem', fontWeight: 900, 
                color: 'rgba(255, 255, 255, 0.01)', WebkitTextStroke: '1px rgba(212, 175, 55, 0.15)', 
                lineHeight: 1
              }}>
                {fase.num}
              </span>
            </div>

            <div style={{ marginBottom: '1rem', position: 'relative', display: 'flex', alignItems: 'center', height: '32px', zIndex: 1 }}>
              {fase.icon}
            </div>

            <h2 style={{ color: 'var(--text-light)', fontSize: '1.25rem', marginBottom: '0.8rem', fontWeight: 800, position: 'relative', zIndex: 1 }}>
              {fase.title}
            </h2>
            
            <p style={{ color: '#E5E7EB', lineHeight: 1.6, fontSize: '0.9rem', position: 'relative', flex: 1, zIndex: 1 }}>
              {fase.desc}
            </p>
          </div>
        ))}

      </div>

      <div style={{ textAlign: 'center', marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
        <Link href="/votar/tgt" style={{ 
          display: 'inline-block', background: 'linear-gradient(135deg, #9333EA, #B026FF)', color: '#FFF', 
          padding: '1rem 3rem', fontSize: '1rem', fontWeight: 900, borderRadius: '50px', 
          textDecoration: 'none', boxShadow: '0 0 30px rgba(176, 38, 255, 0.4)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid rgba(255,255,255,0.2)', letterSpacing: '1px'
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(176, 38, 255, 0.6)' }}
        onMouseOut={(e) { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(176, 38, 255, 0.4)' }}
        >
          ENTENDI, QUERO VOTAR
        </Link>
        
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#71717a', fontWeight: 500, letterSpacing: '0.5px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Leva menos de 2 minutos • 10 jogos • 45 duelos
        </span>
      </div>
    </main>
  );
}