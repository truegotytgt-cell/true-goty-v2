// app/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../components/LanguageProvider';

export default function Home() {
  const [votos, setVotos] = useState<number | null>(null);
  const { lang, t } = useLanguage();

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) setVotos(data.totalVoters);
      })
      .catch(() => setVotos(0));
  }, []);

  const formatarVotos = (valor: number) => {
    if (lang === 'en') return valor.toLocaleString('en-US');
    if (lang === 'es') return valor.toLocaleString('es-ES');
    return valor.toLocaleString('pt-BR');
  };

  return (
    /* Ajustei a altura para caber na tela inteira descontando o Header, e diminuí os paddings */
    <main style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      minHeight: 'calc(100vh - 80px)', textAlign: 'center', padding: '2rem 2rem 1rem 2rem', 
      boxSizing: 'border-box' 
    }}>
      
      {/* HEADLINE (Agora no topo) */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        style={{ fontSize: '4.5rem', fontWeight: 900, color: '#F4F4F0', lineHeight: 1.05, marginBottom: '1rem', textShadow: '0 4px 20px rgba(0,0,0,0.8)', letterSpacing: '-1.5px' }}
      >
        {t.home_titulo1}<br/>
        <span style={{ background: 'linear-gradient(to right, #C084FC, #B026FF, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
          {t.home_titulo2}
        </span>
      </motion.h1>

      {/* EYEBROW (Movido para baixo do Título) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.2)', padding: '6px 18px', borderRadius: '50px', marginBottom: '2rem', backdropFilter: 'blur(5px)' }}
      >
        <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          ★ A verdadeira voz da comunidade
        </span>
      </motion.div>

      {/* SUBTÍTULO (Reescrito com alma) */}
      <motion.p 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
        style={{ fontSize: '1.2rem', color: '#d4d4d8', maxWidth: '650px', marginBottom: '3rem', lineHeight: 1.6, fontWeight: 400 }}
      >
        Chega de premiações compradas e painéis desconectados. Aqui, o veredito é escrito por quem realmente joga, em confrontos diretos e implacáveis. Descubra qual jogo o mundo elegeu.
      </motion.p>

      {/* BOTÕES DIRETOS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
        style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem' }}
      >
        <Link href="/votar/tgt" style={{ 
          background: 'linear-gradient(135deg, #9333EA, #B026FF)', color: '#FFF', 
          padding: '1.1rem 2.8rem', fontSize: '1.1rem', fontWeight: 900, borderRadius: '50px', 
          textDecoration: 'none', boxShadow: '0 0 35px rgba(176, 38, 255, 0.45)', 
          border: '1px solid rgba(255,255,255,0.2)', letterSpacing: '1px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(176, 38, 255, 0.6)' }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 0 35px rgba(176, 38, 255, 0.45)' }}
        >
          {t.home_btn_votar}
        </Link>
        <button disabled style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', color: '#71717a', 
          padding: '1.1rem 2.5rem', fontSize: '1.1rem', fontWeight: 900, borderRadius: '50px', 
          border: '1px dashed rgba(255, 255, 255, 0.15)', cursor: 'not-allowed', letterSpacing: '1px',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          {t.home_btn_mercado}
        </button>
      </motion.div>

      {/* CONTADOR HALL DA FAMA */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.8, type: 'spring', bounce: 0.4 }}
        style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '1.5rem 4rem', borderRadius: '30px', backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '0.2rem' }}>
          <div style={{ height: '1px', width: '50px', background: 'linear-gradient(to right, transparent, rgba(212, 175, 55, 0.6))' }} />
          <span style={{ fontSize: '3.5rem', fontWeight: 900, color: '#FFF', textShadow: '0 0 30px rgba(176, 38, 255, 0.7)', lineHeight: 1 }}>
            {votos === null ? '...' : formatarVotos(votos)}
          </span>
          <div style={{ height: '1px', width: '50px', background: 'linear-gradient(to left, transparent, rgba(212, 175, 55, 0.6))' }} />
        </div>
        <span style={{ fontSize: '0.8rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>
          {t.home_contador}
        </span>
      </motion.div>
    </main>
  );
}