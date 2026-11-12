// app/ranking/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type JogoRanking = {
  game_title: string;
  total_score: number;
};

export default function PlacarGlobal() {
  const [ranking, setRanking] = useState<JogoRanking[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch('/api/ranking')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRanking(data.ranking);
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

  return (
    <main style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '100vh' }}>
      <h1 style={{ color: 'var(--purple-neon)', fontSize: '3rem', marginBottom: '3rem' }}>
        PLACAR GLOBAL TGT
      </h1>
      
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'var(--bg-gray)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {ranking.map((jogo, index) => (
            <li key={jogo.game_title} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '15px', 
              borderBottom: index !== ranking.length - 1 ? '1px solid #333' : 'none',
              fontSize: '1.2rem'
            }}>
              <span><strong style={{ color: 'var(--purple-neon)', marginRight: '10px' }}>{index + 1}º</strong> {jogo.game_title}</span>
              <span style={{ fontWeight: 'bold' }}>{jogo.total_score} PTS</span>
            </li>
          ))}
        </ul>
      </div>

      <Link href="/" style={{ 
        display: 'inline-block', 
        marginTop: '3rem', 
        color: 'var(--text-light)', 
        textDecoration: 'underline' 
      }}>
        Voltar para a Votação
      </Link>
    </main>
  );
}