// app/ranking/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Podium from '../../components/Podium';

type DadosAPI = { game_title: string; total_score: number; };
type JogoRanking = { titulo: string; pontos: number };

export default function PlacarGlobal() {
  const [ranking, setRanking] = useState<JogoRanking[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch('/api/ranking')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.ranking) {
          const formatado = data.ranking.map((item: DadosAPI) => ({
            titulo: item.game_title,
            pontos: item.total_score
          }));
          setRanking(formatado);
        }
        setCarregando(false);
      });
  }, []);

  if (carregando) {
    return (
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <h1 style={{ color: 'var(--purple-neon)' }}>Carregando Placar Global...</h1>
      </main>
    );
  }

  if (ranking.length === 0) {
    return (
      <main style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <h1 style={{ color: 'var(--text-light)' }}>O Placar Global ainda está vazio!</h1>
        <Link href="/votar/tgt" style={{ color: 'var(--purple-neon)', marginTop: '1rem', display: 'inline-block' }}>
          Seja o primeiro a votar
        </Link>
      </main>
    );
  }

  const top3 = ranking.slice(0, 3);
  const restante = ranking.slice(3);

  // Cálculo para a Barra de Força
  const maxPontos = Math.max(...ranking.map(r => r.pontos));
  const minPontos = Math.min(...ranking.map(r => r.pontos));

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '6rem 2rem', textAlign: 'center' }}>
      
      {/* Eyebrow e Título */}
      <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
      <h1 style={{ color: 'var(--text-light)', fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 900, textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>
        PLACAR GLOBAL TGT
      </h1>
      <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>A soma de todos os votos da comunidade.</p>

      <Podium top3={top3} />

      <div style={{ backgroundColor: 'rgba(28, 28, 30, 0.6)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '1.5rem 2rem', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {restante.map((jogo, index) => {
            const percentual = maxPontos === minPontos ? 50 : ((jogo.pontos - minPontos) / (maxPontos - minPontos)) * 100;
            
            return (
              <li key={jogo.titulo} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '15px 0', borderBottom: index !== restante.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                position: 'relative', overflow: 'hidden'
              }}>
                {/* Barra de Força */}
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${percentual}%`,
                  background: jogo.pontos > 0 ? 'linear-gradient(to right, rgba(176, 38, 255, 0.15), transparent)' : 'linear-gradient(to right, rgba(239, 68, 68, 0.1), transparent)',
                  zIndex: 0
                }} />

                <span style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1 }}>
                  <strong style={{ color: 'var(--purple-neon)', width: '30px', fontSize: '1.1rem' }}>{index + 4}º</strong> 
                  <span style={{ color: '#FFF', fontWeight: 600 }}>{jogo.titulo}</span>
                </span>
                <span style={{ fontWeight: 900, color: jogo.pontos > 0 ? '#FFF' : '#ef4444', zIndex: 1 }}>{jogo.pontos} PTS</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <Link href="/" style={{ backgroundColor: 'transparent', border: '1px solid #333', color: '#FFF', padding: '1rem 2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold' }}>
          Voltar ao Início
        </Link>
      </div>
    </main>
  );
}