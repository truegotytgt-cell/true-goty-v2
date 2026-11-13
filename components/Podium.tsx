// components/Podium.tsx
'use client';

import { motion } from 'framer-motion';
import jogosData from '../lib/jogos.json';

type JogoRanking = { titulo: string; pontos: number };

export default function Podium({ top3 }: { top3: JogoRanking[] }) {
  if (!top3 || top3.length < 3) return null;

  const getImagem = (titulo: string) => jogosData.top10.find(j => j.titulo === titulo)?.imagem || '';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1rem', marginBottom: '4rem', minHeight: '350px', marginTop: '2rem' }}>
      
      {/* 2º Lugar */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '180px' }}
      >
        <img src={getImagem(top3[1].titulo)} alt={top3[1].titulo} style={{ width: '120px', borderRadius: '12px', marginBottom: '1rem', border: '3px solid #c0c0c0', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }} />
        <h3 style={{ color: '#FFF', fontSize: '1rem', margin: '0 0 0.5rem 0', textAlign: 'center', minHeight: '40px' }}>{top3[1].titulo}</h3>
        <div style={{ backgroundColor: '#222', padding: '1rem', width: '100%', borderRadius: '12px 12px 0 0', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '3px solid #c0c0c0' }}>
          <span style={{ color: '#c0c0c0', fontWeight: 900, fontSize: '1.5rem' }}>2º</span>
        </div>
      </motion.div>

      {/* 1º Lugar */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '220px' }}
      >
        <img src={getImagem(top3[0].titulo)} alt={top3[0].titulo} style={{ width: '160px', borderRadius: '12px', marginBottom: '1rem', border: '3px solid var(--purple-neon)', boxShadow: '0 0 40px rgba(176, 38, 255, 0.5)' }} />
        <h3 style={{ color: 'var(--purple-neon)', fontSize: '1.2rem', fontWeight: 900, margin: '0 0 0.5rem 0', textAlign: 'center', minHeight: '40px', textShadow: '0 0 10px rgba(176, 38, 255, 0.3)' }}>{top3[0].titulo}</h3>
        <div style={{ backgroundColor: '#1a1a24', padding: '1rem', width: '100%', borderRadius: '12px 12px 0 0', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '3px solid var(--purple-neon)' }}>
          <span style={{ color: 'var(--purple-neon)', fontWeight: 900, fontSize: '2rem' }}>1º</span>
        </div>
      </motion.div>

      {/* 3º Lugar */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '180px' }}
      >
        <img src={getImagem(top3[2].titulo)} alt={top3[2].titulo} style={{ width: '120px', borderRadius: '12px', marginBottom: '1rem', border: '3px solid #cd7f32', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }} />
        <h3 style={{ color: '#FFF', fontSize: '1rem', margin: '0 0 0.5rem 0', textAlign: 'center', minHeight: '40px' }}>{top3[2].titulo}</h3>
        <div style={{ backgroundColor: '#222', padding: '1rem', width: '100%', borderRadius: '12px 12px 0 0', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '3px solid #cd7f32' }}>
          <span style={{ color: '#cd7f32', fontWeight: 900, fontSize: '1.2rem' }}>3º</span>
        </div>
      </motion.div>
    </div>
  );
}