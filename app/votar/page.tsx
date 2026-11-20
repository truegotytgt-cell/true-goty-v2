'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import jogosData from '../../lib/jogos.json';
import { useLanguage } from '../../components/LanguageProvider';

const IconTrophy = ({ color }: { color: string }) => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export default function VotarSelecao() {
  const { t } = useLanguage();
  const btnClip = 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)';

  const qtdTgt = ((jogosData as any).tgt?.top10 || []).length;
  const qtdMercado = ((jogosData as any).mercado?.top10 || []).length;
  const duelosTgt = qtdTgt > 1 ? (qtdTgt * (qtdTgt - 1)) / 2 : 0;
  const duelosMercado = qtdMercado > 1 ? (qtdMercado * (qtdMercado - 1)) / 2 : 0;

  return (
    <main
      style={{
        minHeight: 'calc(100vh - 75px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '88px 1.5rem 1.75rem',
        backgroundColor: 'transparent',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '1.4rem', width: '100%', maxWidth: '1040px' }}
      >
        <div
          style={{
            display: 'inline-block',
            border: '1px solid rgba(176, 38, 255, 0.4)',
            backgroundColor: 'rgba(176, 38, 255, 0.1)',
            color: 'var(--purple-neon)',
            padding: '4px 16px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '2.5px',
            marginBottom: '0.6rem',
            borderRadius: '0px',
          }}
        >
          {t.votar_sel_badge}
        </div>
        <h1
          style={{
            color: 'var(--text-light)',
            fontSize: 'clamp(2rem, 4.6vw, 3.6rem)',
            fontWeight: 900,
            margin: 0,
            lineHeight: 1,
            letterSpacing: '1px',
          }}
        >
          {t.votar_sel_titulo1} <span className="title-shine">{t.votar_sel_titulo2}</span>
        </h1>
        <p
          style={{
            color: '#D1D5DB',
            fontFamily: 'var(--font-teko)',
            fontSize: 'clamp(1.15rem, 2.2vw, 1.4rem)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            maxWidth: '700px',
            margin: '0.35rem auto 0',
            lineHeight: 1.1,
          }}
        >
          {t.votar_sel_sub}
        </p>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          width: '100%',
          maxWidth: '1040px',
          alignItems: 'stretch',
        }}
      >
        <Link href="/votar/tgt" style={{ textDecoration: 'none', display: 'flex' }}>
          <motion.div
            whileHover={{ scale: 1.015, y: -4 }}
            style={{
              backgroundColor: 'rgba(20, 15, 28, 0.94)',
              backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(176, 38, 255, 0.22), transparent 65%)',
              backdropFilter: 'blur(16px)',
              width: '100%',
              border: '1px solid rgba(176, 38, 255, 0.65)',
              borderRadius: '0px',
              padding: '1.6rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 16px 40px rgba(0,0,0,0.8), inset 0 0 70px rgba(176, 38, 255, 0.16)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ marginBottom: '0.8rem', filter: 'drop-shadow(0 0 16px rgba(176, 38, 255, 0.8))' }}>
              <IconTrophy color="var(--purple-neon)" />
            </div>
            <div
              style={{
                color: 'var(--purple-neon)',
                fontSize: '0.78rem',
                fontWeight: 900,
                letterSpacing: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '0.35rem',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--purple-neon)',
                  boxShadow: '0 0 12px var(--purple-neon)',
                  animation: 'pulseGlow 1.5s infinite',
                }}
              />
              {t.votar_sel_tgt_status} • {duelosTgt} {t.veredito_duelos}
            </div>
            <h2 style={{ color: '#FFF', fontSize: '2.4rem', fontWeight: 900, margin: 0, lineHeight: 1, fontFamily: 'var(--font-teko)' }}>
              {t.votar_sel_tgt_titulo} <span style={{ color: 'var(--purple-neon)' }}>{t.votar_sel_tgt_destaque}</span>
            </h2>
            <p style={{ color: '#D1D5DB', margin: '0.65rem 0 1.35rem 0', fontSize: '0.92rem', lineHeight: 1.5, maxWidth: '380px' }}>
              {t.votar_sel_tgt_desc}
            </p>
            <div style={{ marginTop: 'auto', width: '100%' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #7e22ce, #B026FF)',
                  color: '#FFF',
                  padding: '0.95rem 1.25rem',
                  clipPath: btnClip,
                  fontWeight: 900,
                  fontSize: '1.3rem',
                  boxShadow: '0 10px 35px rgba(176, 38, 255, 0.45)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontFamily: 'var(--font-teko)',
                }}
              >
                {t.votar_sel_tgt_btn}
              </div>
            </div>
          </motion.div>
        </Link>

        <Link href="/votar/mercado" style={{ textDecoration: 'none', display: 'flex' }}>
          <motion.div
            whileHover={{ scale: 1.015, y: -4 }}
            style={{
              width: '100%',
              backgroundColor: 'rgba(24, 20, 12, 0.94)',
              backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.24), transparent 65%)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(212, 175, 55, 0.65)',
              borderRadius: '0px',
              padding: '1.6rem 1.75rem',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 16px 40px rgba(0,0,0,0.8), inset 0 0 70px rgba(212, 175, 55, 0.14)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ marginBottom: '0.8rem', filter: 'drop-shadow(0 0 16px rgba(212, 175, 55, 0.7))' }}>
              <IconTrophy color="#D4AF37" />
            </div>
            <div
              style={{
                color: '#F4D06F',
                fontSize: '0.78rem',
                fontWeight: 900,
                letterSpacing: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '0.35rem',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4AF37', boxShadow: '0 0 12px #D4AF37' }} />
              {t.votar_sel_mercado_status} • {duelosMercado} {t.veredito_duelos}
            </div>
            <h2 style={{ color: '#FFF', fontSize: '2.4rem', fontWeight: 900, margin: 0, lineHeight: 1, fontFamily: 'var(--font-teko)' }}>
              {t.votar_sel_mercado_titulo} <span style={{ color: '#D4AF37' }}>{t.votar_sel_mercado_destaque}</span>
            </h2>
            <p style={{ color: '#E4E4E7', margin: '0.65rem 0 0.75rem 0', fontSize: '0.92rem', lineHeight: 1.5, maxWidth: '380px' }}>
              {t.votar_sel_mercado_desc}
            </p>
            <p
              style={{
                color: '#a1a1aa',
                fontSize: '0.73rem',
                margin: '0 0 1.15rem 0',
                lineHeight: 1.4,
                paddingTop: '0.6rem',
                borderTop: '1px solid rgba(212, 175, 55, 0.25)',
                maxWidth: '400px',
              }}
            >
              {t.votar_sel_mercado_disclaimer}
            </p>
            <div style={{ marginTop: 'auto', width: '100%' }}>
              <div
                style={{
                  padding: '0.95rem 1.25rem',
                  background: 'linear-gradient(135deg, #B8860B, #D4AF37)',
                  clipPath: btnClip,
                  color: '#0A0A0A',
                  fontWeight: 900,
                  fontSize: '1.3rem',
                  fontFamily: 'var(--font-teko)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  boxShadow: '0 10px 35px rgba(212, 175, 55, 0.4)',
                }}
              >
                {t.votar_sel_mercado_btn}
              </div>
            </div>
          </motion.div>
        </Link>
      </div>
    </main>
  );
}