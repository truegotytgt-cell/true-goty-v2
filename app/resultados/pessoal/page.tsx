// app/resultados/pessoal/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import jogosData from '@/lib/jogos.json';
import { calcularPlacar, Voto } from '@/lib/condorcet';

function RankingPessoalContent() {
  const searchParams = useSearchParams();
  const categoria = searchParams.get('cat') || 'tgt';

  const [ranking, setRanking] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [naoVotou, setNaoVotou] = useState(false);

  const isTgt = categoria === 'tgt';
  const corPrincipal = isTgt ? 'var(--purple-neon)' : '#D4AF37';

  useEffect(() => {
    const jogos = (jogosData as any)[categoria]?.top10 || [];
    setCarregando(true);
    setNaoVotou(false);
    setRanking([]);

    try {
      const rankingSalvo = localStorage.getItem(`tgt_my_ranking_${categoria}`);
      
      if (rankingSalvo) {
        const placar = JSON.parse(rankingSalvo);
        const rankingCompleto = placar.map((item: any) => {
          const infoJogo = jogos.find((j: any) => j.titulo === item.titulo);
          return {
            titulo: item.titulo,
            pontos: item.pontos,
            imagem: infoJogo?.imagem || '/placeholder.jpg',
            rating: infoJogo?.user_rating_original || 0,
            slug: infoJogo?.slug || '#'
          };
        });
        setRanking(rankingCompleto);
      } else {
        const progressoSalvo = localStorage.getItem(`tgt_progress_${categoria}`);
        if (progressoSalvo) {
          const parsed = JSON.parse(progressoSalvo);
          if (parsed.votos && parsed.votos.length === 45) {
            const placar = calcularPlacar(jogos, parsed.votos as Voto[]);
            const rankingCalculado = placar.map((item) => {
              const infoJogo = jogos.find((j: any) => j.titulo === item.titulo);
              return {
                titulo: item.titulo,
                pontos: item.pontos,
                imagem: infoJogo?.imagem || '/placeholder.jpg',
                rating: infoJogo?.user_rating_original || 0,
                slug: infoJogo?.slug || '#'
              };
            });
            setRanking(rankingCalculado);
          } else {
            setNaoVotou(true);
          }
        } else {
          setNaoVotou(true);
        }
      }
    } catch (e) {
      setNaoVotou(true);
    }
    setCarregando(false);
  }, [categoria]);

  const cardClip = 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)';
  const btnClip = 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)';

  return (
    <main style={{ minHeight: '100vh', padding: '120px 2rem 4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* NAVEGAÇÃO DE ABAS */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <Link href={`/resultados/global?cat=${categoria}`} style={{ padding: '0.8rem 2rem', backgroundColor: 'rgba(255,255,255,0.05)', color: '#a1a1aa', textDecoration: 'none', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '1px', clipPath: btnClip, border: '1px solid rgba(255,255,255,0.1)' }}>
          PLACAR GLOBAL
        </Link>
        <Link href={`/resultados/pessoal?cat=${categoria}`} style={{ padding: '0.8rem 2rem', backgroundColor: corPrincipal, color: isTgt ? '#FFF' : '#000', textDecoration: 'none', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '1px', clipPath: btnClip }}>
          MEU PÓDIO
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--text-light)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '0.5rem', lineHeight: 1 }}>
          MEU PÓDIO <span style={{ color: corPrincipal }}>PESSOAL</span>
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          A hierarquia exata forjada nos seus 45 confrontos.
        </p>
      </div>

      {carregando ? (
        <div style={{ color: corPrincipal, fontSize: '1.2rem', marginTop: '2rem', fontWeight: 'bold', letterSpacing: '2px' }}>CARREGANDO...</div>
      ) : naoVotou ? (
        
        // EMPTY STATE "PÓDIO TRANCADO"
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'relative', width: '100%', maxWidth: '800px', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0A', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2rem', filter: 'blur(10px) opacity(0.15)', pointerEvents: 'none' }}>
            <div style={{ width: '150px', height: '200px', backgroundColor: corPrincipal, borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
            <div style={{ width: '180px', height: '280px', backgroundColor: '#D4AF37', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
            <div style={{ width: '150px', height: '160px', backgroundColor: '#CD7F32', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', backgroundColor: 'rgba(10, 10, 12, 0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: corPrincipal, marginBottom: '1rem', filter: `drop-shadow(0 0 15px ${corPrincipal})` }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              SEU PÓDIO AINDA ESTÁ TRANCADO
            </h2>
            <p style={{ color: '#a1a1aa', fontSize: '1rem', maxWidth: '450px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
              Vença os <strong>45 confrontos diretos</strong> da arena para revelar a sua hierarquia definitiva do ano.
            </p>
            <Link href={`/votar/${categoria}`} style={{ 
              backgroundColor: corPrincipal, color: isTgt ? '#FFF' : '#000', padding: '1rem 3rem', 
              fontSize: '1rem', fontWeight: 900, textDecoration: 'none', letterSpacing: '1px',
              clipPath: btnClip, boxShadow: `0 0 30px ${corPrincipal}40`,
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              DESTRAVAR MEU PÓDIO (45 DUELOS) →
            </Link>
          </div>
        </motion.div>

      ) : (
        // RANKING PESSOAL PREENCHIDO
        <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* 1º LUGAR */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href={`/indicados/${ranking[0].slug}/confrontos?cat=${categoria}`} style={{ textDecoration: 'none' }}>
              <div style={{ 
                position: 'relative', backgroundColor: '#111114', display: 'flex', alignItems: 'center', padding: '1.5rem', gap: '1.5rem',
                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                boxShadow: `inset 0 0 0 2px #D4AF37, inset 0 0 40px rgba(212, 175, 55, 0.1)`, overflow: 'hidden'
              }}>
                <div style={{ width: '120px', height: '160px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', border: '2px solid #D4AF37', boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)', position: 'relative', zIndex: 2 }}>
                  <img src={ranking[0].imagem} alt={ranking[0].titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D4AF37', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
                      SEU CAMPEÃO
                    </div>
                    <h2 className="font-arena" style={{ color: '#FFF', fontSize: '2.2rem', fontWeight: 900, margin: 0, lineHeight: 1, maxWidth: '400px' }}>{ranking[0].titulo}</h2>
                    <div style={{ color: '#a1a1aa', fontSize: '0.85rem', marginTop: '0.6rem' }}>ÍNDICE INICIAL: <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>★ {ranking[0].rating.toFixed(1)}</span></div>
                  </div>
                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingRight: '1rem' }}>
                    <span className="font-arena" style={{ color: '#D4AF37', fontSize: '4.5rem', fontWeight: 900, lineHeight: 0.8, textShadow: '0 0 20px rgba(212, 175, 55, 0.5)' }}>{ranking[0].pontos}</span>
                    <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', marginTop: '0.4rem' }}>VITÓRIAS</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* 2º E 3º */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
            {[ranking[1], ranking[2]].map((jogo, index) => {
              const corBorda = index === 0 ? '#E2E8F0' : '#CD7F32';
              return (
                <motion.div key={jogo.titulo} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}>
                  <Link href={`/indicados/${jogo.slug}/confrontos?cat=${categoria}`} style={{ textDecoration: 'none' }}>
                    <div style={{ position: 'relative', backgroundColor: '#111114', display: 'flex', alignItems: 'center', padding: '1rem', gap: '1rem', clipPath: cardClip, boxShadow: `inset 0 0 0 1px ${corBorda}80`, overflow: 'hidden' }}>
                      <div style={{ width: '70px', height: '95px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden', border: `1px solid ${corBorda}60`, position: 'relative', zIndex: 2 }}>
                        <img src={jogo.imagem} alt={jogo.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

          {/* 4º AO 10º */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.5rem' }}>
            {ranking.slice(3).map((jogo, index) => (
              <motion.div key={jogo.titulo} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.4 + (index * 0.05) }}>
                <Link href={`/indicados/${jogo.slug}/confrontos?cat=${categoria}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', backgroundColor: 'rgba(28, 28, 30, 0.5)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem 1.5rem', clipPath: btnClip, transition: 'border-color 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = corPrincipal}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                  >
                    <div className="font-arena" style={{ color: '#71717a', fontSize: '1.5rem', fontWeight: 900, width: '30px', textAlign: 'center' }}>{index + 4}º</div>
                    <div style={{ width: '45px', height: '60px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={jogo.imagem} alt={jogo.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

export default function RankingPessoal() {
  return (
    <Suspense fallback={<main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--purple-neon)' }}>Carregando...</main>}>
      <RankingPessoalContent />
    </Suspense>
  );
}