// components/CardDuelo.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Jogo } from '../lib/condorcet';

type Props = {
  jogo: Jogo;
  onClick: () => void;
  status?: 'idle' | 'winner' | 'loser';
};

export default function CardDuelo({ jogo, onClick, status = 'idle' }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const variantes = {
    idle: { 
      scale: isHovered ? 1.03 : 1, 
      opacity: 1, 
      filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
      borderColor: isHovered ? 'var(--purple-neon)' : 'rgba(255,255,255,0.1)',
      boxShadow: isHovered ? '0 0 30px rgba(176, 38, 255, 0.4), inset 0 0 50px rgba(176, 38, 255, 0.2)' : 'none' 
    },
    winner: { 
      scale: 1.08, // Aumento um pouco maior para dar impacto
      opacity: 1, 
      filter: 'brightness(1.2)', 
      borderColor: '#D4AF37', // Borda dourada para o vencedor (premiação)
      boxShadow: '0 0 60px rgba(212, 175, 55, 0.6), inset 0 0 50px rgba(212, 175, 55, 0.3)', 
      zIndex: 10 
    },
    loser: { 
      scale: 0.92,
      opacity: 0.3, 
      filter: 'grayscale(100%) brightness(0.5)', 
      borderColor: 'transparent', 
      boxShadow: 'none' 
    }
  };

  return (
    <motion.div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={status}
      variants={variantes}
      // AQUI ESTÁ A MÁGICA DA SUAVIDADE (Spring)
      transition={{ type: "spring", stiffness: 120, damping: 15, mass: 1 }}
      style={{
        cursor: status === 'idle' ? 'pointer' : 'default',
        border: '2px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '1rem',
        backgroundColor: 'rgba(28, 28, 30, 0.8)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
        width: '100%',
        maxWidth: '340px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '12px', marginBottom: '1rem' }}>
        <img src={jogo.imagem} alt={jogo.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s' }} />
      </div>
      <h3 style={{ fontSize: '1.2rem', color: status === 'winner' ? '#D4AF37' : 'var(--text-light)', fontWeight: 800, transition: 'color 0.3s' }}>
        {jogo.titulo}
      </h3>

      {status === 'idle' && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <div style={{ backgroundColor: 'rgba(176, 38, 255, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid #FFF', color: '#FFF', padding: '12px 40px', borderRadius: '50px', fontWeight: 900, fontSize: '1.2rem', boxShadow: '0 0 30px rgba(176, 38, 255, 0.8)', letterSpacing: '1px' }}>
            VOTAR
          </div>
        </div>
      )}
    </motion.div>
  );
}