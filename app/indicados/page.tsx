'use client';

import { useState } from 'react';
import jogosData from '@/lib/jogos.json';
import Link from 'next/link';
import { motion } from 'framer-motion';

function formatarNota(nota: number) {
  if (typeof nota !== 'number') return nota;
  return nota.toFixed(1);
}

// Links oficiais por slug e plataforma
const LINKS_OFICIAIS: Record<string, Partial<Record<'pc' | 'ps5' | 'xbox' | 'switch', string>>> = {
  '007-first-light': {
    pc: 'https://store.steampowered.com/search/?term=007+First+Light',
    ps5: 'https://store.playstation.com/pt-br/search/007%20First%20Light',
    xbox: 'https://www.xbox.com/pt-BR/search/results/games?q=007+First+Light',
  },
  'control-resonant': {
    pc: 'https://store.steampowered.com/search/?term=Control+Resonant',
    ps5: 'https://store.playstation.com/pt-br/search/Control%20Resonant',
    xbox: 'https://www.xbox.com/pt-BR/search/results/games?q=Control+Resonant',
  },
  'queens-domain': {
    pc: 'https://store.steampowered.com/search/?term=Queens+Domain',
    ps5: 'https://store.playstation.com/pt-br/search/Queens%20Domain',
    xbox: 'https://www.xbox.com/pt-BR/search/results/games?q=Queens+Domain',
  },
  'splatoon-raiders': {
    switch: 'https://www.nintendo.com/pt-br/search/#q=Splatoon+Raiders',
  },
  'trails-in-the-sky-2nd': {
    pc: 'https://store.steampowered.com/search/?term=Trails+in+the+Sky',
    ps5: 'https://store.playstation.com/pt-br/search/Trails%20in%20the%20Sky',
    switch: 'https://www.nintendo.com/pt-br/search/#q=Trails+in+the+Sky',
  },
  pragmata: {
    pc: 'https://store.steampowered.com/search/?term=Pragmata',
    ps5: 'https://store.playstation.com/pt-br/search/Pragmata',
    xbox: 'https://www.xbox.com/pt-BR/search/results/games?q=Pragmata',
  },
  'forza-6': {
    pc: 'https://store.steampowered.com/search/?term=Forza+Horizon+6',
    xbox: 'https://www.xbox.com/pt-BR/games/forza-horizon',
  },
  'gta-vi': {
    ps5: 'https://www.playstation.com/pt-br/games/grand-theft-auto-vi/',
    xbox: 'https://www.xbox.com/pt-BR/games/store/grand-theft-auto-vi',
  },
  mina: {
    pc: 'https://store.steampowered.com/app/1875580/Mina_the_Hollower/',
    switch: 'https://www.nintendo.com/pt-br/search/#q=Mina+the_Hollower',
  },
  onimusha: {
    pc: 'https://store.steampowered.com/search/?term=Onimusha+Way+of+the+Sword',
    ps5: 'https://store.playstation.com/pt-br/search/Onimusha%20Way%20of%20the%20Sword',
    xbox: 'https://www.xbox.com/pt-BR/search/results/games?q=Onimusha+Way+of+the+Sword',
  },
  phantom: {
    pc: 'https://store.steampowered.com/search/?term=Phantom+Blade+Zero',
    ps5: 'https://www.playstation.com/pt-br/games/phantom-blade-zero/',
  },
  pokopia: {
    switch: 'https://www.nintendo.com/pt-br/search/#q=Pokemon+Pokopia',
  },
  're-requiem': {
    pc: 'https://store.steampowered.com/search/?term=Resident+Evil+Requiem',
    ps5: 'https://store.playstation.com/pt-br/search/Resident%20Evil%20Requiem',
    xbox: 'https://www.xbox.com/pt-BR/search/results/games?q=Resident+Evil+Requiem',
  },
  saros: {
    ps5: 'https://www.playstation.com/pt-br/games/saros/',
  },
  zelda: {
    switch: 'https://www.nintendo.com/pt-br/store/products/nintendo-64-nintendo-switch-online-switch/',
  },
};

// --- ÍCONES VETORIAIS OFICIAIS DAS PLATAFORMAS ---
const IconPC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <title>Ver na Steam (PC)</title>
    <path d="M2 3h9v8.5H2V3zm11 0h9v8.5h-9V3zM2 13h9v8H2v-8zm11 0h9v8h-9v-8z" />
  </svg>
);

