'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Script from 'next/script';
import jogosData from '../../../lib/jogos.json';
import { calcularPlacar, Jogo } from '../../../lib/condorcet';
import { useVotingProgress } from '../../../lib/useVotingProgress';
import { motion } from 'framer-motion';
import ArenaDuelo from '../../../components/ArenaDuelo';
import CartaoVeredito from '../../../components/CartaoVeredito';

const CATEGORIAS_VALIDAS = ['tgt', 'mercado'] as const;
type CategoriaValida = (typeof CATEGORIAS_VALIDAS)[number];

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

const IconLockClock = () => (
  <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function Votar() {
  const params = useParams();
  const router = useRouter();
  const categoriaParam = params?.categoria;

  const isCategoriaValida =
    typeof categoriaParam === 'string' &&
    (CATEGORIAS_VALIDAS as readonly string[]).includes(categoriaParam);

  if (!isCategoriaValida) {
    notFound();
  }

  const categoria: CategoriaValida = categoriaParam as CategoriaValida;
  const isTgt = categoria === 'tgt';

  const corPrincipal = isTgt ? '#B026FF' : '#D4AF37';
  const corGlow = isTgt ? 'rgba(176, 38, 255, 0.16)' : 'rgba(212, 175, 55, 0.16)';
  const corSeloBg = isTgt ? 'rgba(176, 38, 255, 0.1)' : 'rgba(212, 175, 55, 0.12)';
  const corSeloBorda = isTgt ? 'rgba(176, 38, 255, 0.45)' : 'rgba(212, 175, 55, 0.55)';
  const corCardBg = isTgt ? 'rgba(20, 20, 24, 0.85)' : 'rgba(24, 20, 12, 0.88)';
  const corCardBorda = isTgt ? 'rgba(255, 255, 255, 0.1)' : 'rgba(212, 175, 55, 0.3)';

  const jogosDaCategoria = (jogosData as any)[categoria];
  const jogos: Jogo[] = jogosDaCategoria?.top10 || [];

  const { votos, duelos, dueloAtual, carregado, registrarVoto, desfazerVoto } = useVotingProgress(
    categoria,
    jogos
  );

  const [animacao, setAnimacao] = useState<{
    jogo1: 'idle' | 'winner' | 'loser';
    jogo2: 'idle' | 'winner' | 'loser';
  }>({
    jogo1: 'idle',
    jogo2: 'idle',
  });
  const [enviando, setEnviando] = useState(false);
  const [iniciou, setIniciou] = useState(false);
  const votoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (votoTimerRef.current) {
        clearTimeout(votoTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (duelos.length > 0 && dueloAtual >= duelos.length && TURNSTILE_SITE_KEY) {
      const timer = setTimeout(() => {
        if ((window as any).turnstile) {
          (window as any).turnstile.render('.cf-turnstile', {
            sitekey: TURNSTILE_SITE_KEY,
            theme: 'dark',
          });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [dueloAtual, duelos.length]);

  function executarVoto(vencedor: Jogo, perdedor: Jogo, jogo1Venceu: boolean) {
    if (animacao.jogo1 !== 'idle') return;
    setAnimacao({
      jogo1: jogo1Venceu ? 'winner' : 'loser',
      jogo2: jogo1Venceu ? 'loser' : 'winner',
    });

    if (votoTimerRef.current) {
      clearTimeout(votoTimerRef.current);
    }

    votoTimerRef.current = setTimeout(() => {
      registrarVoto(vencedor.titulo, perdedor.titulo);
      setAnimacao({ jogo1: 'idle', jogo2: 'idle' });
    }, 400);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!carregado || duelos.length === 0 || dueloAtual >= duelos.length || enviando || !iniciou) {
        return;
      }
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
  }, [carregado, duelos, dueloAtual, animacao, enviando, iniciou]);

  if (!jogosDaCategoria) {
    notFound();
  }

  // ==========================================
  // TELA DE PORTÕES FECHADOS (SEM JOGOS AINDA)
  // ==========================================
  if (jogos.length === 0) {
    return (
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          padding: 'clamp(100px, 14vh, 140px) 1.25rem 3rem',
          boxSizing: 'border-box',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            width: '100%',
            maxWidth: '640px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2.75rem 2rem',
            backgroundColor: 'rgba(24, 20, 12, 0.88)',
            backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.16), transparent 65%)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            borderTop: '2px solid #D4AF37',
            borderRadius: '0px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ marginBottom: '1.25rem', filter: 'drop-shadow(0 0 16px rgba(212, 175, 55, 0.45))' }}>
            <IconLockClock />
          </div>

          <div
            style={{
              display: 'inline-block',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              color: '#F4D06F',
              padding: '5px 14px',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '2px',
              marginBottom: '1rem',
              borderRadius: '0px',
            }}
          >
            [ ARENA MERCADO (TGA) • ABERTURA EM 19/11 ]
          </div>

          <h1 style={{ color: '#FFF', fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 900, margin: '0 0 0.85rem 0', lineHeight: 1, fontFamily: 'var(--font-teko)' }}>
            PORTÕES FECHADOS <span style={{ color: '#D4AF37' }}>ATÉ 19/11</span>
          </h1>

          <p style={{ color: '#D1D5DB', fontSize: '1rem', lineHeight: 1.6, margin: '0 0 1rem 0', maxWidth: '500px' }}>
            Assim que os indicados do mercado forem revelados no dia <strong>19/11</strong>, esta arena será destravada para os confrontos diretos.
          </p>

          <p style={{ color: '#8b8b94', fontSize: '0.78rem', lineHeight: 1.5, margin: '0 0 2.25rem 0', maxWidth: '480px' }}>
            Simulação independente sem vínculo oficial com o The Game Awards.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
            <button
              type="button"
              onClick={() => router.push('/votar')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '0px',
                color: '#d4d4d8',
                padding: '0.95rem 1.8rem',
                fontSize: '0.85rem',
                fontWeight: 800,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#FFF';
                e.currentTarget.style.borderColor = '#D4AF37';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#d4d4d8';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
              }}
            >
              ← Voltar
            </button>
            <button
              type="button"
              onClick={() => router.push('/votar/tgt')}
              className="btn-arena"
              style={{ padding: '0.95rem 2.2rem', fontSize: '1.25rem' }}
            >
              ENTRAR NA ARENA TRUE GOTY
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  async function enviarParaPlacarGlobal(placarFinal: any[], votosBrutos: any[]) {
    const turnstileToken = (window as any).turnstile?.getResponse();
    if (!turnstileToken) {
      alert('Por favor, aguarde a verificação de segurança aparecer e clique novamente.');
      return;
    }

    setEnviando(true);
    const pairwiseParaEnviar = votosBrutos.map((v) => ({
      winner_title: v.vencedor,
      loser_title: v.perdedor,
      category: categoria,
    }));

    try {
      const resposta = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: categoria, turnstileToken, pairwise: pairwiseParaEnviar }),
      });
      const resultado = await resposta.json();

      if (resultado.success) {
        localStorage.setItem(`tgt_has_voted_${categoria}`, 'true');
        localStorage.setItem(`tgt_my_ranking_${categoria}`, JSON.stringify(placarFinal));
        window.location.href = `/obrigado?categoria=${categoria}`;
      } else {
        if (resultado.error && resultado.error.includes('já votou')) {
          localStorage.setItem(`tgt_has_voted_${categoria}`, 'true');
          localStorage.setItem(`tgt_my_ranking_${categoria}`, JSON.stringify(placarFinal));
          alert('Parece que você já votou nesta categoria! Vamos te levar para a página de resultados.');
          window.location.href = `/obrigado?categoria=${categoria}`;
        } else {
          alert('Ops! Ocorreu um erro: ' + resultado.error);
          (window as any).turnstile?.reset();
          setEnviando(false);
        }
      }
    } catch {
      alert('Erro de conexão. Tente novamente.');
      (window as any).turnstile?.reset();
      setEnviando(false);
    }
  }

  // ==========================================
  // TELA DE BRIEFING (CANTOS RETOS + CTA .btn-arena)
  // ==========================================
  if (!iniciou && dueloAtual === 0 && votos.length === 0) {
    const totalDuelosPrevisto = (jogos.length * (jogos.length - 1)) / 2;
    const duelosPorJogo = jogos.length - 1;

    const passos = [
      {
        num: '01',
        cor: isTgt ? '#B026FF' : '#D4AF37',
        titulo: 'ESCOLHA O VENCEDOR',
        texto: 'Clique no jogo superior em cada confronto direto ou use as setas do teclado.',
      },
      {
        num: '02',
        cor: isTgt ? '#D4AF37' : '#F4D06F',
        titulo: 'CONSTRUA O PLACAR',
        texto: `Cada vitória vale +1 ponto. Cada finalista disputa ${duelosPorJogo} duelos na arena.`,
      },
      {
        num: '03',
        cor: '#F4F4F0',
        titulo: 'COROE O CAMPEÃO',
        texto: 'No fim, a matemática revela o campeão. Empates são resolvidos no mano a mano.',
      },
    ];

    return (
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: 'clamp(100px, 13vh, 130px) 1.25rem 3.5rem',
          backgroundColor: 'transparent',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            width: '100%',
            maxWidth: '940px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-30px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              height: '260px',
              background: `radial-gradient(ellipse at top, ${corGlow} 0%, transparent 70%)`,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <div
            style={{
              display: 'inline-block',
              border: `1px solid ${corSeloBorda}`,
              backgroundColor: corSeloBg,
              color: corPrincipal,
              padding: '6px 18px',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '2.5px',
              marginBottom: '1.1rem',
              borderRadius: '0px',
              zIndex: 1,
            }}
          >
            {isTgt ? '[ TEMPORADA 2026 • ARENA TRUE GOTY ]' : '[ TEMPORADA 2026 • ARENA MERCADO (TGA) ]'}
          </div>

          <h1
            style={{
              color: '#F4F4F0',
              fontSize: 'clamp(2.5rem, 6vw, 4.3rem)',
              fontWeight: 900,
              margin: 0,
              lineHeight: 0.92,
              zIndex: 1,
              fontFamily: 'var(--font-teko)',
              textShadow: '0 10px 30px rgba(0,0,0,0.75)',
            }}
          >
            ESCOLHA O SEU
            <br />
            {isTgt ? (
              <span className="title-shine" style={{ fontSize: 'clamp(3rem, 7vw, 5.2rem)', display: 'inline-block', marginTop: '0.15rem' }}>
                TRUE GAME OF THE YEAR
              </span>
            ) : (
              <span style={{ color: '#D4AF37', fontSize: 'clamp(3rem, 7vw, 5.2rem)', display: 'inline-block', marginTop: '0.15rem' }}>
                CAMPEÃO DO MERCADO (TGA)
              </span>
            )}
          </h1>

          <p
            style={{
              color: '#D1D5DB',
              fontSize: 'clamp(1rem, 3vw, 1.15rem)',
              margin: '1rem auto 2.5rem',
              lineHeight: 1.5,
              maxWidth: '600px',
              zIndex: 1,
              fontWeight: 500,
            }}
          >
            {totalDuelosPrevisto} duelos diretos. Um campeão. Quem decide é quem joga.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.25rem',
              width: '100%',
              marginBottom: '2.75rem',
              zIndex: 1,
            }}
          >
            {passos.map((passo) => (
              <div
                key={passo.num}
                style={{
                  backgroundColor: corCardBg,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${corCardBorda}`,
                  borderTop: `2px solid ${passo.cor}`,
                  borderRadius: '0px',
                  padding: '1.6rem 1.4rem',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.55rem',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    color: passo.cor,
                    fontSize: '2.4rem',
                    fontWeight: 900,
                    lineHeight: 0.9,
                    fontFamily: 'var(--font-teko)',
                    letterSpacing: '1px',
                  }}
                >
                  {passo.num}
                </div>
                <h3
                  style={{
                    color: '#F4F4F0',
                    fontSize: '1.35rem',
                    margin: 0,
                    fontWeight: 800,
                    fontFamily: 'var(--font-teko)',
                    letterSpacing: '1px',
                    lineHeight: 1.05,
                  }}
                >
                  {passo.titulo}
                </h3>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                  {passo.texto}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIniciou(true)}
            className="btn-arena"
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '1.15rem 3rem',
              fontSize: '1.75rem',
              letterSpacing: '2px',
              zIndex: 1,
              background: isTgt
                ? 'linear-gradient(135deg, #7e22ce, #B026FF)'
                : 'linear-gradient(135deg, #B8860B, #D4AF37)',
              color: isTgt ? '#FFFFFF' : '#0A0A0A',
              boxShadow: isTgt
                ? '0 14px 40px rgba(176, 38, 255, 0.45), inset 0 0 20px rgba(255,255,255,0.16)'
                : '0 14px 40px rgba(212, 175, 55, 0.4), inset 0 0 20px rgba(255,255,255,0.25)',
            }}
          >
            VOTE AGORA →
          </button>

          {!isTgt && (
            <p style={{ color: '#71717a', fontSize: '0.78rem', marginTop: '1rem', maxWidth: '500px', lineHeight: 1.45, zIndex: 1 }}>
              Simulação independente sem vínculo oficial com o The Game Awards — votos computados apenas no placar da comunidade True GOTY.
            </p>
          )}

          <button
            type="button"
            onClick={() => router.push('/votar')}
            style={{
              marginTop: '1.5rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '0px',
              color: '#a1a1aa',
              padding: '0.6rem 1.3rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              zIndex: 1,
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#FFF';
              e.currentTarget.style.borderColor = corPrincipal;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#a1a1aa';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
            }}
          >
            ← Trocar de arena
          </button>
        </motion.div>
      </main>
    );
  }

  // ==========================================
  // TELA DE CARREGAMENTO
  // ==========================================
  if (!carregado || duelos.length === 0) {
    return (
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: '120px' }}>
        <h1 style={{ color: corPrincipal }}>Preparando o tapete vermelho...</h1>
      </main>
    );
  }

  // ==========================================
  // TELA DE SELEÇÃO FINAL
  // ==========================================
  if (dueloAtual >= duelos.length) {
    const placar = calcularPlacar(jogos, votos);

    const placarComImagens = placar.map((item) => {
      const jogoInfo = jogos.find((j: any) => j.titulo === item.titulo);
      return {
        ...item,
        imagem: jogoInfo?.imagem || '/placeholder.jpg',
      };
    });

    return (
      <>
        {TURNSTILE_SITE_KEY && (
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
        )}
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
  // TELA DE DUELO
  // ==========================================
  const duelo = duelos[dueloAtual];
  const progressoPorcentagem = (dueloAtual / duelos.length) * 100;

  return (
    <>
      {TURNSTILE_SITE_KEY && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      )}
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