// app/votar/[categoria]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Script from 'next/script';
import jogosData from '../../../lib/jogos.json';
import { calcularPlacar, Jogo } from '../../../lib/condorcet';
import { useVotingProgress } from '../../../lib/useVotingProgress'; 
import CardDuelo from '../../../components/CardDuelo';
import { motion, AnimatePresence } from 'framer-motion';

export default function Votar() {
  const params = useParams();
  const categoria = (params?.categoria as string) || 'tgt'; 
  const jogos = jogosData.top10;
  
  const { votos, duelos, dueloAtual, carregado, registrarVoto, desfazerVoto } = useVotingProgress(categoria, jogos);
  
  const [animacao, setAnimacao] = useState<{jogo1: 'idle'|'winner'|'loser', jogo2: 'idle'|'winner'|'loser'}>({ jogo1: 'idle', jogo2: 'idle' });

  function executarVoto(vencedor: Jogo, perdedor: Jogo, jogo1Venceu: boolean) {
    if (animacao.jogo1 !== 'idle') return;

    setAnimacao({
      jogo1: jogo1Venceu ? 'winner' : 'loser',
      jogo2: jogo1Venceu ? 'loser' : 'winner'
    });

    setTimeout(() => {
      registrarVoto(vencedor.titulo, perdedor.titulo);
      setAnimacao({ jogo1: 'idle', jogo2: 'idle' }); 
    }, 600);
  }

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
  }, [carregado, duelos, dueloAtual, animacao]);

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

        <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} data-theme="dark" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}></div>

        <button onClick={() => enviarParaPlacarGlobal(placarFinal)} style={{ backgroundColor: 'var(--purple-neon)', color: '#FFF', padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 0 20px rgba(176, 38, 255, 0.4)' }}>
          CONFIRMAR MEU TRUE GOTY
        </button>
      </main>
    );
  }

  const duelo = duelos[dueloAtual];

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '2rem', padding: '0 1rem' }}>
      
      <h1 style={{ color: 'var(--purple-neon)', textAlign: 'center', fontSize: '2rem', fontWeight: 900 }}>
        QUAL FOI O MELHOR?
        <span style={{ display: 'block', fontSize: '1rem', color: '#a1a1aa', marginTop: '0.5rem', fontWeight: 'normal', letterSpacing: '2px' }}>
          BATALHA {dueloAtual + 1} DE {duelos.length}
        </span>
      </h1>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'nowrap', justifyContent: 'center', width: '100%', maxWidth: '1000px' }}>
        
        {/* Lado Esquerdo (Animado) */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`jogo1-${dueloAtual}`}
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}
            style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}
          >
            <CardDuelo jogo={duelo.jogo1} status={animacao.jogo1} onClick={() => executarVoto(duelo.jogo1, duelo.jogo2, true)} />
          </motion.div>
        </AnimatePresence>

        {/* MEDALHÃO VS (Aço Damasco) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 2rem' }}>
          <div style={{ width: '2px', height: '80px', background: 'linear-gradient(to bottom, transparent, var(--purple-neon), transparent)', marginBottom: '1rem' }} />
          <div style={{ 
            width: '80px', height: '80px', transform: 'rotate(45deg)', 
            background: 'linear-gradient(135deg, #1a1a24, #05000A)', 
            border: '2px solid var(--purple-neon)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(176, 38, 255, 0.4), inset 0 0 20px rgba(176, 38, 255, 0.2)',
            position: 'relative'
          }}>
            <span style={{ transform: 'rotate(-45deg)', color: '#D4AF37', fontSize: '1.8rem', fontWeight: 900, textShadow: '0 0 10px rgba(212, 175, 55, 0.8)' }}>
              VS
            </span>
          </div>
          <div style={{ width: '2px', height: '80px', background: 'linear-gradient(to top, transparent, var(--purple-neon), transparent)', marginTop: '1rem' }} />
        </div>

        {/* Lado Direito (Animado) */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`jogo2-${dueloAtual}`}
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.3 }}
            style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}
          >
            <CardDuelo jogo={duelo.jogo2} status={animacao.jogo2} onClick={() => executarVoto(duelo.jogo2, duelo.jogo1, false)} />
          </motion.div>
        </AnimatePresence>

      </div>

      {/* TECLAS ESTILIZADAS (Substituindo o texto simples) */}
      <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ color: '#a1a1aa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Pressione <kbd style={{ backgroundColor: '#1a1a24', border: '1px solid #333', borderBottom: '2px solid #555', borderRadius: '4px', padding: '2px 8px', color: '#FFF', fontFamily: 'monospace', fontSize: '1rem' }}>←</kbd> para escolher
        </span>
        <span style={{ color: '#a1a1aa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Pressione <kbd style={{ backgroundColor: '#1a1a24', border: '1px solid #333', borderBottom: '2px solid #555', borderRadius: '4px', padding: '2px 8px', color: '#FFF', fontFamily: 'monospace', fontSize: '1rem' }}>→</kbd> para escolher
        </span>
      </div>

      <div style={{ marginTop: '1rem' }}>
        {dueloAtual > 0 && (
          <button onClick={desfazerVoto} style={{ backgroundColor: 'transparent', color: '#a1a1aa', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '50px', cursor: 'pointer', fontSize: '0.85rem' }}>
            ← Desfazer último voto
          </button>
        )}
      </div>
    </main>
  );
}