'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '../../components/LanguageProvider';

export default function Sobre() {
  const { t } = useLanguage();
  const [copiado, setCopiado] = useState(false);

  const copiarEmail = () => {
    navigator.clipboard.writeText('truegoty.tgt@gmail.com');
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <main
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '140px 2rem 4rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'start' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'linear-gradient(to bottom, transparent, #D4AF37, transparent)' }} />
          <div style={{ paddingLeft: '2rem' }}>
            <div style={{ color: 'var(--purple-neon)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', marginBottom: '1rem' }}>
              {t.sobre_badge}
            </div>
            <img
              src="/logo-tgt.png"
              alt="TGT - True GOTY"
              style={{
                height: '110px',
                width: 'auto',
                objectFit: 'contain',
                marginBottom: '1.5rem',
                display: 'block',
                filter: 'drop-shadow(0 0 20px rgba(176, 38, 255, 0.35))',
              }}
            />
            <h1 style={{ color: '#F4F4F0', fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '1.5rem', fontFamily: 'var(--font-teko)', textTransform: 'uppercase' }}>
              {t.sobre_h1_1}
              <br />
              {t.sobre_h1_2}
              <br />
              <span style={{ color: 'var(--purple-neon)' }}>{t.sobre_h1_3}</span>
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 500 }}>
              {t.sobre_sub}
            </p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ color: '#D4AF37', fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-teko)', letterSpacing: '1px', marginBottom: '0.5rem' }}>
              01
            </div>
            <p style={{ color: '#D1D5DB', lineHeight: 1.7, fontSize: '1rem', margin: 0 }}>
              {t.sobre_p1}
            </p>
          </div>
          <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ color: '#D4AF37', fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-teko)', letterSpacing: '1px', marginBottom: '0.5rem' }}>
              02
            </div>
            <p style={{ color: '#D1D5DB', lineHeight: 1.7, fontSize: '1rem', margin: 0 }}>
              {t.sobre_p2}
            </p>
          </div>
          <div style={{ paddingBottom: '1.5rem' }}>
            <div style={{ color: '#D4AF37', fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-teko)', letterSpacing: '1px', marginBottom: '0.5rem' }}>
              03
            </div>
            <p style={{ color: '#D1D5DB', lineHeight: 1.7, fontSize: '1rem', margin: 0 }}>
              {t.sobre_p3}
            </p>
          </div>

          <button
            type="button"
            onClick={copiarEmail}
            style={{
              marginTop: '1rem',
              backgroundColor: 'rgba(20, 20, 24, 0.85)',
              backdropFilter: 'blur(10px)',
              padding: '1.5rem',
              borderRadius: '0px',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <p style={{ fontWeight: 800, color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              {t.sobre_contato_label}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple-neon)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: copiado ? '#25D366' : 'var(--purple-neon)', transition: 'color 0.2s' }}>
                {copiado ? t.sobre_copiado : 'truegoty.tgt@gmail.com'}
              </span>
            </div>
          </button>
        </motion.div>
      </div>

      <div style={{ marginTop: '4rem', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <p style={{ color: '#71717a', fontSize: '0.8rem', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto' }}>
          {t.footer_direitos}
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link href="/votar/tgt" className="btn-arena" style={{ display: 'inline-block', padding: '1.2rem 3rem', fontSize: '1.2rem' }}>
          {t.sobre_cta}
        </Link>
      </motion.div>
    </main>
  );
}