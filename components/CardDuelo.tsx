// components/CardDuelo.tsx
'use client';

import { motion } from 'framer-motion';
import { Jogo } from '../lib/condorcet';

type Props = {
  jogo: Jogo;
  onClick: () => void;
  status?: 'idle' | 'winner' | 'loser';
  isHovered: boolean;
  isOpponentHovered: boolean;
  onHover: (hovering: boolean) => void;
};

export default function CardDuelo({ jogo, onClick, status = 'idle', isHovered, isOpponentHovered, onHover }: Props) {
  const isWinner = status === 'winner';
  const isLoser = status === 'loser';
  const isIdle = status === 'idle';

  const baseScale = isWinner ? 1.05 : isLoser ? 0.85 : (isHovered && isIdle ? 1.03 : 1);

  // Definindo as sombras aqui
  let boxShadow = '0 10px 30px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.1)';
  if (isWinner) {
    boxShadow = '0 0 40px #FFFFFF, 0 0 80px #FFD700, 0 0 100px rgba(255, 215, 0, 0.5), inset 0 0 0 4px #FFD700';
  } else if (isHovered && isIdle) {
    boxShadow = '0 0 30px rgba(176, 38, 255, 0.8), inset 0 0 0 3px #B026FF';
  }

  return (
    <motion.div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onClick}
      animate={{
        scale: baseScale,
        opacity: isLoser ? 0.2 : 1,
        filter: isLoser ? 'grayscale(100%) blur(4px) brightness(0.3)' : 'grayscale(0%) blur(0px) brightness(1)',
      }}
      // A transição do Framer Motion agora cuida apenas de escala e opacidade
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '3 / 4',
        cursor: isIdle ? 'pointer' : 'default',
        zIndex: isWinner ? 20 : isHovered ? 10 : 1,
        backgroundColor: '#111114',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        boxShadow: boxShadow,
        // ESTA LINHA RESOLVE O ATRASO DO HOVER:
        transition: 'box-shadow 0.15s ease-out', 
      }}
    >
      <img 
        src={jogo.imagem} 
        alt={jogo.titulo} 
        style={{ 
          position: 'absolute', inset: 0, width: '100%', height: '100%', 
          objectFit: 'cover', zIndex: 1,
          transition: 'transform 0.4s ease',
          transform: isHovered && isIdle ? 'scale(1.08)' : 'scale(1)'
        }} 
      />

      <div style={{ 
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'linear-gradient(to top, rgba(5, 5, 8, 1) 0%, rgba(5, 5, 8, 0.8) 25%, transparent 60%)' 
      }} />

      <div style={{ position: 'relative', zIndex: 3, padding: '1.5rem 1rem', textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        
        {isWinner && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 900, letterSpacing: '3px', marginBottom: '0.5rem', textShadow: '0 0 10px #FFD700, 0 0 20px #FFD700' }}>
            ★ VEREDITO SELADO ★
          </motion.div>
        )}

        <h2 style={{ 
          color: '#FFF', fontSize: 'clamp(1.2rem, 2vw, 1.7rem)', fontWeight: 900, margin: 0, lineHeight: 1.1, 
          fontFamily: 'var(--font-teko)', textTransform: 'uppercase', textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          wordBreak: 'break-word'
        }}>
          {jogo.titulo}
        </h2>
        
        <div style={{ height: '28px', marginTop: '0.5rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isHovered && isIdle ? (
            <div style={{ color: '#FFF', backgroundColor: 'var(--purple-neon)', padding: '4px 15px', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', borderRadius: '4px', boxShadow: '0 0 15px var(--purple-neon)' }}>
              ESCOLHER ESTE
            </div>
          ) : (
            <div style={{ color: isWinner ? '#FFD700' : '#71717a', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
              {isWinner ? 'SELADO' : isLoser ? 'ELIMINADO' : 'DESAFIANTE'}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}