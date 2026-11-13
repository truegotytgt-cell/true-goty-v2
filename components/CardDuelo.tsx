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
      scale: isHovered ? 1.02 : 1, 
      opacity: 1, 
      filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
      borderColor: isHovered ? 'var(--purple-neon)' : 'var(--border-color)',
      // AQUI ESTÁ O GLOW INTERNO (inset) E EXTERNO
      boxShadow: isHovered ? '0 0 30px rgba(176, 38, 255, 0.4), inset 0 0 50px rgba(176, 38, 255, 0.2)' : 'none' 
    },
    winner: { 
      scale: 1.05, // Reduzido para não tampar a tela
      opacity: 1, 
      filter: 'brightness(1.15)', 
      borderColor: 'var(--purple-neon)', 
      boxShadow: '0 0 50px rgba(176, 38, 255, 0.7), inset 0 0 60px rgba(176, 38, 255, 0.4)', 
      zIndex: 10 
    },
    loser: { 
      scale: 0.95, // Encolhe suavemente
      opacity: 0.2, 
      filter: 'grayscale(100%) brightness(0.6)', 
      borderColor: 'transparent', 
      boxShadow: 'none' 
    }
  };

  return (
    <motion.div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={status === 'idle' ? (isHovered ? 'idle' : 'idle') : status}
      variants={variantes}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        cursor: status === 'idle' ? 'pointer' : 'default',
        border: '2px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1rem',
        backgroundColor: 'var(--bg-gray)',
        textAlign: 'center',
        width: '320px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <img 
        src={jogo.imagem} 
        alt={jogo.titulo} 
        style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem', transition: 'all 0.3s' }} 
      />
      <h3 style={{ fontSize: '1.3rem', color: 'var(--text-light)', fontWeight: 900 }}>{jogo.titulo}</h3>

      {status === 'idle' && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <div style={{ backgroundColor: 'rgba(176, 38, 255, 0.9)', backdropFilter: 'blur(8px)', border: '2px solid #FFF', color: '#FFF', padding: '12px 40px', borderRadius: '50px', fontWeight: 900, fontSize: '1.4rem', boxShadow: '0 0 30px rgba(176, 38, 255, 0.8)', letterSpacing: '2px' }}>
            VOTAR
          </div>
        </div>
      )}
    </motion.div>
  );
}