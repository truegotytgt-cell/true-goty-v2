'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import jogosData from '../../lib/jogos.json';
import { useLanguage } from '../../components/LanguageProvider';

const IconZebra = ({ color }: { color: string }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const IconParelho = ({ color }: { color: string }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
    <path d="M13 19l6-6" />
    <path d="M16 16l4 4" />
    <path d="M19 21l2-2" />
    <path d="M14.5 6.5L18 3h3v3l-3.5 3.5" />
    <path d="M5 14l6 6" />
    <path d="M8 17l-4 4" />
    <path d="M5 19l-2 2" />
  </svg>
);

const IconChama = ({ color }: { color: string }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

function HistoriaContent() {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const catUrl = searchParams.get('cat');

  const [categoria, setCategoria] = useState<'tgt' | 'mercado'>(
    catUrl === 'mercado' ? 'mercado' : 'tgt'
  );
  const [anoSelecionado, setAnoSelecionado] = useState<number>(2026);

  const [highlights, setHighlights] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  const [jogoA, setJogoA] = useState('');
  const [jogoB, setJogoB] = useState('');
  const [h2h, setH2h] = useState<any>(null);
  const [buscandoH2h, setBuscandoH2h] = useState(false);

  const anosDisponiveis = [2026];

  useEffect(() => {
    if (catUrl === 'mercado' || catUrl === 'tgt') {
      setCategoria(catUrl);
    }
  }, [catUrl]);

  const isTgt = categoria === 'tgt';
  const corPrincipal = isTgt ? 'var(--purple-neon)' : '#D4AF37';
  const corSecundaria = isTgt ? '#D4AF37' : '#E2E8F0';
  const corSeloBg = isTgt ? 'rgba(176, 38, 255, 0.1)' : 'rgba(212, 175, 55, 0.12)';
  const corSeloBorda = isTgt ? 'rgba(176, 38, 255, 0.4)' : 'rgba(212, 175, 55, 0.55)';
  const corBordaPainel = isTgt ? 'rgba(255, 255, 255, 0.1)' : 'rgba(212, 175, 55, 0.35)';
  const corBgPainel = isTgt ? 'rgba(20, 20, 24, 0.85)' : 'rgba(24, 20, 12, 0.88)';
  const corGlowPrincipal = isTgt ? 'rgba(176, 38, 255, 0.45)' : 'rgba(212, 175, 55, 0.45)';
  const corGlowSecundaria = isTgt ? 'rgba(212, 175, 55, 0.45)' : 'rgba(226, 232, 240, 0.35)';
  const corSelectAtivoA = isTgt ? 'rgba(176, 38, 255, 0.12)' : 'rgba(212, 175, 55, 0.14)';
  const corSelectAtivoB = isTgt ? 'rgba(212, 175, 55, 0.12)' : 'rgba(226, 232, 240, 0.1)';

  useEffect(() => {
    async function buscarHighlights() {
      setCarregando(true);
      try {
        const res = await fetch(`/api/highlights?category=${categoria}&year=${anoSelecionado}`);
        const json = await res.json();
        if (json.success) {
          setHighlights(json.data);
        } else {
          setHighlights(null);
        }
      } catch (erro) {
        console.error('Erro ao buscar highlights', erro);
        setHighlights(null);
      } finally {
        setCarregando(false);
      }
    }

    buscarHighlights();
    setJogoA('');
    setJogoB('');
    setH2h(null);
  }, [categoria, anoSelecionado]);

  useEffect(() => {
    async function buscarH2h() {
      if (!jogoA || !jogoB || jogoA === jogoB) {
        setH2h(null);
        return;
      }
      setBuscandoH2h(true);
      try {
        const res = await fetch(
          `/api/head-to-head?category=${categoria}&year=${anoSelecionado}&jogoA=${encodeURIComponent(jogoA)}&jogoB=${encodeURIComponent(jogoB)}`
        );
        const json = await res.json();
        if (json.success) setH2h(json.data);
      } catch (erro) {
        console.error(erro);
      } finally {
        setBuscandoH2h(false);
      }
    }
    buscarH2h();
  }, [jogoA, jogoB, categoria, anoSelecionado]);

  const listaJogos = (jogosData as any)[categoria]?.top10 || [];
  const semJogos = listaJogos.length === 0;

  const getImagem = (titulo: string) => {
    const jogo = listaJogos.find((j: any) => j.titulo === titulo);
    return jogo ? jogo.imagem : null;
  };

  const txt =
    lang === 'en'
      ? {
          mercadoAviso:
            'Independent simulation stats for market nominees (TGA) — no official affiliation with The Game Awards.',
          btnTgt: 'TRUE GOTY',
          btnMercado: 'MARKET',
          carregandoArquivo: 'CONSULTING THE ARCHIVES...',
          vazioSub:
            'No records have been set in this arena yet. Enter the duels now and write the first stats of the season.',
          btnInaugurar: 'OPEN THE ARENA',
          zebraTitulo: 'BIGGEST UPSET',
          zebraDescPrefix: 'Underdog',
          zebraDescMid: 'took down favorite',
          zebraDescEnd: 'times',
          parelhoTitulo: 'TITAN CLASH',
          parelhoDescMid: 'and',
          parelhoDescEnd: 'Decided vote by vote between',
          massacreTitulo: 'ARENA STOMP',
          massacreDescMid: 'left no room for',
          rivalTitulo: 'RIVALRY ARCHIVE',
          rivalSub:
            'Pit two finalists head-to-head and see who came out on top in this edition’s history.',
          lutadorA: 'Pick Fighter A',
          lutadorB: 'Pick Fighter B',
          aguardandoJogos: 'Waiting for games reveal...',
          buscando: 'SEARCHING ARCHIVE...',
          mesmoJogo: 'A game cannot fight itself. Pick another opponent.',
          vitorias: 'WINS',
          vereditoDePrefix: 'Verdict from',
          vereditoDeSuffix: 'community votes.',
          semConfronto: 'These two have not faced each other in the arena yet. The matchup is open.',
        }
      : lang === 'es'
        ? {
            mercadoAviso:
              'Estadísticas de la simulación independiente de nominados del mercado (TGA) — sin vínculo oficial con The Game Awards.',
            btnTgt: 'TRUE GOTY',
            btnMercado: 'MERCADO',
            carregandoArquivo: 'CONSULTANDO LOS ARCHIVOS...',
            vazioSub:
              'Aún no hay récords en esta arena. Entra en los duelos ahora y escribe las primeras estadísticas de la temporada.',
            btnInaugurar: 'INAUGURAR LA ARENA',
            zebraTitulo: 'LA GRAN SORPRESA',
            zebraDescPrefix: 'El no favorito',
            zebraDescMid: 'derribó a',
            zebraDescEnd: 'veces',
            parelhoTitulo: 'CHOQUE DE TITANES',
            parelhoDescMid: 'y',
            parelhoDescEnd: 'Decidido voto a voto entre',
            massacreTitulo: 'PALIZA EN LA ARENA',
            massacreDescMid: 'no le dio tregua a',
            rivalTitulo: 'ARCHIVO DE RIVALIDAD',
            rivalSub:
              'Enfrenta a dos finalistas cara a cara y descubre quién dominó el historial de la edición.',
            lutadorA: 'Elige al Luchador A',
            lutadorB: 'Elige al Luchador B',
            aguardandoJogos: 'Esperando la revelación de los juegos...',
            buscando: 'BUSCANDO EN EL ARCHIVO...',
            mesmoJogo: 'Un juego no compite contra sí mismo. Elige otro rival.',
            vitorias: 'VICTORIAS',
            vereditoDePrefix: 'Veredicto de',
            vereditoDeSuffix: 'votos de la comunidad.',
            semConfronto: 'Estos dos aún no se han enfrentado en la arena. El duelo está abierto.',
          }
        : {
            mercadoAviso:
              'Estatísticas da simulação independente dos indicados do mercado (TGA) — sem vínculo oficial com o The Game Awards.',
            btnTgt: 'TRUE GOTY',
            btnMercado: 'MERCADO',
            carregandoArquivo: 'CONSULTANDO OS ARQUIVOS DO TEMPO...',
            vazioSub:
              'Nenhum recorde foi cravado nesta arena ainda. Entre nos duelos agora e escreva as primeiras estatísticas da temporada.',
            btnInaugurar: 'INAUGURAR A ARENA',
            zebraTitulo: 'A GRANDE ZEBRA',
            zebraDescPrefix: 'O azarão',
            zebraDescMid: 'derrubou o gigante',
            zebraDescEnd: 'ocasiões',
            parelhoTitulo: 'CHOQUE DE TITÃS',
            parelhoDescMid: 'e',
            parelhoDescEnd: 'Decidido voto a voto entre',
            massacreTitulo: 'MASSACRE NA ARENA',
            massacreDescMid: 'não deu a mínima chance para',
            rivalTitulo: 'ARQUIVO DE RIVALIDADE',
            rivalSub:
              'Coloque dois finalistas frente a frente e descubra quem levou a melhor no histórico da edição.',
            lutadorA: 'Escolha o Lutador A',
            lutadorB: 'Escolha o Lutador B',
            aguardandoJogos: 'Aguardando revelação dos jogos...',
            buscando: 'BUSCANDO NO ARQUIVO...',
            mesmoJogo: 'Um jogo não luta contra ele mesmo. Escolha outro adversário.',
            vitorias: 'VITÓRIAS',
            vereditoDePrefix: 'Veredito de',
            vereditoDeSuffix: 'votos da comunidade.',
            semConfronto: 'Esses dois ainda não se encontraram na arena. O duelo está em aberto.',
          };

  return (
    <main className="historia-main">
      <style>{`
        .historia-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          padding: 7.5rem 2rem 4rem;
          background-color: transparent;
          box-sizing: border-box;
          width: 100%;
        }

        .historia-filtros {
          border-radius: 0px;
          padding: 1rem 2rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem 2rem;
          justify-content: center;
          align-items: center;
          margin-bottom: 3.5rem;
          backdrop-filter: blur(10px);
          max-width: 100%;
          box-sizing: border-box;
          transition: border-color 0.3s ease, background-color 0.3s ease;
        }

        .historia-destaques-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          width: 100%;
          max-width: 1200px;
          margin-bottom: 3.5rem;
        }

        .rivalidade-box {
          width: 100%;
          max-width: 820px;
          border-radius: 0px;
          padding: 3rem 2rem;
          text-align: center;
          backdrop-filter: blur(5px);
          box-sizing: border-box;
          transition: border-color 0.3s ease, background-color 0.3s ease;
        }

        .rivalidade-duelo {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 1.5rem;
          align-items: center;
          margin-bottom: 2.5rem;
          width: 100%;
        }

        .rivalidade-lutador {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 100%;
          min-width: 0;
        }

        .rivalidade-vs {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F4F4F0;
          font-family: var(--font-teko), sans-serif;
          font-weight: 900;
          font-size: 2.6rem;
          line-height: 1;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.45);
          padding: 0 0.5rem;
        }

        @media (max-width: 768px) {
          .historia-main {
            padding: 5.5rem 1rem 3rem;
          }

          .historia-filtros {
            padding: 1rem;
            gap: 1rem;
            margin-bottom: 2.5rem;
            width: 100%;
          }

          .historia-destaques-grid {
            grid-template-columns: 1fr;
            margin-bottom: 2.5rem;
          }

          .rivalidade-box {
            padding: 2rem 1.15rem;
          }

          .rivalidade-duelo {
            grid-template-columns: 1fr;
            gap: 1.25rem;
            margin-bottom: 2rem;
          }

          .rivalidade-vs {
            font-size: 2rem;
            padding: 0.2rem 0;
          }
        }
      `}</style>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '2.5rem', width: '100%' }}>
        <div
          style={{
            display: 'inline-block',
            border: `1px solid ${corSeloBorda}`,
            backgroundColor: corSeloBg,
            color: corPrincipal,
            padding: '6px 16px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '2px',
            marginBottom: '1rem',
            borderRadius: '0px',
            transition: 'all 0.3s ease',
          }}
        >
          {t.hist_badge}
        </div>

        <h1 style={{ color: 'white', fontSize: 'clamp(2.3rem, 8vw, 4rem)', fontWeight: 900, margin: 0, lineHeight: 1 }}>
          {t.hist_titulo_1}{' '}
          <span style={{ color: corPrincipal, transition: 'color 0.3s ease' }}>
            {t.hist_titulo_2}
          </span>
        </h1>

        <p style={{ color: '#a1a1aa', fontSize: '1rem', margin: '1rem auto 0', maxWidth: '600px', lineHeight: 1.5 }}>
          {t.hist_sub}
        </p>

        {!isTgt && (
          <p style={{ color: '#8b8b94', fontSize: '0.78rem', margin: '0.6rem auto 0', maxWidth: '580px' }}>
            {txt.mercadoAviso}
          </p>
        )}
      </motion.div>

      <div
        className="historia-filtros"
        style={{
          backgroundColor: corBgPainel,
          border: `1px solid ${corBordaPainel}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ color: '#a1a1aa', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>{t.hist_arena_label}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setCategoria('tgt')}
              style={{
                padding: '0.6rem 1.3rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: categoria === 'tgt' ? 'var(--purple-neon)' : 'rgba(255,255,255,0.1)',
                borderRadius: '0px',
                backgroundColor: categoria === 'tgt' ? 'var(--purple-neon)' : 'rgba(255,255,255,0.04)',
                color: categoria === 'tgt' ? '#FFF' : '#a1a1aa',
                transition: 'all 0.25s',
              }}
            >
              {txt.btnTgt}
            </button>
            <button
              type="button"
              onClick={() => setCategoria('mercado')}
              style={{
                padding: '0.6rem 1.3rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: categoria === 'mercado' ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                borderRadius: '0px',
                backgroundColor: categoria === 'mercado' ? '#D4AF37' : 'rgba(255,255,255,0.04)',
                color: categoria === 'mercado' ? '#000' : '#a1a1aa',
                transition: 'all 0.25s',
              }}
            >
              {txt.btnMercado}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ color: '#a1a1aa', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>{t.hist_temporada_label}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {anosDisponiveis.map((ano) => (
              <button
                type="button"
                key={ano}
                onClick={() => setAnoSelecionado(ano)}
                style={{
                  padding: '0.6rem 1.3rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor:
                    anoSelecionado === ano
                      ? isTgt
                        ? '#F4F4F0'
                        : '#D4AF37'
                      : 'rgba(255,255,255,0.1)',
                  borderRadius: '0px',
                  backgroundColor:
                    anoSelecionado === ano
                      ? isTgt
                        ? '#F4F4F0'
                        : '#D4AF37'
                      : 'rgba(255,255,255,0.04)',
                  color: anoSelecionado === ano ? '#000' : '#a1a1aa',
                  transition: 'all 0.25s',
                }}
              >
                {ano}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {carregando ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ color: corPrincipal, fontSize: '1.2rem', marginBottom: '4rem', fontWeight: 'bold', letterSpacing: '2px', textAlign: 'center' }}
          >
            {txt.carregandoArquivo}
          </motion.div>
        ) : !highlights || (!highlights.zebra && !highlights.parelho && !highlights.desequilibrado) ? (
          <motion.div
            key={`empty-${categoria}-${anoSelecionado}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '800px',
              padding: '3rem 1.5rem',
              border: `1px solid ${corBordaPainel}`,
              borderTop: `2px solid ${corPrincipal}`,
              borderRadius: '0px',
              backgroundColor: corBgPainel,
              backgroundImage: isTgt
                ? 'radial-gradient(circle at 50% 0%, rgba(176, 38, 255, 0.12), transparent 65%)'
                : 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.16), transparent 65%)',
              textAlign: 'center',
              marginBottom: '4rem',
              boxSizing: 'border-box',
            }}
          >
            <h2 style={{ color: '#F4F4F0', fontSize: '2rem', marginBottom: '1rem' }}>
              {t.hist_vazio_1} <span style={{ color: corPrincipal }}>{anoSelecionado}</span> {t.hist_vazio_2}
            </h2>
            <p style={{ color: '#a1a1aa', marginBottom: '2rem', maxWidth: '500px', lineHeight: 1.55 }}>
              {txt.vazioSub}
            </p>
            <Link
              href={`/votar/${categoria}`}
              className="btn-arena"
              style={{
                padding: '1rem 3rem',
                fontSize: '1.25rem',
                background: isTgt
                  ? 'linear-gradient(135deg, #7e22ce, #B026FF)'
                  : 'linear-gradient(135deg, #B8860B, #D4AF37)',
                color: isTgt ? '#FFF' : '#0A0A0A',
                boxShadow: isTgt
                  ? '0 10px 30px rgba(176, 38, 255, 0.4), inset 0 0 20px rgba(255,255,255,0.15)'
                  : '0 10px 30px rgba(212, 175, 55, 0.4), inset 0 0 20px rgba(255,255,255,0.25)',
              }}
            >
              {txt.btnInaugurar}
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key={`content-${categoria}-${anoSelecionado}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
          >
            <div className="historia-destaques-grid">
              {highlights.zebra && (
                <div
                  style={{
                    backgroundColor: corBgPainel,
                    border: `1px solid ${corBordaPainel}`,
                    borderTop: `2px solid ${corPrincipal}`,
                    borderRadius: '0px',
                    padding: '2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                    <IconZebra color={corPrincipal} />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <IconZebra color={corPrincipal} />
                  </div>
                  <h2 style={{ color: corPrincipal, fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '1px' }}>
                    {txt.zebraTitulo}
                  </h2>
                  <p style={{ color: '#D1D5DB', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    {txt.zebraDescPrefix} <strong>{highlights.zebra.lanterna}</strong> {txt.zebraDescMid}{' '}
                    <strong>{highlights.zebra.jogo_derrotado}</strong> {highlights.zebra.vitorias} {txt.zebraDescEnd}!
                  </p>
                </div>
              )}

              {highlights.parelho && (
                <div
                  style={{
                    backgroundColor: corBgPainel,
                    border: `1px solid ${corBordaPainel}`,
                    borderTop: '2px solid #D4AF37',
                    borderRadius: '0px',
                    padding: '2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                    <IconParelho color="#D4AF37" />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <IconParelho color="#D4AF37" />
                  </div>
                  <h2 style={{ color: '#D4AF37', fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '1px' }}>
                    {txt.parelhoTitulo}
                  </h2>
                  <p style={{ color: '#D1D5DB', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    {txt.parelhoDescEnd} <strong>{highlights.parelho.jogo_a}</strong> {txt.parelhoDescMid}{' '}
                    <strong>{highlights.parelho.jogo_b}</strong>.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: corPrincipal }}>{highlights.parelho.porcentagem_a}%</span>
                    <span style={{ color: corSecundaria }}>{highlights.parelho.porcentagem_b}%</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', backgroundColor: '#1C1C1E', display: 'flex', overflow: 'hidden', borderRadius: '0px' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${highlights.parelho.porcentagem_a}%` }}
                      transition={{ duration: 1 }}
                      style={{ backgroundColor: corPrincipal }}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${highlights.parelho.porcentagem_b}%` }}
                      transition={{ duration: 1 }}
                      style={{ backgroundColor: corSecundaria }}
                    />
                  </div>
                </div>
              )}

              {highlights.desequilibrado && (
                <div
                  style={{
                    backgroundColor: corBgPainel,
                    border: `1px solid ${corBordaPainel}`,
                    borderTop: `2px solid ${isTgt ? '#F4F4F0' : '#D4AF37'}`,
                    borderRadius: '0px',
                    padding: '2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                    <IconChama color="#D4AF37" />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <IconChama color="#D4AF37" />
                  </div>
                  <h2
                    style={{
                      color: isTgt ? '#F4F4F0' : '#F4D06F',
                      fontSize: '1.5rem',
                      fontWeight: 900,
                      marginBottom: '0.5rem',
                      letterSpacing: '1px',
                    }}
                  >
                    {txt.massacreTitulo}
                  </h2>
                  <p style={{ color: '#D1D5DB', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    <strong>{highlights.desequilibrado.jogo_a}</strong> {txt.massacreDescMid}{' '}
                    <strong>{highlights.desequilibrado.jogo_b}</strong>.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: isTgt ? '#F4F4F0' : '#D4AF37' }}>{highlights.desequilibrado.porcentagem_a}%</span>
                    <span style={{ color: '#a1a1aa' }}>{highlights.desequilibrado.porcentagem_b}%</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', backgroundColor: '#0A0A0A', display: 'flex', overflow: 'hidden', borderRadius: '0px', border: '1px solid #333' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${highlights.desequilibrado.porcentagem_a}%` }}
                      transition={{ duration: 1 }}
                      style={{ backgroundColor: isTgt ? '#F4F4F0' : '#D4AF37' }}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${highlights.desequilibrado.porcentagem_b}%` }}
                      transition={{ duration: 1 }}
                      style={{ backgroundColor: '#333333' }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div
              className="rivalidade-box"
              style={{
                backgroundColor: isTgt ? 'rgba(20, 20, 24, 0.72)' : 'rgba(24, 20, 12, 0.78)',
                border: `1px solid ${corBordaPainel}`,
                borderTop: `2px solid ${corPrincipal}`,
              }}
            >
              <h2 style={{ color: 'white', fontSize: 'clamp(1.7rem, 6vw, 2.2rem)', fontWeight: 900, margin: '0 0 0.5rem 0', letterSpacing: '0.5px' }}>
                {txt.rivalTitulo}
              </h2>
              <p style={{ color: '#a1a1aa', margin: '0 auto 2.2rem', maxWidth: '520px', lineHeight: 1.5 }}>
                {txt.rivalSub}
              </p>

              <div className="rivalidade-duelo">
                <div className="rivalidade-lutador">
                  {jogoA && getImagem(jogoA) ? (
                    <motion.img
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      src={getImagem(jogoA)!}
                      alt="Jogo A"
                      style={{
                        width: '92px',
                        aspectRatio: '3/4',
                        objectFit: 'cover',
                        border: `2px solid ${corPrincipal}`,
                        borderRadius: '0px',
                        boxShadow: `0 0 18px ${corGlowPrincipal}`,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '92px',
                        aspectRatio: '3/4',
                        border: '1px dashed rgba(255,255,255,0.15)',
                        borderRadius: '0px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#444',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                      }}
                    >
                      ?
                    </div>
                  )}
                  <select
                    value={jogoA}
                    onChange={(e) => setJogoA(e.target.value)}
                    disabled={semJogos}
                    style={{
                      width: '100%',
                      padding: '0.95rem 1rem',
                      backgroundColor: jogoA ? corSelectAtivoA : '#1C1C1E',
                      color: jogoA ? corPrincipal : 'white',
                      border: '1px solid',
                      borderColor: jogoA ? corPrincipal : 'rgba(255,255,255,0.12)',
                      borderRadius: '0px',
                      fontSize: '0.95rem',
                      cursor: semJogos ? 'not-allowed' : 'pointer',
                      outline: 'none',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="" style={{ color: '#FFF', backgroundColor: '#1C1C1E' }}>
                      {txt.lutadorA}
                    </option>
                    {listaJogos.map((jogo: any) => (
                      <option key={`A-${jogo.titulo}`} value={jogo.titulo} style={{ color: '#FFF', backgroundColor: '#1C1C1E' }}>
                        {jogo.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rivalidade-vs" style={{ color: isTgt ? '#F4F4F0' : '#F4D06F' }}>
                  VS
                </div>

                <div className="rivalidade-lutador">
                  {jogoB && getImagem(jogoB) ? (
                    <motion.img
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      src={getImagem(jogoB)!}
                      alt="Jogo B"
                      style={{
                        width: '92px',
                        aspectRatio: '3/4',
                        objectFit: 'cover',
                        border: `2px solid ${corSecundaria}`,
                        borderRadius: '0px',
                        boxShadow: `0 0 18px ${corGlowSecundaria}`,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '92px',
                        aspectRatio: '3/4',
                        border: '1px dashed rgba(255,255,255,0.15)',
                        borderRadius: '0px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#444',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                      }}
                    >
                      ?
                    </div>
                  )}
                  <select
                    value={jogoB}
                    onChange={(e) => setJogoB(e.target.value)}
                    disabled={semJogos}
                    style={{
                      width: '100%',
                      padding: '0.95rem 1rem',
                      backgroundColor: jogoB ? corSelectAtivoB : '#1C1C1E',
                      color: jogoB ? corSecundaria : 'white',
                      border: '1px solid',
                      borderColor: jogoB ? corSecundaria : 'rgba(255,255,255,0.12)',
                      borderRadius: '0px',
                      fontSize: '0.95rem',
                      cursor: semJogos ? 'not-allowed' : 'pointer',
                      outline: 'none',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="" style={{ color: '#FFF', backgroundColor: '#1C1C1E' }}>
                      {txt.lutadorB}
                    </option>
                    {listaJogos.map((jogo: any) => (
                      <option key={`B-${jogo.titulo}`} value={jogo.titulo} style={{ color: '#FFF', backgroundColor: '#1C1C1E' }}>
                        {jogo.titulo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {semJogos ? (
                <div style={{ color: '#a1a1aa' }}>{txt.aguardandoJogos}</div>
              ) : buscandoH2h ? (
                <div style={{ color: corPrincipal, fontWeight: 'bold' }}>{txt.buscando}</div>
              ) : jogoA && jogoB && jogoA === jogoB ? (
                <div style={{ color: corPrincipal, fontWeight: 'bold' }}>
                  {txt.mesmoJogo}
                </div>
              ) : h2h && h2h.total > 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.8rem' }}>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <span style={{ color: corPrincipal, fontSize: 'clamp(1.5rem, 6vw, 2rem)', fontWeight: 900 }}>
                        {h2h.porcentagemA}%
                      </span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <span style={{ color: corSecundaria, fontSize: 'clamp(1.5rem, 6vw, 2rem)', fontWeight: 900 }}>
                        {h2h.porcentagemB}%
                      </span>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '24px', backgroundColor: '#1C1C1E', display: 'flex', overflow: 'hidden', border: '1px solid #333', borderRadius: '0px' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${h2h.porcentagemA}%` }}
                      transition={{ duration: 1 }}
                      style={{
                        backgroundColor: corPrincipal,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'black',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                      }}
                    >
                      {h2h.vitoriasA} {txt.vitorias}
                    </motion.div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${h2h.porcentagemB}%` }}
                      transition={{ duration: 1 }}
                      style={{
                        backgroundColor: corSecundaria,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'black',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                      }}
                    >
                      {h2h.vitoriasB} {txt.vitorias}
                    </motion.div>
                  </div>
                  <p style={{ color: '#71717a', fontSize: '0.8rem', marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {txt.vereditoDePrefix} {h2h.total} {txt.vereditoDeSuffix}
                  </p>
                </motion.div>
              ) : jogoA && jogoB ? (
                <div style={{ color: '#a1a1aa' }}>{txt.semConfronto}</div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function Historia() {
  return (
    <Suspense
      fallback={
        <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--purple-neon)' }}>
          Carregando...
        </main>
      }
    >
      <HistoriaContent />
    </Suspense>
  );
}