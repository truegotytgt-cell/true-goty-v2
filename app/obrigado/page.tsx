// app/obrigado/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { calcularPlacar, Jogo } from '../../lib/condorcet';
import jogosData from '../../lib/jogos.json';

export default function Obrigado() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoria = searchParams.get('categoria') || 'tgt';
  
  const [ranking, setRanking] = useState<any[] | null>(null);
  const [carregado, setCarregado] = useState(false);
  const [resetando, setResetando] = useState(false);

  useEffect(() => {
    let rankingSalvo = localStorage.getItem(`tgt_my_ranking_${categoria}`);
    
    if (!rankingSalvo) {
      const progressoSalvo = localStorage.getItem(`tgt_progress_${categoria}`);
      if (progressoSalvo) {
        try {
          const parsed = JSON.parse(progressoSalvo);
          if (parsed.votos && parsed.votos.length > 0) {
            const jogos = jogosData.top10 as Jogo[];
            const placarCalculado = calcularPlacar(jogos, parsed.votos);
            rankingSalvo = JSON.stringify(placarCalculado);
            localStorage.setItem(`tgt_my_ranking_${categoria}`, rankingSalvo);
          }
        } catch (e) {}
      }
    }

    if (rankingSalvo) {
      try {
        setRanking(JSON.parse(rankingSalvo));
      } catch (e) {}
    }
    setCarregado(true);
  }, [categoria]);

  async function resetarVotos() {
    if (!confirm("Tem certeza que deseja apagar seus votos para testar novamente?")) return;
    
    setResetando(true);
    try {
      await fetch('/api/reset', { method: 'POST' });
      
      localStorage.removeItem(`tgt_progress_${categoria}`);
      localStorage.removeItem(`tgt_my_ranking_${categoria}`);
      localStorage.removeItem(`tgt_has_voted_${categoria}`);
      
      router.push(`/votar/${categoria}`);
    } catch (e) {
      alert("Erro ao resetar. Tente limpar o cache do navegador.");
      setResetando(false);
    }
  }

  if (!carregado) {
    return <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--purple-neon)' }}>Carregando...</main>;
  }

  // TELA DE ERRO (Agora com botão de reset para nunca travar o usuário)
  if (!ranking || ranking.length === 0) {
    return (
      <main style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: '2rem', textAlign: 'center', padding: '1rem' }}>
        <h1 style={{ color: 'var(--purple-neon)', fontSize: '2rem' }}>Ops! Não encontramos seu voto.</h1>
        <p style={{ color: '#a1a1aa' }}>Parece que a verificação de segurança falhou ou você acessou esta página diretamente.</p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href={`/votar/${categoria}`} style={{ backgroundColor: 'var(--purple-neon)', color: '#FFF', padding: '1rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
            Voltar para a Votação
          </Link>
          <button onClick={resetarVotos} disabled={resetando} style={{ backgroundColor: 'transparent', border: '1px solid #a1a1aa', color: '#a1a1aa', padding: '1rem 2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            {resetando ? 'Limpando...' : 'Forçar Reset'}
          </button>
        </div>
      </main>
    );
  }

  const t1 = ranking[0]?.titulo || '';
  const t2 = ranking[1]?.titulo || '';
  const t3 = ranking[2]?.titulo || '';
  const ogImageUrl = `/api/og?t1=${encodeURIComponent(t1)}&t2=${encodeURIComponent(t2)}&t3=${encodeURIComponent(t3)}`;
  
  const textoCompartilhar = `Meu Top 3 no True GOTY (${categoria.toUpperCase()}):\n1º ${t1}\n2º ${t2}\n3º ${t3}\n\nFaça o seu em truegoty.com!`;
  const urlSite = 'https://truegoty.com';

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', textAlign: 'center', backgroundColor: '#0A0A0A', backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a24 0%, #0A0A0A 100%)' }}>
      
      <div style={{ backgroundColor: 'rgba(10,10,10,0.8)', border: '1px solid #333', borderRadius: '24px', padding: '3rem 2rem', maxWidth: '600px', width: '100%', boxShadow: '0 0 50px rgba(176, 38, 255, 0.1)' }}>
        
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
          SEU VEREDITO ESTÁ NA HISTÓRIA!
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem', marginBottom: '2rem' }}>
          Sua voz ajudou a moldar o Placar Global da categoria <strong>{categoria.toUpperCase()}</strong>.
          <br/>Agora, mostre ao mundo qual jogo realmente merece o título.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem', textAlign: 'left', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
          {ranking.map((item, index) => (
            <div key={item.titulo} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#121212', borderRadius: '12px', border: '1px solid #222' }}>
              <span style={{ color: index === 0 ? '#D4AF37' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#a1a1aa', fontWeight: 'bold' }}>
                {index + 1}º {item.titulo}
              </span>
              <span style={{ color: '#a1a1aa' }}>{item.pontos} PTS</span>
            </div>
          ))}
        </div>

        <a href={ogImageUrl} download={`meu-top3-${categoria}.png`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', background: 'linear-gradient(90deg, #a855f7 0%, #d8b4fe 100%)', color: '#000', padding: '1rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem', boxShadow: '0 0 20px rgba(176, 38, 255, 0.4)' }}>
          <span>⬇️</span> BAIXAR IMAGEM DO TOP 3
        </a>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(textoCompartilhar + ' ' + urlSite)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#25D366', color: '#FFF', padding: '0.8rem 1.5rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
            WhatsApp
          </a>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(textoCompartilhar)}&url=${encodeURIComponent(urlSite)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FFF', color: '#000', padding: '0.8rem 1.5rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
            Postar no X
          </a>
        </div>

        <button onClick={resetarVotos} disabled={resetando} style={{ background: 'none', border: 'none', color: '#a1a1aa', textDecoration: 'underline', cursor: resetando ? 'not-allowed' : 'pointer', fontSize: '0.9rem' }}>
          {resetando ? 'Apagando...' : 'Apagar meus votos e testar novamente'}
        </button>

      </div>
    </main>
  );
}