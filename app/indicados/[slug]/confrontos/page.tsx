// app/indicados/[slug]/confrontos/page.tsx
'use client';

import { useParams, useSearchParams, notFound } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import jogosData from '@/lib/jogos.json';

function ConfrontosJogoContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const categoria = searchParams.get('cat') || 'tgt';

  const isTgt = categoria === 'tgt';
  const corPrincipal = isTgt ? 'var(--purple-neon)' : '#D4AF37';
  const corSecundaria = isTgt ? '#D4AF37' : '#E2E8F0';

  const listaJogos = (jogosData as any)[categoria]?.top10 || [];
  const jogoAtual = listaJogos.find((j: any) => j.slug === slug);
  
  const [stats, setStats] = useState<Record<string, any>>({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!jogoAtual) return;

    async function buscarTodasAsEstatisticas() {
      try {
        const res = await fetch(`/api/head-to-head?category=${categoria}&year=2026&jogoA=${encodeURIComponent(jogoAtual.titulo)}`);
        const json = await res.json();
        if (json.success) {
          setStats(json.data); 
        }
      } catch (erro) {
        console.error("Erro ao buscar stats:", erro);
      } finally {
        setCarregando(false);
      }
    }

    buscarTodasAsEstatisticas();
  }, [slug, categoria, jogoAtual]);

  if (!jogoAtual) {
    notFound();
  }

  const oponentes = listaJogos.filter((j: any) => j.slug !== slug);

  const oponentesOrdenados = [...oponentes].sort((a, b) => {
    const statA = stats[a.titulo];
    const statB = stats[b.titulo];
    const porcA = (!statA || statA.total === 0) ? 50 : statA.porcentagemA;
    const porcB = (!statB || statB.total === 0) ? 50 : statB.porcentagemA;
    return Math.abs(50 - porcA) - Math.abs(50 - porcB);
  });

  let maisParelho: any = null;
  let maiorVitoria: any = null;
  let arquiInimigo: any = null;

  let menorDiffParelho = 100;
  let maiorPorcVitoria = -1;
  let menorPorcVitoria = 101;

  oponentesOrdenados.forEach(op => {
    const stat = stats[op.titulo];
    if (!stat || stat.total === 0) return;

    const porc = stat.porcentagemA;
    const diff = Math.abs(50 - porc);

    if (diff < menorDiffParelho) {
      menorDiffParelho = diff;
      maisParelho = { op, porc };
    }

    if (porc > maiorPorcVitoria) {
      maiorPorcVitoria = porc;
      maiorVitoria = { op, porc };
    }

    if (porc < menorPorcVitoria) {
      menorPorcVitoria = porc;
      arquiInimigo = { op, porc };
    }
  });

  // Cantos retos editoriais e bordas finas (sem chanfro)
  const cardStyle = {
    backgroundColor: 'rgba(20, 20, 24, 0.85)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0px',
    position: 'relative' as const,
    overflow: 'hidden',
    boxSizing: 'border-box' as const,
  };

  return (
    <main className="confrontos-main">
      
      <style>{`
        .confrontos-main {
          min-height: 100vh;
          padding: 100px 2rem 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
        }

        .confrontos-layout {
          max-width: 1200px;
          width: 100%;
          display: grid;
          grid-template-columns: minmax(300px, 360px) 1fr;
          gap: 3rem;
          align-items: start;
        }

        .dossie-card {
          position: sticky;
          top: 100px;
          padding: 1.5rem;
          width: 100%;
        }

        .confrontos-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.2rem;
          width: 100%;
        }

        @media (min-width: 1024px) {
          .confrontos-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .destaques-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .oponente-card:hover .oponente-img {
          transform: scale(1.1);
        }

        .oponente-card:hover .vs-marca {
          opacity: 0.3;
          transform: translate(-50%, -50%) scale(1.1);
        }

        .barra-cabo {
          width: 100%;
          height: 8px;
          background: rgba(255,255,255,0.05);
          border-radius: 0px;
          display: flex;
          overflow: hidden;
          position: relative;
        }

        .cabo-esq {
          height: 100%;
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cabo-dir {
          height: 100%;
          flex: 1;
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cta-arena-wrapper {
          margin-top: 2.5rem;
          width: 100%;
        }

        .cta-arena-btn {
          width: 100%;
          padding: 1.25rem 2rem;
          font-size: clamp(1.25rem, 3vw, 1.55rem);
          letter-spacing: 1.5px;
          gap: 12px;
          background: linear-gradient(135deg, #7e22ce 0%, #B026FF 100%);
          color: #FFFFFF;
          box-shadow: 0 12px 35px rgba(176, 38, 255, 0.35), inset 0 0 20px rgba(255, 255, 255, 0.15);
          text-align: center;
        }

        @media (max-width: 900px) {
          .confrontos-main {
            padding: 84px 1rem 3rem 1rem;
          }

          .confrontos-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .dossie-card {
            position: static;
            top: auto;
            padding: 1.25rem;
          }

          .destaques-grid {
            grid-template-columns: 1fr;
            margin-bottom: 1.75rem;
          }

          .cta-arena-btn {
            padding: 1.1rem 1.25rem;
          }
        }
      `}</style>

      {/* BREADCRUMB LIMPO E DIRETO */}
      <div style={{ width: '100%', maxWidth: '1200px', marginBottom: '1.5rem' }}>
        <Link href={`/indicados?cat=${categoria}`} style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = corPrincipal} onMouseOut={(e) => e.currentTarget.style.color = '#a1a1aa'}>
          ← VOLTAR AOS DESAFIANTES
        </Link>
      </div>

      <div className="confrontos-layout">
        
        {/* DOSSIÊ DO JOGO (CANTOS RETOS) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="dossie-card"
          style={{ ...cardStyle, borderTop: `3px solid ${corPrincipal}` }}
        >
          <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: '0px', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
            <img src={jogoAtual.imagem} alt={jogoAtual.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,20,24,1) 0%, transparent 40%)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ backgroundColor: `${corPrincipal}20`, color: corPrincipal, padding: '6px 12px', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '1px', borderLeft: `3px solid ${corPrincipal}` }}>
              FINALISTA // {isTgt ? 'ARENA TGT' : 'ARENA MERCADO'}
            </span>
            {jogoAtual.user_rating_original && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D4AF37', fontWeight: 900, fontSize: '1.2rem', textShadow: '0 0 10px rgba(212, 175, 55, 0.3)' }}>
                <span style={{ fontSize: '0.9rem' }}>★</span> {jogoAtual.user_rating_original}
              </div>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(1.7rem, 6vw, 2.2rem)', fontWeight: 900, color: 'var(--text-light)', lineHeight: 1.08, margin: '0 0 1.25rem 0' }}>
            {jogoAtual.titulo}
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
            {jogoAtual.produtora && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ color: '#71717a', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Produtora</span>
                <span style={{ color: '#D1D5DB', fontSize: '0.9rem', fontWeight: 500 }}>{jogoAtual.produtora}</span>
              </div>
            )}
            {jogoAtual.diretor && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ color: '#71717a', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Diretor</span>
                <span style={{ color: '#D1D5DB', fontSize: '0.9rem', fontWeight: 500 }}>{jogoAtual.diretor}</span>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ color: '#71717a', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Plataformas</span>
              <span style={{ color: '#D1D5DB', fontSize: '0.9rem', fontWeight: 500 }}>{jogoAtual.plataformas?.join(', ')}</span>
            </div>
          </div>
        </motion.div>

        {/* RAIO-X DE CONFRONTOS */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          style={{ width: '100%', minWidth: 0 }}
        >
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: 'clamp(1.85rem, 7vw, 2.5rem)', fontWeight: 900, color: 'var(--text-light)', margin: '0 0 0.5rem 0', lineHeight: 1 }}>
              RAIO-X DE CONFRONTOS <span style={{ color: corPrincipal }}>1v1</span>
            </h2>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem', margin: 0 }}>
              Desempenho de <strong style={{ color: '#FFF' }}>{jogoAtual.titulo}</strong> no mano a mano contra os outros 9 finalistas.
            </p>
          </div>

          {/* DESTAQUES (CANTOS RETOS + ÍCONE BALANÇA EM EQUILÍBRIO) */}
          {!carregando && maisParelho && maiorVitoria && arquiInimigo && (
            <div className="destaques-grid">
              <div style={{ ...cardStyle, padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: `2px solid ${corPrincipal}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: corPrincipal, fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  Domínio
                </div>
                <p style={{ color: '#D1D5DB', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>
                  Venceu <strong>{maiorVitoria.op.titulo}</strong> em <strong>{maiorVitoria.porc}%</strong> dos duelos.
                </p>
              </div>

              <div style={{ ...cardStyle, padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: '2px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v18" />
                    <path d="M8 21h8" />
                    <path d="M4 7h16" />
                    <path d="M6 7l-3 7a3 3 0 0 0 6 0L6 7z" />
                    <path d="M18 7l-3 7a3 3 0 0 0 6 0l-3-7z" />
                  </svg>
                  Equilíbrio
                </div>
                <p style={{ color: '#D1D5DB', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>
                  A comunidade está dividida contra <strong>{maisParelho.op.titulo}</strong> ({maisParelho.porc}%).
                </p>
              </div>

              <div style={{ ...cardStyle, padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: '2px solid #ef4444' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M9.5 6.5L21 18v3h-3L6.5 9.5"/></svg>
                  Arqui-Inimigo
                </div>
                <p style={{ color: '#D1D5DB', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>
                  Perdeu para <strong>{arquiInimigo.op.titulo}</strong> em <strong>{100 - arquiInimigo.porc}%</strong> dos duelos.
                </p>
              </div>
            </div>
          )}

          {carregando ? (
            <div style={{ color: corPrincipal, padding: '3rem 1rem', textAlign: 'center', fontWeight: 'bold', letterSpacing: '2px' }}>
              CARREGANDO HISTÓRICO...
            </div>
          ) : (
            <>
              <div className="confrontos-grid">
                {oponentesOrdenados.map((oponente: any) => {
                  const stat = stats[oponente.titulo];
                  const semVotos = !stat || stat.total === 0;
                  const porcentagemVitoria = semVotos ? 50 : stat.porcentagemA; 
                  const porcentagemDerrota = 100 - porcentagemVitoria;

                  const corBarraEsq = semVotos ? 'rgba(255,255,255,0.1)' : (porcentagemVitoria > 50 ? corPrincipal : '#ef4444');
                  const corBarraDir = semVotos ? 'rgba(255,255,255,0.1)' : (porcentagemDerrota > 50 ? '#ef4444' : corSecundaria);

                  return (
                    <div key={oponente.slug} className="oponente-card" style={{ 
                      ...cardStyle, 
                      display: 'flex', 
                      alignItems: 'center', 
                      height: '100px',
                      width: '100%',
                      transition: 'border-color 0.3s'
                    }}>
                      <div style={{ width: '92px', height: '100%', position: 'absolute', left: 0, top: 0, overflow: 'hidden' }}>
                        <img 
                          src={oponente.imagem} 
                          alt={oponente.titulo} 
                          className="oponente-img"
                          style={{ 
                            width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease',
                            maskImage: 'linear-gradient(to right, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 40%, transparent 100%)'
                          }} 
                        />
                        <div className="vs-marca" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', opacity: 0, transition: 'all 0.3s', color: corPrincipal, fontWeight: 900, fontSize: '2rem', pointerEvents: 'none', textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>
                          VS
                        </div>
                      </div>

                      <div style={{ marginLeft: '94px', flex: 1, minWidth: 0, paddingRight: '1rem', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem' }}>
                          <span style={{ fontWeight: 'bold', color: 'var(--text-light)', fontSize: '0.92rem', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {oponente.titulo}
                          </span>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                            {semVotos ? (
                              <span style={{ color: '#71717a', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', whiteSpace: 'nowrap' }}>SEM DADOS</span>
                            ) : (
                              <>
                                <span style={{ color: porcentagemVitoria > 50 ? corPrincipal : '#ef4444', fontWeight: 900, fontSize: '1.05rem' }}>
                                  {porcentagemVitoria}%
                                </span>
                                {porcentagemVitoria > 50 ? (
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={corPrincipal} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                ) : porcentagemVitoria < 50 ? (
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                ) : null}
                              </>
                            )}
                          </div>
                        </div>

                        <div className="barra-cabo">
                          {semVotos ? (
                            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to right, transparent 49%, #71717a 50%, transparent 51%)' }} />
                          ) : (
                            <>
                              <motion.div initial={{ width: 0 }} animate={{ width: `${porcentagemVitoria}%` }} transition={{ duration: 1 }} className="cabo-esq" style={{ backgroundColor: corBarraEsq }} />
                              <motion.div initial={{ width: 0 }} animate={{ width: `${porcentagemDerrota}%` }} transition={{ duration: 1 }} className="cabo-dir" style={{ backgroundColor: corBarraDir }} />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* BOTÃO CTA PRINCIPAL DE DESTAQUE MÁXIMO (CHANFRO EXCLUSIVO 45°) */}
              <div className="cta-arena-wrapper">
                <Link href={`/votar/${categoria}`} className="btn-arena cta-arena-btn">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
                    <path d="M13 19l6-6" />
                    <path d="M16 16l4 4" />
                    <path d="M19 21l2-2" />
                    <path d="M14.5 6.5L18 3h3v3l-3.5 3.5" />
                    <path d="M5 14l6 6" />
                    <path d="M8 17l-4 4" />
                    <path d="M5 19l-2 2" />
                  </svg>
                  <span>DISCORDA? ENTRE NA ARENA E DECIDA O VERDADEIRO GOTY</span>
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}

export default function ConfrontosJogo() {
  return (
    <Suspense fallback={<main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--purple-neon)' }}>Carregando Dossiê...</main>}>
      <ConfrontosJogoContent />
    </Suspense>
  );
}