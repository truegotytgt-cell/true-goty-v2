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
      scale: 1.05, 
      opacity: 1, 
      filter: 'brightness(1.2)', 
      borderColor: '#D4AF37', 
      boxShadow: '0 0 60px rgba(212, 175, 55, 0.6), inset 0 0 50px rgba(212, 175, 55, 0.3)', 
      zIndex: 10 
    },
    loser: { 
      scale: 0.95,
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
      transition={{ type: "spring", stiffness: 200, damping: 20, mass: 1 }}
      style={{
        cursor: status === 'idle' ? 'pointer' : 'default',
        border: '2px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '1rem',
        backgroundColor: 'rgba(28, 28, 30, 0.8)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
        width: '100%',
        maxWidth: '320px', 
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ width: '100%', maxHeight: '55vh', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '12px', marginBottom: '0.5rem' }}>
        <img src={jogo.imagem} alt={jogo.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s' }} />
      </div>
      
      {/* ALTURA FIXA NO TÍTULO: Garante que todos os cards tenham o mesmo tamanho */}
      <h3 style={{ 
        fontSize: '1.1rem', 
        color: status === 'winner' ? '#D4AF37' : 'var(--text-light)', 
        fontWeight: 800, 
        transition: 'color 0.3s', 
        margin: 0, 
        height: '3.2rem', // Altura exata para 2 linhas de texto
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        lineHeight: '1.2',
        textAlign: 'center'
      }}>
        {jogo.titulo}
      </h3>

      {status === 'idle' && (
        <div style={{ position: 'absolute', top: '0', left: '0', opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div style={{ backgroundColor: 'rgba(176, 38, 255, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid #FFF', color: '#FFF', padding: '10px 30px', borderRadius: '50px', fontWeight: 900, fontSize: '1.2rem', boxShadow: '0 0 30px rgba(176, 38, 255, 0.8)', letterSpacing: '1px' }}>
            VOTAR
          </div>
        </div>
      )}
    </motion.div>
  );
}