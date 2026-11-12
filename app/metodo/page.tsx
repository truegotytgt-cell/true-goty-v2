// app/metodo/page.tsx
export default function Metodo() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', color: 'var(--text-light)' }}>
      <h1 style={{ color: 'var(--purple-neon)', fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>O NOSSO MÉTODO</h1>
      <p style={{ textAlign: 'center', color: '#a1a1aa', marginBottom: '3rem' }}>O TGT não é apenas mais um prêmio. Construímos um sistema de votação em 3 fases para garantir que o vencedor seja verdadeiramente a escolha da comunidade.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ backgroundColor: 'var(--bg-gray)', padding: '2rem', borderRadius: '16px', border: '1px solid #333' }}>
          <h2 style={{ color: 'var(--purple-neon)', fontSize: '1.5rem', marginBottom: '1rem' }}>Fase 1: A Curadoria (Os 10 Indicados)</h2>
          <p>Para a nossa curadoria oficial, selecionamos 10 jogos com base em uma Média Ponderada de Metascore, OpenCritic e User Score (filtro anti-Review Bombing). Como um experimento social e comparativo, também disponibilizaremos uma categoria onde você poderá aplicar o nosso método de votação sobre a lista de indicados revelada por outras premiações do mercado, mas sem qualquer vínculo oficial com elas.</p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-gray)', padding: '2rem', borderRadius: '16px', border: '1px solid #333' }}>
          <h2 style={{ color: 'var(--purple-neon)', fontSize: '1.5rem', marginBottom: '1rem' }}>Fase 2: O Mata-Mata (Método Condorcet)</h2>
          <p>Em vez de pedir para você dar uma nota de 0 a 10, nós usamos o Método de Condorcet. Nós geramos 45 combates diretos (Todos contra Todos) entre os 10 indicados. Você vê o Card A e o Card B e clica em quem é melhor. O sistema força você a comparar frente a frente. É matematicamente o método mais justo de votação.</p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-gray)', padding: '2rem', borderRadius: '16px', border: '1px solid #333' }}>
          <h2 style={{ color: 'var(--purple-neon)', fontSize: '1.5rem', marginBottom: '1rem' }}>Fase 3: A Pontuação e o Placar</h2>
          <p>Ao final dos seus 45 combates, o sistema calcula o seu Ranking Pessoal. Cada vitória vale +1 ponto e cada derrota vale -1 ponto. Se você concordar, você envia para o Placar Global, que é a soma matemática de todos os votos da comunidade.</p>
        </div>
      </div>
    </main>
  );
}