// app/resultados/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Resultados() {
  return (
    // justify-content: 'center' centraliza verticalmente e horizontalmente
    <main style={{ minHeight: '100vh', padding: '80px 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      <style>{`
        @keyframes pulse-dot {
          0% { opacity: 1; box-shadow: 0 0 0 0 rgba(176, 38, 255, 0.7); }
          70% { opacity: 0.5; box-shadow: 0 0 0 6px rgba(176, 38, 255, 0); }
          100% { opacity: 1; box-shadow: 0 0 0 0 rgba(176, 38, 255, 0); }
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '3.5rem', width: '100%' }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ 
            color: 'var(--text-light)', fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '0.8rem',
            textTransform: 'uppercase'
          }}
        >
          TRUE GOTY: <span style={{ color: 'var(--purple-neon)' }}>A HORA DA VERDADE</span>
        </motion.h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
          A voz dos jogadores em tempo real. Descubra quem a comunidade coroou como o verdadeiro GOTY ou monte o seu próprio veredito.
        </p>
      </div>

      {/* justifyContent: 'center' no grid garante alinhamento perfeito mesmo com conteúdo diferente nas colunas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', width: '100%', maxWidth: '1000px', margin: '0 auto', alignItems: 'start', justifyContent: 'center' }}>
        
        {/* COLUNA TRUE GOTY */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ color: 'var(--purple-neon)', fontSize: '1.5rem', fontWeight: 900, margin: 0, letterSpacing: '1px' }}>
              TRUE GOTY
            </h2>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(176, 38, 255, 0.15)', color: 'var(--purple-neon)', padding: '4px 10px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, border: '1px solid rgba(176, 38, 255, 0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--purple-neon)', borderRadius: '50%', animation: 'pulse-dot 2s infinite' }}></span>
              Ao Vivo
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/resultados/global" style={{ textDecoration: 'none' }}>
              <div style={{ 
                backgroundColor: 'rgba(28, 28, 30, 0.6)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(176, 38, 255, 0.2)', borderRadius: '16px', padding: '1.5rem',
                display: 'flex', alignItems: 'center', gap: '1rem',
                transition: 'all 0.3s ease', cursor: 'pointer'
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--purple-neon)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(176, 38, 255, 0.15)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(176, 38, 255, 0.2)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--purple-neon)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                <div>
                  <h3 style={{ color: 'var(--text-light)', fontSize: '1.2rem', fontWeight: 800, margin: 0, marginBottom: '0.2rem' }}>PLACAR GLOBAL</h3>
                  <p style={{ color: '#a1a1aa', fontSize: '0.85rem', margin: 0 }}>A soma de todos os votos da comunidade.</p>
                </div>
              </div>
            </Link>

            <Link href="/resultados/pessoal" style={{ textDecoration: 'none' }}>
              <div style={{ 
                backgroundColor: 'rgba(28, 28, 30, 0.6)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(176, 38, 255, 0.2)', borderRadius: '16px', padding: '1.5rem',
                display: 'flex', alignItems: 'center', gap: '1rem',
                transition: 'all 0.3s ease', cursor: 'pointer'
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--purple-neon)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(176, 38, 255, 0.15)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(176, 38, 255, 0.2)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--purple-neon)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <div>
                  <h3 style={{ color: 'var(--text-light)', fontSize: '1.2rem', fontWeight: 800, margin: 0, marginBottom: '0.2rem' }}>MEU RANKING PESSOAL</h3>
                  <p style={{ color: '#a1a1aa', fontSize: '0.85rem', margin: 0 }}>Faça o seu ranking e envie para o placar.</p>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* COLUNA MERCADO (EM BREVE) */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#71717a', fontSize: '1.5rem', fontWeight: 900, margin: 0, letterSpacing: '1px' }}>MERCADO</h2>
            <span style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37', padding: '4px 10px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, border: '1px solid rgba(212, 175, 55, 0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Em Breve</span>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px dashed rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '2rem', textAlign: 'center', opacity: 0.6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <h3 style={{ color: '#71717a', fontSize: '1.1rem', fontWeight: 800, margin: 0, marginBottom: '0.5rem' }}>COMPARATIVO</h3>
            <p style={{ color: '#52525b', fontSize: '0.85rem', margin: 0 }}>Aguardando anúncio oficial da premiação.</p>
          </div>
        </motion.div>

      </div>
    </main>
  );
}