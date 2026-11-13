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
    idle: { scale: 1, opacity: 1, filter: 'grayscale(0%)', borderColor: 'var(--border-color)', boxShadow: 'none' },
    winner: { scale: 1.05, opacity: 1, filter: 'grayscale(0%)', borderColor: 'var(--purple-neon)', boxShadow: '0 0 40px rgba(176, 38, 255, 0.7)', zIndex: 10 },
    loser: { scale: 0.95, opacity: 0.3, filter: 'grayscale(100%)', borderColor: 'transparent', boxShadow: 'none' }
  };

  return (
    <motion.div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={status}
      variants={variantes}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        cursor: status === 'idle' ? 'pointer' : 'default',
        border: '2px solid var(--border-color)',
        borderRadius: '12px',
        padding: '1rem',
        backgroundColor: 'var(--bg-gray)',
        textAlign: 'center',
        width: '300px',
        position: 'relative',
        overflow: 'hidden' // Garante que o overlay não vaze
      }}
    >
      <img 
        src={jogo.imagem} 
        alt={jogo.titulo} 
        style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem', filter: isHovered && status === 'idle' ? 'brightness(0.7)' : 'none', transition: 'filter 0.3s' }} 
      />
      <h3 style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>{jogo.titulo}</h3>

      {/* Botão VOTAR que aparece no Hover */}
      {status === 'idle' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%'
        }}>
          <div style={{
            backgroundColor: 'var(--purple-neon)',
            color: '#FFF',
            padding: '10px 30px',
            borderRadius: '30px',
            fontWeight: 900,
            fontSize: '1.2rem',
            boxShadow: '0 0 20px rgba(176, 38, 255, 0.8)'
          }}>
            VOTAR
          </div>
        </div>
      )}
    </motion.div>
  );
}