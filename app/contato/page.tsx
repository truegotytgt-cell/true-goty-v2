'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '../../components/LanguageProvider';

export default function Contato() {
  const [copiado, setCopiado] = useState(false);
  const email = 'truegoty.tgt@gmail.com';
  const { t } = useLanguage();

  const copiarEmail = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    });
  };

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 'clamp(100px, 13vh, 140px) 1.25rem 4rem',
        backgroundColor: 'transparent',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: 'rgba(20, 20, 24, 0.9)',
          backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(176, 38, 255, 0.16), transparent 65%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderTop: '2px solid #B026FF',
          borderRadius: '0px',
          padding: 'clamp(2.2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 2.5rem)',
          textAlign: 'center',
          maxWidth: '650px',
          width: '100%',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <img
            src="/logo-tgt.png"
            alt="TGT - True GOTY"
            style={{
              height: '92px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 0 18px rgba(176, 38, 255, 0.4))',
            }}
          />
        </div>

        <div
          style={{
            display: 'inline-block',
            border: '1px solid rgba(176, 38, 255, 0.4)',
            backgroundColor: 'rgba(176, 38, 255, 0.1)',
            color: 'var(--purple-neon)',
            padding: '5px 14px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '2px',
            marginBottom: '1.1rem',
            borderRadius: '0px',
          }}
        >
          [ {t.nav_contato} ]
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 3.5rem)',
            fontWeight: 900,
            color: '#F4F4F0',
            margin: '0 0 1rem 0',
            lineHeight: 1,
            fontFamily: 'var(--font-teko)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          {t.contato_titulo}
        </h1>

        <p
          style={{
            color: '#D1D5DB',
            fontSize: '1.02rem',
            lineHeight: 1.6,
            maxWidth: '500px',
            margin: '0 auto 2.25rem auto',
          }}
        >
          {t.contato_sub}
        </p>

        <div
          style={{
            backgroundColor: 'rgba(10, 10, 12, 0.78)',
            padding: '1.4rem 1.25rem',
            marginBottom: '2rem',
            border: '1px solid rgba(176, 38, 255, 0.45)',
            borderRadius: '0px',
            position: 'relative',
          }}
        >
          <span
            style={{
              fontSize: 'clamp(1.1rem, 4.5vw, 1.5rem)',
              fontWeight: 900,
              color: '#FFF',
              letterSpacing: '0.5px',
              wordBreak: 'break-all',
            }}
          >
            {email}
          </span>
        </div>

        <button
          type="button"
          onClick={copiarEmail}
          style={{
            width: '100%',
            maxWidth: '340px',
            padding: '1rem 2rem',
            fontSize: '1.25rem',
            fontFamily: 'var(--font-teko)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: copiado ? '#D4AF37' : '#B026FF',
            color: copiado ? '#0A0A0A' : '#FFFFFF',
            borderRadius: '0px',
            border: `1px solid ${copiado ? '#F4D06F' : 'rgba(255, 255, 255, 0.18)'}`,
            cursor: 'pointer',
            fontWeight: 800,
            boxShadow: copiado ? '0 0 24px rgba(212, 175, 55, 0.45)' : '0 0 28px rgba(176, 38, 255, 0.4)',
            transition: 'all 0.25s ease',
          }}
        >
          {copiado ? t.contato_copiado : t.contato_btn}
        </button>

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ color: '#71717a', fontSize: '0.75rem', lineHeight: 1.5, margin: 0 }}>
            {t.footer_direitos}
          </p>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <Link
            href="/"
            style={{
              color: '#a1a1aa',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'color 0.2s',
            }}
          >
            {t.contato_voltar}
          </Link>
        </div>
      </motion.div>
    </main>
  );
}