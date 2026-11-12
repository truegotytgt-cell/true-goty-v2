// app/indicados/page.tsx
import jogosData from '../../lib/jogos.json';

export default function Indicados() {
  const jogos = jogosData.top10;

  return (
    <main style={{ padding: '4rem 2rem', color: 'var(--text-light)' }}>
      <h1 style={{ color: 'var(--purple-neon)', fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>INDICADOS TGT</h1>
      <p style={{ textAlign: 'center', color: '#a1a1aa', marginBottom: '3rem' }}>Conheça os 10 jogos que disputam o True GOTY deste ano.</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '2rem', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {jogos.map((jogo) => (
          <div key={jogo.slug} style={{ 
            backgroundColor: 'var(--bg-gray)', 
            padding: '1rem', 
            borderRadius: '12px', 
            border: '1px solid #333',
            textAlign: 'center',
            transition: 'transform 0.2s'
          }}>
            <img 
              src={jogo.imagem} 
              alt={jogo.titulo} 
              style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} 
            />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{jogo.titulo}</h3>
          </div>
        ))}
      </div>
    </main>
  );
}