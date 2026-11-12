// app/meu-ranking/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Jogo = { titulo: string; pontos: number };

export default function MeuRanking() {
  const [ranking, setRanking] = useState<Jogo[]>([]);

  useEffect(() => {
    const salvo = localStorage.getItem('tgt_my_ranking_tgt');
    if (salvo) {
      setRanking(JSON.parse(salvo));
    }
  }, []);

  if (ranking.length === 0) {
    return (
      <main style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <h1 style={{ color: 'var(--text-light)' }}>Você ainda não votou!</h1>
        <Link href="/votar" style={{ color: 'var(--purple-neon)', marginTop: '1rem', display: 'inline-block' }}>
          Clique aqui para votar
        </Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '8rem 2rem', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--purple-neon)', fontSize: '2.5rem', marginBottom: '2rem' }}>SEU TOP 10</h1>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {ranking.map((jogo, index) => (
          <li key={jogo.titulo} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '15px', 
            borderBottom: '1px solid #333',
            fontSize: '1.1rem'
          }}>
            <span><strong style={{ color: 'var(--purple-neon)', marginRight: '10px' }}>{index + 1}º</strong> {jogo.titulo}</span>
            <span style={{ fontWeight: 'bold' }}>{jogo.pontos} PTS</span>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link href="/ranking" style={{ color: 'var(--text-light)', textDecoration: 'underline' }}>Ver Placar Global</Link>
        <Link href="/" style={{ color: 'var(--text-light)', textDecoration: 'underline' }}>Voltar ao Início</Link>
      </div>
    </main>
  );
}