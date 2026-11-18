// app/resultados/global/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import jogosData from '@/lib/jogos.json';

function PlacarGlobalContent() {
  const searchParams = useSearchParams();
  const categoria = searchParams.get('cat') || 'tgt';
  
  const [ranking, setRanking] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  const isTgt = categoria === 'tgt';
  const corPrincipal = isTgt ? 'var(--purple-neon)' : '#D4AF37';

  useEffect(() => {
    async function fetchRanking() {
      setCarregando(true);
      try {
        const res = await fetch(`/api/ranking?category=${categoria}`);
        const json = await res.json();
        
        if (json.success) {
          const jogosJSON = (jogosData as any)[categoria]?.top10 || [];
          
          const rankingCompleto = json.ranking.map((item: any) => {
            const infoJogo = jogosJSON.find((j: any) => j.titulo === item.game_title);
            return {
              titulo: item.game_title,
              pontos: item.total_score,
              imagem: infoJogo?.imagem || '/placeholder.jpg',
              rating: infoJogo?.user_rating_original || 0,
              slug: infoJogo?.slug || '#'
            };
          });

          setRanking(rankingCompleto);
        }
      } catch (error) {
        console.error("Erro ao carregar ranking:", error);
      } finally {
        setCarregando(false);
      }
    }

    fetchRanking();
  }, [categoria]);

  const semVotos = ranking.length > 0 && ranking.every(j => j.pontos === 0);

  const cardClip = 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)';
  const btnClip = 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)';
  // Novos cortes específicos para as imagens (3/4)
  const imgClipBig = 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)';
  const imgClipSmall = 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)';

  return (
    <main style={{ minHeight: '100vh', padding: '120px 2rem 4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* NAVEGAÇÃO DE ABAS */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <Link href={`/resultados/global?cat=${categoria}`} style={{ padding: '0.8rem 2rem', backgroundColor: corPrincipal, color: isTgt ? '#FFF' : '#000', textDecoration: 'none', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '1px', clipPath: btnClip }}>
          PLACAR GLOBAL
        </Link>
        <Link href={`/resultados/pessoal?cat=${categoria}`} style={{ padding: '0.8rem 2rem', backgroundColor: 'rgba(255,255,255,0.05)', color: '#a1a1aa', textDecoration: 'none', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '1px', clipPath: btnClip, border: '1px solid rgba(255,255,255,0.1)' }}>
          MEU PÓDIO
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--text-light)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '0.5rem', lineHeight: 1 }}>
          O TRONO DA <span style={{ color: corPrincipal }}>ARENA</span>
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          O veredito matemático da comunidade. Cada ponto representa uma vitória direta no mano a mano.
        </p>
      </div>

      {semVotos && !carregando && (
        <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', color: '#D4AF37', padding: '8px 20px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', marginBottom: '2rem', clipPath: btnClip }}>
          [ APURAÇÃO INICIADA • AGUARDANDO OS PRIMEIROS VEREDITOS ]
        </div>
      )}

      {carregando ? (
        <div style={{ color: corPrincipal, fontSize: '1.2rem', marginTop: '4rem', fontWeight: 'bold', letterSpacing: '2px' }}>CONTANDO OS VOTOS...</div>
      ) : ranking.length === 0 ? (
        <div style={{ color: '#a1a1aa', fontSize: '1.2rem', marginTop: '2rem' }}>Nenhum voto registrado ainda. Seja o primeiro a votar!</div>
      ) : (
        <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* 1º LUGAR (O TRONO) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href={`/indicados/${ranking[0].slug}/confrontos?cat=${categoria}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ 
                position: 'relative', backgroundColor: '#111114', display: 'flex', alignItems: 'center', padding: '1.5rem', gap: '1.5rem',
                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                boxShadow: `inset 0 0 0 2px #D4AF37, inset 0 0 40px rgba(212, 175, 55, 0.1)`,
                overflow: 'hidden'
              }}>
                {/* Imagem 3/4 do Campeão (com corte chanfrado e zoom no hover) */}
                <div style={{ 
                  width: '130px', aspectRatio: '3 / 4', flexShrink: 0, background: '#D4AF37', padding: '2px', 
                  clipPath: imgClipBig, position: 'relative', zIndex: 2,
                  transition: 'transform 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ width: '100%', height: '100%', clipPath: imgClipBig, overflow: 'hidden' }}>
                    <img src={ranking[0].imagem} alt={ranking[0].titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                </div>
                
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D4AF37', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
                      CAMPEÃO
                    </div>
                    <h2 className="font-arena" style={{ color: '#FFF', fontSize: '2.2rem', fontWeight: 900, margin: 0, lineHeight: 1, maxWidth: '400px' }}>
                      {ranking[0].titulo}
                    </h2>
                    <div style={{ color: '#a1a1aa', fontSize: '0.85rem', marginTop: '0.6rem' }}>
                      ÍNDICE INICIAL: <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>★ {ranking[0].rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingRight: '1rem' }}>
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

          {/* 2º E 3º LUGARES (PÓDIO) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
            {[ranking[1], ranking[2]].map((jogo, index) => {
              const isPrata = index === 0;
              const corBorda = isPrata ? '#E2E8F0' : '#CD7F32';
              return (
                <motion.div key={jogo.titulo} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}>
                  <Link href={`/indicados/${jogo.slug}/confrontos?cat=${categoria}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{ 
                      position: 'relative', backgroundColor: '#111114', display: 'flex', alignItems: 'center', padding: '1rem', gap: '1rem',
                      clipPath: cardClip, boxShadow: `inset 0 0 0 1px ${corBorda}80`, overflow: 'hidden'
                    }}>
                      
                      {/* Imagem 3/4 (com corte) */}
                      <div style={{ 
                        width: '75px', aspectRatio: '3 / 4', flexShrink: 0, background: corBorda, padding: '1px',
                        clipPath: imgClipSmall, position: 'relative', zIndex: 2,
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <div style={{ width: '100%', height: '100%', clipPath: imgClipSmall, overflow: 'hidden' }}>
                          <img src={jogo.imagem} alt={jogo.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                        </div>
                      </div>
                      
                      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 className="font-arena" style={{ color: '#FFF', fontSize: '1.2rem', fontWeight: 900, margin: 0, lineHeight: 1 }}>{jogo.titulo}</h3>
                          <div style={{ color: '#a1a1aa', fontSize: '0.7rem', marginTop: '0.4rem' }}>★ {jogo.rating.toFixed(1)}</div>
                        </div>
                        <div style={{ textAlign: 'right', paddingLeft: '0.5rem' }}>
                          <span className="font-arena" style={{ color: corBorda, fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>{jogo.pontos}</span>
                          <span style={{ display: 'block', color: '#71717a', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '1px' }}>PTS</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* 4º AO 10º (A LISTA) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.5rem' }}>
            {ranking.slice(3).map((jogo, index) => (
              <motion.div key={jogo.titulo} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.4 + (index * 0.05) }}>
                <Link href={`/indicados/${jogo.slug}/confrontos?cat=${categoria}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '1.2rem', backgroundColor: 'rgba(28, 28, 30, 0.5)', 
                    border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem 1.5rem', clipPath: btnClip,
                    transition: 'border-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = corPrincipal}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                  >
                    <div className="font-arena" style={{ color: '#71717a', fontSize: '1.5rem', fontWeight: 900, width: '30px', textAlign: 'center' }}>
                      {index + 4}º
                    </div>
                    
                    {/* Imagem 3/4 Menor */}
                    <div style={{ 
                      width: '50px', aspectRatio: '3 / 4', flexShrink: 0,
                      clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)', overflow: 'hidden',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <img src={jogo.imagem} alt={jogo.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'var(--text-light)', fontSize: '1rem', fontWeight: 800, margin: 0 }}>{jogo.titulo}</h4>
                      <span style={{ color: '#71717a', fontSize: '0.75rem' }}>ÍNDICE: ★ {jogo.rating.toFixed(1)}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="font-arena" style={{ color: corPrincipal, fontSize: '1.5rem', fontWeight: 900, lineHeight: 1 }}>{jogo.pontos}</span>
                      <span style={{ display: 'block', color: '#71717a', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '1px' }}>PTS</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

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