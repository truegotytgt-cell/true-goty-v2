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
      console.error("Erro ao carregar dados locais", e);
      setNaoVotou(true);
    }
    setCarregando(false);
  }, [categoria]);

  return (
    <main style={{ minHeight: '100vh', padding: '100px 2rem 4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '800px', marginBottom: '2rem', display: 'flex', gap: '0.5rem', color: '#71717a', fontSize: '0.85rem' }}>
        <Link href="/resultados" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Resultados</Link>
        <span>/</span>
        <span style={{ color: corPrincipal, fontWeight: 600 }}>Meu Ranking Pessoal ({categoria.toUpperCase()})</span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--text-light)', fontSize: '3rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '0.5rem' }}>
          MEU RANKING <span style={{ color: corPrincipal }}>PESSOAL</span>
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '1rem' }}>Seu veredito para {categoria.toUpperCase()}, calculado com base nos seus 45 duelos.</p>
      </div>

      {carregando ? (
        <div style={{ color: corPrincipal, fontSize: '1.2rem', marginTop: '2rem' }}>Carregando seu ranking...</div>
      ) : naoVotou ? (
        <div style={{ textAlign: 'center', backgroundColor: 'rgba(28, 28, 30, 0.4)', padding: '3rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>Você ainda não completou seus duelos!</h2>
          <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Precisamos dos 45 votos para montar o seu ranking verdadeiro desta categoria.</p>
          <Link href={`/votar/${categoria}`} style={{ backgroundColor: corPrincipal, color: isTgt ? '#FFF' : '#000', padding: '1rem 2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold' }}>
            Ir para a Votação
          </Link>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {ranking.map((jogo, index) => {
            const pos = index + 1;
            const isTop1 = pos === 1;
            const isTop2 = pos === 2;
            const isTop3 = pos === 3;
            
            let borderColor = 'rgba(255,255,255,0.05)';
            let bgColor = 'rgba(28, 28, 30, 0.4)';
            let glow = 'none';
            let colorPos = '#71717a';

            if (isTop1) { borderColor = '#D4AF37'; bgColor = 'rgba(212, 175, 55, 0.08)'; glow = '0 0 20px rgba(212, 175, 55, 0.15)'; colorPos = '#D4AF37'; }
            else if (isTop2) { borderColor = isTgt ? 'rgba(176, 38, 255, 0.5)' : 'rgba(212, 175, 55, 0.3)'; bgColor = isTgt ? 'rgba(176, 38, 255, 0.05)' : 'rgba(212, 175, 55, 0.03)'; colorPos = corPrincipal; }
            else if (isTop3) { borderColor = isTgt ? 'rgba(176, 38, 255, 0.2)' : 'rgba(212, 175, 55, 0.1)'; colorPos = '#a1a1aa'; }

            return (
              <motion.div 
                key={jogo.titulo}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', 
                  backgroundColor: bgColor, border: `1px solid ${borderColor}`,
                  borderRadius: '16px', padding: '0.8rem 1.2rem', backdropFilter: 'blur(10px)',
                  boxShadow: glow
                }}
              >
                <div style={{ width: '30px', fontSize: '1.2rem', fontWeight: 900, color: colorPos, textAlign: 'center' }}>
                  {pos}º
                </div>

                <div style={{ width: '50px', height: '66px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={jogo.imagem} alt={jogo.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.2rem 0' }}>{jogo.titulo}</h3>
                  <span style={{ color: '#a1a1aa', fontSize: '0.8rem' }}>Nota da Crítica: ★ {jogo.rating.toFixed(1)}</span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', color: isTop1 ? '#D4AF37' : corPrincipal, fontSize: '1.3rem', fontWeight: 900, lineHeight: 1 }}>
                    {jogo.pontos}
                  </span>
                  <span style={{ color: '#71717a', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                    Pontos
                  </span>
                </div>
              </motion.div>
            );
          })}
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