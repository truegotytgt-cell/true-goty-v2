// app/meu-ranking/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import jogosData from '../../lib/jogos.json';

type Jogo = { titulo: string; pontos: number };

export default function MeuRanking() {
  const [ranking, setRanking] = useState<Jogo[]>([]);
  const searchParams = useSearchParams();
  const categoria = searchParams.get('categoria') || 'tgt';

  useEffect(() => {
    const salvo = localStorage.getItem(`tgt_my_ranking_${categoria}`);
    if (salvo) {
      setRanking(JSON.parse(salvo));
    }
  }, [categoria]);

  if (ranking.length === 0) {
    return (
      <main style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <h1 style={{ color: 'var(--text-light)' }}>Você ainda não votou na categoria {categoria.toUpperCase()}!</h1>
        <Link href={`/votar/${categoria}`} style={{ color: 'var(--purple-neon)', marginTop: '1rem', display: 'inline-block' }}>
          Clique aqui para votar
        </Link>
      </main>
    );
  }

  const getImagem = (titulo: string) => jogosData.top10.find(j => j.titulo === titulo)?.imagem || '';
  const top3 = ranking.slice(0, 3);
  const restante = ranking.slice(3);

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '6rem 2rem', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--purple-neon)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>SEU RANKING PESSOAL</h1>
      <p style={{ color: '#a1a1aa', marginBottom: '4rem' }}>Este é o resultado dos seus 45 votos.</p>
      
      {/* PÓDIO TOP 3 */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1rem', marginBottom: '4rem', minHeight: '350px' }}>
        
        {/* 2º Lugar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
          <img src={getImagem(top3[1].titulo)} alt={top3[1].titulo} style={{ width: '120px', borderRadius: '12px', marginBottom: '1rem', border: '3px solid #c0c0c0' }} />
          <h3 style={{ color: '#FFF', fontSize: '1rem', margin: '0 0 0.5rem 0' }}>{top3[1].titulo}</h3>
          <div style={{ backgroundColor: '#222', padding: '1rem', width: '100%', borderRadius: '12px 12px 0 0', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '3px solid #c0c0c0' }}>
            <span style={{ color: '#c0c0c0', fontWeight: 900, fontSize: '1.5rem' }}>2º</span>
          </div>
        </div>

        {/* 1º Lugar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '220px' }}>
          <img src={getImagem(top3[0].titulo)} alt={top3[0].titulo} style={{ width: '160px', borderRadius: '12px', marginBottom: '1rem', border: '3px solid var(--purple-neon)', boxShadow: '0 0 30px rgba(176, 38, 255, 0.4)' }} />
          <h3 style={{ color: 'var(--purple-neon)', fontSize: '1.2rem', fontWeight: 900, margin: '0 0 0.5rem 0' }}>{top3[0].titulo}</h3>
          <div style={{ backgroundColor: '#1a1a24', padding: '1rem', width: '100%', borderRadius: '12px 12px 0 0', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '3px solid var(--purple-neon)' }}>
            <span style={{ color: 'var(--purple-neon)', fontWeight: 900, fontSize: '2rem' }}>1º</span>
          </div>
        </div>

        {/* 3º Lugar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
          <img src={getImagem(top3[2].titulo)} alt={top3[2].titulo} style={{ width: '120px', borderRadius: '12px', marginBottom: '1rem', border: '3px solid #cd7f32' }} />
          <h3 style={{ color: '#FFF', fontSize: '1rem', margin: '0 0 0.5rem 0' }}>{top3[2].titulo}</h3>
          <div style={{ backgroundColor: '#222', padding: '1rem', width: '100%', borderRadius: '12px 12px 0 0', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '3px solid #cd7f32' }}>
            <span style={{ color: '#cd7f32', fontWeight: 900, fontSize: '1.2rem' }}>3º</span>
          </div>
        </div>

      </div>

      {/* LISTA DO 4º AO 10º */}
      <div style={{ backgroundColor: 'var(--bg-gray)', borderRadius: '12px', padding: '1rem 2rem', border: '1px solid #333' }}>
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
                <strong style={{ color: 'var(--purple-neon)', width: '30px', textAlign: 'left' }}>{index + 4}º</strong> 
                <span style={{ color: '#FFF' }}>{jogo.titulo}</span>
              </span>
              <span style={{ fontWeight: 'bold', color: jogo.pontos > 0 ? '#FFF' : '#ef4444' }}>{jogo.pontos} PTS</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link href="/ranking" style={{ backgroundColor: 'var(--purple-neon)', color: '#FFF', padding: '1rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          Ver Placar Global
        </Link>
        <Link href="/" style={{ backgroundColor: 'transparent', border: '1px solid #333', color: '#FFF', padding: '1rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          Voltar ao Início
        </Link>
      </div>
    </main>
  );
}