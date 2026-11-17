// app/historia/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import jogosData from '../../lib/jogos.json';

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

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '8rem 2rem 4rem', backgroundColor: '#0A0A0A', backgroundImage: 'radial-gradient(circle at 50% 0%, #1a1a24 0%, #0A0A0A 100%)' }}>
      
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ color: 'white', fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', textAlign: 'center', textShadow: '0 0 20px rgba(176, 38, 255, 0.3)' }}>
        RANKINGS HISTÓRICOS
      </motion.h1>
      <p style={{ color: '#a1a1aa', fontSize: '1.1rem', marginBottom: '3rem', textAlign: 'center' }}>
        Viaje no tempo e descubra os maiores causos, zebras e confrontos do {categoria === 'tgt' ? 'TGT' : 'Mercado'}.
      </p>

      <div style={{ backgroundColor: '#121212', border: '1px solid #333', borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '800px', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', marginBottom: '4rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#a1a1aa', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px' }}>CATEGORIA</span>
          <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#0A0A0A', padding: '0.5rem', borderRadius: '50px', border: '1px solid #333' }}>
            <button onClick={() => setCategoria('tgt')} style={{ padding: '0.8rem 2rem', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', border: 'none', backgroundColor: categoria === 'tgt' ? 'var(--purple-neon)' : 'transparent', color: categoria === 'tgt' ? '#FFF' : '#a1a1aa', transition: 'all 0.3s' }}>
              TRUE GOTY
            </button>
            <button onClick={() => setCategoria('mercado')} style={{ padding: '0.8rem 2rem', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', border: 'none', backgroundColor: categoria === 'mercado' ? '#D4AF37' : 'transparent', color: categoria === 'mercado' ? '#000' : '#a1a1aa', transition: 'all 0.3s' }}>
              MERCADO
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#a1a1aa', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px' }}>EDIÇÃO</span>
          <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#0A0A0A', padding: '0.5rem', borderRadius: '50px', border: '1px solid #333' }}>
            {anosDisponiveis.map(ano => (
              <button key={ano} onClick={() => setAnoSelecionado(ano)} style={{ padding: '0.8rem 1.5rem', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', border: 'none', backgroundColor: anoSelecionado === ano ? '#D4AF37' : 'transparent', color: anoSelecionado === ano ? '#000' : '#a1a1aa', transition: 'all 0.3s' }}>
                {ano}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {carregando ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: 'var(--purple-neon)', fontSize: '1.2rem', marginBottom: '4rem' }}>
            Consultando os arquivos do tempo...
          </motion.div>
        ) : !highlights || (!highlights.zebra && !highlights.parelho && !highlights.desequilibrado) ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: '#a1a1aa', textAlign: 'center', marginBottom: '4rem' }}>
            <h2>Ainda não há dados suficientes para {categoria.toUpperCase()} em {anoSelecionado}.</h2>
            <p>Seja o primeiro a votar e fazer história!</p>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1200px', marginBottom: '5rem' }}>
              {highlights.zebra && (
                <div style={{ backgroundColor: '#121212', border: '1px solid #333', borderRadius: '24px', padding: '2rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🦓</div>
                  <h2 style={{ color: 'var(--purple-neon)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>A Zebra do Ano</h2>
                  <p style={{ color: '#a1a1aa' }}>O lanterna ({highlights.zebra.lanterna}) conseguiu vencer o favorito <strong>{highlights.zebra.jogo_derrotado}</strong> em <strong>{highlights.zebra.vitorias} ocasiões</strong>!</p>
                </div>
              )}
              {highlights.parelho && (
                <div style={{ backgroundColor: '#121212', border: '1px solid #333', borderRadius: '24px', padding: '2rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚖️</div>
                  <h2 style={{ color: 'var(--purple-neon)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>O Mais Parelho</h2>
                  <p style={{ color: '#a1a1aa', marginBottom: '1rem' }}>A comunidade se dividiu ao máximo entre <strong>{highlights.parelho.jogo_a}</strong> e <strong>{highlights.parelho.jogo_b}</strong>.</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 'bold', marginBottom: '0.5rem' }}><span>{highlights.parelho.porcentagem_a}%</span><span>{highlights.parelho.porcentagem_b}%</span></div>
                  <div style={{ width: '100%', height: '10px', backgroundColor: '#333', borderRadius: '5px', display: 'flex', overflow: 'hidden' }}><div style={{ width: `${highlights.parelho.porcentagem_a}%`, backgroundColor: 'var(--purple-neon)' }} /><div style={{ width: `${highlights.parelho.porcentagem_b}%`, backgroundColor: '#D4AF37' }} /></div>
                </div>
              )}
              {highlights.desequilibrado && (
                <div style={{ backgroundColor: '#121212', border: '1px solid #333', borderRadius: '24px', padding: '2rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💥</div>
                  <h2 style={{ color: 'var(--purple-neon)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>O Atropelo</h2>
                  <p style={{ color: '#a1a1aa', marginBottom: '1rem' }}><strong>{highlights.desequilibrado.jogo_a}</strong> não deu a mínima chance para <strong>{highlights.desequilibrado.jogo_b}</strong>.</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 'bold', marginBottom: '0.5rem' }}><span>{highlights.desequilibrado.porcentagem_a}%</span><span>{highlights.desequilibrado.porcentagem_b}%</span></div>
                  <div style={{ width: '100%', height: '10px', backgroundColor: '#333', borderRadius: '5px', display: 'flex', overflow: 'hidden' }}><div style={{ width: `${highlights.desequilibrado.porcentagem_a}%`, backgroundColor: 'var(--purple-neon)' }} /><div style={{ width: `${highlights.desequilibrado.porcentagem_b}%`, backgroundColor: '#333' }} /></div>
                </div>
              )}
            </div>

            <div style={{ width: '100%', maxWidth: '800px', backgroundColor: '#121212', border: '1px solid #333', borderRadius: '24px', padding: '3rem 2rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Confronto Direto</h2>
              <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Escolha dois jogos para ver quem venceu mais vezes em {anoSelecionado}.</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                <select value={jogoA} onChange={(e) => setJogoA(e.target.value)} disabled={semJogos} style={{ padding: '1rem', borderRadius: '8px', backgroundColor: '#0A0A0A', color: 'white', border: '1px solid #444', minWidth: '250px', fontSize: '1rem', cursor: semJogos ? 'not-allowed' : 'pointer', opacity: semJogos ? 0.5 : 1 }}>
                  <option value="">Selecione o Jogo A</option>
                  {listaJogos.map((jogo: any) => <option key={`A-${jogo.titulo}`} value={jogo.titulo}>{jogo.titulo}</option>)}
                </select>

                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--purple-neon)', fontWeight: 'bold', fontSize: '1.5rem' }}>VS</div>

                <select value={jogoB} onChange={(e) => setJogoB(e.target.value)} disabled={semJogos} style={{ padding: '1rem', borderRadius: '8px', backgroundColor: '#0A0A0A', color: 'white', border: '1px solid #444', minWidth: '250px', fontSize: '1rem', cursor: semJogos ? 'not-allowed' : 'pointer', opacity: semJogos ? 0.5 : 1 }}>
                  <option value="">Selecione o Jogo B</option>
                  {listaJogos.map((jogo: any) => <option key={`B-${jogo.titulo}`} value={jogo.titulo}>{jogo.titulo}</option>)}
                </select>
              </div>

              {semJogos ? (
                 <div style={{ color: '#a1a1aa' }}>Aguardando revelação dos jogos de {categoria.toUpperCase()}...</div>
              ) : buscandoH2h ? (
                <div style={{ color: 'var(--purple-neon)' }}>Buscando confrontos...</div>
              ) : jogoA && jogoB && jogoA === jogoB ? (
                <div style={{ color: '#ff4444' }}>Por favor, selecione dois jogos diferentes.</div>
              ) : h2h && h2h.total > 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>{h2h.jogoA}</h3>
                      <span style={{ color: 'var(--purple-neon)', fontSize: '2rem', fontWeight: 'bold' }}>{h2h.porcentagemA}%</span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>{h2h.jogoB}</h3>
                      <span style={{ color: '#D4AF37', fontSize: '2rem', fontWeight: 'bold' }}>{h2h.porcentagemB}%</span>
                    </div>
                  </div>
                  
                  <div style={{ width: '100%', height: '24px', backgroundColor: '#0A0A0A', borderRadius: '12px', display: 'flex', overflow: 'hidden', border: '1px solid #333' }}>
                    <div style={{ width: `${h2h.porcentagemA}%`, backgroundColor: 'var(--purple-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold', fontSize: '0.8rem' }}>{h2h.vitoriasA} VITÓRIAS</div>
                    <div style={{ width: `${h2h.porcentagemB}%`, backgroundColor: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold', fontSize: '0.8rem' }}>{h2h.vitoriasB} VITÓRIAS</div>
                  </div>
                  <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginTop: '1rem' }}>Baseado em {h2h.total} votos totais da comunidade.</p>
                </motion.div>
              ) : (jogoA && jogoB) ? (
                <div style={{ color: '#a1a1aa' }}>Esses dois jogos ainda não se enfrentaram neste ano.</div>
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