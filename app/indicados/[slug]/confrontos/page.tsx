// app/indicados/[slug]/confrontos/page.tsx
'use client';

import { useParams, useRouter, useSearchParams, notFound } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import jogosData from '@/lib/jogos.json';

function ConfrontosJogoContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const categoria = searchParams.get('cat') || 'tgt';

  const isTgt = categoria === 'tgt';
  const corPrincipal = isTgt ? 'var(--purple-neon)' : '#D4AF37';

  const listaJogos = (jogosData as any)[categoria]?.top10 || [];
  const jogoAtual = listaJogos.find((j: any) => j.slug === slug);
  
  const [stats, setStats] = useState<Record<string, any>>({});
  const [carregando, setCarregando] = useState(true);

  if (!jogoAtual) {
    notFound();
  }

  const oponentes = listaJogos.filter((j: any) => j.slug !== slug);

  useEffect(() => {
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
  }, [slug, categoria]);

  const oponentesOrdenados = [...oponentes].sort((a, b) => {
    const statA = stats[a.titulo];
    const statB = stats[b.titulo];
    const porcA = (!statA || statA.total === 0) ? 50 : statA.porcentagemA;
    const porcB = (!statB || statB.total === 0) ? 50 : statB.porcentagemA;
    return Math.abs(50 - porcA) - Math.abs(50 - porcB);
  });

  let maisParelho = null;
  let maiorVitoria = null;
  let arquiInimigo = null;

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

  return (
    <main style={{ minHeight: '100vh', padding: '100px 2rem 4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <style>{`
        .confrontos-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; width: 100%; }
        @media (min-width: 1024px) { .confrontos-grid { grid-template-columns: repeat(2, 1fr); } }
        .destaques-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
        @media (max-width: 768px) { .destaques-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ width: '100%', maxWidth: '1200px', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', color: '#71717a', fontSize: '0.85rem' }}>
        <Link href="/" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Início</Link>
        <span>/</span>
        <Link href={`/indicados?cat=${categoria}`} style={{ color: '#a1a1aa', textDecoration: 'none' }}>Indicados</Link>
        <span>/</span>
        <span style={{ color: corPrincipal, fontWeight: 600 }}>{jogoAtual.titulo}</span>
      </div>

      <div style={{ maxWidth: '1200px', width: '100%', display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '3rem', alignItems: 'start' }}>
        
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '1.5rem', position: 'sticky', top: '100px' }}>
          
          <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img src={jogoAtual.imagem} alt={jogoAtual.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ backgroundColor: isTgt ? 'rgba(176, 38, 255, 0.15)' : 'rgba(212, 175, 55, 0.15)', color: corPrincipal, padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 }}>
              Indicado {categoria.toUpperCase()}
            </span>
            {jogoAtual.user_rating_original && (
              <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: '1.1rem' }}>★ {jogoAtual.user_rating_original}</span>
            )}
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-light)', lineHeight: 1.1, marginBottom: '1rem' }}>
            {jogoAtual.titulo}
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
            {jogoAtual.produtora && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#71717a', fontSize: '0.85rem' }}>Produtora</span>
                <span style={{ color: '#D1D5DB', fontSize: '0.85rem', fontWeight: 500, textAlign: 'right' }}>{jogoAtual.produtora}</span>
              </div>
            )}
            {jogoAtual.diretor && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#71717a', fontSize: '0.85rem' }}>Diretor</span>
                <span style={{ color: '#D1D5DB', fontSize: '0.85rem', fontWeight: 500, textAlign: 'right' }}>{jogoAtual.diretor}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#71717a', fontSize: '0.85rem' }}>Plataformas</span>
              <span style={{ color: '#D1D5DB', fontSize: '0.85rem', fontWeight: 500, textAlign: 'right' }}>{jogoAtual.plataformas?.join(', ')}</span>
            </div>
          </div>

          <button onClick={() => router.push(`/indicados?cat=${categoria}`)} style={{ 
            width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', 
            color: '#FFF', padding: '0.8rem', fontSize: '0.9rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s' 
          }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            ← Voltar para Indicados
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-light)', marginBottom: '0.5rem' }}>Confrontos Diretos</h2>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>Veja como a comunidade votou quando {jogoAtual.titulo} enfrentou cada um dos outros indicados.</p>
          </div>

          {!carregando && maisParelho && maiorVitoria && arquiInimigo && (
            <div className="destaques-grid">
              <div style={{ backgroundColor: 'rgba(28, 28, 30, 0.4)', border: `1px solid ${isTgt ? 'rgba(176, 38, 255, 0.2)' : 'rgba(212, 175, 55, 0.2)'}`, borderRadius: '16px', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: corPrincipal, fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  Domínio Total
                </div>
                <p style={{ color: '#D1D5DB', fontSize: '0.9rem', margin: 0, lineHeight: 1.4 }}>
                  <strong>{jogoAtual.titulo}</strong> não deu chances e venceu <strong>{maiorVitoria.op.titulo}</strong> em <strong>{maiorVitoria.porc}%</strong> dos confrontos globais.
                </p>
              </div>

              <div style={{ backgroundColor: 'rgba(28, 28, 30, 0.4)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '16px', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D4AF37', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M5 10l7-7 7 7"/><path d="M5 14l7 7 7-7"/></svg>
                  Equilíbrio Total
                </div>
                <p style={{ color: '#D1D5DB', fontSize: '0.9rem', margin: 0, lineHeight: 1.4 }}>
                  A comunidade está dividida contra <strong>{maisParelho.op.titulo}</strong>. O confronto terminou com <strong>{maisParelho.porc}%</strong> de vantagem.
                </p>
              </div>

              <div style={{ backgroundColor: 'rgba(28, 28, 30, 0.4)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '16px', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M9.5 6.5L21 18v3h-3L6.5 9.5"/></svg>
                  O Arqui-Inimigo
                </div>
                <p style={{ color: '#D1D5DB', fontSize: '0.9rem', margin: 0, lineHeight: 1.4 }}>
                  O maior pesadelo deste indicado. <strong>{arquiInimigo.op.titulo}</strong> leva a melhor, vencendo em <strong>{100 - arquiInimigo.porc}%</strong> dos confrontos globais.
                </p>
              </div>
            </div>
          )}

          {carregando ? (
            <div style={{ color: corPrincipal, padding: '2rem', textAlign: 'center' }}>Calculando estatísticas...</div>
          ) : (
            <div className="confrontos-grid">
              {oponentesOrdenados.map((oponente: any) => {
                const stat = stats[oponente.titulo];
                const semVotos = !stat || stat.total === 0;
                const porcentagemVitoria = semVotos ? 50 : stat.porcentagemA; 
                
                const isVitoria = porcentagemVitoria > 50;
                const isDerrota = porcentagemVitoria < 50;

                return (
                  <div key={oponente.slug} style={{ backgroundColor: 'rgba(28, 28, 30, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <img src={oponente.imagem} alt={oponente.titulo} style={{ width: '40px', height: '54px', objectFit: 'cover', borderRadius: '6px' }} />
                        <span style={{ fontWeight: 'bold', color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: 1.2 }}>{oponente.titulo}</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: semVotos ? '#71717a' : isVitoria ? corPrincipal : '#ef4444', fontWeight: 900, fontSize: '1rem' }}>
                          {semVotos ? '--' : `${porcentagemVitoria}%`}
                        </span>
                        {!semVotos && (
                          isVitoria ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={corPrincipal} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          ) : isDerrota ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          ) : null
                        )}
                      </div>
                    </div>

                    <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${porcentagemVitoria}%`, height: '100%', background: semVotos ? 'transparent' : isVitoria ? (isTgt ? 'linear-gradient(to right, #9333EA, #B026FF)' : 'linear-gradient(to right, #B8860B, #D4AF37)') : '#ef4444', borderRadius: '2px', transition: 'width 1s ease-in-out' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

export default function ConfrontosJogo() {
  return (
    <Suspense fallback={<main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--purple-neon)' }}>Carregando...</main>}>
      <ConfrontosJogoContent />
    </Suspense>
  );
}