const IconPlayStation = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <title>Ver na PlayStation Store</title>
    <path d="M8.984 2.596v17.547l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.18.76.814.76 1.505v5.875c2.441 1.193 4.362-.002 4.362-3.152 0-3.237-1.126-4.675-4.438-5.827-1.307-.448-3.728-1.186-5.39-1.502zm4.656 16.241l6.296-2.275c.715-.258.826-.625.246-.818-.586-.192-1.637-.139-2.357.123l-4.205 1.5V14.98l.24-.085s1.201-.42 2.913-.615c1.696-.18 3.785.03 5.437.661 1.848.601 2.04 1.472 1.576 2.072-.465.6-1.622 1.036-1.622 1.036l-8.544 3.107V18.86zM1.807 18.6c-1.9-.545-2.214-1.668-1.352-2.32.801-.586 2.16-1.052 2.16-1.052l5.615-2.013v2.313L4.205 17c-.705.271-.825.632-.239.826.586.195 1.637.15 2.343-.12L8.247 17v2.074c-.12.03-.256.044-.39.073-1.939.331-3.996.196-6.038-.479z" />
  </svg>
);

const IconXbox = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <title>Ver na Xbox Store</title>
    <path d="M4.102 21.033A11.947 11.947 0 0012 24a11.96 11.96 0 007.902-2.967c1.877-1.912-4.316-8.709-7.902-11.417-3.582 2.708-9.779 9.505-7.898 11.417zm11.16-14.406c2.5 2.961 7.484 10.313 6.076 12.912A11.942 11.942 0 0024 12.004a11.95 11.95 0 00-3.57-8.536s-.027-.022-.082-.042a.12.12 0 00-.072-.018c-.499 0-1.908.397-5.014 3.219zM11.997 0C8.82 0 5.927 1.152 3.694 3.062c.06-.012.124-.018.189-.018 1.484 0 4.53 1.44 8.117 3.748 3.587-2.308 6.633-3.748 8.117-3.748.065 0 .129.006.189.018A11.95 11.95 0 0011.997 0zM3.652 3.426c-.055.02-.082.042-.082.042A11.95 11.95 0 000 12.004c0 2.854.998 5.475 2.662 7.535-1.408-2.6 3.576-9.951 6.076-12.912C5.632 3.805 4.223 3.408 3.724 3.408a.12.12 0 00-.072.018z" />
  </svg>
);

const IconSwitch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <title>Ver na Nintendo eShop</title>
    <path d="M10.04 20.4H7.1c-1.94 0-3.5-1.58-3.5-3.52V7.12c0-1.94 1.56-3.52 3.5-3.52h2.94v16.8zM7.1 2C4.29 2 2 4.29 2 7.12v9.76C2 19.71 4.29 22 7.1 22h4.54V2H7.1zm.52 5.42a1.72 1.72 0 1 0 0 3.44 1.72 1.72 0 0 0 0-3.44zM16.9 2h-3.54v20h3.54c2.81 0 5.1-2.29 5.1-5.12V7.12C22 4.29 19.71 2 16.9 2zm-.52 12.78a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44z" />
  </svg>
);

const IconSwords = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
    <path d="M13 19l6-6" />
    <path d="M16 16l4 4" />
    <path d="M19 21l2-2" />
    <path d="M14.5 6.5L18 3h3v3l-3.5 3.5" />
    <path d="M5 14l6 6" />
    <path d="M8 17l-4 4" />
    <path d="M5 19l-2 2" />
  </svg>
);

function renderizarPlataformas(slug: string, plataformas: string[], corPrincipal: string) {
  if (!plataformas) return null;
  const mapaLinks = LINKS_OFICIAIS[slug] || {};

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start', flexWrap: 'wrap', marginTop: '0.6rem', alignItems: 'center' }}>
      {plataformas.map((p) => {
        const pLower = p.toLowerCase();
        let icone = null;
        let chave: 'pc' | 'ps5' | 'xbox' | 'switch' | null = null;
        let labelLoja = p;

        if (pLower === 'ps5' || pLower === 'playstation') {
          icone = <IconPlayStation />;
          chave = 'ps5';
          labelLoja = 'PlayStation Store';
        } else if (pLower === 'xbox') {
          icone = <IconXbox />;
          chave = 'xbox';
          labelLoja = 'Xbox Store';
        } else if (pLower === 'switch' || pLower === 'nintendo') {
          icone = <IconSwitch />;
          chave = 'switch';
          labelLoja = 'Nintendo eShop';
        } else if (pLower === 'pc') {
          icone = <IconPC />;
          chave = 'pc';
          labelLoja = 'Steam (PC)';
        } else {
          return null;
        }

        const href = chave ? mapaLinks[chave] : undefined;

        if (!href) {
          return (
            <span key={p} style={{ display: 'inline-flex', alignItems: 'center', color: '#a1a1aa' }}>
              {icone}
            </span>
          );
        }

        return (
          <a
            key={p}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir na ${labelLoja}`}
            title={`Abrir na ${labelLoja}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a1a1aa',
              transition: 'color 0.2s, transform 0.2s',
              padding: '2px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = corPrincipal;
              e.currentTarget.style.transform = 'scale(1.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#a1a1aa';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {icone}
          </a>
        );
      })}
    </div>
  );
}

