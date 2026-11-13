// app/indicados/page.tsx
'use client'; // <-- ISSO CONSERTA O ERRO

import jogosData from '../../lib/jogos.json';
import { useState } from 'react';

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
          <span key={p} style={{ fontSize: '0.65rem', color: '#a1a1aa', backgroundColor: '#1a1a24', padding: '3px 8px', borderRadius: '6px', border: '1px solid #333', fontWeight: 'bold' }}>
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
    <main style={{ padding: '8rem 2rem 4rem', color: 'var(--text-light)', minHeight: '100vh' }}>
      <h1 style={{ color: 'var(--purple-neon)', fontSize: '3rem', marginBottom: '1rem', textAlign: 'center', fontWeight: 900, textShadow: '0 0 20px rgba(176, 38, 255, 0.3)' }}>
        INDICADOS TGT
      </h1>
      <p style={{ textAlign: 'center', color: '#a1a1aa', marginBottom: '4rem', fontSize: '1.2rem' }}>
        Conheça os 10 jogos que disputam o True GOTY deste ano.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {jogos.map((jogo) => (
          <div 
            key={jogo.slug} 
            onMouseEnter={() => setHoveredCard(jogo.slug)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ 
              backgroundColor: 'var(--bg-gray)', 
              padding: '1.2rem', 
              borderRadius: '16px', 
              border: hoveredCard === jogo.slug ? '1px solid var(--purple-neon)' : '1px solid #333',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              position: 'relative',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              transform: hoveredCard === jogo.slug ? 'translateY(-8px)' : 'translateY(0)',
              boxShadow: hoveredCard === jogo.slug ? '0 15px 30px rgba(176, 38, 255, 0.2)' : 'none'
            }}
          >
            {jogo.user_rating_original && (
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', backgroundColor: 'rgba(10, 10, 15, 0.9)', color: 'var(--purple-neon)', border: '1px solid var(--purple-neon)', padding: '4px 10px', borderRadius: '8px', fontWeight: 900, fontSize: '0.9rem', backdropFilter: 'blur(4px)', boxShadow: '0 0 10px rgba(176, 38, 255, 0.5)', zIndex: 10 }}>
                {jogo.user_rating_original}
              </div>
            )}

            <img src={jogo.imagem} alt={jogo.titulo} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.2rem', filter: hoveredCard === jogo.slug ? 'brightness(1.1)' : 'brightness(0.9)', transition: 'filter 0.3s' }} />
            <h3 style={{ fontSize: '1.2rem', margin: 0, flexGrow: 1, fontWeight: 800 }}>{jogo.titulo}</h3>
            {renderizarPlataformas(jogo.plataformas)}
          </div>
        ))}
      </div>
    </main>
  );
}