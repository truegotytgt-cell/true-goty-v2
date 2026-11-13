// app/metodo/page.tsx
'use client';

import Link from 'next/link';

export default function Metodo() {
  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem', minHeight: '80vh' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ color: 'var(--purple-neon)', fontSize: '3rem', fontWeight: 900, textShadow: '0 0 20px rgba(176, 38, 255, 0.3)', marginBottom: '1rem' }}>
          O NOSSO MÉTODO
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto' }}>
          O TGT não é apenas mais um prêmio de "jogo do ano". Construímos um sistema de votação em 3 fases, inspirado em modelos estatísticos, para garantir que o vencedor seja verdadeiramente a escolha da comunidade.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* FASE 1 */}
        <div style={{ 
          backgroundColor: 'rgba(28, 28, 30, 0.5)', backdropFilter: 'blur(10px)', 
          border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '16px', padding: '2.5rem',
          transition: 'all 0.3s ease', cursor: 'default'
        }}
        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--purple-neon)'}
        onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.2)'}
        >
          <h2 style={{ color: 'var(--purple-neon)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800 }}>Fase 1: A Curadoria (Os 10 Indicados)</h2>
          <p style={{ color: '#D1D5DB', lineHeight: 1.7, fontSize: '1.05rem' }}>
            Para a nossa curadoria oficial, selecionamos 10 jogos com base em uma Média Ponderada de Metascore, OpenCritic e User Score (com filtro anti-Review Bombing). Como um experimento social e comparativo, também disponibilizaremos uma categoria onde você poderá aplicar o nosso método de votação sobre a lista de indicados revelada por outras premiações do mercado, mas sem qualquer vínculo oficial com elas.
          </p>
        </div>

        {/* FASE 2 */}
        <div style={{ 
          backgroundColor: 'rgba(28, 28, 30, 0.5)', backdropFilter: 'blur(10px)', 
          border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '16px', padding: '2.5rem',
          transition: 'all 0.3s ease', cursor: 'default'
        }}
        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--purple-neon)'}
        onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.2)'}
        >
          <h2 style={{ color: 'var(--purple-neon)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800 }}>Fase 2: O Mata-Mata (Método Condorcet)</h2>
          <p style={{ color: '#D1D5DB', lineHeight: 1.7, fontSize: '1.05rem' }}>
            Em vez de pedir para você dar uma nota de 0 a 10, nós usamos o Método de Condorcet. Nós geramos 45 combates diretos (Todos contra Todos) entre os 10 indicados. Você vê o Card A e o Card B e clica em quem é melhor. O sistema força você a comparar frente a frente. É matematicamente o método mais justo de votação.
          </p>
        </div>

        {/* FASE 3 */}
        <div style={{ 
          backgroundColor: 'rgba(28, 28, 30, 0.5)', backdropFilter: 'blur(10px)', 
          border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '16px', padding: '2.5rem',
          transition: 'all 0.3s ease', cursor: 'default'
        }}
        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--purple-neon)'}
        onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.2)'}
        >
          <h2 style={{ color: 'var(--purple-neon)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800 }}>Fase 3: A Pontuação e o Placar</h2>
          <p style={{ color: '#D1D5DB', lineHeight: 1.7, fontSize: '1.05rem' }}>
            Ao final dos seus 45 combates, o sistema calcula o seu Ranking Pessoal. Cada vitória vale +1 ponto e cada derrota vale -1 ponto. Se você concordar, você envia para o Placar Global, que é a soma matemática de todos os votos da comunidade.
          </p>
        </div>

      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Link href="/votar/tgt" style={{ 
          display: 'inline-block', backgroundColor: 'var(--purple-neon)', color: '#FFF', 
          padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 900, borderRadius: '8px', 
          textDecoration: 'none', boxShadow: '0 0 30px rgba(176, 38, 255, 0.4)', transition: 'transform 0.2s' 
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          ENTENDI, QUERO VOTAR
        </Link>
      </div>
    </main>
  );
}