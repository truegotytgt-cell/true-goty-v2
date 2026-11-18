// app/resultados/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// ÍCONES SVG (desenhados no estilo TGT — traço fino, sem emoji)
// ─────────────────────────────────────────────────────────────────────────────

const IconCoroa = () => (
  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="gradCoroa" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#D4AF37" />
      </linearGradient>
    </defs>
    <path
      d="M8 22 L20 34 L32 14 L44 34 L56 22 L50 48 L14 48 Z"
      stroke="url(#gradCoroa)"
      strokeWidth="2.5"
      strokeLinejoin="round"
      fill="rgba(168, 85, 247, 0.1)"
    />
    <path d="M14 48 L50 48 L46 56 L18 56 Z" fill="#D4AF37" opacity="0.9" />
    <circle cx="32" cy="12" r="3" fill="#D4AF37" />
    <circle cx="8" cy="22" r="2.5" fill="#A855F7" />
    <circle cx="56" cy="22" r="2.5" fill="#A855F7" />
  </svg>
);

const IconMonolito = () => (
  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
    <polygon
      points="32,4 56,18 56,46 32,60 8,46 8,18"
      stroke="#9CA3AF"
      strokeWidth="2.5"
      strokeLinejoin="round"
      fill="rgba(156, 163, 175, 0.05)"
    />
    <polygon
      points="32,16 44,23 44,37 32,44 20,37 20,23"
      fill="#9CA3AF"
      opacity="0.35"
    />
    <path d="M32 22 L32 38 M24 30 L40 30" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconGlobo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconPodium = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// PÁGINA
// ─────────────────────────────────────────────────────────────────────────────

type Categoria = 'tgt' | 'mercado';
type StatusVeredito = 'concluido' | 'pendente';

export default function Resultados() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | null>(null);
  const [votosPorCategoria, setVotosPorCategoria] = useState<{ tgt: number; mercado: number }>({ tgt: 0, mercado: 0 });
  const [statusVeredito, setStatusVeredito] = useState<{ tgt: StatusVeredito; mercado: StatusVeredito }>({
    tgt: 'pendente',
    mercado: 'pendente',
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/stats?category=tgt').then((r) => r.json()).catch(() => ({ totalVoters: 0 })),
      fetch('/api/stats?category=mercado').then((r) => r.json()).catch(() => ({ totalVoters: 0 })),
    ]).then(([tgt, mercado]) => {
      setVotosPorCategoria({
        tgt: tgt?.totalVoters || 0,
        mercado: mercado?.totalVoters || 0,
      });
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checar = (cat: Categoria): StatusVeredito => {
      const votou = localStorage.getItem(`tgt_has_voted_${cat}`) === 'true';
      const temRanking = !!localStorage.getItem(`tgt_my_ranking_${cat}`);
      return votou || temRanking ? 'concluido' : 'pendente';
    };
    setStatusVeredito({ tgt: checar('tgt'), mercado: checar('mercado') });
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        // 🔥 CORREÇÃO AQUI: paddingTop ajustado para 120px (igual Indicados) e centralização vertical removida
        padding: '120px 2rem 4rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start', 
      }}
    >
      <style>{`
        .arena-card {
          clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
          position: relative;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2), box-shadow 0.35s ease;
        }
        .arena-card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          z-index: 1;
        }
        .arena-card-tgt::before { background: radial-gradient(circle at 30% 0%, rgba(168, 85, 247, 0.25), transparent 60%); }
        .arena-card-mercado::before { background: radial-gradient(circle at 30% 0%, rgba(229, 231, 235, 0.15), transparent 60%); }
        .arena-card:hover::before { opacity: 1; }
        .arena-card-tgt:hover { transform: translateY(-6px) scale(1.015); box-shadow: 0 25px 60px -15px rgba(168, 85, 247, 0.6); }
        .arena-card-mercado:hover { transform: translateY(-6px) scale(1.015); box-shadow: 0 25px 60px -15px rgba(229, 231, 235, 0.25); }
        .menu-card {
          clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .menu-card:hover { transform: translateY(-3px); }
        .grid-categorias {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.5rem;
          width: 100%;
          max-width: 900px;
        }
        @media (max-width: 720px) {
          .grid-categorias { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* CABEÇALHO (Agora fica fixo no topo) */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', width: '100%', maxWidth: '900px' }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'inline-block',
            color: '#D4AF37',
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
            padding: '8px 18px',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            backgroundColor: 'rgba(212, 175, 55, 0.05)',
          }}
        >
          [ APURAÇÃO OFICIAL // TEMPORADA 2026 ]
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            color: 'var(--text-light)',
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            letterSpacing: '-1px',
            marginBottom: '0.8rem',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          A HORA DA <span style={{ color: 'var(--purple-neon)' }}>VERDADE</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{ color: '#a1a1aa', fontSize: '1rem', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}
        >
          Os duelos foram travados. Escolha a arena e confira quem sobreviveu ao veredito matemático.
        </motion.p>
      </div>

      {/* ETAPA 1: SELEÇÃO DE ARENA */}
      {!categoriaSelecionada && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid-categorias"
        >
          {/* Card TRUE GOTY */}
          <button
            onClick={() => setCategoriaSelecionada('tgt')}
            className="arena-card arena-card-tgt"
            style={{
              backgroundColor: 'rgba(20, 15, 30, 0.85)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '1rem',
              cursor: 'pointer',
              color: 'inherit',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
              <IconCoroa />
            </div>
            <h2
              style={{
                color: '#FFF',
                fontSize: '1.8rem',
                fontWeight: 900,
                margin: 0,
                letterSpacing: '1px',
                position: 'relative',
                zIndex: 2,
              }}
            >
              ARENA <span style={{ color: '#A855F7' }}>TRUE GOTY</span>
            </h2>
            <p style={{ color: '#D1D5DB', fontSize: '0.9rem', margin: 0, lineHeight: 1.5, position: 'relative', zIndex: 2 }}>
              A elite avaliada pelos jogadores. Sem lobby, sem filtro.
            </p>
            <div
              style={{
                marginTop: '0.5rem',
                padding: '6px 14px',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                color: '#D4AF37',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                backgroundColor: 'rgba(212, 175, 55, 0.08)',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {votosPorCategoria.tgt.toLocaleString('pt-BR')} VEREDITOS COMPUTADOS
            </div>
          </button>

          {/* Card MERCADO */}
          <button
            onClick={() => setCategoriaSelecionada('mercado')}
            className="arena-card arena-card-mercado"
            style={{
              backgroundColor: 'rgba(22, 22, 24, 0.85)',
              border: '1px solid rgba(156, 163, 175, 0.35)',
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '1rem',
              cursor: 'pointer',
              color: 'inherit',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
              <IconMonolito />
            </div>
            <h2
              style={{
                color: '#FFF',
                fontSize: '1.8rem',
                fontWeight: 900,
                margin: 0,
                letterSpacing: '1px',
                position: 'relative',
                zIndex: 2,
              }}
            >
              ARENA <span style={{ color: '#E5E7EB' }}>MERCADO</span>
            </h2>
            <p style={{ color: '#D1D5DB', fontSize: '0.9rem', margin: 0, lineHeight: 1.5, position: 'relative', zIndex: 2 }}>
              Os finalistas da indústria colocados à prova no mano a mano.
            </p>
            <div
              style={{
                marginTop: '0.5rem',
                padding: '6px 14px',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                color: '#E5E7EB',
                border: '1px solid rgba(229, 231, 235, 0.3)',
                backgroundColor: 'rgba(229, 231, 235, 0.05)',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {votosPorCategoria.mercado.toLocaleString('pt-BR')} VEREDITOS COMPUTADOS
            </div>
          </button>
        </motion.div>
      )}

      {/* ETAPA 2: MENU DA ARENA ESCOLHIDA */}
      {categoriaSelecionada && (
        <motion.div
          key={categoriaSelecionada}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <button
            onClick={() => setCategoriaSelecionada(null)}
            style={{
              alignSelf: 'flex-start',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#a1a1aa',
              padding: '0.6rem 1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.15em',
              transition: 'all 0.2s',
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#FFF';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#a1a1aa';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            }}
          >
            ← TROCAR DE ARENA
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2))' }} />
            <h2
              style={{
                color: categoriaSelecionada === 'tgt' ? '#A855F7' : '#E5E7EB',
                fontSize: '1.4rem',
                fontWeight: 900,
                margin: 0,
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              {categoriaSelecionada === 'tgt' ? 'TRUE GOTY' : 'MERCADO (TGA)'}
            </h2>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.2))' }} />
          </div>

          <Link href={`/resultados/global?cat=${categoriaSelecionada}`} style={{ textDecoration: 'none' }}>
            <div
              className="menu-card"
              style={{
                backgroundColor: 'rgba(22, 22, 24, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1.5rem 1.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor =
                  categoriaSelecionada === 'tgt' ? 'rgba(168, 85, 247, 0.6)' : 'rgba(229, 231, 235, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <div
                style={{
                  color: categoriaSelecionada === 'tgt' ? '#A855F7' : '#E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  border: `1px solid ${categoriaSelecionada === 'tgt' ? 'rgba(168,85,247,0.4)' : 'rgba(229,231,235,0.3)'}`,
                  backgroundColor: categoriaSelecionada === 'tgt' ? 'rgba(168,85,247,0.08)' : 'rgba(229,231,235,0.05)',
                  flexShrink: 0,
                }}
              >
                <IconGlobo />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: 'var(--text-light)', fontSize: '1.15rem', fontWeight: 800, margin: 0, marginBottom: '0.25rem', letterSpacing: '0.5px' }}>
                  PLACAR MUNDIAL DA ARENA
                </h3>
                <p style={{ color: '#a1a1aa', fontSize: '0.85rem', margin: 0 }}>
                  O consenso implacável de todos os vereditos selados.
                </p>
              </div>
              <span style={{ color: '#71717a', fontSize: '1.5rem', fontWeight: 300 }}>›</span>
            </div>
          </Link>

          <Link href={`/resultados/pessoal?cat=${categoriaSelecionada}`} style={{ textDecoration: 'none' }}>
            <div
              className="menu-card"
              style={{
                backgroundColor: 'rgba(22, 22, 24, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1.5rem 1.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                cursor: 'pointer',
                position: 'relative',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor =
                  categoriaSelecionada === 'tgt' ? 'rgba(168, 85, 247, 0.6)' : 'rgba(229, 231, 235, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <div
                style={{
                  color: categoriaSelecionada === 'tgt' ? '#A855F7' : '#E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  border: `1px solid ${categoriaSelecionada === 'tgt' ? 'rgba(168,85,247,0.4)' : 'rgba(229,231,235,0.3)'}`,
                  backgroundColor: categoriaSelecionada === 'tgt' ? 'rgba(168,85,247,0.08)' : 'rgba(229,231,235,0.05)',
                  flexShrink: 0,
                }}
              >
                <IconPodium />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                  <h3 style={{ color: 'var(--text-light)', fontSize: '1.15rem', fontWeight: 800, margin: 0, letterSpacing: '0.5px' }}>
                    MEU PÓDIO INDIVIDUAL
                  </h3>
                  {statusVeredito[categoriaSelecionada] === 'concluido' ? (
                    <span style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.15em', padding: '3px 8px', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
                      ✓ CONCLUÍDO
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.15em', padding: '3px 8px', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.4)', backgroundColor: 'rgba(212, 175, 55, 0.08)' }}>
                      ⚠ PENDENTE • VOTAR
                    </span>
                  )}
                </div>
                <p style={{ color: '#a1a1aa', fontSize: '0.85rem', margin: 0 }}>
                  A hierarquia exata forjada nos seus 45 confrontos.
                </p>
              </div>
              <span style={{ color: '#71717a', fontSize: '1.5rem', fontWeight: 300 }}>›</span>
            </div>
          </Link>
        </motion.div>
      )}
    </main>
  );
}