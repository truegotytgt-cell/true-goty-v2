// app/votar/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const IconTrophy = () => (
  <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="var(--purple-neon)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const IconLock = () => (
  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default function VotarSelecao() {
  const cardClip = 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)';
  const btnClip = 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)';

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 2rem 2rem', backgroundColor: 'transparent' }}>
      
      {/* HEADER AGRESSIVO */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-block', border: '1px solid rgba(176, 38, 255, 0.4)', backgroundColor: 'rgba(176, 38, 255, 0.1)', color: 'var(--purple-neon)', padding: '6px 20px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '3px', marginBottom: '1rem', clipPath: btnClip }}>
          [ TEMPORADA 2026 ]
        </div>
        <h1 style={{ color: 'var(--text-light)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, margin: 0, lineHeight: 1.1 }}>
          QUAL É O SEU<br/>
          {/* Animação title-shine aplicada aqui */}
          <span className="title-shine" style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', display: 'inline-block', marginTop: '0.5rem' }}>
            VERDADEIRO GOTY?
          </span>
        </h1>
        {/* Subtítulo em Teko para dar peso */}
        <p style={{ color: '#D1D5DB', fontFamily: 'var(--font-teko)', fontSize: '1.6rem', letterSpacing: '2px', textTransform: 'uppercase', maxWidth: '700px', margin: '1rem auto 0', lineHeight: 1.2 }}>
          45 Duelos. Sem nota média. Um campeão sai daqui.
        </p>
      </motion.div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '1000px', alignItems: 'stretch' }}>
        
        {/* ARENA TRUE GOTY */}
        <Link href="/votar/tgt" style={{ textDecoration: 'none', flex: '1 1 450px', display: 'flex' }}>
          <motion.div whileHover={{ scale: 1.02, y: -5 }} style={{ 
            backgroundColor: 'rgba(20, 20, 22, 0.95)', backdropFilter: 'blur(16px)', width: '100%',
            border: '1px solid rgba(176, 38, 255, 0.6)', padding: '2.5rem 2rem', clipPath: cardClip,
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 80px rgba(176, 38, 255, 0.2)'
          }}>
            <div style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px rgba(176, 38, 255, 0.8))' }}><IconTrophy /></div>
            
            <div style={{ color: 'var(--purple-neon)', fontSize: '0.85rem', fontWeight: 900, letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--purple-neon)', boxShadow: '0 0 15px var(--purple-neon)', animation: 'pulseGlow 1.5s infinite' }} />
              ARENA ABERTA
            </div>
            
            <h2 style={{ color: '#FFF', fontSize: '3rem', fontWeight: 900, margin: 0, lineHeight: 1, fontFamily: 'var(--font-teko)' }}>TRUE GOTY</h2>
            <p style={{ color: '#a1a1aa', margin: '1rem 0 2.5rem 0', fontSize: '1rem' }}>Os 10 mais aclamados do ano frente a frente em duelos implacáveis.</p>
            
            <div style={{ marginTop: 'auto', width: '100%' }}>
              <div style={{ backgroundColor: 'var(--purple-neon)', color: '#FFF', padding: '1.2rem', clipPath: btnClip, fontWeight: 900, fontSize: '1.3rem', boxShadow: '0 10px 40px rgba(176, 38, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-teko)' }}>
                ENTRAR NA ARENA
              </div>
            </div>
          </motion.div>
        </Link>

        {/* ARENA MERCADO */}
        <div style={{ 
          flex: '1 1 350px', backgroundColor: 'rgba(15, 15, 15, 0.7)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column',
          border: '1px solid rgba(255, 255, 255, 0.05)', padding: '2rem', clipPath: cardClip,
          alignItems: 'center', textAlign: 'center', opacity: 0.8
        }}>
          <div style={{ marginBottom: '1.5rem', opacity: 0.7 }}><IconLock /></div>
          
          <div style={{ color: '#D4AF37', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '1px', marginBottom: '0.5rem' }}>
            ABERTURA EM 19/11
          </div>
          
          <h2 style={{ color: '#71717a', fontSize: '2rem', fontWeight: 900, margin: 0, fontFamily: 'var(--font-teko)' }}>MERCADO</h2>
          <p style={{ color: '#555', margin: '1rem 0 2.5rem 0', fontSize: '0.9rem' }}>Apenas uma referência de fora da arena.</p>
          
          <div style={{ marginTop: 'auto', width: '100%' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: '#555', fontWeight: 800, fontSize: '0.9rem', clipPath: btnClip, fontFamily: 'var(--font-teko)', letterSpacing: '1px' }}>
              AGUARDANDO
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}