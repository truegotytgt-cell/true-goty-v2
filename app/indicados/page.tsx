// app/indicados/page.tsx
'use client';

import jogosData from '../../lib/jogos.json';
import { useState } from 'react';
import { motion } from 'framer-motion'; // <-- IMPORTADO

function renderizarPlataformas(plataformas: string[]) {
  if (!plataformas) return null;
  return (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.8rem', flexWrap: 'wrap' }}>
      {plataformas.map(p => {
        let icone = '🎮';
        if (p === 'PC') icone = '💻';
        if (p === 'PS5') icone = '🎮 PS';
        if (p === 'Xbox') icone = '🎮 Xbox';
        if (p === 'switch') icone = '🎮 Switch';
        return (
          <span key={p} style={{ fontSize: '0.65rem', color: '#a1a1aa', backgroundColor: 'rgba(0,0,0,0.5)', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold' }}>
            {icone}
          </span>
        );
      })}
    </div>
  );
}

export default function Indicados() {
  const jogos = jogosData.top10;
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <main style={{ padding: '6rem 2rem', color: 'var(--text-light)', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span style={{ display: 'inline-block', color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '1rem' }}>
          ★ A Curadoria Oficial
        </span>
        <h1 style={{ color: 'var(--text-light)', fontSize: '3rem', marginBottom: '1rem', fontWeight: 900 }}>
          INDICADOS TGT
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>
          Conheça os 10 jogos que disputam o True GOTY deste ano.
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        {jogos.map((jogo, index) => (
          <motion.div 
            key={jogo.slug}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }} // <-- EFEITO CASCATA (0.1s de atraso por card)
            onMouseEnter={() => setHoveredCard(jogo.slug)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ 
              backgroundColor: 'rgba(28, 28, 30, 0.6)', backdropFilter: 'blur(10px)',
              padding: '1rem', borderRadius: '16px', 
              border: hoveredCard === jogo.slug ? '1px solid var(--purple-neon)' : '1px solid rgba(255,255,255,0.05)',
              textAlign: 'center', transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              position: 'relative', cursor: 'pointer', display: 'flex', flexDirection: 'column',
              transform: hoveredCard === jogo.slug ? 'translateY(-8px)' : 'translateY(0)',
              boxShadow: hoveredCard === jogo.slug ? '0 15px 30px rgba(176, 38, 255, 0.2)' : 'none'
            }}
          >
            {jogo.user_rating_original && (
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', backgroundColor: 'rgba(10, 10, 15, 0.85)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.5)', padding: '4px 10px', borderRadius: '8px', fontWeight: 900, fontSize: '0.9rem', backdropFilter: 'blur(4px)', zIndex: 10 }}>
                {jogo.user_rating_original}
              </div>
            )}
            <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '12px', marginBottom: '1.2rem' }}>
              <img src={jogo.imagem} alt={jogo.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', transform: hoveredCard === jogo.slug ? 'scale(1.05)' : 'scale(1)' }} />
            </div>
            <h3 style={{ fontSize: '1.1rem', margin: 0, flexGrow: 1, fontWeight: 800 }}>{jogo.titulo}</h3>
            {renderizarPlataformas(jogo.plataformas)}
          </motion.div>
        ))}
      </div>
    </main>
  );
}