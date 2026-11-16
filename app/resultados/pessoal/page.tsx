// app/resultados/pessoal/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import jogosData from '@/lib/jogos.json';

export default function RankingPessoal() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Carrega os jogos na ordem padrão ao abrir a página
  useEffect(() => {
    const jogos = (jogosData as any).tgt?.top10 || [];
    setRanking([...jogos]);

    // Verifica se é mobile para ajustar o layout
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Função para mover o jogo para cima
  const moverParaCima = (index: number) => {
    if (index === 0) return;
    const novoRanking = [...ranking];
    [novoRanking[index - 1], novoRanking[index]] = [novoRanking[index], novoRanking[index - 1]];
    setRanking(novoRanking);
  };

  // Função para mover o jogo para baixo
  const moverParaBaixo = (index: number) => {
    if (index === ranking.length - 1) return;
    const novoRanking = [...ranking];
    [novoRanking[index], novoRanking[index + 1]] = [novoRanking[index + 1], novoRanking[index]];
    setRanking(novoRanking);
  };

  // Função para salvar (Aqui você conectaria com sua API de salvar no banco depois)
  const salvarRanking = () => {
    alert("Ranking salvo com sucesso! (Em breve, isso será enviado para o Placar Global)");
  };

  return (
    <main style={{ minHeight: '100vh', padding: '100px 2rem 4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Breadcrumb */}
      <div style={{ width: '100%', maxWidth: '800px', marginBottom: '2rem', display: 'flex', gap: '0.5rem', color: '#71717a', fontSize: '0.85rem' }}>
        <Link href="/resultados" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Resultados</Link>
        <span>/</span>
        <span style={{ color: 'var(--purple-neon)', fontWeight: 600 }}>Meu Ranking Pessoal</span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--text-light)', fontSize: '3rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '0.5rem' }}>
          MEU RANKING <span style={{ color: 'var(--purple-neon)' }}>PESSOAL</span>
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '1rem' }}>Ordene os 10 indicados do seu jeito. O topo da lista é o seu verdadeiro GOTY.</p>
      </div>

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
          else if (isTop2) { borderColor = 'rgba(176, 38, 255, 0.5)'; bgColor = 'rgba(176, 38, 255, 0.05)'; colorPos = 'var(--purple-neon)'; }
          else if (isTop3) { borderColor = 'rgba(176, 38, 255, 0.2)'; colorPos = '#a1a1aa'; }

          return (
            <motion.div 
              key={jogo.slug}
              layout // Animação mágica do Framer Motion para reordenar suavemente
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
                <h3 style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{jogo.titulo}</h3>
              </div>

              {/* Botões para subir e descer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button 
                  onClick={() => moverParaCima(index)} 
                  disabled={index === 0}
                  style={{ 
                    background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', 
                    color: '#FFF', padding: '4px 8px', cursor: index === 0 ? 'not-allowed' : 'pointer',
                    opacity: index === 0 ? 0.3 : 1, transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { if(index !== 0) e.currentTarget.style.backgroundColor = 'var(--purple-neon)' }}
                  onMouseOut={(e) => { if(index !== 0) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}
                >
                  ▲
                </button>
                <button 
                  onClick={() => moverParaBaixo(index)} 
                  disabled={index === ranking.length - 1}
                  style={{ 
                    background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', 
                    color: '#FFF', padding: '4px 8px', cursor: index === ranking.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: index === ranking.length - 1 ? 0.3 : 1, transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { if(index !== ranking.length - 1) e.currentTarget.style.backgroundColor = 'var(--purple-neon)' }}
                  onMouseOut={(e) => { if(index !== ranking.length - 1) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}
                >
                  ▼
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Botão de Salvar */}
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <button 
          onClick={salvarRanking}
          style={{ 
            background: 'linear-gradient(135deg, #9333EA, #B026FF)', color: '#FFF', 
            padding: '1rem 3rem', fontSize: '1.1rem', fontWeight: 900, borderRadius: '50px', 
            border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 0 30px rgba(176, 38, 255, 0.4)', 
            cursor: 'pointer', transition: 'all 0.3s ease', letterSpacing: '1px'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(176, 38, 255, 0.6)' }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(176, 38, 255, 0.4)' }}
        >
          SALVAR MEU RANKING
        </button>
        <p style={{ color: '#71717a', fontSize: '0.85rem', marginTop: '1rem' }}>Seu ranking será somado ao placar global da comunidade.</p>
      </div>

    </main>
  );
}