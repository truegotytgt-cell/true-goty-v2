// app/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [votos, setVotos] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) setVotos(data.totalVoters);
      })
      .catch(() => setVotos(0));
  }, []);

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '85vh', textAlign: 'center', padding: '2rem' }}>
      
      {/* EYEBROW (Pré-título) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '6px 16px', borderRadius: '50px', marginBottom: '2rem' }}
      >
        <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em' }}>
          ★ A Verdadeira Escolha da Comunidade
        </span>
      </motion.div>

      {/* HEADLINE */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
        style={{ fontSize: '4rem', fontWeight: 900, color: '#F4F4F0', lineHeight: 1.1, marginBottom: '1.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
      >
        QUAL É O VERDADEIRO<br/>
        <span style={{ background: 'linear-gradient(to right, #C084FC, #B026FF, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          GAME OF THE YEAR?
        </span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
        style={{ fontSize: '1.2rem', color: '#a1a1aa', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}
      >
        Escolhas frente a frente garantem que o jogo mais amado vença, sem empates. 
        Sua voz importa: descubra qual título realmente marcou a comunidade.
      </motion.p>

      {/* BOTÕES DIRETOS (Sem caixa) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
        style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem' }}
      >
        <Link href="/votar/tgt" style={{ 
          background: 'linear-gradient(to right, #9333EA, #B026FF)', color: '#FFF', 
          padding: '1.2rem 2.5rem', fontSize: '1.1rem', fontWeight: 900, borderRadius: '50px', 
          textDecoration: 'none', boxShadow: '0 0 35px rgba(176, 38, 255, 0.45)', 
          border: '1px solid rgba(255,255,255,0.2)', letterSpacing: '1px', transition: 'transform 0.2s' 
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          COMEÇAR A VOTAR
        </Link>
        <button disabled style={{ 
          backgroundColor: 'rgba(28, 28, 30, 0.6)', backdropFilter: 'blur(10px)', color: '#a1a1aa', 
          padding: '1.2rem 2.5rem', fontSize: '1.1rem', fontWeight: 900, borderRadius: '50px', 
          border: '1px solid rgba(255,255,255,0.1)', cursor: 'not-allowed', letterSpacing: '1px' 
        }}>
          COMPARATIVO MERCADO (EM BREVE)
        </button>
      </motion.div>

      {/* CONTADOR HALL DA FAMA */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '0.5rem' }}>
          <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to right, transparent, rgba(212, 175, 55, 0.5))' }} />
          <span style={{ fontSize: '3.5rem', fontWeight: 900, color: '#FFF', textShadow: '0 0 20px rgba(176, 38, 255, 0.6)' }}>
            {votos === null ? '...' : votos.toLocaleString('pt-BR')}
          </span>
          <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to left, transparent, rgba(212, 175, 55, 0.5))' }} />
        </div>
        <span style={{ fontSize: '0.8rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>
          Jogadores já definiram seu veredito oficial
        </span>
      </motion.div>
    </main>
  );
}