export default function Indicados() {
  const [categoria, setCategoria] = useState<'tgt' | 'mercado'>('tgt');
  const jogos = (jogosData as any)[categoria]?.top10 || [];

  const isTgt = categoria === 'tgt';
  const corPrincipal = isTgt ? '#B026FF' : '#D4AF37';
  const corTextoHoverCta = isTgt ? '#FFFFFF' : '#0A0A0A';
  const corSombraCard = isTgt ? 'rgba(176, 38, 255, 0.28)' : 'rgba(212, 175, 55, 0.28)';

  return (
    <main
      style={{
        minHeight: 'calc(100vh - 80px)',
        padding: 'clamp(115px, 14vh, 145px) 2rem 4rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
        width: '100%',
      }}
    >
      <style>{`
        .indicado-card {
          background-color: #111114;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0px;
          position: relative;
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
        }

        .indicado-card:hover {
          border-color: ${corPrincipal};
          box-shadow: 0 14px 34px ${corSombraCard};
        }

        .indicado-card:hover .indicado-cover {
          transform: scale(1.04);
        }

        .indicado-cover {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .raio-x-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 0.72rem 1rem;
          text-decoration: none;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background-color: ${isTgt ? 'rgba(176, 38, 255, 0.08)' : 'rgba(212, 175, 55, 0.08)'};
          color: ${corPrincipal};
          font-family: var(--font-teko), sans-serif;
          font-size: 1.08rem;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }

        .raio-x-cta-left {
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .raio-x-arrow {
          display: inline-block;
          transition: transform 0.25s ease;
        }

        .indicado-card:hover .raio-x-cta {
          background-color: ${corPrincipal};
          border-top-color: ${corPrincipal};
          color: ${corTextoHoverCta};
        }

        .indicado-card:hover .raio-x-arrow {
          transform: translateX(4px);
        }
      `}</style>

      {/* CABEÇALHO DINÂMICO */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: corPrincipal,
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            marginBottom: '1rem',
            backgroundColor: `${corPrincipal}15`,
            padding: '8px 20px',
            borderLeft: `3px solid ${corPrincipal}`,
            borderRadius: '0px',
          }}
        >
          <span>[ FINALISTAS DA TEMPORADA 2026 ]</span>
        </motion.div>

        <motion.h1
          key={categoria}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-arena"
          style={{
            color: 'var(--text-light)',
            fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)',
            fontWeight: 900,
            margin: '0 0 1.25rem 0',
            lineHeight: 0.95,
          }}
        >
          {isTgt ? (
            <>
              INDICADOS <span style={{ color: '#71717a' }}>//</span>{' '}
              <span style={{ color: '#B026FF' }}>ARENA TRUE GOTY</span>
            </>
          ) : (
            <>
              INDICADOS <span style={{ color: '#71717a' }}>//</span>{' '}
              <span style={{ color: '#D4AF37' }}>MERCADO (TGA)</span>
            </>
          )}
        </motion.h1>

        {/* SELETOR DE CATEGORIA */}
        <div
          style={{
            display: 'inline-flex',
            marginTop: '0.5rem',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '0px',
            overflow: 'hidden',
          }}
        >
          <button
            type="button"
            onClick={() => setCategoria('tgt')}
            style={{
              padding: '0.9rem 2.2rem',
              fontFamily: 'var(--font-teko), sans-serif',
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '1px',
              cursor: 'pointer',
              border: 'none',
              borderRadius: '0px',
              backgroundColor: isTgt ? '#B026FF' : 'rgba(255,255,255,0.04)',
              color: isTgt ? '#FFF' : '#8b8b94',
              transition: 'all 0.25s',
            }}
          >
            ARENA TRUE GOTY
          </button>
          <button
            type="button"
            onClick={() => setCategoria('mercado')}
            style={{
              padding: '0.9rem 2.2rem',
              fontFamily: 'var(--font-teko), sans-serif',
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '1px',
              cursor: 'pointer',
              border: 'none',
              borderLeft: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '0px',
              backgroundColor: !isTgt ? '#D4AF37' : 'rgba(255,255,255,0.04)',
              color: !isTgt ? '#000' : '#8b8b94',
              transition: 'all 0.25s',
            }}
          >
            MERCADO (TGA)
          </button>
        </div>

        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', maxWidth: '660px', margin: '1.5rem auto 0', lineHeight: 1.55 }}>
          {isTgt
            ? 'Analise os finalistas da comunidade. Clique em qualquer jogo ou na faixa Raio-X 1v1 para abrir seu histórico completo de confrontos.'
            : 'Os finalistas decididos pela indústria (Geoff Keighley). Lista meramente comparativa, sem vínculo oficial com o The Game Awards.'}
        </p>
      </div>

      {/* ESTADO VAZIO */}
      {jogos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            maxWidth: '640px',
            width: '100%',
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: 'rgba(24, 20, 12, 0.75)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '0px',
            marginTop: '1rem',
          }}
        >
          <div
            className="font-arena"
            style={{ color: '#D4AF37', fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '1.5px' }}
          >
            REVELAÇÃO OFICIAL EM 19/11
          </div>
          <p style={{ color: '#D1D5DB', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1.75rem 0' }}>
            Assim que os indicados do mercado forem anunciados, os finalistas aparecerão aqui para os confrontos diretos.
          </p>
          <button
            type="button"
            onClick={() => setCategoria('tgt')}
            className="btn-arena"
            style={{ padding: '0.95rem 2.5rem', fontSize: '1.3rem' }}
          >
            VER INDICADOS TRUE GOTY
          </button>
        </motion.div>
      ) : (
        /* GRID DE CARTAS */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '1600px',
            justifyContent: 'center',
            flex: 1,
            zIndex: 1,
          }}
        >
          {jogos.map((jogo: any, index: number) => (
            <motion.div
              key={jogo.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div className="indicado-card">
                <Link
                  href={`/indicados/${jogo.slug}/confrontos?cat=${categoria}`}
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', flex: 1 }}
                >
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden' }}>
                    <img src={jogo.imagem} alt={jogo.titulo} className="indicado-cover" />

                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, #111114 0%, rgba(17,17,20,0.8) 28%, transparent 70%)',
                      }}
                    />

                    {typeof jogo.user_rating_original === 'number' && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          backgroundColor: '#0A0A0A',
                          color: isTgt ? '#D4AF37' : '#FFF',
                          padding: '3px 9px',
                          borderRadius: '0px',
                          border: `1px solid ${isTgt ? '#D4AF37' : 'rgba(255,255,255,0.25)'}`,
                          fontWeight: 900,
                          fontSize: '0.95rem',
                          zIndex: 10,
                          boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                          fontFamily: 'var(--font-teko)',
                        }}
                      >
                        {formatarNota(jogo.user_rating_original)}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '0 1rem', marginTop: '-8px', position: 'relative', zIndex: 2 }}>
                    <h3
                      className="font-arena"
                      style={{
                        fontSize: '1.35rem',
                        margin: '0',
                        fontWeight: 700,
                        color: 'var(--text-light)',
                        lineHeight: 1.05,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.2em',
                      }}
                    >
                      {jogo.titulo}
                    </h3>
                  </div>
                </Link>

                <div style={{ padding: '0 1rem 0.9rem 1rem' }}>
                  {renderizarPlataformas(jogo.slug, jogo.plataformas, corPrincipal)}
                </div>

                <Link
                  href={`/indicados/${jogo.slug}/confrontos?cat=${categoria}`}
                  className="raio-x-cta"
                >
                  <span className="raio-x-cta-left">
                    <IconSwords />
                    <span>VER RAIO-X 1V1</span>
                  </span>
                  <span className="raio-x-arrow">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {jogos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginTop: '4rem', textAlign: 'center' }}
        >
          <p style={{ color: '#a1a1aa', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            Já escolheu seus favoritos?
          </p>
          <Link
            href={`/votar/${categoria}`}
            className="btn-arena"
            style={{
              padding: '1.2rem 4rem',
              fontSize: '1.5rem',
              background: isTgt
                ? 'linear-gradient(135deg, #7e22ce, #B026FF)'
                : 'linear-gradient(135deg, #B8860B, #D4AF37)',
              color: isTgt ? '#FFF' : '#000',
            }}
          >
            ENTRAR NA ARENA DE VOTAÇÃO
          </Link>
        </motion.div>
      )}
    </main>
  );
}