// app/votar/[categoria]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Script from 'next/script';
import jogosData from '../../../lib/jogos.json';
import { calcularPlacar, Jogo } from '../../../lib/condorcet';
import { useVotingProgress } from '../../../lib/useVotingProgress'; 
import CardDuelo from '../../../components/CardDuelo';
import { motion, AnimatePresence } from 'framer-motion';

export default function Votar() {
  const params = useParams();
  const router = useRouter();
  const categoria = (params?.categoria as string) || 'tgt'; 
  
  const jogosDaCategoria = (jogosData as any)[categoria];
  const jogos = jogosDaCategoria?.top10 || [];
  
  const { votos, duelos, dueloAtual, carregado, registrarVoto, desfazerVoto } = useVotingProgress(categoria, jogos);
  
  const [animacao, setAnimacao] = useState<{jogo1: 'idle'|'winner'|'loser', jogo2: 'idle'|'winner'|'loser'}>({ jogo1: 'idle', jogo2: 'idle' });
  const [enviando, setEnviando] = useState(false);
  const [iniciou, setIniciou] = useState(false);

  function executarVoto(vencedor: Jogo, perdedor: Jogo, jogo1Venceu: boolean) {
    if (animacao.jogo1 !== 'idle') return;

    setAnimacao({ jogo1: jogo1Venceu ? 'winner' : 'loser', jogo2: jogo1Venceu ? 'loser' : 'winner' });

    setTimeout(() => {
      registrarVoto(vencedor.titulo, perdedor.titulo);
      setAnimacao({ jogo1: 'idle', jogo2: 'idle' }); 
    }, 180);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!carregado || duelos.length === 0 || dueloAtual >= duelos.length || enviando || !iniciou) return;
      const duelo = duelos[dueloAtual];
      
      if (e.key === 'ArrowLeft') { e.preventDefault(); executarVoto(duelo.jogo1, duelo.jogo2, true); } 
      else if (e.key === 'ArrowRight') { e.preventDefault(); executarVoto(duelo.jogo2, duelo.jogo1, false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [carregado, duelos, dueloAtual, animacao, enviando, iniciou]);

  if (jogos.length === 0) {
    notFound();
  }

  async function enviarParaPlacarGlobal(placarFinal: any[], votosBrutos: any[]) {
    const turnstileToken = (window as any).turnstile?.getResponse();
    if (!turnstileToken) { alert("Por favor, aguarde a verificação de segurança aparecer e clique novamente."); return; }

    setEnviando(true);
    const pairwiseParaEnviar = votosBrutos.map(v => ({ winner_title: v.vencedor, loser_title: v.perdedor, category: categoria }));

    try {
      const resposta = await fetch('/api/vote', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: categoria, turnstileToken, pairwise: pairwiseParaEnviar })
      });
      const resultado = await resposta.json();
      
      if (resultado.success) {
        localStorage.setItem(`tgt_has_voted_${categoria}`, 'true');
        localStorage.setItem(`tgt_my_ranking_${categoria}`, JSON.stringify(placarFinal));
        window.location.href = `/obrigado?categoria=${categoria}`;
      } else {
        if (resultado.error && resultado.error.includes("já votou")) {
          localStorage.setItem(`tgt_has_voted_${categoria}`, 'true');
          localStorage.setItem(`tgt_my_ranking_${categoria}`, JSON.stringify(placarFinal));
          alert("Parece que você já votou nesta categoria! Vamos te levar para a página de resultados.");
          window.location.href = `/obrigado?categoria=${categoria}`;
        } else {
          alert("Ops! Ocorreu um erro: " + resultado.error);
          (window as any).turnstile?.reset(); 
          setEnviando(false); 
        }
      }
    } catch (erro) {
      alert("Erro de conexão. Tente novamente.");
      (window as any).turnstile?.reset();
      setEnviando(false); 
    }
  }

  // TELA DE INTRODUÇÃO
  if (!iniciou && dueloAtual === 0 && votos.length === 0) {
    return (
      <main style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', textAlign: 'center', padding: '120px 2rem 2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ color: 'var(--purple-neon)', fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>
            PREPARE-SE PARA O VEREDITO
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Você terá <strong>45 duelos</strong> pela frente. Escolha o seu favorito em cada confronto e ajude a coroar o verdadeiro GOTY da categoria <strong>{categoria.toUpperCase()}</strong>.
          </p>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '3rem', color: '#d4d4d8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <kbd style={{ backgroundColor: '#1a1a24', border: '1px solid #333', borderRadius: '4px', padding: '4px 10px', color: '#FFF' }}>←</kbd> Vota no Jogo 1
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <kbd style={{ backgroundColor: '#1a1a24', border: '1px solid #333', borderRadius: '4px', padding: '4px 10px', color: '#FFF' }}>→</kbd> Vota no Jogo 2
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => router.push('/votar')} style={{ backgroundColor: 'transparent', border: '1px solid #555', color: '#a1a1aa', padding: '1rem 2rem', fontSize: '1rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#FFF'} onMouseOut={(e) => e.currentTarget.style.color = '#a1a1aa'}>
              ← Trocar Categoria
            </button>
            <button onClick={() => setIniciou(true)} style={{ backgroundColor: 'var(--purple-neon)', color: '#FFF', padding: '1rem 3rem', fontSize: '1.1rem', fontWeight: 'bold', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 0 30px rgba(176, 38, 255, 0.5)' }}>
              COMEÇAR A VOTAR
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  if (!carregado || duelos.length === 0) {
    return <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: '120px' }}><h1 style={{ color: 'var(--purple-neon)' }}>Preparando o tapete vermelho...</h1></main>;
  }

  if (dueloAtual >= duelos.length) {
    const placarFinal = calcularPlacar(jogos, votos);
    return (
      <main style={{ padding: '120px 2rem 2rem', textAlign: 'center', minHeight: '100vh' }}>
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
        <h1 style={{ color: 'var(--purple-neon)', marginBottom: '0.5rem' }}>SUA SELEÇÃO FINAL</h1>
        <p style={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2rem' }}>{categoria}</p>
        
        <ul style={{ listStyle: 'none', padding: 0, maxWidth: '400px', margin: '0 auto', marginBottom: '2rem' }}>
          {placarFinal.map((item, index) => (
            <li key={item.titulo} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #333', color: 'white' }}>
              <span>{index + 1}º {item.titulo}</span><span>{item.pontos} PTS</span>
            </li>
          ))}
        </ul>

        <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} data-theme="dark" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}></div>
        <button onClick={() => enviarParaPlacarGlobal(placarFinal, votos)} disabled={enviando} style={{ backgroundColor: enviando ? '#666' : 'var(--purple-neon)', color: '#FFF', padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: enviando ? 'not-allowed' : 'pointer', boxShadow: '0 0 20px rgba(176, 38, 255, 0.4)' }}>
          {enviando ? 'ENVIANDO...' : 'CONFIRMAR MEU VOTO'}
        </button>
      </main>
    );
  }

  const duelo = duelos[dueloAtual];
  const progressoPorcentagem = ((dueloAtual) / duelos.length) * 100;

  const btnTopoStyle = {
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    backdropFilter: 'blur(10px)',
    color: '#a1a1aa',
    border: '1px solid #555',
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    transition: 'all 0.2s',
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '100px 1rem 2rem', gap: '1.5rem', overflow: 'hidden', minHeight: '100vh' }}>
      
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />

      {/* BOTÕES NO TOPO COM Z-INDEX ALTO */}
      <div style={{ position: 'absolute', top: '90px', left: '0', width: '100%', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 }}>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button onClick={() => router.push('/votar')} disabled={enviando} style={btnTopoStyle} onMouseOver={(e) => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = '#FFF'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.borderColor = '#555'; }}>
            ← Trocar Categoria
          </button>
          
          {dueloAtual > 0 && (
            <button onClick={desfazerVoto} disabled={enviando} style={btnTopoStyle} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--purple-neon)'; e.currentTarget.style.borderColor = 'var(--purple-neon)'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.borderColor = '#555'; }}>
              ← Desfazer Voto
            </button>
          )}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        {/* BARRA DE PROGRESSO E TÍTULO */}
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '1rem' }}>
          <h1 style={{ color: 'var(--purple-neon)', fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>QUAL FOI O MELHOR?</h1>
          <div style={{ width: '100%', maxWidth: '400px', margin: '0.8rem auto 0', backgroundColor: '#1A1A24', height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressoPorcentagem}%` }} transition={{ type: 'spring', stiffness: 50, damping: 20 }} style={{ height: '100%', backgroundColor: 'var(--purple-neon)', boxShadow: '0 0 10px var(--purple-neon)' }} />
          </div>
          <span style={{ display: 'block', fontSize: '0.85rem', color: '#a1a1aa', marginTop: '0.6rem', fontWeight: 'normal', letterSpacing: '2px' }}>
            BATALHA {dueloAtual + 1} DE {duelos.length} ({categoria.toUpperCase()})
          </span>
        </div>
      </div>
      
      <div style={{ display: 'flex', position: 'relative', alignItems: 'stretch', justifyContent: 'center', width: '100%', maxWidth: '900px', gap: '2rem' }}>
        
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '80px', pointerEvents: 'none' }}>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, var(--purple-neon), transparent)', marginBottom: '0.5rem' }} />
          <div style={{ width: '60px', height: '60px', transform: 'rotate(45deg)', background: 'linear-gradient(135deg, #1a1a24, #05000A)', border: '1.5px solid var(--purple-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulseGlow 2s infinite ease-in-out', position: 'relative' }}>
            <span style={{ transform: 'rotate(-45deg)', color: '#D4AF37', fontSize: '1.2rem', fontWeight: 900, textShadow: '0 0 10px rgba(212, 175, 55, 0.8)' }}>VS</span>
          </div>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to top, transparent, var(--purple-neon), transparent)', marginTop: '0.5rem' }} />
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div 
            key={`jogo1-${dueloAtual}`}
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100, rotate: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 1 }}
            style={{ flex: 1, display: 'flex', justifyContent: 'center', paddingRight: '40px', minWidth: 0 }}
          >
            <CardDuelo jogo={duelo.jogo1} status={animacao.jogo1} onClick={() => executarVoto(duelo.jogo1, duelo.jogo2, true)} />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          <motion.div 
            key={`jogo2-${dueloAtual}`}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100, rotate: 3 }} transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 1 }}
            style={{ flex: 1, display: 'flex', justifyContent: 'center', paddingLeft: '40px', minWidth: 0 }}
          >
            <CardDuelo jogo={duelo.jogo2} status={animacao.jogo2} onClick={() => executarVoto(duelo.jogo2, duelo.jogo1, false)} />
          </motion.div>
        </AnimatePresence>

      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
        <span style={{ color: '#a1a1aa', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <kbd style={{ backgroundColor: '#1a1a24', border: '1px solid #333', borderBottom: '2px solid #555', borderRadius: '4px', padding: '2px 8px', color: '#FFF', fontFamily: 'monospace', fontSize: '0.9rem' }}>←</kbd> para escolher
        </span>
        <span style={{ color: '#a1a1aa', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <kbd style={{ backgroundColor: '#1a1a24', border: '1px solid #333', borderBottom: '2px solid #555', borderRadius: '4px', padding: '2px 8px', color: '#FFF', fontFamily: 'monospace', fontSize: '0.9rem' }}>→</kbd> para escolher
        </span>
      </div>

    </main>
  );
}