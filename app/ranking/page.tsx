// app/ranking/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Podium from '../../components/Podium';

// O formato que a API devolve
type DadosAPI = {
  game_title: string;
  total_score: number;
};

// O formato que o nosso componente Podium e a lista esperam
type JogoRanking = { titulo: string; pontos: number };

export default function PlacarGlobal() {
  const [ranking, setRanking] = useState<JogoRanking[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch('/api/ranking')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.ranking) {
          // AQUI ESTÁ A MÁGICA: Convertemos os nomes das propriedades
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

  // Separa o Top 3 do restante da lista
  const top3 = ranking.slice(0, 3);
  const restante = ranking.slice(3);

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '6rem 2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
      <h1 style={{ color: 'var(--text-light)', fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 900, textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>
        PLACAR GLOBAL TGT
      </h1>
      <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>A soma de todos os votos da comunidade.</p>

      {/* COMPONENTE DO PÓDIO */}
      <Podium top3={top3} />

      {/* LISTA DO 4º AO 10º */}
      <div style={{ backgroundColor: 'var(--bg-gray)', borderRadius: '12px', padding: '1rem 2rem', border: '1px solid #333', textAlign: 'left' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {restante.map((jogo, index) => (
            <li key={jogo.titulo} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '15px 0', 
              borderBottom: index !== restante.length - 1 ? '1px solid #333' : 'none',
              fontSize: '1rem'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <strong style={{ color: 'var(--purple-neon)', width: '30px' }}>{index + 4}º</strong> 
                <span style={{ color: '#FFF' }}>{jogo.titulo}</span>
              </span>
              <span style={{ fontWeight: 'bold', color: jogo.pontos > 0 ? '#FFF' : '#ef4444' }}>{jogo.pontos} PTS</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <Link href="/" style={{ backgroundColor: 'transparent', border: '1px solid #333', color: '#FFF', padding: '1rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          Voltar ao Início
        </Link>
      </div>
    </main>
  );
}