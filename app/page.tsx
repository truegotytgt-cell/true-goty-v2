// app/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../components/LanguageProvider';

export default function Home() {
  const [votos, setVotos] = useState<number | null>(null);
  const { lang } = useLanguage();

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
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: 'clamp(96px, 13vh, 130px) 1.25rem 3.5rem 1.25rem',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      {/* TÍTULO PRINCIPAL */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          fontSize: 'clamp(2.6rem, 10vw, 5rem)',
          fontWeight: 900,
          color: '#F4F4F0',
          lineHeight: 0.92,
          margin: '0 0 1.5rem 0',
          letterSpacing: '0px',
          textShadow: '0 10px 30px rgba(0,0,0,0.8)',
          maxWidth: '100%',
        }}
      >
        QUEM É O VERDADEIRO
        <br />
        <span className="title-shine" style={{ fontSize: '1.1em', display: 'inline-block' }}>
          GAME OF THE YEAR?
        </span>
      </motion.h1>

      {/* SELO / BADGE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          backgroundColor: 'rgba(176, 38, 255, 0.1)',
          border: '1px solid rgba(176, 38, 255, 0.4)',
          padding: '8px 20px',
          marginBottom: '1.75rem',
          transform: 'skewX(-10deg)',
          maxWidth: '92%',
          boxSizing: 'border-box',
        }}
      >
        <span
          style={{
            color: '#D4AF37',
            fontSize: 'clamp(0.75rem, 2.8vw, 0.9rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            transform: 'skewX(10deg)',
          }}
        >
          SEM JÚRI DE GABINETE • 100% VOTO GAMER
        </span>
      </motion.div>

      {/* TEXTO DE APOIO */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{
          fontSize: 'clamp(0.98rem, 3.6vw, 1.1rem)',
          color: '#a1a1aa',
          maxWidth: '600px',
          margin: '0 0 clamp(2rem, 5vh, 3.2rem) 0',
          lineHeight: 1.6,
          fontWeight: 400,
        }}
      >
        Chega de premiações de fachada. Aqui, os maiores jogos do ano se enfrentam em duelos 1v1 implacáveis até sobrar apenas um campeão. Quem leva a coroa?
      </motion.p>

      {/* BOTÕES DE AÇÃO + MICRO-LEGENDA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: 'clamp(2.5rem, 6.5vh, 4.5rem)',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '1.25rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Link href="/votar/tgt" className="btn-arena">
            ENTRAR NA ARENA TGT
          </Link>

          <Link href="/votar/mercado" className="btn-mercado">
            ARENA INDICADOS TGA
          </Link>
        </div>

        <p
          style={{
            fontSize: '0.78rem',
            color: '#71717a',
            maxWidth: '520px',
            margin: '0.25rem auto 0',
            lineHeight: 1.45,
          }}
        >
          Sem vínculo oficial com o The Game Awards. Ambas as arenas têm placar próprio com a voz da comunidade gamer — sem representar os vencedores oficiais do prêmio.
        </p>
      </motion.div>

      {/* PLACAR / CONTADOR */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.8, type: 'spring', bounce: 0.4 }}
        className="hud-placar"
      >
        <div className="hud-placar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 4vw, 2rem)', marginBottom: '0.5rem' }}>
            <div style={{ height: '2px', width: '36px', background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
            <span
              className="font-arena"
              style={{
                fontSize: 'clamp(2.8rem, 11vw, 4rem)',
                color: '#FFF',
                textShadow: '0 0 20px rgba(176, 38, 255, 0.8)',
                lineHeight: 0.9,
                letterSpacing: '2px',
              }}
            >
              {votos === null ? '...' : formatarVotos(votos)}
            </span>
            <div style={{ height: '2px', width: '36px', background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
          </div>
          <span
            style={{
              fontSize: 'clamp(0.68rem, 2.5vw, 0.8rem)',
              color: '#a1a1aa',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              fontWeight: 600,
            }}
          >
            VEREDITOS REGISTRADOS NA ARENA
          </span>
        </div>
      </motion.div>
    </main>
  );
}