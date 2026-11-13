// components/Podium.tsx
'use client';

import { motion } from 'framer-motion';
import jogosData from '../lib/jogos.json';

type JogoRanking = { titulo: string; pontos: number };

export default function Podium({ top3 }: { top3: JogoRanking[] }) {
  if (!top3 || top3.length < 3) return null;

  const getImagem = (titulo: string) => jogosData.top10.find(j => j.titulo === titulo)?.imagem || '';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1rem', marginBottom: '4rem', minHeight: '400px', marginTop: '2rem' }}>
      
      {/* 2º Lugar (Platina) */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '180px' }}
      >
        <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '12px', marginBottom: '1rem', border: '2px solid rgba(226, 232, 240, 0.4)', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
          <img src={getImagem(top3[1].titulo)} alt={top3[1].titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h3 style={{ color: '#E2E8F0', fontSize: '1rem', margin: '0 0 0.5rem 0', textAlign: 'center', minHeight: '40px' }}>{top3[1].titulo}</h3>
        <div style={{ background: 'linear-gradient(to bottom, rgba(226,232,240,0.15), #12141C)', padding: '1rem', width: '100%', borderRadius: '12px 12px 0 0', height: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: '2px solid rgba(226, 232, 240, 0.4)' }}>
          <span style={{ color: '#E2E8F0', fontWeight: 900, fontSize: '1.5rem' }}>2º</span>
          <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>{top3[1].pontos} PTS</span>
        </div>
      </motion.div>

      {/* 1º Lugar (Ouro) */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '220px' }}
      >
        <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '12px', marginBottom: '1rem', border: '2px solid #D4AF37', boxShadow: '0 0 50px rgba(212, 175, 55, 0.4)' }}>
          <img src={getImagem(top3[0].titulo)} alt={top3[0].titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h3 style={{ color: '#D4AF37', fontSize: '1.2rem', fontWeight: 900, margin: '0 0 0.5rem 0', textAlign: 'center', minHeight: '40px', textShadow: '0 0 10px rgba(212, 175, 55, 0.4)' }}>{top3[0].titulo}</h3>
        <div style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.25), #17130A)', padding: '1rem', width: '100%', borderRadius: '12px 12px 0 0', height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: '2px solid #D4AF37' }}>
          <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: '2.5rem', textShadow: '0 0 20px rgba(212, 175, 55, 0.5)' }}>1º</span>
          <span style={{ fontSize: '1rem', color: '#FFF', fontWeight: 'bold' }}>{top3[0].pontos} PTS</span>
        </div>
      </motion.div>

      {/* 3º Lugar (Bronze) */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '180px' }}
      >
        <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '12px', marginBottom: '1rem', border: '2px solid rgba(205, 127, 50, 0.5)', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
          <img src={getImagem(top3[2].titulo)} alt={top3[2].titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h3 style={{ color: '#CD7F32', fontSize: '1rem', margin: '0 0 0.5rem 0', textAlign: 'center', minHeight: '40px' }}>{top3[2].titulo}</h3>
        <div style={{ background: 'linear-gradient(to bottom, rgba(205,127,50,0.2), #18110B)', padding: '1rem', width: '100%', borderRadius: '12px 12px 0 0', height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: '2px solid rgba(205, 127, 50, 0.5)' }}>
          <span style={{ color: '#CD7F32', fontWeight: 900, fontSize: '1.5rem' }}>3º</span>
          <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>{top3[2].pontos} PTS</span>
        </div>
      </motion.div>
    </div>
  );
}