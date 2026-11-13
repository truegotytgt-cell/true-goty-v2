// app/votar/[categoria]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Script from 'next/script';
import jogosData from '../../../lib/jogos.json';
import { calcularPlacar, Jogo } from '../../../lib/condorcet';
import { useVotingProgress } from '../../../lib/useVotingProgress'; 
import CardDuelo from '../../../components/CardDuelo';

export default function Votar() {
  const params = useParams();
  const categoria = (params?.categoria as string) || 'tgt'; 
  const jogos = jogosData.top10;
  
  const { votos, duelos, dueloAtual, carregado, registrarVoto, desfazerVoto, resetarProgresso } = useVotingProgress(categoria, jogos);
  
  // Estados para controlar a animação dos cards
  const [animacao, setAnimacao] = useState<{jogo1: 'idle'|'winner'|'loser', jogo2: 'idle'|'winner'|'loser'}>({ jogo1: 'idle', jogo2: 'idle' });

  // Função que centraliza o voto e a animação
  function executarVoto(vencedor: Jogo, perdedor: Jogo, jogo1Venceu: boolean) {
    if (animacao.jogo1 !== 'idle') return; // Evita duplo clique

    // 1. Dispara a animação visual
    setAnimacao({
      jogo1: jogo1Venceu ? 'winner' : 'loser',
      jogo2: jogo1Venceu ? 'loser' : 'winner'
    });

    // 2. Espera 600ms (tempo da animação) e avança para o próximo duelo
    setTimeout(() => {
      registrarVoto(vencedor.titulo, perdedor.titulo);
      setAnimacao({ jogo1: 'idle', jogo2: 'idle' }); // Reseta para a próxima batalha
    }, 600);
  }

  // Atalhos de teclado adaptados para a nova função
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!carregado || duelos.length === 0 || dueloAtual >= duelos.length) return;
      const duelo = duelos[dueloAtual];
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault(); 
        executarVoto(duelo.jogo1, duelo.jogo2, true);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault(); 
        executarVoto(duelo.jogo2, duelo.jogo1, false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [carregado, duelos, dueloAtual, animacao]); // Adicionado animacao nas dependências

  async function enviarParaPlacarGlobal(placarFinal: any[]) {
    const turnstileToken = (window as any).turnstile?.getResponse();
    if (!turnstileToken) {
      alert("Por favor, aguarde a verificação de segurança.");
      return;
    }

    const dadosParaEnviar = placarFinal.map(item => ({
      game_title: item.titulo,
      score: item.pontos,
      category: categoria,
      turnstileToken: turnstileToken 
    }));

    try {
      const resposta = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores: dadosParaEnviar })
      });
      
      const resultado = await resposta.json();
      
      if (resultado.success) {
        localStorage.setItem(`tgt_has_voted_${categoria}`, 'true');
        localStorage.setItem(`tgt_my_ranking_${categoria}`, JSON.stringify(placarFinal));
        window.location.href = `/obrigado?categoria=${categoria}`;
      } else {
        alert("Erro de segurança: " + resultado.error);
      }
    } catch (erro) {
      alert("Erro ao enviar os votos.");
    }
  }

  if (!carregado || duelos.length === 0) {
    return (
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <h1 style={{ color: 'var(--purple-neon)' }}>Preparando o tapete vermelho...</h1>
      </main>
    );
  }

  if (dueloAtual >= duelos.length) {
    const placarFinal = calcularPlacar(jogos, votos);
    return (
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
        
        <h1 style={{ color: 'var(--purple-neon)' }}>SUA SELEÇÃO FINAL ({categoria.toUpperCase()})</h1>
        <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>O jogo mais amado da comunidade vai ser decidido pelos seus votos.</p>
        
        <ul style={{ listStyle: 'none', padding: 0, maxWidth: '400px', margin: '0 auto', marginBottom: '2rem' }}>
          {placarFinal.map((item, index) => (
            <li key={item.titulo} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #333', color: 'white' }}>
              <span>{index + 1}º {item.titulo}</span>
              <span>{item.pontos} PTS</span>
            </li>
          ))}
        </ul>

        <div 
          className="cf-turnstile" 
          data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} 
          data-theme="dark"
          style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}
        ></div>

        <button 
          onClick={() => enviarParaPlacarGlobal(placarFinal)}
          style={{ backgroundColor: 'var(--purple-neon)', color: '#FFF', padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 0 20px rgba(176, 38, 255, 0.4)' }}
        >
          CONFIRMAR MEU TRUE GOTY
        </button>
        
        <div style={{ marginTop: '2rem' }}>
            <button onClick={resetarProgresso} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Refazer votação do zero
            </button>
        </div>
      </main>
    );
  }

  const duelo = duelos[dueloAtual];

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '2rem' }}>
      <h1 style={{ color: 'var(--purple-neon)', textAlign: 'center' }}>
        QUAL FOI O MELHOR?
        <span style={{ display: 'block', fontSize: '1rem', color: '#a1a1aa', marginTop: '0.5rem', fontWeight: 'normal' }}>
          Batalha {dueloAtual + 1} de {duelos.length}
        </span>
      </h1>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <CardDuelo 
          jogo={duelo.jogo1} 
          status={animacao.jogo1}
          onClick={() => executarVoto(duelo.jogo1, duelo.jogo2, true)} 
        />
        <h2 style={{ fontSize: '3rem', color: 'var(--purple-neon)' }}>VS</h2>
        <CardDuelo 
          jogo={duelo.jogo2} 
          status={animacao.jogo2}
          onClick={() => executarVoto(duelo.jogo2, duelo.jogo1, false)} 
        />
      </div>

      <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginTop: '-1rem' }}>
        Dica: Use as setas <strong>←</strong> e <strong>→</strong> do teclado para votar mais rápido!
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        {dueloAtual > 0 && (
          <button onClick={desfazerVoto} style={{ backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
            ← Desfazer último voto
          </button>
        )}
        <button 
          onClick={() => { if(confirm("Tem certeza que deseja apagar todo o progresso?")) { resetarProgresso(); } }} 
          style={{ backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
        >
          Resetar Votação (Teste)
        </button>
      </div>
    </main>
  );
}