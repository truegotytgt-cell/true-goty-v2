// app/indicados/page.tsx
'use client';

import { useState } from 'react';
import jogosData from '@/lib/jogos.json';
import Link from 'next/link';
import { motion } from 'framer-motion';

function formatarNota(nota: number) {
  if (typeof nota !== 'number') return nota;
  return nota.toFixed(1);
}

function renderizarPlataformas(plataformas: string[]) {
  if (!plataformas) return null;
  return (
    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: 'auto', flexWrap: 'wrap' }}>
      {plataformas.map(p => {
        let label = p;
        const pLower = p.toLowerCase(); 
        if (pLower === 'ps5') label = 'PS5';
        if (pLower === 'xbox') label = 'XBOX';
        if (pLower === 'switch') label = 'NSW';
        if (pLower === 'pc') label = 'PC';
        
        return (
          <span key={p} style={{ fontSize: '0.6rem', color: '#a1a1aa', backgroundColor: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 700 }}>
            {label}
          </span>
        );
      })}
    </div>
  );
}

export default function Indicados() {
  const [categoria, setCategoria] = useState<'tgt' | 'mercado'>('tgt');
  const jogos = (jogosData as any)[categoria]?.top10 || [];

  return (
    <main style={{ minHeight: 'calc(100vh - 80px)', padding: '85px 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '0.2rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          A Curadoria Oficial
        </span>
        <h1 style={{ color: 'var(--text-light)', fontSize: '2.8rem', marginBottom: '1.5rem', fontWeight: 900, letterSpacing: '-1px' }}>
          INDICADOS <span style={{ color: categoria === 'tgt' ? 'var(--purple-neon)' : '#D4AF37' }}>{categoria.toUpperCase()}</span> 2026
        </h1>

        {/* SELETOR DE CATEGORIA */}
        <div style={{ display: 'inline-flex', gap: '0.5rem', backgroundColor: 'rgba(0,0,0,0.5)', padding: '0.5rem', borderRadius: '50px', border: '1px solid #333' }}>
          <button 
            onClick={() => setCategoria('tgt')}
            style={{ padding: '0.6rem 2rem', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', border: 'none', backgroundColor: categoria === 'tgt' ? 'var(--purple-neon)' : 'transparent', color: categoria === 'tgt' ? '#FFF' : '#a1a1aa', transition: 'all 0.3s' }}
          >
            TRUE GOTY
          </button>
          <button 
            onClick={() => setCategoria('mercado')}
            style={{ padding: '0.6rem 2rem', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', border: 'none', backgroundColor: categoria === 'mercado' ? '#D4AF37' : 'transparent', color: categoria === 'mercado' ? '#000' : '#a1a1aa', transition: 'all 0.3s' }}
          >
            MERCADO
          </button>
        </div>

        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', marginTop: '1rem' }}>
          Clique em um jogo para ver seus detalhes e confrontos.
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '1600px', justifyContent: 'center', flex: 1, zIndex: 1 }}>
        {jogos.map((jogo: any, index: number) => (
          <motion.div 
            key={jogo.slug}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Link envia a categoria para a próxima página */}
            <Link href={`/indicados/${jogo.slug}/confrontos?cat=${categoria}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              <div style={{ 
                backgroundColor: 'rgba(28, 28, 30, 0.6)', backdropFilter: 'blur(10px)',
                padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center', transition: 'all 0.3s ease', position: 'relative', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box'
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = categoria === 'tgt' ? 'var(--purple-neon)' : '#D4AF37'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 10px 20px ${categoria === 'tgt' ? 'rgba(176, 38, 255, 0.15)' : 'rgba(212, 175, 55, 0.15)'}` }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {jogo.user_rating_original && (
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(10, 10, 15, 0.9)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.5)', padding: '2px 8px', borderRadius: '6px', fontWeight: 900, fontSize: '0.8rem', zIndex: 10 }}>
                    {formatarNota(jogo.user_rating_original)}
                  </div>
                )}
                
                <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '8px', marginBottom: '0.8rem' }}>
                  <img src={jogo.imagem} alt={jogo.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <h3 style={{ 
                  fontSize: '0.95rem', margin: '0 0 0.5rem 0', fontWeight: 800, color: 'var(--text-light)', lineHeight: 1.2,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.4em'
                }}>
                  {jogo.titulo}
                </h3>
                
                {renderizarPlataformas(jogo.plataformas)}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}