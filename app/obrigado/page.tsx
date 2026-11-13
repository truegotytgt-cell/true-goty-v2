// app/obrigado/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importante para redirecionar
import jogosData from '../../lib/jogos.json';

export default function Obrigado() {
  const [urlImagem, setUrlImagem] = useState('');
  const router = useRouter();

  useEffect(() => {
    const salvo = localStorage.getItem('tgt_my_ranking_tgt');
    if (salvo) {
      const placar = JSON.parse(salvo);
      if (placar.length >= 3) {
        const jogos = jogosData.top10;
        const img1 = jogos.find(j => j.titulo === placar[0].titulo)?.imagem || '';
        const img2 = jogos.find(j => j.titulo === placar[1].titulo)?.imagem || '';
        const img3 = jogos.find(j => j.titulo === placar[2].titulo)?.imagem || '';

        const url = `/api/og?t1=${encodeURIComponent(placar[0].titulo)}&i1=${encodeURIComponent(img1)}&t2=${encodeURIComponent(placar[1].titulo)}&i2=${encodeURIComponent(img2)}&t3=${encodeURIComponent(placar[2].titulo)}&i3=${encodeURIComponent(img3)}`;
        setUrlImagem(url);
      }
    }
  }, []);

  // NOVA FUNÇÃO: Limpa tudo e permite votar de novo
  async function resetarTudo() {
    if (!confirm("Deseja apagar seu voto e começar do zero?")) return;

    try {
      // 1. Chama a API para apagar o Cookie HttpOnly
      await fetch('/api/reset', { method: 'POST' });
      
      // 2. Limpa o localStorage
      localStorage.removeItem('tgt_has_voted_tgt');
      localStorage.removeItem('tgt_my_ranking_tgt');
      localStorage.removeItem('tgt_progress_tgt');
      
      // 3. Redireciona para a votação
      router.push('/votar/tgt');
    } catch (error) {
      alert("Erro ao resetar. Tente limpar os cookies do navegador.");
    }
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }}>MUITO OBRIGADO!</h1>
      <p style={{ fontSize: '1.2rem', color: '#a1a1aa', marginBottom: '2rem' }}>
        Seu voto foi registrado no Placar Global com sucesso.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
        {urlImagem && (
          <a 
            href={urlImagem} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ backgroundColor: 'transparent', color: 'var(--purple-neon)', padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 'bold', border: '2px solid var(--purple-neon)', borderRadius: '8px', textDecoration: 'none' }}
          >
            BAIXAR IMAGEM DO TOP 3
          </a>
        )}

        <Link href="/meu-ranking" style={{ backgroundColor: 'var(--purple-neon)', color: '#FFF', padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '8px', textDecoration: 'none' }}>
          VER MEU RANKING
        </Link>

        <Link href="/ranking" style={{ backgroundColor: 'transparent', color: 'var(--text-light)', padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 'bold', border: '2px solid #333', borderRadius: '8px', textDecoration: 'none' }}>
          VER PLACAR GLOBAL
        </Link>
      </div>

      {/* BOTÃO DE RESET ADICIONADO */}
      <div style={{ marginTop: '2rem', borderTop: '1px solid #333', paddingTop: '2rem' }}>
        <button 
          onClick={resetarTudo}
          style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}
        >
          Apagar voto e votar novamente (Teste)
        </button>
      </div>
    </main>
  );
}