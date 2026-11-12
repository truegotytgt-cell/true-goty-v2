// app/votar/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import jogosData from '../../lib/jogos.json';
import { gerarDuelos, calcularPlacar, Duelo, Voto } from '../../lib/condorcet';
import CardDuelo from '../../components/CardDuelo';

export default function Home() {
  const jogos = jogosData.top10;
  
  const [duelos, setDuelos] = useState<Duelo[]>([]); 
  const [dueloAtual, setDueloAtual] = useState(0);
  const [votos, setVotos] = useState<Voto[]>([]);5
  const [finalizado, setFinalizado] = useState(false);

  useEffect(() => {
    setDuelos(gerarDuelos(jogos));
  }, []);

  function registrarVoto(vencedor: any, perdedor: any) {
    const novosVotos = [...votos, { vencedor: vencedor.titulo, perdedor: perdedor.titulo }];
    setVotos(novosVotos);

    if (dueloAtual + 1 >= duelos.length) {
      setFinalizado(true);
    } else {
      setDueloAtual(dueloAtual + 1);
    }
  }

    async function enviarParaPlacarGlobal(placarFinal: any[]) {
    const turnstileToken = (window as any).turnstile?.getResponse();

    if (!turnstileToken) {
      alert("Por favor, aguarde a verificação de segurança ou recarregue a página.");
      return;
    }

    const dadosParaEnviar = placarFinal.map(item => ({
      game_title: item.titulo,
      score: item.pontos,
      category: 'tgt',
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
        // SALVANDO NO NAVEGADOR (LocalStorage)
        localStorage.setItem('tgt_has_voted_tgt', 'true');
        localStorage.setItem('tgt_my_ranking_tgt', JSON.stringify(placarFinal));
        
        // Redireciona para a página de Obrigado
        window.location.href = '/obrigado';
      } else {
        alert("Erro de segurança: " + resultado.error);
      }
    } catch (erro) {
      alert("Erro ao enviar os votos.");
    }
  }

  if (finalizado) {
    const placarFinal = calcularPlacar(jogos, votos);

    const top1 = placarFinal[0];
    const top2 = placarFinal[1];
    const top3 = placarFinal[2];

    const img1 = jogos.find(j => j.titulo === top1.titulo)?.imagem;
    const img2 = jogos.find(j => j.titulo === top2.titulo)?.imagem;
    const img3 = jogos.find(j => j.titulo === top3.titulo)?.imagem;

   // Procure por esta linha no seu page.tsx:
const urlImagem = `/api/og?t1=${encodeURIComponent(top1.titulo)}&i1=${encodeURIComponent(img1)}&t2=${encodeURIComponent(top2.titulo)}&i2=${encodeURIComponent(img2)}&t3=${encodeURIComponent(top3.titulo)}&i3=${encodeURIComponent(img3)}`;
    return (
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
        
        <h1 style={{ color: 'var(--purple-neon)' }}>SEU TOP 10</h1>
        <ul style={{ listStyle: 'none', padding: 0, maxWidth: '400px', margin: '0 auto', marginBottom: '2rem' }}>
          {placarFinal.map((item, index) => (
            <li key={item.titulo} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #333' }}>
              <span>{index + 1}º {item.titulo}</span>
              <span>{item.pontos} PTS</span>
            </li>
          ))}
        </ul>

        <div style={{ marginBottom: '2rem' }}>
          <a 
            href={urlImagem} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              backgroundColor: 'transparent',
              color: 'var(--purple-neon)',
              padding: '1rem 3rem',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              border: '2px solid var(--purple-neon)',
              borderRadius: '8px',
              textDecoration: 'none',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            BAIXAR IMAGEM DO TOP 3
          </a>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>A imagem abre em uma nova aba. Clique com o botão direito para salvar.</p>
        </div>

        <div 
          className="cf-turnstile" 
          data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} 
          data-theme="dark"
          style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}
        ></div>

        <button 
          onClick={() => enviarParaPlacarGlobal(placarFinal)}
          style={{
            backgroundColor: 'var(--purple-neon)',
            color: '#FFF',
            padding: '1rem 3rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(176, 38, 255, 0.4)'
          }}
        >
          ENVIAR PARA O PLACAR GLOBAL
        </button>
      </main>
    );
  }

  if (duelos.length === 0) {
    return (
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <h1 style={{ color: 'var(--purple-neon)' }}>Carregando duelos...</h1>
      </main>
    );
  }

  const duelo = duelos[dueloAtual];

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '2rem' }}>
      <h1 style={{ color: 'var(--purple-neon)' }}>BATALHA {dueloAtual + 1} DE {duelos.length}</h1>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <CardDuelo jogo={duelo.jogo1} onClick={() => registrarVoto(duelo.jogo1, duelo.jogo2)} />
        <h2 style={{ fontSize: '3rem', color: 'var(--purple-neon)' }}>VS</h2>
        <CardDuelo jogo={duelo.jogo2} onClick={() => registrarVoto(duelo.jogo2, duelo.jogo1)} />
      </div>
    </main>
  );
}