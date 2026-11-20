'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '../../components/LanguageProvider';

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
      fill="rgba(168, 85, 247, 0.12)"
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
      stroke="#D4AF37"
      strokeWidth="2.5"
      strokeLinejoin="round"
      fill="rgba(212, 175, 55, 0.12)"
    />
    <polygon
      points="32,16 44,23 44,37 32,44 20,37 20,23"
      fill="#D4AF37"
      opacity="0.4"
    />
    <path d="M32 22 L32 38 M24 30 L40 30" stroke="#FFF3C4" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const IconGloboPortal = () => (
  <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9.5" />
    <line x1="2.5" y1="12" x2="21.5" y2="12" />
    <path d="M12 2.5a14.5 14.5 0 0 1 4 9.5 14.5 14.5 0 0 1-4 9.5 14.5 14.5 0 0 1-4-9.5 14.5 14.5 0 0 1 4-9.5z" />
    <path d="M4.2 7.5h15.6" opacity="0.55" />
    <path d="M4.2 16.5h15.6" opacity="0.55" />
  </svg>
);

const IconCoroaPessoal = () => (
  <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8.5L7.5 12L12 5L16.5 12L21 8.5L19 17.5H5L3 8.5Z" />
    <line x1="5" y1="20.5" x2="19" y2="20.5" />
    <circle cx="12" cy="3.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

type Categoria = 'tgt' | 'mercado';
type StatusVeredito = 'concluido' | 'pendente';

export default function Resultados() {
  const { lang, t } = useLanguage();
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

  const formatarNumero = (valor: number) => {
    if (lang === 'en') return valor.toLocaleString('en-US');
    if (lang === 'es') return valor.toLocaleString('es-ES');
    return valor.toLocaleString('pt-BR');
  };

  const labelVereditos =
    lang === 'en' ? 'VERDICTS RECORDED' : lang === 'es' ? 'VEREDICTOS COMPUTADOS' : 'VEREDITOS COMPUTADOS';

  const labelConcluido =
    lang === 'en' ? '✓ VERDICT COMPLETED' : lang === 'es' ? '✓ VEREDICTO COMPLETADO' : '✓ VEREDITO CONCLUÍDO';

  const labelPendente =
    lang === 'en' ? 'PENDING — VOTE NOW' : lang === 'es' ? 'PENDIENTE — VOTAR AHORA' : 'PENDENTE — VOTAR AGORA';

  const labelVerRanking =
    lang === 'en' ? 'VIEW GLOBAL RANKING' : lang === 'es' ? 'VER RANKING GLOBAL' : 'VER RANKING MUNDIAL';

  const labelVerMeuTop =
    lang === 'en' ? 'VIEW MY TOP 10' : lang === 'es' ? 'VER MI TOP 10' : 'VER MEU TOP 10';

  const labelTrocarArena =
    lang === 'en' ? '← SWITCH ARENA' : lang === 'es' ? '← CAMBIAR DE ARENA' : '← TROCAR DE ARENA';

  const isTgtAtiva = categoriaSelecionada === 'tgt';
  const corTema = isTgtAtiva ? '#B026FF' : '#D4AF37';
  const corTemaClaro = isTgtAtiva ? '#C084FC' : '#F4D06F';
  const corGlow = isTgtAtiva ? 'rgba(176, 38, 255, 0.28)' : 'rgba(212, 175, 55, 0.28)';
  const corBordaPortal = isTgtAtiva ? 'rgba(176, 38, 255, 0.48)' : 'rgba(212, 175, 55, 0.55)';
  const corBgPortal = isTgtAtiva ? 'rgba(20, 15, 30, 0.9)' : 'rgba(24, 20, 12, 0.92)';
  const corTextoCtaHover = isTgtAtiva ? '#FFFFFF' : '#0A0A0A';

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '120px 2rem 4rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .arena-card {
          border-radius: 0px;
          position: relative;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2), box-shadow 0.35s ease, border-color 0.25s ease;
        }
        .arena-card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.7;
          transition: opacity 0.35s ease;
          pointer-events: none;
          z-index: 1;
        }
        .arena-card-tgt::before {
          background: radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.26), transparent 68%);
        }
        .arena-card-mercado::before {
          background: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.26), transparent 68%);
        }
        .arena-card:hover::before {
          opacity: 1;
        }
        .arena-card-tgt:hover {
          transform: translateY(-6px) scale(1.015);
          border-color: #B026FF !important;
          box-shadow: 0 25px 60px -15px rgba(168, 85, 247, 0.6);
        }
        .arena-card-mercado:hover {
          transform: translateY(-6px) scale(1.015);
          border-color: #F4D06F !important;
          box-shadow: 0 25px 60px -15px rgba(212, 175, 55, 0.55);
        }

        .grid-categorias {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.75rem;
          width: 100%;
          max-width: 960px;
          align-items: stretch;
        }

        .context-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          width: 100%;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .portal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          width: 100%;
          align-items: stretch;
        }

        .portal-card {
          position: relative;
          overflow: hidden;
          border-radius: 0px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          height: 100%;
          box-sizing: border-box;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .portal-card:hover {
          transform: translateY(-6px);
        }

        .portal-cta {
          width: 100%;
          padding: 1rem 1.25rem;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: var(--font-teko), sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: background-color 0.25s ease, color 0.25s ease;
        }

        .portal-arrow {
          display: inline-block;
          transition: transform 0.25s ease;
        }

        .portal-card:hover .portal-arrow {
          transform: translateX(5px);
        }

        @media (max-width: 720px) {
          .grid-categorias,
          .portal-grid {
            grid-template-columns: 1fr;
          }

          .context-bar {
            justify-content: center;
          }
        }
      `}</style>

      {/* CABEÇALHO */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', width: '100%', maxWidth: '920px' }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'inline-block',
            color: '#D4AF37',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
            padding: '8px 18px',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            backgroundColor: 'rgba(212, 175, 55, 0.06)',
            borderRadius: '0px',
          }}
        >
          {t.res_sel_badge}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            color: 'var(--text-light)',
            fontSize: 'clamp(2.3rem, 5.5vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '0px',
            margin: '0 0 1rem 0',
            textTransform: 'uppercase',
            lineHeight: 0.95,
          }}
        >
          {t.home_titulo1}
          <br />
          <span className="title-shine" style={{ fontSize: '1.08em', display: 'inline-block' }}>
            {t.home_titulo2}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{ color: '#a1a1aa', fontSize: '1rem', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}
        >
          {t.res_sel_sub}
        </motion.p>
      </div>

      {/* ETAPA 1: SELEÇÃO DE ARENA */}
      {!categoriaSelecionada && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid-categorias"
        >
          <button
            type="button"
            onClick={() => setCategoriaSelecionada('tgt')}
            className="arena-card arena-card-tgt"
            style={{
              backgroundColor: 'rgba(20, 15, 30, 0.88)',
              border: '1px solid rgba(168, 85, 247, 0.45)',
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
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65), inset 0 0 60px rgba(168, 85, 247, 0.12)',
            }}
          >
            <div style={{ position: 'relative', zIndex: 2, filter: 'drop-shadow(0 0 16px rgba(168, 85, 247, 0.45))' }}>
              <IconCoroa />
            </div>

            <h2
              style={{
                color: '#FFF',
                fontSize: '2rem',
                fontWeight: 900,
                margin: 0,
                letterSpacing: '1px',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {t.votar_sel_tgt_titulo} <span style={{ color: '#A855F7' }}>{t.votar_sel_tgt_destaque}</span>
            </h2>

            <p style={{ color: '#D1D5DB', fontSize: '0.94rem', margin: 0, lineHeight: 1.55, position: 'relative', zIndex: 2 }}>
              {t.res_sel_tgt_desc}
            </p>

            <div
              style={{
                marginTop: 'auto',
                paddingTop: '1rem',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  padding: '6px 14px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  color: '#D4AF37',
                  border: '1px solid rgba(212, 175, 55, 0.45)',
                  backgroundColor: 'rgba(212, 175, 55, 0.08)',
                }}
              >
                {formatarNumero(votosPorCategoria.tgt)} {labelVereditos}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCategoriaSelecionada('mercado')}
            className="arena-card arena-card-mercado"
            style={{
              backgroundColor: 'rgba(24, 20, 12, 0.9)',
              border: '1px solid rgba(212, 175, 55, 0.55)',
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
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65), inset 0 0 65px rgba(212, 175, 55, 0.14)',
            }}
          >
            <div style={{ position: 'relative', zIndex: 2, filter: 'drop-shadow(0 0 16px rgba(212, 175, 55, 0.55))' }}>
              <IconMonolito />
            </div>

            <h2
              style={{
                color: '#FFF',
                fontSize: '2rem',
                fontWeight: 900,
                margin: 0,
                letterSpacing: '1px',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {t.votar_sel_mercado_titulo} <span style={{ color: '#D4AF37' }}>{t.votar_sel_mercado_destaque}</span>
            </h2>

            <p style={{ color: '#E4E4E7', fontSize: '0.94rem', margin: 0, lineHeight: 1.55, position: 'relative', zIndex: 2 }}>
              {t.res_sel_mercado_desc}
            </p>

            <p
              style={{
                color: '#a1a1aa',
                fontSize: '0.76rem',
                margin: '0.2rem 0 0 0',
                lineHeight: 1.45,
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(212, 175, 55, 0.22)',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {t.votar_sel_mercado_disclaimer}
            </p>

            <div
              style={{
                marginTop: 'auto',
                paddingTop: '0.5rem',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  padding: '6px 14px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  color: '#F4D06F',
                  border: '1px solid rgba(212, 175, 55, 0.55)',
                  backgroundColor: 'rgba(212, 175, 55, 0.12)',
                }}
              >
                {formatarNumero(votosPorCategoria.mercado)} {labelVereditos}
              </div>
            </div>
          </button>
        </motion.div>
      )}

      {/* ETAPA 2: CARDS PORTAIS LADO A LADO COM TEMA DINÂMICO */}
      {categoriaSelecionada && (
        <motion.div
          key={categoriaSelecionada}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: '960px', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
        >
          <style>{`
            .portal-card-dinamico:hover {
              border-color: ${corTema} !important;
              box-shadow: 0 24px 60px -14px ${corGlow}, inset 0 0 85px ${corGlow} !important;
            }
            .portal-card-dinamico:hover .portal-cta-dinamico {
              background-color: ${corTema} !important;
              color: ${corTextoCtaHover} !important;
              border-top-color: ${corTema} !important;
            }
          `}</style>

          <div className="context-bar">
            <button
              type="button"
              onClick={() => setCategoriaSelecionada(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '0px',
                color: '#d4d4d8',
                padding: '0.65rem 1.25rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                transition: 'all 0.2s ease',
              }}
            >
              {labelTrocarArena}
            </button>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.55rem 1.25rem',
                border: `1px solid ${corBordaPortal}`,
                backgroundColor: `${corTema}14`,
                borderRadius: '0px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: corTema,
                  boxShadow: `0 0 12px ${corTema}`,
                }}
              />
              <span
                className="font-arena"
                style={{
                  color: corTemaClaro,
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  lineHeight: 1,
                }}
              >
                {isTgtAtiva ? t.rank_arena_tgt : t.rank_arena_mercado}
              </span>
            </div>
          </div>

          <div className="portal-grid">
            <Link
              href={`/resultados/global?cat=${categoriaSelecionada}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
            >
              <div
                className="portal-card portal-card-dinamico"
                style={{
                  backgroundColor: corBgPortal,
                  backgroundImage: `radial-gradient(circle at 50% 0%, ${corGlow}, transparent 68%)`,
                  border: `1px solid ${corBordaPortal}`,
                  boxShadow: `0 16px 42px rgba(0, 0, 0, 0.7), inset 0 0 60px ${isTgtAtiva ? 'rgba(176, 38, 255, 0.12)' : 'rgba(212, 175, 55, 0.12)'}`,
                }}
              >
                <div
                  style={{
                    padding: '2.75rem 2rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    flex: 1,
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      width: '88px',
                      height: '88px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: corTema,
                      border: `1px solid ${corBordaPortal}`,
                      backgroundColor: `${corTema}14`,
                      filter: `drop-shadow(0 0 18px ${corGlow})`,
                      marginBottom: '0.25rem',
                    }}
                  >
                    <IconGloboPortal />
                  </div>

                  <h2
                    className="font-arena"
                    style={{
                      color: '#FFFFFF',
                      fontSize: '2.1rem',
                      fontWeight: 900,
                      margin: 0,
                      lineHeight: 1,
                      letterSpacing: '1.5px',
                    }}
                  >
                    {t.rank_global_tab}
                  </h2>

                  <p style={{ color: '#D1D5DB', fontSize: '0.95rem', margin: 0, lineHeight: 1.55, maxWidth: '340px' }}>
                    {t.rank_sub_global}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '5px 12px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        letterSpacing: '0.16em',
                        color: corTemaClaro,
                        border: `1px solid ${corBordaPortal}`,
                        backgroundColor: `${corTema}12`,
                      }}
                    >
                      {formatarNumero(votosPorCategoria[categoriaSelecionada])} {labelVereditos}
                    </span>
                  </div>
                </div>

                <div
                  className="portal-cta portal-cta-dinamico"
                  style={{
                    borderTop: `1px solid ${corBordaPortal}`,
                    backgroundColor: `${corTema}14`,
                    color: corTemaClaro,
                  }}
                >
                  <span>{labelVerRanking}</span>
                  <span className="portal-arrow">→</span>
                </div>
              </div>
            </Link>

            <Link
              href={`/resultados/pessoal?cat=${categoriaSelecionada}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
            >
              <div
                className="portal-card portal-card-dinamico"
                style={{
                  backgroundColor: corBgPortal,
                  backgroundImage: `radial-gradient(circle at 50% 0%, ${corGlow}, transparent 68%)`,
                  border: `1px solid ${corBordaPortal}`,
                  boxShadow: `0 16px 42px rgba(0, 0, 0, 0.7), inset 0 0 60px ${isTgtAtiva ? 'rgba(176, 38, 255, 0.12)' : 'rgba(212, 175, 55, 0.12)'}`,
                }}
              >
                <div
                  style={{
                    padding: '2.75rem 2rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    flex: 1,
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      width: '88px',
                      height: '88px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: corTema,
                      border: `1px solid ${corBordaPortal}`,
                      backgroundColor: `${corTema}14`,
                      filter: `drop-shadow(0 0 18px ${corGlow})`,
                      marginBottom: '0.25rem',
                    }}
                  >
                    <IconCoroaPessoal />
                  </div>

                  <h2
                    className="font-arena"
                    style={{
                      color: '#FFFFFF',
                      fontSize: '2.1rem',
                      fontWeight: 900,
                      margin: 0,
                      lineHeight: 1,
                      letterSpacing: '1.5px',
                    }}
                  >
                    {t.rank_pessoal_tab}
                  </h2>

                  <p style={{ color: '#D1D5DB', fontSize: '0.95rem', margin: 0, lineHeight: 1.55, maxWidth: '340px' }}>
                    {t.veredito_empate}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
                    {statusVeredito[categoriaSelecionada] === 'concluido' ? (
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '6px 14px',
                          fontSize: '0.72rem',
                          fontWeight: 900,
                          letterSpacing: '0.16em',
                          color: '#34d399',
                          border: '1px solid rgba(52, 211, 153, 0.55)',
                          backgroundColor: 'rgba(16, 185, 129, 0.14)',
                        }}
                      >
                        {labelConcluido}
                      </span>
                    ) : (
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '6px 14px',
                          fontSize: '0.72rem',
                          fontWeight: 900,
                          letterSpacing: '0.16em',
                          color: '#F4D06F',
                          border: '1px solid rgba(212, 175, 55, 0.6)',
                          backgroundColor: 'rgba(212, 175, 55, 0.14)',
                        }}
                      >
                        {labelPendente}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="portal-cta portal-cta-dinamico"
                  style={{
                    borderTop: `1px solid ${corBordaPortal}`,
                    backgroundColor: `${corTema}14`,
                    color: corTemaClaro,
                  }}
                >
                  <span>{labelVerMeuTop}</span>
                  <span className="portal-arrow">→</span>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      )}
    </main>
  );
}