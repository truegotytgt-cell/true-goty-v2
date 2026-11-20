// app/metodo/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '../../components/LanguageProvider';

export default function Metodo() {
  const { t, lang } = useLanguage();
  const isEn = lang === 'en';

  const fases = [
    {
      num: '01',
      title: t.metodo_f1_titulo,
      desc: t.metodo_f1_desc,
      accentColor: '#A1A1AA',
      glowColor: 'rgba(255, 255, 255, 0.05)',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      ),
    },
    {
      num: '02',
      title: t.metodo_f2_titulo,
      desc: t.metodo_f2_desc,
      accentColor: '#B026FF',
      glowColor: 'rgba(176, 38, 255, 0.2)',
      icon: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            color: '#B026FF',
            transform: 'skewX(-10deg)',
          }}
        >
          <span
            className="font-arena"
            style={{
              fontSize: '2.8rem',
              fontWeight: 900,
              fontStyle: 'italic',
              lineHeight: 1,
              textShadow: '0 0 15px rgba(176, 38, 255, 0.8), 0 0 30px rgba(176, 38, 255, 0.4)',
              letterSpacing: '-2px',
            }}
          >
            VS
          </span>
        </div>
      ),
    },
    {
      num: '03',
      title: t.metodo_f3_titulo,
      desc: t.metodo_f3_desc,
      accentColor: '#D4AF37',
      glowColor: 'rgba(212, 175, 55, 0.2)',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      ),
    },
  ];

  const principios = isEn
    ? [
        {
          titulo: 'Why Pairwise 1v1 Duels Eliminate Strategic Voting',
          texto:
            'In traditional single-choice polls, players often feel pressured to vote against a rival title rather than for their genuine favorite, or votes split between two similar games. By evaluating every pair head-to-head, each game is judged strictly on its own merits against every competitor.',
        },
        {
          titulo: 'How the Condorcet Winner Is Calculated',
          texto:
            'Every completed ballot generates a complete preference matrix across all matchups. A Condorcet winner is the title that defeats every other nominee in a direct majority head-to-head comparison, reflecting the broadest consensus across the entire gaming community.',
        },
        {
          titulo: 'Multi-Layer Anti-Bot Integrity',
          texto:
            'Every submission passes through Cloudflare edge security, Turnstile human verification, rate limiting, and cryptographic session deduplication before recording a single matchup in the database, ensuring that community rankings reflect real players.',
        },
      ]
    : [
        {
          titulo: 'Por que os duelos 1v1 eliminam o voto útil e a divisão de votos',
          texto:
            'Em enquetes tradicionais de escolha única, dois jogos excelentes do mesmo gênero acabam dividindo votos entre si, permitindo que um terceiro título vença sem ter a preferência da maioria. Nos confrontos diretos par a par, cada jogo é avaliado individualmente frente a frente contra todos os concorrentes.',
        },
        {
          titulo: 'Como funciona a matriz de apuração Condorcet',
          texto:
            'Cada cédula concluída alimenta uma matriz completa de confrontos diretos. O vencedor de Condorcet é o jogo capaz de derrotar todos os demais finalistas no mano a mano por maioria de preferência, representando o consenso mais sólido e justo da comunidade.',
        },
        {
          titulo: 'Auditoria e proteção contra manipulação automatizada',
          texto:
            'Antes de qualquer resultado ser gravado no banco de dados, o envio passa por verificação humana via Cloudflare Turnstile, controle de taxa por IP e deduplicação criptográfica de sessão, garantindo que o placar reflita exclusivamente jogadores reais.',
        },
      ];

  return (
    <main
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 2rem 4rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#D4AF37',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            marginBottom: '1rem',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            padding: '8px 20px',
            transform: 'skewX(-10deg)',
            borderLeft: '3px solid #D4AF37',
          }}
        >
          <span style={{ transform: 'skewX(10deg)' }}>{t.metodo_badge}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="font-arena"
          style={{
            color: 'var(--text-light)',
            fontSize: '4rem',
            fontWeight: 900,
            marginBottom: '1rem',
            lineHeight: 0.9,
            textShadow: '0 10px 30px rgba(0,0,0,0.8)',
          }}
        >
          {t.metodo_titulo}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ color: '#a1a1aa', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '650px', margin: '0 auto' }}
        >
          {t.metodo_sub}
        </motion.p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          alignItems: 'stretch',
          width: '100%',
          marginBottom: '4rem',
        }}
      >
        {fases.map((fase, index) => (
          <motion.div
            key={fase.num}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.15, duration: 0.6, ease: 'easeOut' }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <div
              style={{
                flex: 1,
                backgroundColor: '#111114',
                padding: '2rem 1.5rem',
                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                boxShadow: `inset 0 0 0 1px ${fase.accentColor}, inset 0 0 30px ${fase.glowColor}`,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span
                className="font-arena"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '15px',
                  fontSize: '8rem',
                  fontWeight: 900,
                  color: '#1a1a1f',
                  lineHeight: 0.8,
                  pointerEvents: 'none',
                  zIndex: 0,
                  textShadow: `1px 1px 0 ${fase.accentColor}40`,
                }}
              >
                {fase.num}
              </span>
              <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 1, color: fase.accentColor }}>
                {fase.icon}
              </div>
              <h2
                className="font-arena"
                style={{
                  color: 'var(--text-light)',
                  fontSize: '1.6rem',
                  marginBottom: '0.8rem',
                  fontWeight: 700,
                  position: 'relative',
                  zIndex: 1,
                  letterSpacing: '1px',
                  borderBottom: `2px solid ${fase.accentColor}40`,
                  paddingBottom: '0.3rem',
                  display: 'inline-block',
                }}
              >
                {fase.title}
              </h2>
              <p style={{ color: '#b0b0b8', lineHeight: 1.5, fontSize: '0.9rem', position: 'relative', flex: 1, zIndex: 1 }}>
                {fase.desc}
              </p>
              <div
                style={{
                  marginTop: '1.5rem',
                  width: '100%',
                  height: '2px',
                  background: `linear-gradient(to right, ${fase.accentColor}, transparent)`,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%', marginBottom: '4rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="font-arena" style={{ color: '#FFF', fontSize: '2rem', letterSpacing: '1px', margin: '0 0 0.4rem 0' }}>
            {t.metodo_arenas_titulo}
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>
            {t.metodo_arenas_sub}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div
            style={{
              backgroundColor: 'rgba(176, 38, 255, 0.05)',
              border: '1px solid rgba(176, 38, 255, 0.3)',
              padding: '2rem',
              borderRadius: '8px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#B026FF' }} />
            <h3 className="font-arena" style={{ color: '#B026FF', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              {t.metodo_m1_titulo}
            </h3>
            <p style={{ color: '#d4d4d8', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {t.metodo_m1_desc}
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              padding: '2rem',
              borderRadius: '8px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#D4AF37' }} />
            <h3 className="font-arena" style={{ color: '#D4AF37', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              {t.metodo_m2_titulo}
            </h3>
            <p style={{ color: '#d4d4d8', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {t.metodo_m2_desc}
            </p>
          </div>
        </div>
      </motion.div>

      <section style={{ width: '100%', marginBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h2 className="font-arena" style={{ color: '#D4AF37', fontSize: '2rem', letterSpacing: '1px', textAlign: 'center', marginBottom: '0.5rem' }}>
          {isEn ? 'Transparency & Voting Science' : 'Transparência e Ciência da Votação'}
        </h2>
        {principios.map((item) => (
          <article
            key={item.titulo}
            style={{
              backgroundColor: '#111114',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1.75rem',
            }}
          >
            <h3 style={{ color: '#F4F4F0', fontSize: '1.15rem', fontWeight: 700, marginTop: 0, marginBottom: '0.6rem' }}>
              {item.titulo}
            </h3>
            <p style={{ color: '#b0b0b8', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>
              {item.texto}
            </p>
          </article>
        ))}
      </section>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%' }}
      >
        <div>
          <Link href="/votar/tgt" className="btn-arena" style={{ padding: '1.2rem 4rem', fontSize: '1.5rem' }}>
            {t.metodo_cta}
          </Link>
        </div>

        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '1.5rem',
            border: '1px dashed rgba(255,255,255,0.2)',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.02)',
          }}
        >
          <p style={{ color: '#71717a', fontSize: '0.75rem', lineHeight: 1.5, margin: 0 }}>
            {t.footer_direitos}
          </p>
        </div>
      </motion.div>
    </main>
  );
}