// app/historia/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import jogosData from '../../lib/jogos.json';

// Ícones SVG Minimalistas
const IconZebra = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--purple-neon)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const IconParelho = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const IconAtropelo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

function HistoriaContent() {
  const searchParams = useSearchParams();
  const catUrl = searchParams.get('cat') as 'tgt' | 'mercado' | null;
  
  const [categoria, setCategoria] = useState<'tgt' | 'mercado'>(catUrl || 'tgt');
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  
  const [highlights, setHighlights] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  const [jogoA, setJogoA] = useState('');
  const [jogoB, setJogoB] = useState('');
  const [h2h, setH2h] = useState<any>(null);
  const [buscandoH2h, setBuscandoH2h] = useState(false);

  const anosDisponiveis = [2026, 2025]; 

  const cardClip = 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)';
  const btnClip = 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)';
  const selectClip = 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)';

  useEffect(() => {
    async function buscarHighlights() {
      setCarregando(true);
      try {
        const res = await fetch(`/api/highlights?category=${categoria}&year=${anoSelecionado}`);
        const json = await res.json();
        if (json.success) {
          setHighlights(json.data);
        }
      } catch (erro) {
        console.error("Erro ao buscar highlights", erro);
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
        const res = await fetch(`/api/head-to-head?category=${categoria}&year=${anoSelecionado}&jogoA=${encodeURIComponent(jogoA)}&jogoB=${encodeURIComponent(jogoB)}`);
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
          background-color: rgba(28, 28, 30, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
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
          background-color: rgba(28, 28, 30, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 3rem 2rem;
          text-align: center;
          backdrop-filter: blur(5px);
          box-sizing: border-box;
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

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '2.5rem', width: '100%' }}>
        <div style={{ display: 'inline-block', border: '1px solid rgba(176, 38, 255, 0.4)', backgroundColor: 'rgba(176, 38, 255, 0.1)', color: 'var(--purple-neon)', padding: '6px 16px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', marginBottom: '1rem', clipPath: btnClip }}>
          [ ARQUIVO OFICIAL • TELEMETRIA & RECORDES ]
        </div>
        <h1 style={{ color: 'white', fontSize: 'clamp(2.3rem, 8vw, 4rem)', fontWeight: 900, margin: 0, lineHeight: 1 }}>
          MEMÓRIA DA <span style={{ color: 'var(--purple-neon)' }}>ARENA</span>
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '1rem', margin: '1rem auto 0', maxWidth: '600px' }}>
          Reviva os maiores massacres, as zebras improváveis e os duelos mais sangrentos de cada temporada.
        </p>
      </motion.div>

      {/* CONSOLE DE FILTROS (Chanfrado) */}
      <div className="historia-filtros" style={{ clipPath: cardClip }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ color: '#a1a1aa', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>ARENA</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setCategoria('tgt')} style={{ padding: '0.6rem 1.3rem', fontWeight: 'bold', cursor: 'pointer', border: 'none', backgroundColor: categoria === 'tgt' ? 'var(--purple-neon)' : 'rgba(255,255,255,0.05)', color: categoria === 'tgt' ? '#FFF' : '#a1a1aa', transition: 'all 0.3s', clipPath: btnClip }}>
              TRUE GOTY
            </button>
            <button onClick={() => setCategoria('mercado')} style={{ padding: '0.6rem 1.3rem', fontWeight: 'bold', cursor: 'pointer', border: 'none', backgroundColor: categoria === 'mercado' ? '#D4AF37' : 'rgba(255,255,255,0.05)', color: categoria === 'mercado' ? '#000' : '#a1a1aa', transition: 'all 0.3s', clipPath: btnClip }}>
              MERCADO
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ color: '#a1a1aa', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>TEMPORADA</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {anosDisponiveis.map(ano => (
              <button key={ano} onClick={() => setAnoSelecionado(ano)} style={{ padding: '0.6rem 1.3rem', fontWeight: 'bold', cursor: 'pointer', border: 'none', backgroundColor: anoSelecionado === ano ? '#F4F4F0' : 'rgba(255,255,255,0.05)', color: anoSelecionado === ano ? '#000' : '#a1a1aa', transition: 'all 0.3s', clipPath: btnClip }}>
                {ano}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {carregando ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: 'var(--purple-neon)', fontSize: '1.2rem', marginBottom: '4rem', fontWeight: 'bold', letterSpacing: '2px', textAlign: 'center' }}>
            CONSULTANDO OS ARQUIVOS DO TEMPO...
          </motion.div>
        ) : !highlights || (!highlights.zebra && !highlights.parelho && !highlights.desequilibrado) ? (
          
          /* ESTADO VAZIO */
          <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '800px', padding: '3rem 1.5rem', border: '2px dashed rgba(255,255,255,0.1)', backgroundColor: 'rgba(28, 28, 30, 0.5)', clipPath: cardClip, textAlign: 'center', marginBottom: '4rem', boxSizing: 'border-box' }}>
            <h2 style={{ color: '#F4F4F0', fontSize: '2rem', marginBottom: '1rem' }}>ARQUIVO DE {anoSelecionado} EM BRANCO</h2>
            <p style={{ color: '#a1a1aa', marginBottom: '2rem', maxWidth: '500px' }}>
              Nenhum recorde foi cravado nesta arena ainda. Entre nos duelos agora e escreva as primeiras estatísticas da temporada.
            </p>
            <Link href={`/votar/${categoria}`} className="btn-arena" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
              INAUGURAR A ARENA
            </Link>
          </motion.div>

        ) : (
          <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            
            {/* CARDS DE DESTAQUES */}
            <div className="historia-destaques-grid">
              
              {highlights.zebra && (
                <div style={{ backgroundColor: 'rgba(28, 28, 30, 0.8)', border: '1px solid rgba(176, 38, 255, 0.3)', padding: '2rem', clipPath: cardClip, position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
                  <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><IconZebra /></div>
                  <div style={{ marginBottom: '1.5rem' }}><IconZebra /></div>
                  <h2 style={{ color: 'var(--purple-neon)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '1px' }}>A GRANDE ZEBRA</h2>
                  <p style={{ color: '#D1D5DB', fontSize: '0.95rem', lineHeight: 1.5 }}>O azarão <strong>{highlights.zebra.lanterna}</strong> derrubou o gigante <strong>{highlights.zebra.jogo_derrotado}</strong> em <strong>{highlights.zebra.vitorias} ocasiões</strong>!</p>
                </div>
              )}

              {highlights.parelho && (
                <div style={{ backgroundColor: 'rgba(28, 28, 30, 0.8)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '2rem', clipPath: cardClip, position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
                  <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><IconParelho /></div>
                  <div style={{ marginBottom: '1.5rem' }}><IconParelho /></div>
                  <h2 style={{ color: '#D4AF37', fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '1px' }}>CHOQUE DE TITÃS</h2>
                  <p style={{ color: '#D1D5DB', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>Decidido voto a voto entre <strong>{highlights.parelho.jogo_a}</strong> e <strong>{highlights.parelho.jogo_b}</strong>.</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--purple-neon)' }}>{highlights.parelho.porcentagem_a}%</span>
                    <span style={{ color: '#D4AF37' }}>{highlights.parelho.porcentagem_b}%</span>
                  </div>
                  <div style={{ width: '100%', height: '12px', backgroundColor: '#1C1C1E', display: 'flex', overflow: 'hidden', clipPath: selectClip }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${highlights.parelho.porcentagem_a}\%` }} transition={{ duration: 1 }} style={{ backgroundColor: 'var(--purple-neon)' }} /> <motion.div initial={{ width: 0 }} animate={{ width: `${highlights.parelho.porcentagem_b}%` }} transition={{ duration: 1 }} style={{ backgroundColor: '#D4AF37' }} />
                  </div>
                </div>
              )}

              {highlights.desequilibrado && (
                <div style={{ backgroundColor: 'rgba(28, 28, 30, 0.8)', border: '1px solid rgba(255,255,255,0.2)', padding: '2rem', clipPath: cardClip, position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
                  <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><IconAtropelo /></div>
                  <div style={{ marginBottom: '1.5rem' }}><IconAtropelo /></div>
                  <h2 style={{ color: '#F4F4F0', fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '1px' }}>MASSACRE NA ARENA</h2>
                  <p style={{ color: '#D1D5DB', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}><strong>{highlights.desequilibrado.jogo_a}</strong> não deu a mínima chance para <strong>{highlights.desequilibrado.jogo_b}</strong>.</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: '#F4F4F0' }}>{highlights.desequilibrado.porcentagem_a}%</span>
                    <span style={{ color: '#a1a1aa' }}>{highlights.desequilibrado.porcentagem_b}%</span>
                  </div>
                  <div style={{ width: '100%', height: '12px', backgroundColor: '#0A0A0A', display: 'flex', overflow: 'hidden', clipPath: selectClip, border: '1px solid #333' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${highlights.desequilibrado.porcentagem_a}\%` }} transition={{ duration: 1 }} style={{ backgroundColor: '#F4F4F0' }} /> <motion.div initial={{ width: 0 }} animate={{ width: `${highlights.desequilibrado.porcentagem_b}%` }} transition={{ duration: 1 }} style={{ backgroundColor: '#333333' }} />
                  </div>
                </div>
              )}
            </div>

            {/* CONFRONTO DIRETO (ARQUIVO DE RIVALIDADE) */}
            <div className="rivalidade-box" style={{ clipPath: cardClip }}>
              <h2 style={{ color: 'white', fontSize: 'clamp(1.7rem, 6vw, 2.2rem)', fontWeight: 900, margin: '0 0 0.5rem 0', letterSpacing: '0.5px' }}>
                ARQUIVO DE RIVALIDADE
              </h2>
              <p style={{ color: '#a1a1aa', margin: '0 auto 2.2rem', maxWidth: '520px', lineHeight: 1.5 }}>
                Coloque dois finalistas frente a frente e descubra quem levou a melhor no histórico da edição.
              </p>

              <div className="rivalidade-duelo">
                {/* Lutador A */}
                <div className="rivalidade-lutador">
                  {jogoA && getImagem(jogoA) ? (
                    <motion.img initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} src={getImagem(jogoA)!} alt="Jogo A" style={{ width: '92px', aspectRatio: '3/4', objectFit: 'cover', border: '2px solid var(--purple-neon)', clipPath: selectClip, boxShadow: '0 0 18px rgba(176, 38, 255, 0.45)' }} />
                  ) : (
                    <div style={{ width: '92px', aspectRatio: '3/4', border: '2px dashed rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', clipPath: selectClip, fontSize: '1.5rem', fontWeight: 800 }}>?</div>
                  )}
                  <select value={jogoA} onChange={(e) => setJogoA(e.target.value)} disabled={semJogos} style={{ width: '100%', padding: '0.95rem 1rem', backgroundColor: jogoA ? 'rgba(176, 38, 255, 0.12)' : '#1C1C1E', color: jogoA ? 'var(--purple-neon)' : 'white', border: '1px solid', borderColor: jogoA ? 'var(--purple-neon)' : '#333', fontSize: '0.95rem', cursor: semJogos ? 'not-allowed' : 'pointer', outline: 'none', clipPath: selectClip, textAlign: 'center', fontWeight: 'bold', boxSizing: 'border-box' }}>
                    <option value="" style={{ color: '#FFF', backgroundColor: '#1C1C1E' }}>Escolha o Lutador A</option>
                    {listaJogos.map((jogo: any) => <option key={`A-${jogo.titulo}`} value={jogo.titulo} style={{ color: '#FFF', backgroundColor: '#1C1C1E' }}>{jogo.titulo}</option>)} </select> </div>  <div className="rivalidade-vs">VS</div>  {/* Lutador B */} <div className="rivalidade-lutador"> {jogoB && getImagem(jogoB) ? ( <motion.img initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} src={getImagem(jogoB)!} alt="Jogo B" style={{ width: '92px', aspectRatio: '3/4', objectFit: 'cover', border: '2px solid #D4AF37', clipPath: selectClip, boxShadow: '0 0 18px rgba(212, 175, 55, 0.45)' }} /> ) : ( <div style={{ width: '92px', aspectRatio: '3/4', border: '2px dashed rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', clipPath: selectClip, fontSize: '1.5rem', fontWeight: 800 }}>?</div> )} <select value={jogoB} onChange={(e) => setJogoB(e.target.value)} disabled={semJogos} style={{ width: '100\%', padding: '0.95rem 1rem', backgroundColor: jogoB ? 'rgba(212, 175, 55, 0.12)' : '#1C1C1E', color: jogoB ? '#D4AF37' : 'white', border: '1px solid', borderColor: jogoB ? '#D4AF37' : '#333', fontSize: '0.95rem', cursor: semJogos ? 'not-allowed' : 'pointer', outline: 'none', clipPath: selectClip, textAlign: 'center', fontWeight: 'bold', boxSizing: 'border-box' }}> <option value="" style={{ color: '#FFF', backgroundColor: '#1C1C1E' }}>Escolha o Lutador B</option> {listaJogos.map((jogo: any) => <option key={`B-${jogo.titulo}`} value={jogo.titulo} style={{ color: '#FFF', backgroundColor: '#1C1C1E' }}>{jogo.titulo}</option>)}
                  </select>
                </div>
              </div>

              {semJogos ? (
                <div style={{ color: '#a1a1aa' }}>Aguardando revelação dos jogos...</div>
              ) : buscandoH2h ? (
                <div style={{ color: 'var(--purple-neon)', fontWeight: 'bold' }}>BUSCANDO NO ARQUIVO...</div>
              ) : jogoA && jogoB && jogoA === jogoB ? (
                <div style={{ color: 'var(--purple-neon)', fontWeight: 'bold' }}>Um jogo não luta contra ele mesmo. Escolha outro adversário.</div>
              ) : h2h && h2h.total > 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.8rem' }}>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <span style={{ color: 'var(--purple-neon)', fontSize: 'clamp(1.5rem, 6vw, 2rem)', fontWeight: 900 }}>{h2h.porcentagemA}%</span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <span style={{ color: '#D4AF37', fontSize: 'clamp(1.5rem, 6vw, 2rem)', fontWeight: 900 }}>{h2h.porcentagemB}%</span>
                    </div>
                  </div>
                  
                  <div style={{ width: '100%', height: '24px', backgroundColor: '#1C1C1E', display: 'flex', overflow: 'hidden', border: '1px solid #333', clipPath: selectClip }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${h2h.porcentagemA}\%` }} transition={{ duration: 1 }} style={{ backgroundColor: 'var(--purple-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 900, fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden' }}>{h2h.vitoriasA} VITÓRIAS</motion.div> <motion.div initial={{ width: 0 }} animate={{ width: `${h2h.porcentagemB}%` }} transition={{ duration: 1 }} style={{ backgroundColor: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 900, fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden' }}>{h2h.vitoriasB} VITÓRIAS</motion.div>
                  </div>
                  <p style={{ color: '#71717a', fontSize: '0.8rem', marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Veredito de {h2h.total} votos da comunidade.</p>
                </motion.div>
              ) : (jogoA && jogoB) ? (
                <div style={{ color: '#a1a1aa' }}>Esses dois ainda não se encontraram na arena. O duelo está em aberto.</div>
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
    <Suspense fallback={<main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--purple-neon)' }}>Carregando...</main>}>
      <HistoriaContent />
    </Suspense>
  );
}