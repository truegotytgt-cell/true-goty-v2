// app/resultados/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Resultados() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<'tgt' | 'mercado' | null>(null);

  return (
    <main style={{ minHeight: '100vh', padding: '80px 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3.5rem', width: '100%' }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ color: 'var(--text-light)', fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '0.8rem', textTransform: 'uppercase' }}
        >
          TRUE GOTY: <span style={{ color: 'var(--purple-neon)' }}>A HORA DA VERDADE</span>
        </motion.h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
          Descubra quem a comunidade coroou como o verdadeiro GOTY ou monte o seu próprio veredito.
        </p>
      </div>

      {!categoriaSelecionada ? (
        // TELA DE SELEÇÃO DE CATEGORIA
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '900px' }}>
          
          <button onClick={() => setCategoriaSelecionada('tgt')} style={{ 
            flex: 1, minWidth: '300px', backgroundColor: 'rgba(28, 28, 30, 0.6)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(176, 38, 255, 0.3)', borderRadius: '24px', padding: '3rem 2rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.3s'
          }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'var(--purple-neon)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(176, 38, 255, 0.3)'; }}>
            <span style={{ fontSize: '3rem' }}>🏆</span>
            <h2 style={{ color: 'var(--purple-neon)', fontSize: '2rem', fontWeight: 900, margin: 0 }}>TRUE GOTY</h2>
            <p style={{ color: '#a1a1aa', margin: 0 }}>Os indicados oficiais do site.</p>
          </button>

          <button onClick={() => setCategoriaSelecionada('mercado')} style={{ 
            flex: 1, minWidth: '300px', backgroundColor: 'rgba(28, 28, 30, 0.6)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '24px', padding: '3rem 2rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.3s'
          }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#D4AF37'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)'; }}>
            <span style={{ fontSize: '3rem' }}>🏬</span>
            <h2 style={{ color: '#D4AF37', fontSize: '2rem', fontWeight: 900, margin: 0 }}>MERCADO</h2>
            <p style={{ color: '#a1a1aa', margin: 0 }}>O comparativo com o TGA.</p>
          </button>
        </motion.div>
      ) : (
        // TELA COM OS CARDS DA CATEGORIA ESCOLHIDA
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <button onClick={() => setCategoriaSelecionada(null)} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            ← Voltar para seleção de categoria
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <h2 style={{ color: categoriaSelecionada === 'tgt' ? 'var(--purple-neon)' : '#D4AF37', fontSize: '2rem', fontWeight: 900, margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>
              {categoriaSelecionada === 'tgt' ? 'True GOTY' : 'Mercado (TGA)'}
            </h2>
          </div>

          <Link href={`/resultados/global?cat=${categoriaSelecionada}`} style={{ textDecoration: 'none' }}>
            <div style={{ 
              backgroundColor: 'rgba(28, 28, 30, 0.6)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.3s ease', cursor: 'pointer'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = categoriaSelecionada === 'tgt' ? 'var(--purple-neon)' : '#D4AF37'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={categoriaSelecionada === 'tgt' ? 'var(--purple-neon)' : '#D4AF37'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              <div>
                <h3 style={{ color: 'var(--text-light)', fontSize: '1.2rem', fontWeight: 800, margin: 0, marginBottom: '0.2rem' }}>PLACAR GLOBAL</h3>
                <p style={{ color: '#a1a1aa', fontSize: '0.85rem', margin: 0 }}>A soma de todos os votos da comunidade.</p>
              </div>
            </div>
          </Link>

          <Link href={`/resultados/pessoal?cat=${categoriaSelecionada}`} style={{ textDecoration: 'none' }}>
            <div style={{ 
              backgroundColor: 'rgba(28, 28, 30, 0.6)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.3s ease', cursor: 'pointer'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = categoriaSelecionada === 'tgt' ? 'var(--purple-neon)' : '#D4AF37'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={categoriaSelecionada === 'tgt' ? 'var(--purple-neon)' : '#D4AF37'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <div>
                <h3 style={{ color: 'var(--text-light)', fontSize: '1.2rem', fontWeight: 800, margin: 0, marginBottom: '0.2rem' }}>MEU RANKING PESSOAL</h3>
                <p style={{ color: '#a1a1aa', fontSize: '0.85rem', margin: 0 }}>Veja como você votou nesta categoria.</p>
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </main>
  );
}