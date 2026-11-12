// app/obrigado/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Obrigado() {
  const [urlImagem, setUrlImagem] = useState('');

  useEffect(() => {
    // Pega o ranking salvo no navegador para gerar a imagem
    const rankingSalvo = localStorage.getItem('tgt_my_ranking_tgt');
    if (rankingSalvo) {
      const placar = JSON.parse(rankingSalvo);
      if (placar.length >= 3) {
        const top1 = placar[0];
        const top2 = placar[1];
        const top3 = placar[2];
        
        // Como estamos no client, precisamos pegar as imagens. 
        // Para simplificar, vamos montar a URL usando os caminhos estáticos
        const url = `/api/og?t1=${encodeURIComponent(top1.titulo)}&i1=/zelda.jpg&t2=${encodeURIComponent(top2.titulo)}&i2=/saros.jpg&t3=${encodeURIComponent(top3.titulo)}&i3=/re_requiem.jpg`;
        setUrlImagem(url);
      }
    }
  }, []);

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }}>MUITO OBRIGADO!</h1>
      <p style={{ fontSize: '1.2rem', color: '#a1a1aa', marginBottom: '2rem' }}>
        Seu voto foi registrado no Placar Global com sucesso.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {urlImagem && (
          <a 
            href={urlImagem} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--purple-neon)',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              border: '2px solid var(--purple-neon)',
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            BAIXAR IMAGEM DO TOP 3
          </a>
        )}

        <Link href="/meu-ranking" style={{
          backgroundColor: 'var(--purple-neon)',
          color: '#FFF',
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          borderRadius: '8px',
          textDecoration: 'none',
        }}>
          VER MEU RANKING
        </Link>

        <Link href="/ranking" style={{
          backgroundColor: 'transparent',
          color: 'var(--text-light)',
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          border: '2px solid #333',
          borderRadius: '8px',
          textDecoration: 'none',
        }}>
          VER PLACAR GLOBAL
        </Link>
      </div>
    </main>
  );
}