// app/indicados/page.tsx
'use client';

import { useState } from 'react';
import jogosData from '@/lib/jogos.json';
import Link from 'next/link';
import { motion } from 'framer-motion';

function formatarNota(nota: number) {
  if (typeof nota !== 'number') return nota;
  return nota.toFixed(1);
}

// --- ÍCONES DAS PLATAFORMAS (Lineares e Proporcionais) ---
const IconPC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <title>PC</title>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const IconPlayStation = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <title>PlayStation</title>
    <path d="M8.984 2.596v17.547l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.18.76.814.76 1.505v5.875c2.441 1.193 4.362-.002 4.362-3.152 0-3.237-1.126-4.675-4.438-5.827-1.307-.448-3.728-1.186-5.39-1.502zm4.656 16.241l6.296-2.275c.715-.258.826-.625.246-.818-.586-.192-1.637-.139-2.357.123l-4.205 1.5V14.98l.24-.085s1.201-.42 2.913-.615c1.696-.18 3.785.03 5.437.661 1.848.601 2.04 1.472 1.576 2.072-.465.6-1.622 1.036-1.622 1.036l-8.544 3.107V18.86zM1.807 18.6c-1.9-.545-2.214-1.668-1.352-2.32.801-.586 2.16-1.052 2.16-1.052l5.615-2.013v2.313L4.205 17c-.705.271-.825.632-.239.826.586.195 1.637.15 2.343-.12L8.247 17v2.074c-.12.03-.256.044-.39.073-1.939.331-3.996.196-6.038-.479z"/>
  </svg>
);

const IconXbox = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <title>Xbox</title>
    <circle cx="12" cy="12" r="10" />
    <path d="M15 9l-6 6M9 9l6 6" />
  </svg>
);

const IconSwitch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <title>Nintendo Switch</title>
    <rect x="2" y="6" width="9" height="16" rx="4" />
    <rect x="13" y="2" width="9" height="16" rx="4" />
    <circle cx="6.5" cy="10" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="17.5" cy="14" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

