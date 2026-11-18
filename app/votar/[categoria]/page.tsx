// app/votar/[categoria]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Script from 'next/script';
import jogosData from '../../../lib/jogos.json';
import { calcularPlacar, Jogo } from '../../../lib/condorcet';
import { useVotingProgress } from '../../../lib/useVotingProgress'; 
import { motion } from 'framer-motion';
import ArenaDuelo from '../../../components/ArenaDuelo';
import CartaoVeredito from '../../../components/CartaoVeredito';

const IconLockClock = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

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

  const cardClip = 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)';

  useEffect(() => {
    if (duelos.length > 0 && dueloAtual >= duelos.length) {
      const timer = setTimeout(() => {
        if ((window as any).turnstile) {
          (window as any).turnstile.render('.cf-turnstile', {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
            theme: 'dark',
          });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [dueloAtual, duelos.length]);

  function executarVoto(vencedor: Jogo, perdedor: Jogo, jogo1Venceu: boolean) {
    if (animacao.jogo1 !== 'idle') return;
    setAnimacao({ jogo1: jogo1Venceu ? 'winner' : 'loser', jogo2: jogo1Venceu ? 'loser' : 'winner' });
    setTimeout(() => {
      registrarVoto(vencedor.titulo, perdedor.titulo);
      setAnimacao({ jogo1: 'idle', jogo2: 'idle' }); 
    }, 400); 
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

  if (!jogosDaCategoria) { notFound(); }

  if (jogos.length === 0) {
    return (
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', textAlign: 'center', padding: '140px 2rem 2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}><IconLockClock /></div>
          <h1 style={{ color: '#D4AF37', fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', fontFamily: 'var(--font-teko)' }}>PORTÕES FECHADOS ATÉ 19/11</h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Assim que os indicados oficiais do mercado forem revelados no dia <strong>19/11</strong>, esta arena será destravada para os confrontos.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/votar')} style={{ backgroundColor: 'transparent', border: '1px solid #555', color: '#a1a1aa', padding: '1rem 2rem', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', borderRadius: '50px' }} onMouseOver={(e) => e.currentTarget.style.color = '#FFF'} onMouseOut={(e) => e.currentTarget.style.color = '#a1a1aa'}>
              ← Voltar
            </button>
            <button onClick={() => router.push('/votar/tgt')} className="btn-arena" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
              ENTRAR NA ARENA TRUE GOTY
            </button>
          </div>
        </motion.div>
      </main>
    );
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

  // ==========================================
  // TELA DE BRIEFING
  // ==========================================
  if (!iniciou && dueloAtual === 0 && votos.length === 0) {
    return (
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '100vh', padding: '120px 2rem 4rem', backgroundColor: 'transparent' }}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}
        >
          <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', width: '100%', height: '250px', background: 'radial-gradient(ellipse at top, rgba(176,38,255,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ color: 'var(--purple-neon)', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '4px', marginBottom: '0.5rem', zIndex: 1, fontFamily: 'var(--font-teko)' }}>
            TEMPORADA 2026
          </div>
          <h1 style={{ color: '#FFF', fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, margin: 0, lineHeight: 0.9, zIndex: 1, fontFamily: 'var(--font-teko)' }}>
            ESCOLHA O SEU<br />
            <span className="title-shine" style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', display: 'inline-block', marginTop: '0.2rem' }}>
              TRUE GAME OF THE YEAR
            </span>
          </h1>
          <p style={{ color: '#D1D5DB', fontSize: '1.1rem', margin: '1rem auto 2.5rem', lineHeight: 1.5, maxWidth: '600px', zIndex: 1, fontWeight: 500 }}>
            45 duelos. Um campeão. Quem decide é quem joga.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', width: '100%', marginBottom: '2.5rem', zIndex: 1 }}>
            <div style={{ backgroundColor: 'rgba(28, 28, 30, 0.8)', border: '1px solid rgba(176, 38, 255, 0.3)', padding: '1.2rem', clipPath: cardClip, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ color: 'var(--purple-neon)', fontSize: '2rem', fontWeight: 900, lineHeight: 1, fontFamily: 'var(--font-teko)' }}>01</div>
              <h3 style={{ color: '#FFF', fontSize: '1.1rem', margin: 0, fontWeight: 900, fontFamily: 'var(--font-teko)', letterSpacing: '1px' }}>ESCOLHA O VENCEDOR</h3>
              <p style={{ color: '#a1a1aa', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>Clique no jogo superior em cada confronto ou use as setas.</p>
            </div>
            <div style={{ backgroundColor: 'rgba(28, 28, 30, 0.8)', border: '1px solid rgba(176, 38, 255, 0.3)', padding: '1.2rem', clipPath: cardClip, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ color: '#D4AF37', fontSize: '2rem', fontWeight: 900, lineHeight: 1, fontFamily: 'var(--font-teko)' }}>02</div>
              <h3 style={{ color: '#FFF', fontSize: '1.1rem', margin: 0, fontWeight: 900, fontFamily: 'var(--font-teko)', letterSpacing: '1px' }}>CONSTRUA O PLACAR</h3>
              <p style={{ color: '#a1a1aa', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>Cada vitória vale 1 ponto. Cada jogo disputa 9 duelos.</p>
            </div>
            <div style={{ backgroundColor: 'rgba(28, 28, 30, 0.8)', border: '1px solid rgba(176, 38, 255, 0.3)', padding: '1.2rem', clipPath: cardClip, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ color: '#FFF', fontSize: '2rem', fontWeight: 900, lineHeight: 1, fontFamily: 'var(--font-teko)' }}>03</div>
              <h3 style={{ color: '#FFF', fontSize: '1.1rem', margin: 0, fontWeight: 900, fontFamily: 'var(--font-teko)', letterSpacing: '1px' }}>COROE O CAMPEÃO</h3>
              <p style={{ color: '#a1a1aa', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>No fim, a matemática revela o campeão. Empate se resolve no mano a mano.</p>
            </div>
          </div>

          <button onClick={() => setIniciou(true)} style={{ 
            padding: '1.2rem 5rem', fontSize: '1.8rem', zIndex: 1, width: '100%', maxWidth: '500px',
            backgroundColor: 'var(--purple-neon)', color: '#FFF', fontWeight: 900, border: '2px solid #FFF',
            clipPath: cardClip, cursor: 'pointer', boxShadow: '0 0 40px rgba(176, 38, 255, 0.6), inset 0 0 20px rgba(255,255,255,0.2)',
            transition: 'all 0.2s ease', textTransform: 'uppercase', letterSpacing: '2px',
            fontFamily: 'var(--font-teko)', animation: 'pulseGlow 1.5s infinite'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 60px rgba(176, 38, 255, 0.9), inset 0 0 30px rgba(255,255,255,0.4)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(176, 38, 255, 0.6), inset 0 0 20px rgba(255,255,255,0.2)'; }}
          >
            VOTE AGORA
          </button>

          <button onClick={() => router.push('/votar')} style={{ marginTop: '1.5rem', background: 'transparent', border: 'none', color: '#71717a', fontSize: '0.9rem', cursor: 'pointer', zIndex: 1, transition: 'color 0.2s', fontWeight: 'bold' }} onMouseOver={(e) => e.currentTarget.style.color = '#FFF'} onMouseOut={(e) => e.currentTarget.style.color = '#71717a'}>
            ← Trocar arena
          </button>
        </motion.div>
      </main>
    );
  }

  // ==========================================
  // TELA DE CARREGAMENTO
  // ==========================================
  if (!carregado || duelos.length === 0) {
    return <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: '120px' }}><h1 style={{ color: 'var(--purple-neon)' }}>Preparando o tapete vermelho...</h1></main>;
  }

  // ==========================================
  // TELA DE SELEÇÃO FINAL (USANDO O NOVO COMPONENTE)
  // ==========================================
  if (dueloAtual >= duelos.length) {
    const placar = calcularPlacar(jogos, votos);
    
    // Aqui a gente enriquece o placar com as imagens antes de mandar pro componente
    const placarComImagens = placar.map(item => {
      const jogoInfo = jogos.find((j: any) => j.titulo === item.titulo);
      return {
        ...item,
        imagem: jogoInfo?.imagem || '/placeholder.jpg'
      };
    });

    return (
      <>
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
        <CartaoVeredito 
          ranking={placarComImagens} 
          enviando={enviando} 
          onEnviar={() => enviarParaPlacarGlobal(placar, votos)} 
          onVoltar={() => {
            setIniciou(true);
            desfazerVoto();
          }}
        />
      </>
    );
  }

  // ==========================================
  // TELA DE DUELO (RENDERIZA O COMPONENTE)
  // ==========================================
  const duelo = duelos[dueloAtual];
  const progressoPorcentagem = ((dueloAtual) / duelos.length) * 100;

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <ArenaDuelo 
        duelo={duelo}
        animacao={animacao}
        dueloAtual={dueloAtual}
        totalDuelos={duelos.length}
        categoria={categoria}
        progressoPorcentagem={progressoPorcentagem}
        enviando={enviando}
        onVoto={executarVoto}
        onDesfazer={desfazerVoto}
        onTrocarArena={() => router.push('/votar')}
      />
    </>
  );
}