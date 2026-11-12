// components/CardDuelo.tsx
import { Jogo } from '../lib/condorcet';

type Props = {
  jogo: Jogo;
  onClick: () => void;
};

export default function CardDuelo({ jogo, onClick }: Props) {
  return (
    <div 
      onClick={onClick}
      style={{
        cursor: 'pointer',
        border: '2px solid var(--border-color)',
        borderRadius: '12px',
        padding: '1rem',
        backgroundColor: 'var(--bg-gray)',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        width: '300px'
      }}
      // Efeito simples de hover usando onMouseOver
      onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--purple-neon)'}
      onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
    >
      <img 
        src={jogo.imagem} 
        alt={jogo.titulo} 
        style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} 
      />
      <h3 style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>{jogo.titulo}</h3>
    </div>
  );
}