function renderizarPlataformas(plataformas: string[], corPrincipal: string) {
  if (!plataformas) return null;
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-start', flexWrap: 'wrap', marginTop: '0.8rem', alignItems: 'center' }}>
      {plataformas.map(p => {
        const pLower = p.toLowerCase();
        let icone = null;

        if (pLower === 'ps5' || pLower === 'playstation') icone = <IconPlayStation />;
        else if (pLower === 'xbox') icone = <IconXbox />;
        else if (pLower === 'switch' || pLower === 'nintendo') icone = <IconSwitch />;
        else if (pLower === 'pc') icone = <IconPC />;
        else return null;

        return (
          <div
            key={p}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a1a1aa',
              transition: 'color 0.2s',
              cursor: 'help'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = corPrincipal; }}
            onMouseOut={(e) => { e.currentTarget.style.color = '#a1a1aa'; }}
          >
            {icone}
          </div>
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

  return (
    <main style={{ minHeight: 'calc(100vh - 80px)', padding: '100px 2rem 4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: corPrincipal, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem', backgroundColor: `${corPrincipal}15`, padding: '8px 20px', transform: 'skewX(-10deg)', borderLeft: `3px solid ${corPrincipal}` }}
        >
          <span style={{ transform: 'skewX(10deg)' }}>[ ROSTER OFICIAL DA ARENA ]</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="font-arena"
          style={{ color: 'var(--text-light)', fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 0.9 }}
        >
          OS DESAFIANTES <span style={{ color: corPrincipal }}>2026</span>
        </motion.h1>

        {/* SELETOR DE CATEGORIA */}
        <div style={{ display: 'inline-flex', marginTop: '1rem', position: 'relative' }}>
          <button
            onClick={() => setCategoria('tgt')}
            style={{
              padding: '1rem 2.5rem', fontFamily: 'var(--font-teko), sans-serif', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', border: 'none',
              backgroundColor: isTgt ? '#B026FF' : 'rgba(255,255,255,0.05)', color: isTgt ? '#FFF' : '#71717a', transition: 'all 0.3s',
              clipPath: 'polygon(15px 0, 100% 0, 100% 100%, 0 100%, 0 15px)',
              zIndex: isTgt ? 2 : 1, transform: isTgt ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: isTgt ? '0 5px 20px rgba(176, 38, 255, 0.4)' : 'none', marginRight: '-10px'
            }}
          >
            ARENA TRUE GOTY
          </button>
          <button
            onClick={() => setCategoria('mercado')}
            style={{
              padding: '1rem 2.5rem', fontFamily: 'var(--font-teko), sans-serif', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', border: 'none',
              backgroundColor: !isTgt ? '#D4AF37' : 'rgba(255,255,255,0.05)', color: !isTgt ? '#000' : '#71717a', transition: 'all 0.3s',
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)',
              zIndex: !isTgt ? 2 : 1, transform: !isTgt ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: !isTgt ? '0 5px 20px rgba(212, 175, 55, 0.4)' : 'none', marginLeft: '-10px'
            }}
          >
            MERCADO (TGA)
          </button>
        </div>

        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', marginTop: '1.5rem', maxWidth: '600px', margin: '1.5rem auto 0' }}>
          Analise os finalistas. Clique em qualquer título para abrir sua ficha de combate e histórico de duelos 1v1.
        </p>
      </div>

      {/* GRID DE CARTAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '1600px', justifyContent: 'center', flex: 1, zIndex: 1 }}>
        {jogos.map((jogo: any, index: number) => (
          <motion.div
            key={jogo.slug}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -8, scale: 1.02 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Link href={`/indicados/${jogo.slug}/confrontos?cat=${categoria}`} style={{ textDecoration: 'none', display: 'flex', height: '100%' }}>
              <div
                style={{
                  backgroundColor: '#111114',
                  clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
                  boxShadow: `inset 0 0 0 1px ${corPrincipal}40, inset 0 0 20px rgba(0,0,0,0.8)`,
                  position: 'relative', cursor: 'pointer', display: 'flex', flexDirection: 'column', width: '100%',
                  transition: 'box-shadow 0.3s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.boxShadow = `inset 0 0 0 2px ${corPrincipal}, inset 0 0 30px ${corPrincipal}40`; }}
                onMouseOut={(e) => { e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${corPrincipal}40, inset 0 0 20px rgba(0,0,0,0.8)`; }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden' }}>
                  <img src={jogo.imagem} alt={jogo.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #111114 0%, rgba(17,17,20,0.8) 30%, transparent 70%)' }} />

                  {/* Plaqueta de Nota Metálica (Rating) */}
                  {jogo.user_rating_original && (
                    <div style={{
                      position: 'absolute', top: '10px', right: '10px',
                      backgroundColor: '#0A0A0A', color: isTgt ? '#D4AF37' : '#FFF',
                      padding: '4px 10px',
                      clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                      border: `1px solid ${isTgt ? '#D4AF37' : '#555'}`,
                      fontWeight: 900, fontSize: '0.9rem', zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.5)', fontFamily: 'var(--font-teko)'
                    }}>
                      {formatarNota(jogo.user_rating_original)}
                    </div>
                  )}
                </div>

                <div style={{ padding: '0 1rem 1rem 1rem', marginTop: '-10px', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 className="font-arena" style={{
                    fontSize: '1.3rem', margin: '0 0 0.2rem 0', fontWeight: 700, color: 'var(--text-light)', lineHeight: 1,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.6em'
                  }}>
                    {jogo.titulo}
                  </h3>

                  {renderizarPlataformas(jogo.plataformas, corPrincipal)}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* BOTÃO CTA NO FINAL DA PÁGINA */}
      {jogos.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginTop: '4rem', textAlign: 'center' }}>
          <p style={{ color: '#a1a1aa', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Já escolheu seus favoritos?</p>
          <Link href={`/votar/${categoria}`} className="btn-arena" style={{ padding: '1.2rem 4rem', fontSize: '1.5rem', background: isTgt ? 'linear-gradient(135deg, #7e22ce, #B026FF)' : 'linear-gradient(135deg, #B8860B, #D4AF37)', color: isTgt ? '#FFF' : '#000' }}>
            ENTRAR NA ARENA DE VOTAÇÃO
          </Link>
        </motion.div>
      )}
    </main>
  );
}