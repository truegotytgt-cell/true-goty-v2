// app/resultados/global/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import jogosData from '@/lib/jogos.json';

export default function PlacarGlobal() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function fetchRanking() {
      try {
        // Passamos a categoria na URL para o seu arquivo route.ts já preparado
        const res = await fetch('/api/ranking?category=tgt');
        const json = await res.json();
        
        if (json.success) {
          const jogosJSON = (jogosData as any).tgt?.top10 || [];
          
          const rankingCompleto = json.ranking.map((item: any) => {
            const infoJogo = jogosJSON.find((j: any) => j.titulo === item.game_title);
            return {
              titulo: item.game_title,
              pontos: item.total_score, // <--- CORREÇÃO AQUI: de total_points para total_score
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
  }, []);

  return (
    <main style={{ minHeight: '100vh', padding: '100px 2rem 4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '900px', marginBottom: '2rem', display: 'flex', gap: '0.5rem', color: '#71717a', fontSize: '0.85rem' }}>
        <Link href="/resultados" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Resultados</Link>
        <span>/</span>
        <span style={{ color: 'var(--purple-neon)', fontWeight: 600 }}>Placar Global</span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--text-light)', fontSize: '3rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '0.5rem' }}>
          PLACAR <span style={{ color: 'var(--purple-neon)' }}>GLOBAL</span>
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '1rem' }}>O ranking oficial do True GOTY, atualizado em tempo real pela comunidade.</p>
      </div>

      {carregando ? (
        <div style={{ color: 'var(--purple-neon)', fontSize: '1.2rem', marginTop: '2rem' }}>Contando os votos...</div>
      ) : ranking.length === 0 ? (
        <div style={{ color: '#a1a1aa', fontSize: '1.2rem', marginTop: '2rem' }}>Nenhum voto registrado ainda. Seja o primeiro a votar!</div>
      ) : (
        <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
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
            else if (isTop2) { borderColor = 'rgba(176, 38, 255, 0.5)'; bgColor = 'rgba(176, 38, 255, 0.05)'; colorPos = 'var(--purple-neon)'; }
            else if (isTop3) { borderColor = 'rgba(176, 38, 255, 0.2)'; colorPos = '#a1a1aa'; }

            return (
              <motion.div 
                key={jogo.titulo}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '1.5rem', 
                  backgroundColor: bgColor, border: `1px solid ${borderColor}`,
                  borderRadius: '16px', padding: '1rem 1.5rem', backdropFilter: 'blur(10px)',
                  boxShadow: glow, transition: 'all 0.2s ease'
                }}
              >
                <div style={{ width: '40px', fontSize: '1.5rem', fontWeight: 900, color: colorPos, textAlign: 'center' }}>
                  {pos}º
                </div>

                <div style={{ width: '60px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={jogo.imagem} alt={jogo.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ color: 'var(--text-light)', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.2rem 0' }}>{jogo.titulo}</h3>
                  <span style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Nota da Crítica: ★ {jogo.rating.toFixed(1)}</span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', color: isTop1 ? '#D4AF37' : 'var(--purple-neon)', fontSize: '1.5rem', fontWeight: 900, lineHeight: 1 }}>
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