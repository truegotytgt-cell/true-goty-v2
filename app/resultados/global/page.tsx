'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import jogosData from '@/lib/jogos.json';

function PlacarGlobalContent() {
  const searchParams = useSearchParams();
  const categoria = searchParams.get('cat') === 'mercado' ? 'mercado' : 'tgt';

  const [ranking, setRanking] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  const isTgt = categoria === 'tgt';
  const corPrincipal = isTgt ? '#B026FF' : '#D4AF37';
  const corTextoAtivo = isTgt ? '#FFFFFF' : '#0A0A0A';

  useEffect(() => {
    async function fetchRanking() {
      setCarregando(true);
      try {
        const res = await fetch(`/api/ranking?category=${categoria}`);
        const json = await res.json();

        if (json.success && Array.isArray(json.ranking)) {
          const jogosJSON = (jogosData as any)[categoria]?.top10 || [];

          const rankingCompleto = json.ranking.map((item: any) => {
            const infoJogo = jogosJSON.find((j: any) => j.titulo === item.game_title);
            return {
              titulo: item.game_title,
              pontos: item.total_score,
              imagem: infoJogo?.imagem || '/placeholder.jpg',
              rating: typeof infoJogo?.user_rating_original === 'number' ? infoJogo.user_rating_original : 0,
              slug: infoJogo?.slug || '#',
            };
          });

          setRanking(rankingCompleto);
        } else {
          setRanking([]);
        }
      } catch (error) {
        console.error('Erro ao carregar ranking:', error);
        setRanking([]);
      } finally {
        setCarregando(false);
      }
    }

    fetchRanking();
  }, [categoria]);

  const semVotos = ranking.length > 0 && ranking.every((j) => j.pontos === 0);
  const podiumSecundario = [ranking[1], ranking[2]].filter(Boolean);

  return (
    <main className="ranking-main">
      <style>{`
        .ranking-main {
          min-height: 100vh;
          padding: 112px 2rem 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
        }

        .ranking-tabs {
          display: inline-flex;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 0px;
          margin-bottom: 0.9rem;
          overflow: hidden;
        }

        .ranking-cat-switch {
          display: inline-flex;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 0px;
          margin-bottom: 2.25rem;
          background-color: rgba(15, 15, 18, 0.85);
          overflow: hidden;
        }

        .ranking-campeao-card {
          position: relative;
          background-color: #111114;
          background-image: radial-gradient(circle at 18% 50%, rgba(212, 175, 55, 0.16), transparent 60%);
          display: flex;
          align-items: center;
          padding: 1.6rem;
          gap: 1.6rem;
          border: 2px solid #D4AF37;
          border-radius: 0px;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.75), inset 0 0 40px rgba(212, 175, 55, 0.1);
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .ranking-campeao-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 22px 55px rgba(212, 175, 55, 0.22), inset 0 0 45px rgba(212, 175, 55, 0.16);
        }

        .ranking-campeao-card:hover .ranking-cover-zoom {
          transform: scale(1.05);
        }

        .ranking-podio-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 0.35rem;
        }

        .ranking-vice-card {
          position: relative;
          background-color: #111114;
          display: flex;
          align-items: center;
          padding: 1.1rem;
          gap: 1rem;
          border-radius: 0px;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .ranking-vice-card:hover {
          transform: translateY(-3px);
        }

        .ranking-vice-card:hover .ranking-cover-zoom {
          transform: scale(1.06);
        }

        .ranking-cover-zoom {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.3s ease;
        }

        @media (max-width: 720px) {
          .ranking-main {
            padding: 88px 1rem 3rem 1rem;
          }

          .ranking-campeao-card {
            flex-direction: column;
            text-align: center;
            padding: 1.4rem 1.1rem;
          }

          .ranking-campeao-info {
            flex-direction: column !important;
            gap: 1rem;
          }

          .ranking-podio-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* NAVEGAÇÃO DE ABAS (PLACAR GLOBAL | MEU PÓDIO) */}
      <div className="ranking-tabs">
        <Link
          href={`/resultados/global?cat=${categoria}`}
          style={{
            padding: '0.8rem 1.8rem',
            backgroundColor: corPrincipal,
            color: corTextoAtivo,
            textDecoration: 'none',
            fontWeight: 900,
            fontSize: '0.85rem',
            letterSpacing: '1.5px',
            borderRadius: '0px',
          }}
        >
          PLACAR GLOBAL
        </Link>
        <Link
          href={`/resultados/pessoal?cat=${categoria}`}
          style={{
            padding: '0.8rem 1.8rem',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            color: '#a1a1aa',
            textDecoration: 'none',
            fontWeight: 900,
            fontSize: '0.85rem',
            letterSpacing: '1.5px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '0px',
          }}
        >
          MEU PÓDIO
        </Link>
      </div>

      {/* ALTERNADOR RÁPIDO DE CATEGORIA */}
      <div className="ranking-cat-switch" role="tablist" aria-label="Alternar arena">
        <Link
          href="/resultados/global?cat=tgt"
          style={{
            padding: '0.65rem 1.5rem',
            fontFamily: 'var(--font-teko), sans-serif',
            fontSize: '1.15rem',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textDecoration: 'none',
            borderRadius: '0px',
            backgroundColor: isTgt ? '#B026FF' : 'transparent',
            color: isTgt ? '#FFFFFF' : '#a1a1aa',
            boxShadow: isTgt ? 'inset 0 0 16px rgba(255, 255, 255, 0.18)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          ARENA TRUE GOTY
        </Link>
        <Link
          href="/resultados/global?cat=mercado"
          style={{
            padding: '0.65rem 1.5rem',
            fontFamily: 'var(--font-teko), sans-serif',
            fontSize: '1.15rem',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textDecoration: 'none',
            borderLeft: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '0px',
            backgroundColor: !isTgt ? '#D4AF37' : 'transparent',
            color: !isTgt ? '#0A0A0A' : '#a1a1aa',
            boxShadow: !isTgt ? 'inset 0 0 16px rgba(255, 255, 255, 0.25)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          MERCADO (TGA)
        </Link>
      </div>

      {/* TÍTULO MONUMENTAL */}
      <div style={{ textAlign: 'center', marginBottom: '2.25rem', maxWidth: '880px' }}>
        <h1
          className="font-arena"
          style={{
            color: 'var(--text-light)',
            fontSize: 'clamp(2.5rem, 6vw, 4.4rem)',
            fontWeight: 900,
            letterSpacing: '1px',
            margin: '0 0 0.6rem 0',
            lineHeight: 0.95,
          }}
        >
          {isTgt ? (
            <>
              O VERDADEIRO <span className="title-shine">GOTY</span>
            </>
          ) : (
            <>
              O VEREDITO NOS INDICADOS DO{' '}
              <span style={{ color: '#D4AF37' }}>MERCADO (TGA)</span>
            </>
          )}
        </h1>

        <p
          className="font-arena"
          style={{
            color: isTgt ? '#C084FC' : '#F4D06F',
            fontSize: 'clamp(1.15rem, 2.8vw, 1.5rem)',
            fontWeight: 700,
            letterSpacing: '3px',
            margin: '0 auto 0.6rem auto',
            textTransform: 'uppercase',
          }}
        >
          {isTgt
            ? 'DECIDIDO PELOS PLAYERS'
            : 'DECIDIDO PELOS PLAYERS • SIMULAÇÃO SEM VÍNCULO OFICIAL'}
        </p>

        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
          O veredito matemático da comunidade. Cada ponto representa uma vitória direta no mano a mano.
        </p>
      </div>

      {semVotos && !carregando && (
        <div
          style={{
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '0px',
            color: '#D4AF37',
            padding: '8px 20px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '2px',
            marginBottom: '1.75rem',
            textAlign: 'center',
            maxWidth: '720px',
          }}
        >
          [ SEM VITÓRIAS CONCLUÍDAS AINDA • ORDEM INICIAL PELO ÍNDICE DE REFERÊNCIA ]
        </div>
      )}

      {carregando ? (
        <div style={{ color: corPrincipal, fontSize: '1.2rem', marginTop: '4rem', fontWeight: 'bold', letterSpacing: '2px' }}>
          CONTANDO OS VOTOS...
        </div>
      ) : ranking.length === 0 ? (
        <div
          style={{
            width: '100%',
            maxWidth: '720px',
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: 'rgba(20, 20, 24, 0.8)',
            border: `1px solid ${isTgt ? 'rgba(176, 38, 255, 0.35)' : 'rgba(212, 175, 55, 0.45)'}`,
            borderRadius: '0px',
            marginTop: '1rem',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              marginBottom: '1.25rem',
              padding: '6px 14px',
              fontSize: '0.72rem',
              fontWeight: 900,
              letterSpacing: '2px',
              color: isTgt ? '#C084FC' : '#F4D06F',
              border: `1px solid ${corPrincipal}`,
              backgroundColor: `${corPrincipal}14`,
            }}
          >
            {isTgt
              ? 'EXIBINDO RANKING: ARENA TRUE GOTY'
              : 'EXIBINDO RANKING: MERCADO (TGA) — SEM VÍNCULO OFICIAL'}
          </div>
          <p style={{ color: '#D1D5DB', fontSize: '1.05rem', margin: '0 0 1.75rem 0' }}>
            {isTgt
              ? 'Nenhum voto registrado ainda nesta arena. Seja o primeiro a definir o placar!'
              : 'A Arena Mercado (TGA) aguarda a revelação oficial dos indicados e os primeiros vereditos da comunidade.'}
          </p>
          <Link
            href={`/votar/${categoria}`}
            className="btn-arena"
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.3rem',
              background: isTgt
                ? 'linear-gradient(135deg, #7e22ce, #B026FF)'
                : 'linear-gradient(135deg, #B8860B, #D4AF37)',
              color: isTgt ? '#FFF' : '#000',
            }}
          >
            IR PARA A ARENA →
          </Link>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              flexWrap: 'wrap',
              padding: '0.75rem 1.25rem',
              backgroundColor: isTgt ? 'rgba(176, 38, 255, 0.12)' : 'rgba(212, 175, 55, 0.12)',
              border: `1px solid ${corPrincipal}`,
              borderLeft: `4px solid ${corPrincipal}`,
              borderRadius: '0px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: corPrincipal,
                  boxShadow: `0 0 10px ${corPrincipal}`,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  letterSpacing: '1.8px',
                  textTransform: 'uppercase',
                }}
              >
                {isTgt
                  ? 'EXIBINDO RANKING: ARENA TRUE GOTY'
                  : 'EXIBINDO RANKING: MERCADO (TGA) — SEM VÍNCULO OFICIAL'}
              </span>
            </div>
            <span style={{ color: '#a1a1aa', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1px' }}>
              TOP {ranking.length} • CONFRONTO DIRETO
            </span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <Link href={`/indicados/${ranking[0].slug}/confrontos?cat=${categoria}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div className="ranking-campeao-card">
                <div
                  style={{
                    width: '132px',
                    aspectRatio: '3 / 4',
                    flexShrink: 0,
                    border: '2px solid #D4AF37',
                    borderRadius: '0px',
                    overflow: 'hidden',
                    boxShadow: '0 0 24px rgba(212, 175, 55, 0.3)',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  <img src={ranking[0].imagem} alt={ranking[0].titulo} className="ranking-cover-zoom" />
                </div>

                <div
                  className="ranking-campeao-info"
                  style={{ position: 'relative', zIndex: 2, display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#D4AF37',
                        fontWeight: 900,
                        fontSize: '0.82rem',
                        letterSpacing: '2px',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
                      </svg>
                      1º LUGAR • CAMPEÃO
                    </div>
                    <h2 className="font-arena" style={{ color: '#FFF', fontSize: 'clamp(1.9rem, 4vw, 2.5rem)', fontWeight: 900, margin: 0, lineHeight: 1, maxWidth: '420px' }}>
                      {ranking[0].titulo}
                    </h2>
                    <div style={{ color: '#a1a1aa', fontSize: '0.85rem', marginTop: '0.6rem' }}>
                      ÍNDICE INICIAL: <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>★ {ranking[0].rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingRight: '0.5rem' }}>
                    <span className="font-arena" style={{ color: '#D4AF37', fontSize: '4.5rem', fontWeight: 900, lineHeight: 0.8, textShadow: '0 0 20px rgba(212, 175, 55, 0.5)' }}>
                      {ranking[0].pontos}
                    </span>
                    <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', marginTop: '0.4rem' }}>
                      {semVotos ? 'PTS' : 'VITÓRIAS'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {podiumSecundario.length > 0 && (
            <div className="ranking-podio-grid">
              {podiumSecundario.map((jogo, index) => {
                const isPrata = index === 0;
                const corBorda = isPrata ? '#E2E8F0' : '#CD7F32';
                const labelPosicao = isPrata ? '2º LUGAR • PRATA' : '3º LUGAR • BRONZE';

                return (
                  <motion.div
                    key={jogo.titulo}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.15 + index * 0.1 }}
                  >
                    <Link href={`/indicados/${jogo.slug}/confrontos?cat=${categoria}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                      <div
                        className="ranking-vice-card"
                        style={{
                          border: `1px solid ${corBorda}`,
                          boxShadow: `inset 0 0 28px ${isPrata ? 'rgba(226, 232, 240, 0.08)' : 'rgba(205, 127, 50, 0.1)'}`,
                          height: '100%',
                          boxSizing: 'border-box',
                        }}
                      >
                        <div
                          style={{
                            width: '78px',
                            aspectRatio: '3 / 4',
                            flexShrink: 0,
                            border: `2px solid ${corBorda}`,
                            borderRadius: '0px',
                            overflow: 'hidden',
                            position: 'relative',
                            zIndex: 2,
                          }}
                        >
                          <img src={jogo.imagem} alt={jogo.titulo} className="ranking-cover-zoom" />
                        </div>

                        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ color: corBorda, fontSize: '0.7rem', fontWeight: 900, letterSpacing: '1.5px', marginBottom: '0.35rem' }}>
                              {labelPosicao}
                            </div>
                            <h3 className="font-arena" style={{ color: '#FFF', fontSize: '1.35rem', fontWeight: 900, margin: 0, lineHeight: 1.05 }}>
                              {jogo.titulo}
                            </h3>
                            <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                              ★ {jogo.rating.toFixed(1)}
                            </div>
                          </div>

                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <span className="font-arena" style={{ color: corBorda, fontSize: '2.2rem', fontWeight: 900, lineHeight: 1 }}>
                              {jogo.pontos}
                            </span>
                            <span style={{ display: 'block', color: '#71717a', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '1px' }}>
                              PTS
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {ranking.length > 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.25rem' }}>
              {ranking.slice(3).map((jogo, index) => (
                <motion.div
                  key={jogo.titulo}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.3 + index * 0.04 }}
                >
                  <Link href={`/indicados/${jogo.slug}/confrontos?cat=${categoria}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.2rem',
                        backgroundColor: 'rgba(20, 20, 24, 0.78)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '0px',
                        padding: '0.8rem 1.4rem',
                        transition: 'border-color 0.2s ease, background-color 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = corPrincipal;
                        e.currentTarget.style.backgroundColor = 'rgba(28, 28, 34, 0.92)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.backgroundColor = 'rgba(20, 20, 24, 0.78)';
                      }}
                    >
                      <div className="font-arena" style={{ color: '#71717a', fontSize: '1.55rem', fontWeight: 900, width: '32px', textAlign: 'center', flexShrink: 0 }}>
                        {index + 4}º
                      </div>

                      <div
                        style={{
                          width: '48px',
                          aspectRatio: '3 / 4',
                          flexShrink: 0,
                          border: '1px solid rgba(255, 255, 255, 0.14)',
                          borderRadius: '0px',
                          overflow: 'hidden',
                        }}
                      >
                        <img src={jogo.imagem} alt={jogo.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ color: 'var(--text-light)', fontSize: '1rem', fontWeight: 800, margin: 0 }}>{jogo.titulo}</h4>
                        <span style={{ color: '#71717a', fontSize: '0.75rem' }}>ÍNDICE: ★ {jogo.rating.toFixed(1)}</span>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span className="font-arena" style={{ color: corPrincipal, fontSize: '1.6rem', fontWeight: 900, lineHeight: 1 }}>
                          {jogo.pontos}
                        </span>
                        <span style={{ display: 'block', color: '#71717a', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '1px' }}>
                          PTS
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default function PlacarGlobal() {
  return (
    <Suspense fallback={<main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--purple-neon)' }}>Carregando...</main>}>
      <PlacarGlobalContent />
    </Suspense>
  );
}