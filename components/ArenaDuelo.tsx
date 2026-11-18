// components/ArenaDuelo.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardDuelo from './CardDuelo';
import { Jogo } from '../lib/condorcet';

type Props = {
  duelo: { jogo1: Jogo; jogo2: Jogo };
  animacao: { jogo1: 'idle' | 'winner' | 'loser'; jogo2: 'idle' | 'winner' | 'loser' };
  dueloAtual: number;
  totalDuelos: number;
  categoria: string;
  progressoPorcentagem: number;
  enviando: boolean;
  onVoto: (vencedor: Jogo, perdedor: Jogo, jogo1Venceu: boolean) => void;
  onDesfazer: () => void;
  onTrocarArena: () => void;
};

export default function ArenaDuelo({
  duelo, animacao, dueloAtual, totalDuelos, categoria, progressoPorcentagem, enviando, onVoto, onDesfazer, onTrocarArena
}: Props) {
  
  const [hoveredCard, setHoveredCard] = useState<'jogo1' | 'jogo2' | null>(null);
  const isVoting = animacao.jogo1 !== 'idle' || animacao.jogo2 !== 'idle';

  const btnTopoStyle = {
    backgroundColor: 'transparent',
    color: '#a1a1aa',
    border: 'none',
    cursor: enviando ? 'not-allowed' : 'pointer',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    transition: 'all 0.2s',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    fontFamily: 'var(--font-teko)',
    padding: '0.5rem'
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '80px 1rem 1rem', overflow: 'hidden', backgroundColor: 'transparent' }}>
      
      <div style={{ position: 'absolute', top: '80px', left: '0', width: '100%', padding: '0 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 }}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button onClick={onTrocarArena} disabled={enviando} style={btnTopoStyle} onMouseOver={(e) => e.currentTarget.style.color = '#FFF'} onMouseOut={(e) => e.currentTarget.style.color = '#a1a1aa'}>
            ← TROCAR ARENA
          </button>
          
          {dueloAtual > 0 && (
            <button onClick={onDesfazer} disabled={enviando} style={btnTopoStyle} onMouseOver={(e) => e.currentTarget.style.color = 'var(--purple-neon)'} onMouseOut={(e) => e.currentTarget.style.color = '#a1a1aa'}>
              ↺ DESFAZER VOTO
            </button>
          )}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '1300px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem', zIndex: 10 }}>
        <h1 style={{ color: '#FFF', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, margin: 0, fontFamily: 'var(--font-teko)', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center' }}>
          QUAL O SEU <span className="title-shine">TRUE GOTY</span>?
        </h1>
        
        <div style={{ width: '100%', maxWidth: '800px', marginTop: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px', marginBottom: '0.4rem', fontFamily: 'var(--font-teko)' }}>
            <span>CONFRONTO {String(dueloAtual + 1).padStart(2, '0')} / {totalDuelos}</span>
            <span>ARENA TRUE GOTY</span>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: '#111114', borderRadius: '4px', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8)' }}>
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${progressoPorcentagem}%` }} 
              transition={{ type: 'spring', stiffness: 50, damping: 20 }} 
              style={{ 
                height: '100%', 
                background: 'linear-gradient(90deg, #7e22ce, #B026FF, #D4AF37)',
                boxShadow: '0 0 15px rgba(176, 38, 255, 0.8)'
              }} 
            />
          </div>
        </div>
      </div>
      
      {/* ARENA GRID */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'minmax(0, 1fr) 180px minmax(0, 1fr)', 
        alignItems: 'center', 
        width: '100%', 
        maxWidth: '1400px', 
        flex: 1, 
        minHeight: 0,
        gap: '1rem'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={`jogo1-${dueloAtual}`}
              initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}
              style={{ width: '100%', maxWidth: '400px' }}
            >
              <CardDuelo 
                jogo={duelo.jogo1} 
                status={animacao.jogo1} 
                isHovered={hoveredCard === 'jogo1'}
                isOpponentHovered={hoveredCard === 'jogo2'}
                onHover={(h) => setHoveredCard(h ? 'jogo1' : null)}
                onClick={() => onVoto(duelo.jogo1, duelo.jogo2, true)} 
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* VS REFINADO */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative' }}>
          
          {/* Linha Superior (Para onde o VS começa) */}
          <div style={{ 
            position: 'absolute', top: 0, bottom: '50%', width: '2px', 
            background: 'linear-gradient(to bottom, transparent, rgba(176, 38, 255, 0.4))',
            zIndex: 1
          }} />

          {/* Linha Inferior (Para onde o VS termina) */}
          <div style={{ 
            position: 'absolute', top: '50%', bottom: 0, width: '2px', 
            background: 'linear-gradient(to top, transparent, rgba(212, 175, 55, 0.4))',
            zIndex: 1
          }} />

          {/* O "VS" Central */}
          <motion.div 
            animate={{ 
              scale: isVoting ? 1.15 : 1,
            }}
            transition={{ duration: 0.3, type: 'spring' }}
            style={{ 
              position: 'relative', zIndex: 2, 
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              // Fundo escuro para "cortar" a linha atrás dele
              backgroundColor: '#0A0A0A',
              padding: '1.5rem 0'
            }}
          >
            <span style={{ 
              color: '#FFF', 
              fontSize: '4.5rem', 
              fontWeight: 900, 
              fontFamily: 'var(--font-teko)', 
              lineHeight: 0.8, 
              letterSpacing: '-1px',
              background: 'linear-gradient(180deg, #FFFFFF 20%, #B026FF 50%, #FFD700 80%)',
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              // Glow mais elegante e menos estourado
              filter: isVoting 
                ? 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.8))' 
                : 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
            }}>
              VS
            </span>
          </motion.div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={`jogo2-${dueloAtual}`}
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}
              style={{ width: '100%', maxWidth: '400px' }}
            >
              <CardDuelo 
                jogo={duelo.jogo2} 
                status={animacao.jogo2} 
                isHovered={hoveredCard === 'jogo2'}
                isOpponentHovered={hoveredCard === 'jogo1'}
                onHover={(h) => setHoveredCard(h ? 'jogo2' : null)}
                onClick={() => onVoto(duelo.jogo2, duelo.jogo1, false)} 
              />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      <div style={{ marginTop: '1.5rem', zIndex: 10 }}>
        <span style={{ color: '#71717a', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-teko)', letterSpacing: '1px' }}>
          <kbd style={{ backgroundColor: '#1a1a24', border: '1px solid #333', borderBottom: '2px solid #555', borderRadius: '4px', padding: '2px 10px', color: '#FFF', fontFamily: 'monospace', fontSize: '1rem' }}>←</kbd> 
          OU 
          <kbd style={{ backgroundColor: '#1a1a24', border: '1px solid #333', borderBottom: '2px solid #555', borderRadius: '4px', padding: '2px 10px', color: '#FFF', fontFamily: 'monospace', fontSize: '1rem' }}>→</kbd> 
          PARA DECIDIR MAIS RÁPIDO
        </span>
      </div>

    </main>
  );
}